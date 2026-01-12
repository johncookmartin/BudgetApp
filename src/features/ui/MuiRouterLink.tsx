import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { forwardRef } from 'react';

type CombinedLinkProps = MuiLinkProps & Required<Pick<RouterLinkProps, 'to'>>;

const MuiRouterLink = forwardRef<HTMLAnchorElement, CombinedLinkProps>(
  (props, ref) => {
    return <MuiLink component={RouterLink} ref={ref} {...props} />;
  }
);

MuiRouterLink.displayName = 'MuiRouterLink';

export default MuiRouterLink;
