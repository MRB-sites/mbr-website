# n8n: email for "Begär offert" and "Kontakt för rådgivning"

Two workflows in n8n (https://meggamind.app.n8n.cloud):

| Workflow | Webhook path | Sent from the website |
|---|---|---|
| **MBR – Offert** | `mbr-offert` | the quote form ("Begär offert"), with photos |
| **MBR – Rådgivning** | `mbr` | the "Kontakt för rådgivning" button, email address only |

Each workflow does the same thing: the website sends the form to n8n, and n8n emails it to you.

---

## What the website sends (quote form)

Every field arrives in n8n under `body`, already in plain Swedish. For example, "Rivning, Sanering" is sent, not internal codes.

| Field | Example |
|---|---|
| `tjanst` | Rivning, Sanering (asbest, PCB, mögel) |
| `kundtyp` | Bostadsrättsförening |
| `fastighetstyp` | Flerbostadshus |
| `adress` / `postnummer` / `ort` | Storgatan 1 / 211 34 / Malmö |
| `beskrivning` | Riva två badrum och sanera asbest i golv. |
| `yta` | 120 |
| `byggar` | 1965 |
| `start` | Inom en månad |
| `startdatum` | 2026-12-01 (can be empty) |
| `namn` | Anna Andersson |
| `foretag` | (can be empty) |
| `epost` | anna@exempel.se |
| `telefon` | 0701234567 |
| `kontaktsatt` | Telefon |
| `samtycke` | ja |
| `antal_bilagor` | 2 (photos only) |
| `sprak` | sv / en |
| `sida` | the page the form was sent from |
| `skickad` | 2026-11-08 19:30:56 |

**Files** do not appear in `body`. Photos arrive as `bilaga1`, `bilaga2` and so on (up to 5, 8 MB in total). There is always also `sammanfattning`, a .txt file with all the answers.

---

## Part 1: Quote workflow ("MBR – Offert")

The finished workflow looks like this:

```
[Webhook] → [Gmail]
```

### Step 1: Create the workflow
1. In n8n, click **Create workflow** (top right).
2. Click the name at the top and rename it to `MBR – Offert`.

### Step 2: Webhook node (receives the form)
1. Click **+** (Add first step), search for **Webhook**, and click it.
2. Fill in:
   - **HTTP Method:** `POST`
   - **Path:** delete what is there and type `mbr-offert`
   - **Authentication:** `None`
   - **Respond:** `Immediately`
3. Scroll down to **Options**, click **Add option**, and choose **Allowed Origins (CORS)**. Type `*`.
   *Without this, the browser blocks the website from sending.*
4. Do **not** add the option "Field Name for Binary Data". Leave it out so the photos keep their names `bilaga1`, `bilaga2`.
5. Close the node using the **← Back to canvas** link at the top left.

### Step 3: Send one test so n8n can see the data
1. Click **Execute workflow** at the bottom of the canvas. The Webhook node now waits for one form.
2. Open the quote form on the preview site, https://mrb-sites.github.io/mbr-website/kontakt/, fill it in, attach 1–2 photos, and send it.
3. Back in n8n, the Webhook node turns green. Open it:
   - The **JSON** tab shows `body` with all the fields.
   - The **Binary** tab shows `bilaga1` and `bilaga2` (your photos).

> Test mode accepts **one** form per click on **Execute workflow**. Click it again before each new test.

### Step 4: Gmail node (sends the email to the owner)
1. Hover over the right edge of the Webhook node, click **+**, search for **Gmail**, and choose **Send a message**.
2. **Credential:** choose your Gmail account. The first time, click **Create new credential**, then **Sign in with Google**.
3. Fill in. For **Subject** and **Message**, first hover the field and click **Expression**, then paste.
   - **To:** `info@malmombr.se`
   - **Subject:**
     ```
     Ny offertförfrågan – {{ $json.body.namn }} – {{ $json.body.ort }}
     ```
   - **Email Type:** `HTML`
   - **Message:** the whole email from the box under "The email template" below (also saved in `docs/n8n-offert-email.html`).
4. Under **Options**, click **Add option**:
   - **Attachments**, then **Add Attachment**. In **Attachment Field Name**, switch to **Expression** and paste:
     `{{ Object.keys($binary).join(',') }}`
     *This attaches every photo plus a text file with all the answers. The website always sends that text file, so this works even when the customer added no photos.*
   - **Append n8n Attribution:** turn it **off**.
   - **Sender Name:** `MBR Webbplats`
5. Back to canvas.

### Step 5: Test the whole chain
1. Click **Execute workflow**.
2. Send a quote from the preview site. You should get the email with the photos and `offertforfragan-<namn>.txt` attached.
3. Click **Execute workflow** again and send a quote **without** photos. You should get the email with only the .txt attached.
4. Click **Save** (top right).

### The email template

Paste this into **Message** (Expression mode) in the Gmail node:

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333">
  <div style="background:#13714f;color:#fff;padding:18px 22px">
    <div style="font-size:13px;opacity:.85">Ny offertförfrågan från webbplatsen</div>
    <div style="font-size:22px;font-weight:bold;margin-top:4px">{{ $json.body.tjanst }}</div>
  </div>

  <div style="padding:18px 22px;border:1px solid #e6e6e6;border-top:0">
    <h3 style="margin:0 0 8px;color:#c2510e">Kund</h3>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr><td style="padding:4px 0;width:170px;color:#5e5e5e">Namn</td><td><b>{{ $json.body.namn }}</b></td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Företag / BRF</td><td>{{ $json.body.foretag || '–' }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Jag är</td><td>{{ $json.body.kundtyp || '–' }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Telefon</td><td><a href="tel:{{ $json.body.telefon }}">{{ $json.body.telefon }}</a></td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">E-post</td><td><a href="mailto:{{ $json.body.epost }}">{{ $json.body.epost }}</a></td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Vill bli kontaktad via</td><td>{{ $json.body.kontaktsatt }}</td></tr>
    </table>

    <h3 style="margin:20px 0 8px;color:#c2510e">Plats</h3>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr><td style="padding:4px 0;width:170px;color:#5e5e5e">Adress</td><td>{{ $json.body.adress }}, {{ $json.body.postnummer }} {{ $json.body.ort }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Typ av fastighet</td><td>{{ $json.body.fastighetstyp }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Yta</td><td>{{ $json.body.yta ? $json.body.yta + ' m²' : '–' }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Byggår</td><td>{{ $json.body.byggar || '–' }}</td></tr>
    </table>

    <h3 style="margin:20px 0 8px;color:#c2510e">Uppdraget</h3>
    <div style="background:#f4f4f4;padding:12px 14px;white-space:pre-wrap;font-size:15px">{{ $json.body.beskrivning }}</div>
    <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:10px">
      <tr><td style="padding:4px 0;width:170px;color:#5e5e5e">Önskad start</td><td>{{ $json.body.start }}{{ $json.body.startdatum ? ' (' + $json.body.startdatum + ')' : '' }}</td></tr>
      <tr><td style="padding:4px 0;color:#5e5e5e">Bilagor</td><td>{{ $json.body.antal_bilagor }} st (bifogade i mejlet)</td></tr>
    </table>

    <p style="margin:24px 0 6px">
      <a href="mailto:{{ $json.body.epost }}?subject=Ang. din offertförfrågan" style="background:#c2510e;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Svara kunden</a>
      &nbsp;
      <a href="tel:{{ $json.body.telefon }}" style="border:2px solid #ccc;color:#333;padding:8px 16px;border-radius:999px;text-decoration:none;font-weight:bold">Ring {{ $json.body.telefon }}</a>
    </p>

    <p style="font-size:12px;color:#5e5e5e;margin-top:22px">
      Skickad {{ $json.body.skickad }} från {{ $json.body.sida }} · Samtycke: {{ $json.body.samtycke }}
    </p>
  </div>
</div>
```

---

## Part 2: Advice workflow ("MBR – Rådgivning")

It sends only an email address, so there are no attachments.

1. **Create workflow**, then name it `MBR – Rådgivning`.
2. **Webhook** node:
   - HTTP Method `POST`
   - Path `mbr`
   - Respond `Immediately`
   - Options → **Allowed Origins (CORS)** `*`
3. **Gmail → Send a message** node after it:
   - **To:** `info@malmombr.se`
   - **Subject (Expression):** `Ny rådgivningsförfrågan – {{ $json.body.epost }}`
   - **Email Type:** `HTML`
   - **Message (Expression):**
     ```html
     <div style="font-family:Arial,sans-serif;font-size:15px;color:#333">
       <p><b>{{ $json.body.epost }}</b> vill bli kontaktad för rådgivning.</p>
       <p><a href="mailto:{{ $json.body.epost }}?subject=Rådgivning från MBR" style="background:#c2510e;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Svara</a></p>
       <p style="font-size:12px;color:#5e5e5e">Skickad {{ $json.body.skickad }} från {{ $json.body.sida }}</p>
     </div>
     ```
   - Options → **Append n8n Attribution** off.
4. Test it: click **Execute workflow**, then on the preview site click **Kontakt för rådgivning**, type an email address and press Enter. You should see the checkmark, and the email arrives.
5. **Save**.

---

## Part 3: Going live ("activate")

Test URLs (`/webhook-test/…`) only work while you click **Execute workflow**. Real visitors need the production URLs.

1. In n8n, open each workflow and turn on the **Active** switch (top right) in **both** workflows.
2. Tell Claude **"activate"**. The website then switches to the production URLs (`/webhook/mbr-offert` and `/webhook/mbr`) and is published.

For reference, the switch in the code is `N8N_MODE` in `src/config/site.ts`: `'test'` or `'production'`.

---

## If something does not work

| What you see | Cause / fix |
|---|---|
| Website shows "Det gick inte att skicka" | Test mode: click **Execute workflow** first. Live: check that the workflow is **Active**. |
| Nothing arrives, and the browser console says "CORS" | Webhook node → Options → **Allowed Origins (CORS)** = `*`. |
| Email arrives without photos | **Attachments** option is missing in the Gmail node. |
| Fields show as empty in the email | The expression must start with `$json.body.`, e.g. `{{ $json.body.namn }}`, and the field must be in **Expression** mode. |
