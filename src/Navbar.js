import React, { useState, useEffect } from 'react';
import { Heading, Flex, Image, Link, Box, IconButton, Text } from '@chakra-ui/react';
import logo from './WRCLogo.png';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {
	return (
		<Flex boxShadow="lg" justify="space-between" align="center" bg="blue.700" paddingX={2} paddingY={2} w="100%">
			<Flex justify="center" align="center">
				<Flex>
					<Image className="nav-logo" height="50px" src={logo} />
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
			<Flex justifyContent="space-between" alignItems="center">
				<NavLink w="100px" className="header-link" to="/">
					<Text mx="5" fontSize="md">
						Home
					</Text>
				</NavLink>
				<NavLink w="100px" className="header-link" to="/form">
					<Text mx="5" fontSize="md">
						Order
					</Text>
				</NavLink>

				<NavLink w="100px" className="header-link" to="/review">
					<Text mx="5" fontSize="md">
						Review
					</Text>
				</NavLink>
				<Box display={{ base: 'none', md: 'flex' }}>
					<ColorModeSwitcher />
				</Box>
			</Flex>
		</Flex>
	);
};

export default Navbar;
