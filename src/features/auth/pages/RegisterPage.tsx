import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRegisterMutation } from '../authApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SignInCard } from '../components/SignInCard';
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
import GoogleLoginButton from '../google/components/GoogleLoginButton';

interface RegisterPageProps {
  from?: string;
}

const RegisterPage = ({ from: fromProp }: RegisterPageProps) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('');
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [triggerRegister, { isLoading }] = useRegisterMutation();

  const from =
    fromProp ||
    location.state?.from?.pathname ||
    searchParams.get('from') ||
    '/';

  const validateInputs = () => {
    let isValid = true;

    setSubmitErrorMessage('');
    setSubmitError(false);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!newPassword || newPassword.length < 6) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage(
        'Password must be at least 6 characters long.'
      );
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords must match');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    try {
      await triggerRegister({ email, password: newPassword }).unwrap();
      navigate(from || '/', { replace: true });
    } catch (error) {
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
    <SignInCard variant={'outlined'}>
      <Typography
        component={'h1'}
        variant={'h4'}
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign Up
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
          <FormLabel htmlFor="new-password">Password</FormLabel>
          <TextField
            error={newPasswordError}
            helperText={newPasswordErrorMessage}
            name="new-password"
            placeholder="••••••"
            type="password"
            id="new-password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            color={newPasswordError ? 'error' : 'primary'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
          <TextField
            error={confirmPasswordError}
            helperText={confirmPasswordErrorMessage}
            name="confirm-password"
            placeholder="••••••"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            color={confirmPasswordError ? 'error' : 'primary'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        {submitError && <Alert severity="error">{submitErrorMessage}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
        >
          Sign Up
        </Button>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <GoogleLoginButton from={from} />
      </Box>
    </SignInCard>
  );
};

export default RegisterPage;
