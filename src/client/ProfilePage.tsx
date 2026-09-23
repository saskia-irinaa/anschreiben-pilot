import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';

import { stripePayment, stripeGpt4Payment, useQuery, getUserInfo } from 'wasp/client/operations';

import BorderBox from './components/BorderBox';
import { Box, Heading, Text, Button, Code, Spinner, VStack, HStack, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export default function ProfilePage({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGpt4loading, setIsGpt4Loading] = useState(false);

  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });

  const userPaidOnDay = new Date(String(user.datePaid));
  const oneMonthFromDatePaid = new Date(userPaidOnDay.setMonth(userPaidOnDay.getMonth() + 1));

  async function handleBuy4oMini() {
    setIsLoading(true);
    try {
      const response = await stripePayment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    }
    setIsLoading(false);
  }

  async function handleBuy4o() {
    setIsGpt4Loading(true);
    try {
      const response = await stripeGpt4Payment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    }
    setIsGpt4Loading(false);
  }

  return (
    <BorderBox>
      {!!userInfo ? (
        <>
          <Heading size='md'>👋 Hallo {userInfo.email || 'du'} </Heading>
          {userInfo.subscriptionStatus === 'past_due' ? (
            <VStack gap={3} py={5} alignItems='center'>
              <Box color='purple.400'>
                <IoWarningOutline size={30} color='inherit' />
              </Box>
              <Text textAlign='center' fontSize='sm' textColor='text-contrast-lg'>
                Dein Abo ist überfällig. <br /> Bitte aktualisiere deine Zahlungsmethode{' '}
                <Link textColor='purple.400' href='https://billing.stripe.com/p/login/5kA7sS0Wc3gD2QM6oo'>
                  hier
                </Link>
              </Text>
            </VStack>
          ) : userInfo.hasPaid ? (
            <VStack gap={3} pt={5} alignItems='flex-start'>
              <Text textAlign='initial'>Vielen Dank für deine Unterstützung!</Text>

              <Text textAlign='initial'>Du hast unbegrenzten Zugriff auf Anschreiben Pilot mit {user?.gptModel === 'gpt-4' || user?.gptModel === 'gpt-4o' ? 'GPT-4o.' : 'GPT-4o-mini.'}</Text>

              {userInfo.subscriptionStatus === 'canceled' && (
                <Code alignSelf='center' fontSize='lg'>
                  {oneMonthFromDatePaid.toUTCString().slice(0, -13)}
                </Code>
              )}
              <Text alignSelf='initial' fontSize='sm' fontStyle='italic' textColor='text-contrast-sm'>
                Um dein Abo zu verwalten,{' '}
                <Link textColor='purple.600' href='https://billing.stripe.com/p/login/5kA7sS0Wc3gD2QM6oo'>
                  klicke hier.
                </Link>
              </Text>
            </VStack>
          ) : (
            <HStack pt={3} textAlign='center'>
              <Heading size='sm'>Du hast noch </Heading>
              <Code>{userInfo?.credits ? userInfo.credits : '0'}</Code>
              <Heading size='sm'>Anschreiben übrig</Heading>
            </HStack>
          )}
          {!userInfo.hasPaid && (
            <VStack py={3} gap={5}>
              <VStack py={3} gap={2}>
                <HStack gap={5} display='grid' gridTemplateColumns='1fr 1fr'>
                  {/* <VStack
                    layerStyle='card'
                    py={5}
                    px={7}
                    gap={3}
                    height='100%'
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>$2.95</Heading>
                      <Text textAlign='start' fontSize='md'>
                        10 Cover <br />
                        Letters
                      </Text>
                    </VStack>
                    <Button mr={3} isLoading={isCreditsLoading} onClick={handleCreditsClick}>
                      Buy Now
                    </Button>
                  </VStack> */}
                  <VStack layerStyle='card' py={5} px={7} gap={3} height='100%' width='100%' justifyContent='space-between' alignItems='center'>
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>6,95 €</Heading>
                      <Text textAlign='start' fontSize='md'>
                        Unbegrenztes
                        <br />
                        Monatsabo
                      </Text>
                      <Heading size='md'>Mit GPT-4o-mini 🚀</Heading>
                    </VStack>
                    <Button mr={3} isLoading={isLoading} onClick={handleBuy4oMini}>
                      Jetzt kaufen!
                    </Button>
                  </VStack>
                  <VStack layerStyle='cardMd' borderColor={'purple.200'} borderWidth={3} py={5} px={7} gap={3} height='100%' width='100%' justifyContent='space-between' alignItems='center'>
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>6,95 €</Heading>

                      <Text textAlign='start' fontSize='md'>
                        Unbegrenztes <br /> Monatsabo
                      </Text>
                      <Heading size='md'>Mit GPT-4o 🤖</Heading>
                    </VStack>
                    <Button colorScheme='purple' mr={3} isLoading={isGpt4loading} onClick={handleBuy4o}>
                      💰 Jetzt kaufen!
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          )}
          <Button alignSelf='flex-end' size='sm' onClick={() => logout()}>
            Abmelden
          </Button>
        </>
      ) : (
        <Spinner />
      )}
    </BorderBox>
  );
}
