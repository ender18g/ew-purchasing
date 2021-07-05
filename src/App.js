import React from 'react';
import { ChakraProvider, theme, Text, Flex } from '@chakra-ui/react';
import OrderForm from './OrderForm';
import OrderReview from './OrderReview';
import Home from './Home';
import Navbar from './Navbar';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { Auth } from './Auth';
import 'firebase/auth';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Navbar />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/form" component={OrderForm} />
				<Route exact path="/review" component={OrderReview} />
			</Switch>
		</ChakraProvider>
	);
}

export default App;
