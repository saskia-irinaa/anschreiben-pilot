import { useAuth, googleSignInUrl as signInUrl } from 'wasp/client/auth';
import { AiOutlineGoogle } from 'react-icons/ai';
import { VStack, Button, Spinner } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { data: user, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <BorderBox>
      {isLoading ? (
        <Spinner />
      ) : (
        <VStack>
          <a href={signInUrl}>
            <Button leftIcon={<AiOutlineGoogle />}>Mit Google anmelden</Button>
          </a>
        </VStack>
      )}
    </BorderBox>
  );
}
