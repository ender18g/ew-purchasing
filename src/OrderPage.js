import React from 'react';
import { Box, Heading, Flex, Select, Link, Button, Text } from '@chakra-ui/react';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useSigninCheck } from 'reactfire';
import OrderForm from './OrderForm';
import FileUploader from './FileUploader';
import VendorSelect from './VendorSelect';

export default function OrderPage(props) {
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
		orderTitle: '',
		budgetPSC: 'Volgeneau VE',
		giftYesNo: 'Checked',
		costCtrPOC: 'Michael Cornelius',
		budgetPOC: 'Millie Pierce',
		giftLtr: 'FK',
		giftAct: '66040',
		merchantFormURL: '',
		quoteURL: ''
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

	const setQuoteURL = (url) => {
		setData({ ...data, quoteURL: url });
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

	const selectVendor = (vendorObj) => {
		console.log(vendorObj);
		setData({ ...data, merchant: vendorObj.vendor, merchantFormURL: vendorObj.url });
	};

	const invalidForm = () => {
		const requiredItems = {
			quoteURL: 'Upload a PDF quote',
			merchantFormURL: 'Select an 889 form',
			orderTitle: 'Give your order a title',
			date: 'Select a date',
			desc1: 'Include at least one item',
			qty1: 'Provide quantity of item',
			unitPrice1: 'Provide item price',
			estShipping: 'Provide Estimate Shipping',
			requestor: 'Provide requestor full name',
			budgetPSC: 'Provide budget PSC',
			budgetPOC: 'Provide budget POC'
		};
		for (let property in requiredItems) {
			console.log(property, data[property]);
			if (!data[property]) {
				return requiredItems[property];
			}
		}
		return false;
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
			<Heading fontWeight="200" letterSpacing=".1em" size="lg" align="center">
				{data.orderTitle || 'Create Your Order'}
			</Heading>

			{/* THIS IS FOR QUOTE URL AND SELECT 889 */}
			<Flex
				bg="gray.100"
				flexWrap={{ base: 'wrap', md: 'nowrap' }}
				justifyContent="space-around"
				alignItems="center"
				borderRadius="md"
				my="10"
				mx="2"
			>
				<Text>Required Documents:</Text>
				<Flex border={data.quoteURL ? '0px' : '2px'} borderColor="red.500" borderRadius="md" m="1" w="500px">
					<FileUploader setFileURL={setQuoteURL} subfolder="Quote" />
				</Flex>
				<Flex
					border={data.merchantFormURL ? '0px' : '2px'}
					borderColor="red.500"
					borderRadius="md"
					m="1"
					w="500px"
				>
					<VendorSelect setSelection={selectVendor} />
				</Flex>
			</Flex>
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
			/>
			<Heading textAlign="center" size="lg" textColor="red" fontWeight="600">
				{message}
			</Heading>

			{/* Only show the review forms buttons if its an order review */}
			{props.type !== 'new' && (
				<Flex mt="1" justifyContent="center">
					<Link m="1" isExternal style={{ textDecoration: 'none' }} href={data.quoteURL}>
						<Button>Review Quote</Button>
					</Link>
					<Link m="1" isExternal style={{ textDecoration: 'none' }} href={data.merchantFormURL}>
						<Button>Review 889</Button>
					</Link>
				</Flex>
			)}
		</Box>
	);
}
