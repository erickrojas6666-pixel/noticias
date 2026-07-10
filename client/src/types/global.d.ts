// client/src/types/global.d.ts
declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement | string, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        size?: string;
        theme?: string;
        tabindex?: number;
      }) => number;
      reset: (widgetId?: number) => void;
      execute: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    onRecaptchaLoaded?: () => void; // 👈 AÑADIR "?" PARA HACERLO OPCIONAL
  }
}

export {};