import { VStack, BoxProps } from '@chakra-ui/react';

interface BorderBoxProps extends BoxProps {
  children: React.ReactNode;
}

export default function BorderBox({ children, ...props }: BorderBoxProps) {
  return (
    <VStack
      layerStyle='cardLg'
      width={['sm', 'xl', '3xl']}
      mt={7}
      gap={3}
      py={6}
      px={7}
      alignItems='stretch'
      {...props}
    >
      {children}
    </VStack>
  );
}
