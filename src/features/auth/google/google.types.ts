export interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
}

export interface CredentialResponse {
  credential: string;
}

export interface GsiButtonConfiguration {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
}

export interface PromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  isDisplayed: () => boolean;
}
