import React from 'react';
import { ChakraProvider, theme, Text, Flex } from '@chakra-ui/react';
import OrderForm from './OrderForm';
import OrderReview from './OrderReview';
import Home from './Home';
import Navbar from './Navbar';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { AuthWrapper, Auth } from './Auth';
import 'firebase/auth';

const loginMessage = 'Please Login';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Navbar />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route
					exact
					path="/form"
					render={() => (
						<AuthWrapper fallback={<Home message={loginMessage} />}>
							<OrderForm type="new" />
						</AuthWrapper>
					)}
				/>
				<Route
					exact
					path="/review"
					render={() => (
						<AuthWrapper fallback={<Home message={loginMessage} />}>
							<OrderReview />
						</AuthWrapper>
					)}
				/>
			</Switch>
		</ChakraProvider>
	);
}

export default App;
