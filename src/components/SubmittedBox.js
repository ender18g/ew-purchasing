import { Box, Checkbox, Spinner, Input } from '@chakra-ui/react';
import 'firebase/database';
import React, { useState, useEffect } from 'react';
import { useDatabase, useDatabaseObjectData } from 'reactfire';

export default function OrderPage(props) {
	const { displayText, orderFireKey, keyName } = props;
	const [ data, setData ] = useState({ date: '', checked: '' });
	//pass in props.data and props.type (new) props.fireKey

	//update checked variable on input changes
	const handleCheck = (event) => {
		// setData({ ...data, [event.target.name]: event.target.checked && 'checked' });
		const today = new Date();
		const dateStr = `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`;
		const isChecked = event.target.checked;
		orderRef.set({ date: isChecked ? dateStr : '', checked: isChecked ? 'checked' : '' });
		console.log('checked!');
	};

	const database = useDatabase();
	const orderRef = database.ref('orders').child(orderFireKey).child(keyName);
	const { status, data: orderData } = useDatabaseObjectData(orderRef);

	//update the data on load
	useEffect(
		() => {
			setData(orderData);
		},
		[ orderData ]
	);

	if (!data) return <Spinner />;

	return (
		<Box>
			<Checkbox
				mx="4"
				colorScheme="green"
				name="checked"
				size="md"
				isChecked={data.checked}
				onChange={handleCheck}
			>
				{data.date ? data.date : ''}
			</Checkbox>

			{/* <Input type="date" name="date" width="300px" value={data.date} placeholder="Date" mx="1" size="sm" /> */}
		</Box>
	);
}
