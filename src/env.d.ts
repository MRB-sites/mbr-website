interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_NOINDEX?: string;
  readonly PUBLIC_FORM_PROVIDER?: 'netlify' | 'formspree' | 'custom' | '';
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_ANALYTICS_PROVIDER?: 'plausible' | '';
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly PUBLIC_ANALYTICS_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
