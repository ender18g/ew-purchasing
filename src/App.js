import React from 'react';
import { ChakraProvider, theme, Text, Flex } from '@chakra-ui/react';

import { Route, Switch } from 'react-router-dom';
import './App.css';
import { AuthWrapper, Auth } from './components/Auth';
import 'firebase/auth';
import VendorPage from './pages/VendorPage';
import TemplatePage from './pages/TemplatePage';
import OrderPage from './pages/OrderPage';
import OrderReview from './pages/OrderReview';
import Home from './pages/Home';
import Navbar from './components/Navbar';
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
							<OrderPage type="new" />
						</AuthWrapper>
					)}
				/>
				<Route
					exact
					path="/vendor"
					render={() => (
						<AuthWrapper fallback={<Home message={loginMessage} />}>
							<VendorPage />
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
				<Route
					exact
					path="/accounts"
					render={() => (
						<AuthWrapper fallback={<Home message={loginMessage} />}>
							<TemplatePage />
						</AuthWrapper>
					)}
				/>
			</Switch>
		</ChakraProvider>
	);
}

export default App;
