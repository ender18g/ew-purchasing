import React from 'react';
import './Home.css';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Home(props) {
	useEffect(() => {
		document.querySelector('#Home').classList.add('colorize');
	}, []);
	return (
		<Box id="Home" className="Home">
			<div className="text-box">
				<Text className="heading-primary">WRC</Text>
				<Text className="heading-secondary">Purchasing Portal</Text>
				{props.message && (
					<Text color="whte" className="heading-message">
						{props.message}
					</Text>
				)}
			</div>
		</Box>
	);
}
