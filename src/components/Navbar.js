import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import { Auth } from '../components/Auth';
import FullMenu from '../components/FullMenu';
import Hamburger from '../components/Hamburger';
import logo from '../images/WRCLogo.png';
import './Navbar.css';

const menuItems = [
	{ title: 'Home', link: '/' },
	{ title: 'Order Form', link: '/form' },
	{ title: 'Vendor 889s', link: '/vendor' },
	{ title: 'Account Templates', link: '/accounts' },
	{ title: 'Review Orders', link: '/review' }
];

const Navbar = (props) => {
	return (
		<Flex boxShadow="lg" justify="space-between" align="center" bg="blue.700" paddingX={2} paddingY={1} w="100%">
			<Flex justify="center" align="center">
				<Flex>
					<Image className="nav-logo" boxSize="40px" src={logo} />
				</Flex>
				<Heading
					mx="5"
					fontWeight="300"
					textAlign="right"
					letterSpacing=".2em"
					color="white"
					size="md"
					display={{ base: 'none', md: 'flex' }}
				>
					WRC Purchasing
				</Heading>
			</Flex>
			<Flex align="center">
				<Flex alignItems="center" display={{ base: 'none', xl: 'flex' }}>
					<FullMenu menuItems={menuItems} />
				</Flex>
				<Auth />

				{/* <Box display={{ base: 'none', md: 'flex' }}>
					<ColorModeSwitcher />
				</Box> */}

				<Box display={{ base: 'flex', xl: 'none' }}>
					<Hamburger menuItems={menuItems} />
				</Box>
			</Flex>
		</Flex>
	);
};

export default Navbar;
