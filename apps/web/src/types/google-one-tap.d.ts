export interface CredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (
            momentListener?: (moment: { isDisplayed: () => boolean }) => void
          ) => void;
          renderButton: (parent: HTMLElement, config: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}
