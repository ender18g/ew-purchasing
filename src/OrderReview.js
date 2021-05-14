import React from 'react';
import { Box, Text, Spinner, Input, Flex, Button, Heading, OrderedList, Link } from '@chakra-ui/react';
import 'firebase/database';
import { useState } from 'react';
import { useDatabase, useDatabaseList, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import OrderLine from './OrderLine';

export default function OrderForm() {
	const database = useDatabase();
	const ref = database.ref('orders');

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
		<Box m="8">
			<Heading align="center">Order List</Heading>
			{Object.keys(orderList).map((k) => {
				if (k.length < 13) {
					return '';
				}

				return <OrderLine key={k} removeOrder={() => removeOrder(k)} order={orderList[k]} />;
			})}
			<Flex justifyContent="center">
				<Link color="blue" href="https://ew-purchasing-default-rtdb.firebaseio.com/orders.json">
					Firebase JSON
				</Link>
			</Flex>
		</Box>
	);
}
