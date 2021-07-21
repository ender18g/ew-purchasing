import React from 'react';
import { Box, Heading, Flex, Select, Link, Button, Text } from '@chakra-ui/react';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useSigninCheck } from 'reactfire';
import OrderForm from './OrderForm';
import FileUploader from './FileUploader';
import AccountSelect from './AccountSelect';

export default function TemplatePage(props) {
	//pass in props.data and props.type (new) props.fireKey

	//status is true when order has been saved
	const [ status, setStatus ] = useState(false);
	const [ numItems, setNumItems ] = useState(4);
	const [ orderTotal, setOrderTotal ] = useState(0);
	const [ fireKey, setFireKey ] = useState(props.fireKey || false);
	const { signinStatus, data: signinResult } = useSigninCheck();
	//message for what must be filled out
	const [ message, setMessage ] = useState('');

	const [ data, setData ] = useState({
		orderTitle: 'Account Name',
		budgetPSC: '',
		giftYesNo: '',
		costCtrPOC: '',
		budgetPOC: '',
		giftLtr: '',
		giftAct: ''
	});
	// this updates input values
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });
		setStatus(false);
		console.log(data);
		setMessage('');
	};

	//update checked variable on input changes
	const handleCheck = (event) => {
		setData({ ...data, [event.target.name]: event.target.checked && 'checked' });
		setStatus(false);
	};

	/// everytime the order data is changed , calculate the totals
	useEffect(
		() => {
			console.log('Data Changed', data);
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
		if (props.type === 'new') {
			setData({ ...data, requestor: signinResult.user.displayName, requestorEmail: signinResult.user.email });
		}
	}, []);

	const database = useDatabase();
	const orderRef = database.ref('accounts');
	// Button that will add an order to an existing fireky OR to a newly generated Fire key
	const addOrder = () => {
		const genMessage = invalidForm();
		if (genMessage) {
			setMessage(genMessage);
			return;
		}
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

	//handles the selection of an account
	const handleAccount = (accountObj) => {
		console.log('Handling Account:', accountObj);
		setData(accountObj);
	};

	const invalidForm = () => {
		const requiredItems = {
			accountName: 'Give your account a name',
			budgetPSC: 'Provide budget PSC',
			budgetPOC: 'Provide budget POC',
			giftLtr: 'Provid Gift Letter',
			giftAct: 'Provid Gift Account Number'
		};

		for (let property in requiredItems) {
			if (!data[property]) {
				console.log('need', requiredItems[property]);
				return requiredItems[property];
			}
		}
		return false;
	};

	return (
		<Box>
			<Flex m="4" justifyContent="center">
				<AccountSelect handleAccount={handleAccount} />
			</Flex>
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
				<Heading fontWeight="200" letterSpacing=".1em" size="lg" align="center">
					{data.orderTitle || 'New Account Name'}
				</Heading>

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
					disableSubmit={invalidForm() ? true : false}
					type="account"
				/>
				<Heading textAlign="center" size="lg" textColor="red" fontWeight="600">
					{message}
				</Heading>
			</Box>
		</Box>
	);
}
