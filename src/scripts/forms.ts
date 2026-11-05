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

/** Posts the form. Netlify: multipart POST to "/"; Formspree/custom: POST to endpoint, JSON accept header. */
export async function submit(form: HTMLFormElement): Promise<boolean> {
  const provider = form.dataset.provider ?? 'netlify';
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
