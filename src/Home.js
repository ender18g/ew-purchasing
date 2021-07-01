import React from 'react';
import './Home.css';
import { Box, Flex, Text } from '@chakra-ui/react';

export default function Home() {
	return (
		<Box id="Home" className="Home">
			<div className="text-box">
				<Text className="heading-primary">WRC</Text>
				<Text className="heading-secondary">Purchasing Portal</Text>
				{/* <Button onClick={handleclick} size="lg" leftIcon="email" color="white" bg="blue.800">
						Join our email list
					</Button> */}
			</div>

			<Box d="flex" justifyContent="center" alignItems="center" className="f-icon" w="100%">
				<a href="https://www.facebook.com/groups/773009929542726/" target="_blank" rel="noreferrer">
					<Box rounded="md" padding={1} mb={5}>
						<i style={{ color: 'white' }} className="fab fa-2x fa-facebook-square" />
					</Box>
				</a>
			</Box>
		</Box>
	);
}
