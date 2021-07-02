import React from 'react';
import {
	Box,
	Text,
	Spinner,
	Input,
	Flex,
	Button,
	Heading,
	OrderedList,
	Link,
	Table,
	Tr,
	Th,
	Tbody,
	Tfoot,
	TableCaption,
	Td,
	Thead
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import 'firebase/database';
import { useState } from 'react';
import { useDatabase, useDatabaseList, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import OrderForm from './OrderForm';

export default function OrderReview() {
	const database = useDatabase();
	const ref = database.ref('orders');
	const [ showOrder, setShowOrder ] = useState({ show: false, data: false, key: false });
	const { status, data: orderList } = useDatabaseObjectData(ref);
	if (status === 'loading') {
		return <Spinner />;
	}

	const removeOrder = (k) => {
		ref.child(k).remove();
		console.log(`removed ${k}`);
	};

	console.log(orderList);

	return (
		<Box my="5">
			<Heading fontWeight="200" letterSpacing=".1em" size="lg" align="center">
				Order Review
			</Heading>
			<Flex w="100%">
				<Table my="6" size="sm" variant="striped" colorScheme="whiteAlpha">
					<TableCaption>All Saved Orders</TableCaption>
					<Thead>
						<Tr>
							<Th display={{ base: 'none', md: 'block' }}>Title</Th>
							<Th>Date</Th>
							<Th>Requestor</Th>
							<Th display={{ base: 'none', md: 'block' }}>Merchant</Th>
							<Th>Total</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.keys(orderList).map((k) => {
							if (k.length < 13) {
								return '';
							}

							return (
								<Tr key={k}>
									<Td display={{ base: 'none', md: 'block' }}>{orderList[k]['orderTitle']}</Td>
									<Td>{orderList[k]['date']}</Td>
									<Td>{orderList[k]['requestor']}</Td>
									<Td display={{ base: 'none', md: 'block' }}>{orderList[k]['merchant']}</Td>
									<Td>
										${orderList[k]['orderTotal'].toFixed(2)}
										{!showOrder.show && (
											<Flex>
												<EditIcon
													mx="2"
													color="blue.600"
													h={7}
													onClick={() =>
														setShowOrder({ show: true, data: orderList[k], key: k })}
												/>
												<DeleteIcon
													mx="2"
													color="red.600"
													h={7}
													onClick={() => removeOrder(k)}
												/>
											</Flex>
										)}
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Flex>
			{showOrder.show && (
				<Flex justifyContent="center">
					<Button onClick={() => setShowOrder({ ...showOrder, show: false })}>Hide Order Form</Button>
				</Flex>
			)}
			{showOrder.show && <OrderForm data={showOrder.data} fireKey={showOrder.key} />}
			<Flex justifyContent="center">
				<Link color="blue" href="https://ew-purchasing-default-rtdb.firebaseio.com/orders.json">
					Firebase JSON
				</Link>
			</Flex>
		</Box>
	);
}
