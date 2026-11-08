/**
 * Shared client-side helpers for the quote form and the job application form:
 * field validation with readable messages, and submission to Netlify Forms
 * or a Formspree/custom endpoint (configured in src/config/site.ts).
 */

export type Messages = {
  required: string;
  choose: string;
  pick: string;
  email: string;
  phone: string;
  consent: string;
  fileCount: string;
  fileSize: string;
  fileType: string;
};

export type FieldError = { id: string; message: string };

const fill = (tpl: string, vars: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));

function labelText(field: HTMLElement): string {
  const legend = field.querySelector('legend');
  const label = field.querySelector('label');
  const text = (legend ?? label)?.firstChild?.textContent ?? '';
  return text.trim().toLowerCase();
}

function setError(field: HTMLElement, message: string | null) {
  const error = field.querySelector<HTMLElement>('[data-error]');
  const controls = field.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea, select');
  if (error) {
    error.textContent = message ?? '';
    error.hidden = !message;
  }
  controls.forEach((c) => (message ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid')));
}

/** Validates every [data-field] inside `scope`. Returns errors in DOM order. */
export function validate(scope: HTMLElement, messages: Messages, extra?: (field: HTMLElement) => string | null): FieldError[] {
  const errors: FieldError[] = [];
  scope.querySelectorAll<HTMLElement>('[data-field]').forEach((field) => {
    let message: string | null = null;
    const name = labelText(field);

    if (field.dataset.choice) {
      const inputs = [...field.querySelectorAll<HTMLInputElement>('input')];
      if (field.dataset.required === 'true' && !inputs.some((i) => i.checked)) {
        message = fill(field.dataset.choice === 'checkbox' ? messages.choose : messages.pick, { field: name });
      }
    } else {
      const control = field.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
      if (control && !(control instanceof HTMLInputElement && control.type === 'file')) {
        const v = control.validity;
        if (control instanceof HTMLInputElement && control.type === 'checkbox') {
          if (v.valueMissing) message = messages.consent;
        } else if (v.valueMissing) message = fill(messages.required, { field: name });
        else if (control.type === 'email' && (v.typeMismatch || v.patternMismatch)) message = messages.email;
        else if (control.type === 'tel' && control.value.replace(/\D/g, '').length < 8) message = messages.phone;
        else if (!v.valid) message = fill(messages.required, { field: name });
      }
    }
    message = message ?? extra?.(field) ?? null;
    setError(field, message);
    if (message) {
      const target = field.querySelector<HTMLElement>('input, textarea, select');
      errors.push({ id: target?.id || field.id, message });
    }
  });
  return errors;
}

/** Renders a linked error summary (GOV.UK pattern) and moves focus to it. */
export function showSummary(summary: HTMLElement, errors: FieldError[]) {
  const list = summary.querySelector('ul');
  if (!list) return;
  list.replaceChildren(
    ...errors.map((e) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${e.id}`;
      a.textContent = e.message;
      a.className = 'underline underline-offset-2';
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(e.id)?.focus();
      });
      li.append(a);
      return li;
    }),
  );
  summary.hidden = errors.length === 0;
  if (errors.length) summary.focus();
}

/**
 * Flat, readable payload for an n8n webhook:
 * - radio/checkbox values are sent as their visible label ("Rivning, Sanering"), one field per group
 * - files are sent one per field: bilaga1, bilaga2 … plus "sammanfattning" (a .txt of all answers) on the quote form
 * - plus formular (form name), sida (page URL) and skickad (timestamp)
 */
function webhookPayload(form: HTMLFormElement): FormData {
  const out = new FormData();
  const groups = new Map<string, string[]>();
  let fileNo = 0;
  for (const el of form.elements) {
    const input = el as HTMLInputElement;
    const name = input.name;
    if (!name || input.disabled || name === 'form-name' || name === 'bot-field') continue;
    if (input.type === 'file') {
      for (const file of input.files ?? []) out.append(`bilaga${++fileNo}`, file, file.name);
      continue;
    }
    if (input.type === 'radio' || input.type === 'checkbox') {
      if (!groups.has(name)) groups.set(name, []);
      // Consent checkbox: its label is a long sentence – send its value ("ja") instead.
      const label = name === 'samtycke' ? '' : input.closest('label')?.textContent?.replace(/\s+/g, ' ').trim();
      if (input.checked) groups.get(name)!.push(label || input.value);
      continue;
    }
    if (el instanceof HTMLButtonElement) continue;
    out.append(name, input.value.trim());
  }
  for (const [name, labels] of groups) out.append(name, labels.join(', '));
  out.append('formular', form.getAttribute('name') ?? '');
  out.append('sida', location.href);
  out.append('skickad', new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }));

  // Forms with uploads (the quote form) also get a text file with every answer, sent as binary "sammanfattning".
  // There is then always at least one file, so a single n8n Gmail node can attach everything
  // ({{ Object.keys($binary).join(',') }}) without failing on requests that have no photos.
  if (form.querySelector('input[type="file"]')) {
    out.append('antal_bilagor', String(fileNo));
    const fixed: Record<string, string> = { samtycke: 'Samtycke', skickad: 'Skickad', antal_bilagor: 'Antal bilder' };
    const labelOf = (name: string) =>
      fixed[name] ?? (form.querySelector(`[name="${name}"]`)?.closest('[data-field]')?.querySelector('legend, label')?.firstChild?.textContent?.trim() || name);
    const lines = [...out.entries()]
      .filter(([k, v]) => typeof v === 'string' && v !== '' && !['sprak', 'formular', 'sida'].includes(k))
      .map(([k, v]) => `${labelOf(k)}: ${v}`);
    const who = (out.get('namn')?.toString() || 'kund').replace(/[^\p{L}\p{N}]+/gu, '-');
    out.append('sammanfattning', new Blob([lines.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' }), `offertforfragan-${who}.txt`);
  }
  return out;
}

/**
 * Posts the form.
 * webhook: readable multipart payload (see webhookPayload) to data-endpoint, e.g. n8n.
 * netlify: multipart POST to "/"; formspree/custom: POST to endpoint, JSON accept header.
 */
export async function submit(form: HTMLFormElement): Promise<boolean> {
  const provider = form.dataset.provider ?? 'netlify';
  if (provider === 'webhook') {
    // Spam trap filled in: pretend it worked, send nothing.
    if ((form.querySelector<HTMLInputElement>('[name="bot-field"]')?.value ?? '') !== '') return true;
    try {
      const res = await fetch(form.dataset.endpoint ?? form.action, { method: 'POST', body: webhookPayload(form) });
      return res.ok;
    } catch {
      return false;
    }
  }
  const data = new FormData(form);
  // Drop empty file entries – some services reject them.
  for (const [key, value] of [...data.entries()]) {
    if (value instanceof File && value.size === 0 && !value.name) data.delete(key);
  }
  const url = provider === 'netlify' ? '/' : (form.dataset.endpoint ?? form.action);
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: data,
      headers: provider === 'netlify' ? undefined : { Accept: 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}
