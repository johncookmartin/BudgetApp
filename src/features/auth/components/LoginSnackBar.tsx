import { Alert, Snackbar } from '@mui/material';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface LoginSnackBarProps {
  from?: string;
  error?: FetchBaseQueryError | SerializedError;
}

const LoginSnackBar = ({ from, error }: LoginSnackBarProps) => {
  const showSnackbar = !!from || !!error;
  return (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity="error" sx={{ width: '100%' }}>
        Please Login In.
      </Alert>
    </Snackbar>
  );
};

export default LoginSnackBar;
