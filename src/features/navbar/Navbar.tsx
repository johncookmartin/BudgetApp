import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrentUser } from '../auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../auth/authApi';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [triggerLogout] = useLogoutMutation();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginLogout = async () => {
    if (user) {
      try {
        await triggerLogout().unwrap();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position={'static'}>
        <Toolbar>
          <IconButton
            id="nav-menu-button"
            size={'large'}
            edge={'start'}
            color={'inherit'}
            aria-label={'menu'}
            sx={{ mr: 2 }}
            aria-controls={open ? 'nav-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="nav-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'nav-menu-button',
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Home
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                to="/login"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Login
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                to="/register"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Register
              </Link>
            </MenuItem>
          </Menu>
          <Typography variant={'h4'} component={'div'} sx={{ flexGrow: 1 }}>
            Mui Playground
          </Typography>
          <Button color={'inherit'} onClick={handleLoginLogout}>
            {user ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
