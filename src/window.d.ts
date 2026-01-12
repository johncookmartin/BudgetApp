declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration
          ) => void;
        };
      };
    };
  }
}

export {};
