import React from 'react';
import {
	Box,
	Text,
	Spinner,
	Input,
	Flex,
	Button,
	Heading,
	InputLeftAddon,
	InputGroup,
	Divider,
	Checkbox
} from '@chakra-ui/react';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import { CheckIcon } from '@chakra-ui/icons';

export default function OrderForm() {
	const [ status, setStatus ] = useState(false);
	const [ numItems, setNumItems ] = useState(4);
	const [ orderTotal, setOrderTotal ] = useState(0);
	const [ data, setData ] = useState({
		orderTitle: ''
	});
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });
		console.log(data);
		setStatus(false);
	};

	const handleCheck = (event) => {
		setData({ ...data, [event.target.name]: event.target.checked && 'checked' });
		console.log(data);
		setStatus(false);
	};

	useEffect(
		() => {
			let counter = 0;
			for (let i = 1; i < +25; i++) {
				if (!isNaN(data[`qty${i}`]) && !isNaN(data[`unitPrice${i}`])) {
					counter = counter + data[`qty${i}`] * data[`unitPrice${i}`];
				}
			}
			if (!isNaN(data['estShipping'])) {
				counter += Number(data['estShipping']);
			}
			setOrderTotal(counter);
		},
		[ data ]
	);

	const database = useDatabase();
	const ref = database.ref('orders');

	const addOrder = () => {
		const newRef = ref.push();
		newRef.set(data);
		setStatus(true);
		console.log(newRef);
	};

	const addItem = () => {
		setNumItems(numItems + 1);
	};

	return (
		<Box m="8">
			<Heading align="center">Order Form</Heading>

			{/* TITLE AND BUDGET CODE */}
			<Flex m="3" justifyContent="center">
				<Input
					isRequired
					onChange={handleChange}
					name="orderTitle"
					width="800px"
					value={data.orderTitle}
					placeholder="The title of your order"
				/>
				<Input
					onChange={handleChange}
					name="budgetPSC"
					width="150px"
					value={data.budgetPSC}
					placeholder="PSC"
				/>
			</Flex>

			{/* REQUESTOR DATA */}
			<Flex m="3" justifyContent="center">
				<Input
					onChange={handleChange}
					name="requestor"
					width="800px"
					value={data.requestor}
					placeholder="Requestor"
				/>
				<Input
					onChange={handleChange}
					name="requestorPhone"
					width="800px"
					value={data.requestorPhone}
					placeholder="Requestor Phone"
				/>
				<Input
					type="date"
					onChange={handleChange}
					name="date"
					width="800px"
					value={data.date}
					placeholder="Date"
				/>
			</Flex>

			{/* MERCHANT DATA */}
			<Flex m="3" justifyContent="center">
				<Input
					onChange={handleChange}
					name="merchant"
					width="800px"
					value={data.merchant}
					placeholder="Merchant"
				/>
				<Input
					onChange={handleChange}
					name="merchantPOC"
					width="800px"
					value={data.merchantPOC}
					placeholder="Merchant POC"
				/>
				<Input
					onChange={handleChange}
					name="merchantPhone"
					width="800px"
					value={data.merchantPhone}
					placeholder="Merchant Phone"
				/>
			</Flex>

			{/* ITEMS QUANTITY and PRICE */}
			<Divider my="5" />
			{Array.from(Array(numItems), (e, i) => (
				<Flex my="1" justifyContent="center">
					<InputGroup w="800px">
						<InputLeftAddon children={i + 1} />
						<Input
							onChange={handleChange}
							name={`desc${i + 1}`}
							width="800px"
							value={data[`desc${i + 1}`]}
							placeholder={`Item ${i + 1} description`}
						/>
					</InputGroup>
					<Input
						onChange={handleChange}
						name={`qty${i + 1}`}
						width="150px"
						value={data[`qty${i + 1}`]}
						placeholder={`Quantity`}
					/>
					<InputGroup width="200px">
						<InputLeftAddon children="$" />
						<Input
							onChange={handleChange}
							name={`unitPrice${i + 1}`}
							width="200px"
							value={data[`unitPrice${i + 1}`]}
							placeholder={`Unit Price`}
						/>
					</InputGroup>

					<InputGroup width="200px">
						<InputLeftAddon children="Total $" />
						<Input
							width="100px"
							name={`unitPrice${i + 1}`}
							value={
								data[`unitPrice${i + 1}`] * data[`qty${i + 1}`] ? (
									(data[`unitPrice${i + 1}`] * data[`qty${i + 1}`]).toFixed(2)
								) : (
									'-'
								)
							}
							bg="gray.50"
							isReadOnly
						/>
					</InputGroup>
				</Flex>
			))}

			{/* ADD ANOTHER ITEM BUTTON AND TOTAL */}
			<Flex my="5" justifyContent="space-around">
				<Button colorScheme="gray" onClick={addItem}>
					+ Add Item
				</Button>
				<InputGroup width="300px">
					<InputLeftAddon children="$" />
					<Input
						onChange={handleChange}
						name="estShipping"
						width="300px"
						value={data.estShipping}
						placeholder="Estimated Shipping"
					/>
				</InputGroup>

				<InputGroup width="300px">
					<InputLeftAddon children="Total Purchase $" />
					<Input isReadOnly bg="gray.50" width="300px" value={orderTotal.toFixed(2)} />
				</InputGroup>
			</Flex>

			{/* Approval DATA */}
			<Flex m="3" justifyContent="center">
				<Input
					onChange={handleChange}
					name="costCtrPOC"
					width="800px"
					value={data.costCtrPOC}
					placeholder="Cost Center Head Name"
				/>
				<Input
					onChange={handleChange}
					name="budgetPOC"
					width="800px"
					value={data.budgetPOC}
					placeholder="Authorizing Official Name"
				/>
			</Flex>

			{/* THESE ARE FOR CHECKBOXES */}

			<Flex m="3" justifyContent="center">
				<Checkbox mx="4" colorScheme="red" name="itprYesNo" isChecked={data.itprYesNo} onChange={handleCheck}>
					ITPR Required
				</Checkbox>
				<Checkbox
					mx="4"
					colorScheme="red"
					name="accPropYesNo"
					isChecked={data.accPropYesNo}
					onChange={handleCheck}
				>
					Accountable Property Required
				</Checkbox>
				<Checkbox
					mx="4"
					colorScheme="red"
					name="hazmatYesNo"
					isChecked={data.hazmatYesNo}
					onChange={handleCheck}
				>
					Hazmat
				</Checkbox>
				<Checkbox mx="4" colorScheme="green" name="giftYesNo" isChecked={data.giftYesNo} onChange={handleCheck}>
					Gift Funds
				</Checkbox>
				<Input
					onChange={handleChange}
					name="giftAct"
					width="200px"
					value={data.giftAct}
					placeholder="Gift Account Code"
				/>
				<Input
					onChange={handleChange}
					name="giftLtr"
					width="200px"
					value={data.giftLtr}
					placeholder="Gift Letter Code"
				/>
			</Flex>

			<Flex my="5" justifyContent="center">
				<Button colorScheme={status ? 'teal' : 'red'} onClick={addOrder}>
					{status && <CheckIcon mx="2" />}
					{status ? 'Order Saved' : 'Save Order'}
				</Button>
			</Flex>
			<Text align="center">{status}</Text>
		</Box>
	);
}
