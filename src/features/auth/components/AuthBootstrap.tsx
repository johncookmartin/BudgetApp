import { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { useRefreshMutation } from '../authApi';
import { setCheckingAuth, setUnauthenticated } from '../authSlice';

const AuthBootstrap = () => {
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    let cancelled = false;

    const attemptRefresh = async () => {
      dispatch(setCheckingAuth());
      try {
        await refresh().unwrap();
      } catch {
        if (!cancelled) dispatch(setUnauthenticated());
      }
    };

    attemptRefresh();

    return () => {
      cancelled = true;
    };
  }, [dispatch, refresh]);

  return null;
};

export default AuthBootstrap;
