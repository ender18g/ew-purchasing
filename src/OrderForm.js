import React from 'react';
import { Box, Text, Spinner, Input, Flex, Button, Heading } from '@chakra-ui/react';
import 'firebase/database';
import { useState } from 'react';
import { useDatabase, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';

export default function OrderForm() {
	const [ status, setStatus ] = useState('Complete the Order Form');
	const [ numItems, setNumItems ] = useState(1);
	const [ data, setData ] = useState({
		orderTitle: ''
	});
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });
		console.log(data);
		setStatus('Editing Order');
	};
	const database = useDatabase();
	const ref = database.ref('orders');

	const addOrder = () => {
		const newRef = ref.push();
		newRef.set(data);
		setStatus('Submitted');
		console.log(newRef);
	};

	const addItem = () => {
		setNumItems(numItems + 1);
	};

	return (
		<Box m="8">
			<Heading align="center">Order Form</Heading>
			<Flex m="3" justifyContent="center">
				<Input
					onChange={handleChange}
					name="orderTitle"
					width="800px"
					value={data.orderTitle}
					placeholder="The title of your order"
				/>
			</Flex>
			<Flex m="3" justifyContent="center">
				<Input
					onChange={handleChange}
					name="orderRequestor"
					width="800px"
					value={data.orderRequestor}
					placeholder="Your Name"
				/>
				<Input
					onChange={handleChange}
					name="orderVendor"
					width="800px"
					value={data.orderVendor}
					placeholder="Vendor"
				/>
			</Flex>
			{Array.from(Array(numItems), (e, i) => (
				<Flex my="1">
					<Input
						onChange={handleChange}
						name={`item${i}`}
						width="800px"
						value={data[`item${i}`]}
						placeholder={`Item ${i}`}
					/>
					<Input
						onChange={handleChange}
						name={`quantity${i}`}
						width="150px"
						value={data[`quantity${i}`]}
						placeholder={`Quantity`}
					/>
					<Input
						onChange={handleChange}
						name={`price${i}`}
						width="150px"
						value={data[`price${i}`]}
						placeholder={`Price`}
					/>
				</Flex>
			))}

			<Flex my="5" justifyContent="center">
				<Button onClick={addItem}>Add Another Item</Button>
			</Flex>

			<Flex my="5" justifyContent="center">
				<Button bg="teal.300" onClick={addOrder}>
					Save Order
				</Button>
			</Flex>
			<Text align="center">{status}</Text>
		</Box>
	);
}
