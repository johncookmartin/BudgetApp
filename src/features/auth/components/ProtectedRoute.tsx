import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import DefaultSpinner from '../../ui/DefaultSpinner';

const ProtectedRoute = () => {
  const { status } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (status === 'unknown' || status === 'checking') {
    return <DefaultSpinner />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
