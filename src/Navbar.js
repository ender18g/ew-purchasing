import React, { useState, useEffect } from 'react';
import { Heading, Flex, Image, Link, Box, IconButton, Text } from '@chakra-ui/react';
import logo from './WRCLogo.png';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {
	return (
		<Flex boxShadow="md" justify="space-between" align="center" bg="blue.700" paddingX={4} paddingY={2}>
			<Flex justify="left" align="center">
				<Image className="nav-logo" height="50px" src={logo} />
				<Heading mx="5" fontWeight="300" textAlign="right" letterSpacing=".2em" color="white" size="md">
					WRC Purchasing
				</Heading>
			</Flex>
			<Flex justifyContent="space-between" align="center">
				<NavLink className="header-link" to="/">
					<Text mx="5" fontSize="lg">
						Home
					</Text>
				</NavLink>
				<NavLink className="header-link" to="/form">
					<Text mx="5" fontSize="lg">
						Order Form
					</Text>
				</NavLink>

				<NavLink className="header-link" to="/review">
					<Text mx="5" fontSize="lg">
						Review Orders
					</Text>
				</NavLink>
				<ColorModeSwitcher />
			</Flex>
		</Flex>
	);
};

export default Navbar;
