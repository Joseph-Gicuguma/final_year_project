import { Image } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <ReactRouterLink to="/">
      <text>Anza Village</text>
    </ReactRouterLink>
  );
};

export default Logo;
