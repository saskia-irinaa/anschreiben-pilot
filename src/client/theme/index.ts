import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { textStyles, fonts } from './text';
import { semanticTokens } from './tokens';
import {
  Input as ChakraInput,
  Button as ChakraButton,
  Textarea as ChakraTextarea,
  Checkbox as ChakraCheckbox,
  AlertDialog as ChakraAlertDialog,
  Select as ChakraSelect,
  Radio as ChakraRadio,
} from '@chakra-ui/react';

const variantSolid = (props: any) => {
  const { colorScheme: c } = props;

  let bg = `${c}.400`;
  let color = `${c}.50`;
  let hoverBg = `${c}.500`;
  let activeBg = `${c}.600`;
  let disabledBg = `${c}.300`;

  if (c === 'contrast') {
    bg = 'bg-contrast-sm';
    color = 'text-contrast-lg';
    hoverBg = 'bg-contrast-md';
    activeBg = 'bg-contrast-lg';
    disabledBg = 'bg-contrast-sm';
  }

  return {
    border: 'sm',
    bgColor: bg,
    color: color,
    _hover: {
      bg: hoverBg,
      boxShadow: 'glow-sm',
    },
    _focus: {
      boxShadow: 'glow-sm',
      borderColor: 'active',
    },
    _disabled: {
      bg: disabledBg,
      pointerEvents: 'none',
      opacity: 0.5,
    },
    _active: { bg: activeBg },
  };
};

export const Button = {
  defaultProps: {
    colorScheme: 'contrast',
  },
  baseStyle: {
    border: 'sm',
    borderRadius: 'md',
    fontWeight: 600,
    transition: 'transform 0.05s ease-out, background 0.2s, box-shadow 0.2s, opacity 0.2s',
  },
  sizes: {
    md: { fontSize: 'sm', px: 4, h: 9 },
    sm: { fontSize: 'xs', px: 3, h: 8 },
  },
  variants: {
    solid: variantSolid,
  },
};

ChakraButton.defaultProps = {
  ...ChakraButton.defaultProps,
  fontSize: 'sm',
  variant: 'solid',
  backdropFilter: 'blur(4px)',
};

ChakraCheckbox.defaultProps = {
  ...ChakraCheckbox.defaultProps,
  colorScheme: 'purple',
};

export const Checkbox = {
  baseStyle: {
    control: {
      border: 'md',
      borderColor: 'border-contrast-md',
      bg: 'bg-contrast-sm',
      _hover: {
        bg: 'bg-contrast-md',
        borderColor: 'border-contrast-md',
      },
      _focus: {
        boxShadow: 'glow-sm',
        borderColor: 'active',
      },
      _disabled: {
        bg: 'bg-contrast-xs',
      },
    },
  },
};

ChakraInput.defaultProps = {
  ...ChakraInput.defaultProps,
  focusBorderColor: 'white',
  variant: 'outline',
};

export const Input = {
  sizes: {
    md: { field: { fontSize: 'sm', h: 9, borderRadius: 'md' } },
  },
  variants: {
    outline: {
      field: {
        border: 'sm',
        borderColor: 'border-contrast-xs',
        bg: 'bg-contrast-xs',
        color: 'text-contrast-lg',
        _hover: {
          bg: 'bg-contrast-md',
          borderColor: 'border-contrast-md',
        },
        _focus: {
          boxShadow: 'glow-sm',
          borderColor: 'active',
        },
        _disabled: {
          bg: 'bg-contrast-xs',
        },
        _placeholder: {
          color: 'text-contrast-sm',
          fontSize: 'sm',
        },
      },
    },
  },
};

ChakraTextarea.defaultProps = {
  ...ChakraTextarea.defaultProps,
  focusBorderColor: 'purple.300',
  variant: 'outline',
  sx: {
    '&::-webkit-scrollbar': {
      width: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'var(--chakra-colors-border-contrast-md)',
      borderRadius: '20px',
      border: '3px solid transparent',
      backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'var(--chakra-colors-border-contrast-lg)',
    },
  },
};

export const Textarea = {
  variants: {
    outline: {
      fontSize: 'sm',
      borderRadius: 'md',
      border: 'sm',
      borderColor: 'border-contrast-xs',
      bg: 'bg-contrast-sm',
      color: 'text-contrast-lg',
      _hover: {
        borderColor: 'border-contrast-md',
      },
      _focus: {
        boxShadow: 'glow-sm',
        bgColor: 'bg-contrast-xs',
        borderColor: 'active',
      },
      _disabled: {
        bg: 'bg-contrast-xs',
      },
      _placeholder: {
        color: 'text-contrast-sm',
        fontSize: 'sm',
      },
    },
  },
};

ChakraSelect.defaultProps = {
  ...ChakraSelect.defaultProps,
  variant: 'outline',
  border: 'sm',
  borderColor: 'border-contrast-xs',
  bg: 'bg-contrast-sm',
  fontSize: 'sm',

  _hover: {
    bg: 'bg-contrast-md',
    borderColor: 'border-contrast-sm',
  },
  _focus: {
    boxShadow: 'glow-sm',
    borderColor: 'active',
  },
  _placeholder: {
    fontSize: 'sm',
    color: 'text-contrast-sm',
  },
};

ChakraRadio.defaultProps = {
  ...ChakraRadio.defaultProps,
  colorScheme: 'purple',
  border: 'md',
  borderColor: 'border-contrast-sm',
};


export const Link = {
  baseStyle: {
    transition: 'all 0.1s ease-in-out',
    _hover: {
      textDecoration: 'none',
      boxShadow: '0px 1px 0px 0px var(--chakra-colors-active)',
    },
    _focus: {
      boxShadow: '0px 1px 0px 0px var(--chakra-colors-active)',
    },
    _active: { opacity: '0.5' },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const styles = {
  global: (props: StyleFunctionProps) => ({
    html: {
      fontSize: {
        base: '87%',
        md: '95%',
      },
    },
    body: {
      bgColor: 'bg-body',
      backgroundImage:
        props.colorMode === 'dark'
          ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(159, 122, 234, 0.18), transparent)'
          : 'none',
      backgroundAttachment: 'fixed',
    },
  }),
};

export const theme = extendTheme({
  components: {
    Input,
    Textarea,
    Button,
    Link,
    Checkbox,
    Heading: {
      baseStyle: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
    },
  },
  config,
  textStyles,
  fonts,
  semanticTokens,
  styles,
  layerStyles: {
    card: {
      bgColor: 'bg-contrast-xs',
      backdropFilter: 'blur(20px)',
      border: 'sm',
      rounded: 'xl',
      boxShadow: 'glow-sm',
    },
    cardMd: {
      bgColor: 'bg-contrast-md',
      backdropFilter: 'blur(20px)',
      border: 'sm',
      rounded: 'xl',
      boxShadow: 'glow-sm',
    },
    cardLg: {
      bgColor: 'bg-contrast-lg',
      backdropFilter: 'blur(20px)',
      border: 'sm',
      rounded: 'xl',
      boxShadow: 'glow-md',
    },
  },
});
