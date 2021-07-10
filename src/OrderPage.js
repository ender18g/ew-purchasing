import React from 'react';
import { Box } from '@chakra-ui/react';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useSigninCheck } from 'reactfire';
import OrderForm from './OrderForm';

export default function OrderPage(props) {
	//pas in props.data and props.type (new) props.fireKey

	const [ status, setStatus ] = useState(false);
	const [ numItems, setNumItems ] = useState(4);
	const [ orderTotal, setOrderTotal ] = useState(0);
	const [ fireKey, setFireKey ] = useState(props.fireKey || false);
	const { signinStatus, data: signinResult } = useSigninCheck();

	const [ data, setData ] = useState({
		orderTitle: 'Order Title',
		budgetPSC: 'Volgeneau VE',
		giftYesNo: 'Checked',
		costCtrPOC: 'Michael Cornelius',
		budgetPOC: 'Millie Pierce',
		giftLtr: 'FK',
		giftAct: '66040'
	});
	// this updates input values
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });

		setStatus(false);
	};

	//update checked variable on input changes
	const handleCheck = (event) => {
		setData({ ...data, [event.target.name]: event.target.checked && 'checked' });

		setStatus(false);
	};

	/// everytime the order data is changed , calculate the totals
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

	//on the load of the page, check if props are passed and set it as the order data
	useEffect(() => {
		if (props.data) {
			setData(props.data);
			setNumItems(props.data.numItems);
		}
	}, []);

	useEffect(() => {
		//sign in result has signed in==true
		//and user.displayname .email
		// You know that it is a new order if there is no existing firekey
		console.log('**User**', signinStatus);
		if (props.type == 'new') {
			setData({ ...data, requestor: signinResult.user.displayName, requestorEmail: signinResult.user.email });
		}
	}, []);

	const database = useDatabase();
	const orderRef = database.ref('orders');
	// Button that will add an order to an existing fireky OR to a newly generated Fire key
	const addOrder = () => {
		let newRef;
		props.fireKey ? (newRef = orderRef.child(props.fireKey)) : (newRef = orderRef.push());
		newRef.set({ ...data, orderTotal: orderTotal, numItems: numItems });
		setStatus(true);
		setFireKey(newRef._delegate._path.pieces_[1]);
	};
	// increment the number of items in the order
	const addItem = () => {
		setNumItems(numItems + 1);
	};

	return (
		<Box
			my="6"
			mx={{ base: '3', xl: '20' }}
			borderRadius="md"
			py="10"
			px={{ base: '1', xl: '20' }}
			border="2px"
			borderColor="gray.100"
			shadow="md"
		>
			<OrderForm
				data={data}
				setData={setData}
				handleChange={handleChange}
				handleCheck={handleCheck}
				addItem={addItem}
				addOrder={addOrder}
				status={status}
				numItems={numItems}
				orderTotal={orderTotal}
				fireKey={fireKey}
			/>
		</Box>
	);
}
