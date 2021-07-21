import React, { useState, useEffect } from 'react';
import { Heading, Flex, Image, Link, Box, IconButton, Text } from '@chakra-ui/react';
import logo from './WRCLogo.png';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { Auth } from './Auth';

const Navbar = (props) => {
	return (
		<Flex boxShadow="lg" justify="space-between" align="center" bg="blue.700" paddingX={2} paddingY={1} w="100%">
			<Flex justify="center" align="center">
				<Flex display={{ base: 'none', md: 'flex' }}>
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

			<Flex justifyContent="space-around" alignItems="center" flexWrap="wrap">
				<NavLink w="100px" className="header-link" to="/">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						Home
					</Text>
				</NavLink>
				<NavLink w="100px" className="header-link" to="/form">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						Order
					</Text>
				</NavLink>
				<NavLink w="100px" className="header-link" to="/vendor">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						Vendors
					</Text>
				</NavLink>
				<NavLink w="100px" className="header-link" to="/accounts">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						Accounts
					</Text>
				</NavLink>

				<NavLink w="100px" className="header-link" to="/review">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						Review
					</Text>
				</NavLink>

				<Auth />

				{/* <Box display={{ base: 'none', md: 'flex' }}>
					<ColorModeSwitcher />
				</Box> */}
			</Flex>
		</Flex>
	);
};

export default Navbar;
