import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useAuth, useSigninCheck } from 'reactfire';
import { WideButton } from './display/Button';
import { CardSection } from './display/Card';
import { LoadingSpinner } from './display/LoadingSpinner';
import { Box, Flex, Text, Image, Button } from '@chakra-ui/react';

const signOut = (auth) => auth.signOut().then(() => console.log('signed out'));

export const AuthWrapper = ({ children, fallback }) => {
	const { status, data: signInCheckResult } = useSigninCheck();

	if (!children) {
		throw new Error('Children must be provided');
	}
	if (status === 'loading') {
		return <LoadingSpinner />;
	} else if (signInCheckResult.signedIn === true) {
		return children;
	}

	return fallback;
};

const UserDetails = ({ user }) => {
	const auth = useAuth();

	return (
		<Flex justifyContent="center">
			<Button size="sm" mx="2" colorScheme="whiteAlpha" onClick={() => signOut(auth)}>
				Sign Out
			</Button>
			<Image borderRadius="full" boxSize="35px" src={user.photoURL} alt={user.displayName} />
		</Flex>
	);
};

const SignInForm = () => {
	const auth = useAuth;

	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [ auth.GoogleAuthProvider.PROVIDER_ID ],
		callbacks: {
			// Avoid redirects after sign-in.
			signInSuccessWithAuthResult: () => false
		}
	};

	return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />;
};

export const Auth = () => {
	const { status, data: signinResult } = useSigninCheck();

	if (status === 'loading') {
		return <LoadingSpinner />;
	}

	const { signedIn, user } = signinResult;
	console.log(user);

	if (signedIn === true) {
		return <UserDetails user={user} />;
	} else {
		return <SignInForm />;
	}
};
