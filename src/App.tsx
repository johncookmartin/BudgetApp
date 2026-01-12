import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AuthBootstrap from './features/auth/components/AuthBootstrap';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './features/layouts/MainLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import BudgetDashboard from './features/dashboard/BudgetDashboard';

const App = () => {
  const theme = createTheme();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<BudgetDashboard />} />
        </Route>
        <Route index element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthBootstrap />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
