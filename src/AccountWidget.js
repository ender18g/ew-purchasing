import React from 'react';
import {
	Box,
	Text,
	Spinner,
	Flex,
	Button,
	Heading,
	Link,
	Table,
	Tr,
	Th,
	Tbody,
	TableCaption,
	Td,
	Thead
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, CopyIcon } from '@chakra-ui/icons';
import 'firebase/database';
import { useState } from 'react';
import { useDatabase, useDatabaseObjectData } from 'reactfire';
import OrderPage from './OrderPage';

export default function AccountWidget() {
	return <Box m="5" />;
}
