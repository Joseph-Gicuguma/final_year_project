import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import HorizontalWavesAnim from '../SvgAnim/HorizontalWavesAnim';

const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <Box position="absolute" width="100%" bottom="0">
      <HorizontalWavesAnim width="100%" />
      <Flex align="center" justify="center" bgColor="secondary" h="50px">
        <Text fontSize="12px" color="white">
          &copy; {currentYear} Anza Village. All Rights Reserved.{' '}
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
