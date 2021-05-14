import React from 'react';
import { ChakraProvider, Box, theme, Text, Flex } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import OrderForm from './OrderForm';
import OrderReview from './OrderReview';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Flex className="app-div" justifyContent="center">
				<ColorModeSwitcher />
			</Flex>
			<OrderForm />
			<OrderReview />
		</ChakraProvider>
	);
}

export default App;
