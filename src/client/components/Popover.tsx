import { type User } from "wasp/entities";
import { generateEdit, useQuery, getUserInfo } from "wasp/client/operations";
import { VStack, ButtonGroup, Button, ButtonGroupProps, Text, Box, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { TextareaContext } from '../App';
import { LeaveATip } from './AlertDialog';

interface EditPopoverProps extends ButtonGroupProps {
  selectedText?: string;
  setTooltip: any;
  user: Omit<User, 'password'>;
}

export function EditPopover({ setTooltip, selectedText, user, ...props }: EditPopoverProps) {
  const { textareaState, setTextareaState } = useContext(TextareaContext);

  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });

  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();

  const replaceSelectedText = async ({ improvement }: { improvement: string }) => {
    const selection = window.getSelection();
    let loadingInterval;

    try {
      const value = textareaState;
      const selectString = selection!.toString();
      const index = value.indexOf(selectString);

      let loadingString = 'Lädt';
      loadingInterval = setInterval(() => {
        if (loadingString.length < 'Lädt...'.length) {
          loadingString += '.';
          let loading =
            value.slice(0, index + selectString.length) +
            '\n --- \n' +
            loadingString +
            '\n --- \n' +
            value.slice(index + selectString.length);
          setTextareaState(loading);
        } else {
          loadingString = 'Lädt';
        }
      }, 750);

      const newValue = await generateEdit({ content: selectString, improvement });

      clearInterval(loadingInterval);
      setTextareaState(value);

      const newText =
        value.slice(0, index + selectString.length) +
        '\n --- Revision: \n' +
        newValue +
        '\n --- \n' +
        value.slice(index + selectString.length);

      setTextareaState(newText);
    } catch (error: any) {
      console.error(error);
      clearInterval(loadingInterval);
      alert(error?.message ?? 'Ein Fehler ist aufgetreten.');
    }
  };

  const handleClick = async (value: string) => {
    if (!userInfo?.credits && !userInfo?.hasPaid) {
      onPayOpen();
      setTooltip(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    replaceSelectedText({ improvement: value });
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      <VStack {...props} gap={1} bgColor='bg-modal' borderRadius='lg' boxShadow='2xl'>
        <Box layerStyle='cardLg' p={3}>
          <Text fontSize='sm' textAlign='center'>
            🤔 Diesen Teil...
          </Text>
          <ButtonGroup size='xs' p={1} variant='solid' colorScheme='purple' isAttached>
            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('concise')}>
              Prägnanter
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('detailed')}>
              Ausführlicher
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('Professional')}>
              Formeller
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('informal')}>
              Lockerer
            </Button>
          </ButtonGroup>
        </Box>
      </VStack>
      <LeaveATip
        isOpen={isPayOpen}
        onOpen={onPayOpen}
        onClose={onPayClose}
        credits={userInfo?.credits || 0}
      />
    </>
  );
}
