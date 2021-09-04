import React from 'react';
import { Box, Heading, Flex, Select, Link, Button, Text } from '@chakra-ui/react';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useSigninCheck } from 'reactfire';
import OrderForm from './OrderForm';
import FileUploader from './FileUploader';
import VendorSelect from './VendorSelect';
import AccountSelect from './AccountSelect';

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
		budgetPSC: '',
		giftYesNo: '',
		costCtrPOC: '',
		costCtrEmail: '',
		budgetPOCEmail: '',
		budgetPOC: '',
		giftLtr: '',
		giftAct: '',
		merchantFormURL: '',
		quoteURL: '',
		accountKey: '',
		accountName: '',
		orderTotal: 0,
		estShipping: ''
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
					let quantity = Number(data[`qty${i}`]);
					let price = Number(data[`unitPrice${i}`]);
					counter = counter + quantity * price;
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
		console.log('**User**', signinResult);
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
		newRef.set({
			...data,
			orderTotal: orderTotal,
			numItems: numItems,
			estShipping: parseFloat(data.estShipping).toFixed(2)
		});
		setStatus(true);
		console.log('Order Added', data);
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

	const handleAccount = (accountObj) => {
		console.log('Handling Account:', accountObj);
		setData({ ...data, ...accountObj });
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
			budgetPOC: 'Provide budget POC',
			endUse: 'Provide an end use'
		};
		for (let property in requiredItems) {
			if (!data[property]) {
				return requiredItems[property];
			}
		}
		return false;
	};

	const createEmail = () => {
		const recipientName = data.costCtrPOC.split(' ')[0];
		const recipientEmail = data.costCtrEmail;

		const pscText = data.budgetPSC.split(' ')[1];
		let linkString = `mailto:${recipientEmail}?cc=${data.requestorEmail}`;
		linkString += `&subject=New ${pscText} order`;
		linkString += `&body=${recipientName},`;
		linkString += `%0A%0AAttached is a PCO, quote and 889 for ${data.orderTitle}. These items are being charged against our FY21 WRC allocation of the ${data.budgetPSC} spend plan.`;
		linkString += `%0AThe net total of these purchases is $${data.orderTotal} including $${data.estShipping} in shipping. This brings our estimated ${pscText} Fund allocation balance down to [ACCOUNT BALANCE] `;
		linkString += `%0A%0A-Mike`;

		return linkString;
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
				display={props.type === 'new' ? 'flex' : 'none'}
				bg="gray.100"
				flexWrap={{ base: 'wrap', lg: 'nowrap' }}
				justifyContent="space-around"
				alignItems="center"
				borderRadius="md"
				my="10"
				mx="2"
			>
				<Flex border={data.accountName ? '0px' : '2px'} borderColor="red.500" borderRadius="md" m="1" w="500px">
					<AccountSelect handleAccount={handleAccount} accountKey={data.accountKey} />
				</Flex>
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
				type={props.type}
				disableSubmit={invalidForm() ? true : false}
			/>
			<Heading textAlign="center" size="lg" textColor="red" fontWeight="600">
				{message}
			</Heading>

			{/* Only show the review forms buttons if its an order review */}
			{props.type === 'review' && (
				<Flex mt="1" justifyContent="center">
					<Link m="1" isExternal style={{ textDecoration: 'none' }} href={data.quoteURL}>
						<Button>Review Quote</Button>
					</Link>
					<Link m="1" isExternal style={{ textDecoration: 'none' }} href={data.merchantFormURL}>
						<Button>Review 889</Button>
					</Link>
					<Link m="1" isExternal style={{ textDecoration: 'none' }} href={createEmail()}>
						<Button>Create Email</Button>
					</Link>
				</Flex>
			)}
		</Box>
	);
}
