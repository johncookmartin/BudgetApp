import { GSI_SRC } from './google.constants';

let gsiScriptLoading: Promise<void> | null = null;

export const loadGsiScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (gsiScriptLoading) {
    return gsiScriptLoading;
  }

  gsiScriptLoading = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      `script[src='${GSI_SRC}']`
    );

    const onLoad = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error('Failed to load Google Identity Services script'));
    };

    const cleanup = () => {
      if (!script) return;
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      gsiScriptLoading = null;
    };

    if (!script) {
      script = document.createElement('script');
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
  });

  return gsiScriptLoading;
};
