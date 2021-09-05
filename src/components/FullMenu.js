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

const FullMenu = (props) => {
	const { menuItems } = props;
	return (
		<Flex>
			{menuItems.map((item, i) => (
				<NavLink key={i} w="100px" className="header-link" to={item.link} exact activeClassName="active-link">
					<Text mx={{ base: '1', md: '5' }} fontSize="md">
						{item.title}
					</Text>
				</NavLink>
			))}
		</Flex>
	);
};

export default FullMenu;
