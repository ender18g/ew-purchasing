import React, { useState, useEffect } from 'react';
import {
	Heading,
	Flex,
	Image,
	Link,
	Box,
	IconButton,
	Text,
	MenuButton,
	Menu,
	MenuList,
	MenuItem
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Hamburger = (props) => {
	const { menuItems } = props;
	return (
		<Box ml="5">
			<Menu>
				<MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} colorScheme="teal" />
				<MenuList>
					{menuItems.map((item, i) => (
						<NavLink key={i} to={item.link}>
							<MenuItem>
								<Text>{item.title}</Text>
							</MenuItem>
						</NavLink>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
};

export default Hamburger;
