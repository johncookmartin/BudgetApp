import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLoginMutation } from '../authApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import LoginSnackBar from '../components/LoginSnackBar';
import { SignInCard } from '../components/SignInCard';
import MuiRouterLink from '../../ui/MuiRouterLink';
import GoogleLoginButton from '../google/components/GoogleLoginButton';

interface LoginPageProps {
  from?: string;
}

const LoginPage = ({ from: fromProp }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [triggerLogin, { isLoading, error }] = useLoginMutation();

  const from =
    fromProp ||
    location.state?.from?.pathname ||
    searchParams.get('from') ||
    '/';

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    try {
      await triggerLogin({ email, password }).unwrap();
      navigate(from || '/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      console.log('Registration Failed:', error);
      const err = error as FetchBaseQueryError;
      const errorMessage =
        err.data && typeof err.data === 'object' && 'errors' in err.data
          ? (err.data as { errors: string[] }).errors[0]
          : 'Registration failed';
      setSubmitError(true);
      setSubmitErrorMessage(errorMessage);
    }
  };

  return (
    <>
      <LoginSnackBar from={location.state?.from} error={error} />
      <SignInCard variant={'outlined'}>
        <Typography
          component={'h1'}
          variant={'h4'}
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box
          component={'form'}
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id={'email'}
              type={'email'}
              name={'email'}
              placeholder={'your@email.com'}
              autoComplete={'email'}
              autoFocus
              required
              fullWidth
              variant={'outlined'}
              color={emailError ? 'error' : 'primary'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {submitError && <Alert severity="error">{submitErrorMessage}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => console.log('Guest login clicked')}
          >
            Continue as Guest
          </Button>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <GoogleLoginButton from={from} />
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <MuiRouterLink
              to={`/register?from=${from}`}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign Up
            </MuiRouterLink>
          </Typography>
        </Box>
      </SignInCard>
    </>
  );
};

export default LoginPage;
