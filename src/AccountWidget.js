import React from 'react';
import { Box, Text, Flex, Heading, Thead, Tr, Th, Tbody, Td, Table, TableCaption } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, CopyIcon } from '@chakra-ui/icons';
import 'firebase/database';

export default function AccountWidget(props) {
	const { orderList } = props;

	const getAcctCodes = (orderList) => {
		console.log(orderList);
		let resultObj = {};
		for (const orderKey in orderList) {
			if (typeof orderList[orderKey] !== 'object') continue;
			const giftLtr = orderList[orderKey]['giftLtr'];
			const orderTotal = orderList[orderKey]['orderTotal'];
			const accountName = orderList[orderKey]['accountName'];
			console.log(orderKey);
			if (giftLtr in resultObj) {
				resultObj[giftLtr]['total'] += orderTotal;
			} else {
				resultObj[giftLtr] = {
					name: accountName,
					total: orderTotal.toFixed(2)
				};
			}
		}
		console.log(resultObj);
		return resultObj;
	};

	const accountInfo = getAcctCodes(orderList);
	return (
		<Flex my="2" justifyContent="center">
			<Box boxShadow="lg" border="2px" borderRadius="md" borderColor="gray.300">
				<Table size="sm" variant="striped" colorScheme="teal">
					<TableCaption>Total balance of saved orders per account</TableCaption>
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Gift Letter</Th>
							<Th>Total Spent</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.keys(accountInfo).map((k, i) => (
							<Tr key={i}>
								<Td fontWeight="600">{accountInfo[k].name}</Td>
								<Td>{k}</Td>
								<Td>${accountInfo[k].total}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		</Flex>
	);
}
