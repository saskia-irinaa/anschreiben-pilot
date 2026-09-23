import { deleteJob } from "wasp/client/operations";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Checkbox,
  Code,
  Text,
  Spacer,
  VStack,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';

export function LeaveATip({
  isOpen,
  onClose,
  credits,
}: {
  credits: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const tipRef = useRef(null);

  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/profile');
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose}>
        <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
          <AlertDialogContent bgColor='bg-modal'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              👋 Danke, dass du Anschreiben Pilot ausprobierst.
            </AlertDialogHeader>

            <AlertDialogBody textAlign='center'>
              <Text>
                Du hast noch <Code>{credits}</Code> kostenlose{credits === 1 ? 's Anschreiben' : ' Anschreiben'} übrig.
              </Text>
              <Text mt={4}>
                Hol dir Zugriff für nur <Code>14,90 €</Code> im Monat!
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button isLoading={isLoading} ref={tipRef} colorScheme='purple' onClick={handleClick}>
                💰 Jetzt upgraden
              </Button>
              <Spacer />
              <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                Nein, danke
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export function LoginToBegin({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const loginRef = useRef(null);

  const handleClick = async () => {
    navigate('/login');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={loginRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader textAlign='center' fontSize='md' mt={3} fontWeight='bold'>
            ✋
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center'>Bitte melde dich an, um loszulegen!</AlertDialogBody>

          <AlertDialogFooter justifyContent='center'>
            <Button ref={loginRef} leftIcon={<AiOutlineLogin />} colorScheme='purple' onClick={handleClick}>
              Anmelden
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function DeleteJob({
  isOpen,
  onClose,
  jobId,
}: {
  jobId: string | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            ⛔️ Bewerbung löschen
          </AlertDialogHeader>

          <AlertDialogBody>
            Diese Bewerbung und alle zugehörigen Anschreiben löschen?
            <br />
            Das kann nicht rückgängig gemacht werden.
          </AlertDialogBody>

          <AlertDialogFooter display='grid' gridTemplateColumns='1fr 1fr 1fr'>
            <Button
              leftIcon={<BiTrash />}
              size='sm'
              isLoading={isLoading}
              onClick={async () => {
                if (!jobId) return;
                setIsLoading(true);
                await deleteJob({ jobId });
                setIsLoading(false);
                onClose();
              }}
            >
              Löschen
            </Button>
            <Spacer />
            <Button ref={cancelRef} size='sm' colorScheme='purple' onClick={onClose}>
              Abbrechen
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function EditAlert({ coverLetter }: { coverLetter: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (coverLetter && localStorage.getItem('edit-alert') !== 'do not show') {
      onOpen();
    }
  }, [coverLetter]);

  const cancelRef = useRef(null);
  function handleCheckboxChange(e: any) {
    if (e.target.checked) {
      localStorage.setItem('edit-alert', 'do not show');
    } else {
      localStorage.removeItem('edit-alert');
    }
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            📝 Dein Anschreiben ist fertig!
          </AlertDialogHeader>

          <AlertDialogBody gap={5} pointerEvents='none'>
            <Text pb={3}>
              Für feinere Änderungen markiere den Text, den du anpassen möchtest, um das Menü unten zu öffnen:
            </Text>
            <VStack m={3} gap={1} borderRadius='lg'>
              <Box layerStyle='cardLg' p={3}>
                <Text fontSize='sm' textAlign='center'>
                  🤔 Diesen Teil...
                </Text>
                <ButtonGroup size='xs' p={1} variant='solid' colorScheme='purple' isAttached>
                  <Button size='xs' color='black' fontSize='xs'>
                    Prägnanter
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Ausführlicher
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Formeller
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Lockerer
                  </Button>
                </ButtonGroup>
              </Box>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent='space-between'>
            <Checkbox onChange={handleCheckboxChange} size='sm' color='text-contrast-md'>
              Nicht mehr anzeigen
            </Checkbox>
            <Button ref={cancelRef} size='sm' colorScheme='purple' onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
