import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useGoogleLoginMutation } from '../../authApi';
import { loadGsiScript } from '../googleScript';
import { GOOGLE_CLIENT_ID } from '../google.constants';
import type { CredentialResponse } from '../google.types';
import DefaultSpinner from '../../../ui/DefaultSpinner';

interface GoogleLoginProps {
  buttonConfig?: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
  };
  from?: string;
}

const GoogleLoginButton = ({
  buttonConfig,
  from: fromProp,
}: GoogleLoginProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [triggerGoogleLogin, { isLoading }] = useGoogleLoginMutation();

  const from = fromProp || '/';

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        await loadGsiScript();
        if (cancelled) return;
        if (!window.google?.accounts?.id || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: CredentialResponse) => {
            try {
              await triggerGoogleLogin({
                idToken: response.credential,
              }).unwrap();
              navigate(from || '/', { replace: true });
            } catch (error) {
              console.error('Google Login Failed', error);
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: buttonConfig?.theme ?? 'filled_blue',
          size: buttonConfig?.size ?? 'large',
        });
      } catch (err) {
        console.error(err);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [triggerGoogleLogin, buttonConfig, from, navigate]);

  if (isLoading) {
    return <DefaultSpinner />;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <div ref={buttonRef}></div>
    </Box>
  );
};

export default GoogleLoginButton;
