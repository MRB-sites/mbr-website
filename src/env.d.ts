interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_NOINDEX?: string;
  readonly PUBLIC_FORM_PROVIDER?: 'netlify' | 'formspree' | 'custom' | '';
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** 'true' fakes a successful send in the advice button (GitHub Pages preview). */
  readonly PUBLIC_FORMS_DEMO?: string;
  readonly PUBLIC_ANALYTICS_PROVIDER?: 'plausible' | '';
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly PUBLIC_ANALYTICS_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
