import React from 'react';
import {
	Box,
	Text,
	Link,
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
import { useDatabase, useSigninCheck } from 'reactfire';
import { CheckIcon, SpinnerIcon } from '@chakra-ui/icons';

export default function OrderForm(props) {
	const {
		data,
		setData,
		handleChange,
		handleCheck,
		addItem,
		addOrder,
		status,
		numItems,
		orderTotal,
		fireKey
	} = props;

	return (
		<Box>
			{/* TITLE AND BUDGET CODE */}
			<Flex m="2" justifyContent="center">
				<Input
					isRequired
					onChange={handleChange}
					name="orderTitle"
					width="800px"
					value={data.orderTitle}
					placeholder="The title of your order"
					errorBorderColor="crimson"
					isInvalid={!data.orderTitle}
					mx="1"
				/>
				<Input
					onChange={handleChange}
					name="budgetPSC"
					width="150px"
					value={data.budgetPSC}
					placeholder="PSC"
					isInvalid={!data.budgetPSC}
					mx="1"
				/>
			</Flex>

			{/* REQUESTOR DATA */}
			<Flex m="3" justifyContent="center" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
				<Input
					onChange={handleChange}
					name="requestor"
					width="800px"
					value={data.requestor}
					placeholder="Requestor"
					isInvalid={!data.requestor}
					mx="1"
					isReadOnly={props.type === 'new'}
				/>
				<Input
					onChange={handleChange}
					name="requestorPhone"
					type="tel "
					width="300px"
					value={data.requestorPhone}
					placeholder="Requestor Phone"
					isInvalid={!data.requestorPhone}
					mx="1"
				/>
				<Input
					type="date"
					onChange={handleChange}
					name="date"
					width="300px"
					value={data.date}
					placeholder="Date"
					isInvalid={!data.date}
					mx="1"
				/>
			</Flex>

			{/* MERCHANT DATA */}
			<Flex m="3" justifyContent="center" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
				<Input
					onChange={handleChange}
					name="merchant"
					width="600px"
					value={data.merchant}
					placeholder="Merchant"
					isInvalid={!data.merchant}
					mx="1"
				/>
				<Input
					onChange={handleChange}
					name="merchantPOC"
					width="800px"
					value={data.merchantPOC}
					placeholder="Merchant POC/Website"
					isInvalid={!data.merchantPOC}
					mx="1"
				/>
				<Input
					onChange={handleChange}
					name="merchantPhone"
					type="tel"
					width="300px"
					value={data.merchantPhone}
					placeholder="Merchant Phone (Optional)"
				/>
			</Flex>

			{/* ITEMS DESC QUANTITY and PRICE */}
			<Divider my="5" />
			{Array.from(Array(numItems), (e, i) => (
				<Flex
					my={{ base: '6', md: '1' }}
					justifyContent="center"
					flexWrap={{ base: 'wrap', md: 'nowrap' }}
					key={i}
				>
					<InputGroup w="600px">
						<InputLeftAddon children={i + 1} />
						<Input
							onChange={handleChange}
							name={`desc${i + 1}`}
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
						type="number"
						min="0"
						max="10000"
						step="1"
					/>
					<InputGroup width="200px">
						<InputLeftAddon children="$" />
						<Input
							onChange={handleChange}
							name={`unitPrice${i + 1}`}
							value={data[`unitPrice${i + 1}`]}
							placeholder={`Unit Price`}
							min="0"
							max="10000"
							step=".01"
						/>
					</InputGroup>

					<InputGroup width="200px">
						<InputLeftAddon children="Total $" />
						<Input
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
			<Flex my="5" justifyContent="space-around" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
				<Button my="2" colorScheme="gray" onClick={addItem}>
					+ Add Item
				</Button>
				<InputGroup my="2" width="300px">
					<InputLeftAddon children="$" />
					<Input
						onChange={handleChange}
						name="estShipping"
						value={data.estShipping}
						placeholder="Estimated Shipping"
						isInvalid={!data.estShipping}
					/>
				</InputGroup>

				<InputGroup my="2" width="300px">
					<InputLeftAddon children="Total Purchase $" />
					<Input isReadOnly bg="gray.50" value={orderTotal.toFixed(2)} />
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
					isInvalid={!data.costCtrPOC}
					mx="1"
				/>
				<Input
					onChange={handleChange}
					name="budgetPOC"
					width="800px"
					value={data.budgetPOC}
					placeholder="Authorizing Official Name"
					isInvalid={!data.budgetPOC}
					mx="1"
				/>
			</Flex>

			{/* THESE ARE FOR CHECKBOXES */}

			<Flex m="3" justifyContent="center" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
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
				<Checkbox mx="3" colorScheme="green" name="giftYesNo" isChecked={data.giftYesNo} onChange={handleCheck}>
					Gift Funds
				</Checkbox>
				<Input
					onChange={handleChange}
					name="giftAct"
					width="200px"
					value={data.giftAct}
					placeholder="Gift Account Code"
					isInvalid={!data.giftAct}
					mx="1"
				/>
				<Input
					onChange={handleChange}
					name="giftLtr"
					width="200px"
					value={data.giftLtr}
					placeholder="Gift Letter Code"
					isInvalid={!data.giftLtr}
					mx="1"
				/>
			</Flex>

			<Flex my="5" justifyContent="center">
				<Button
					mx="2"
					isDisabled={props.disableSubmit}
					colorScheme={status ? 'teal' : 'blue'}
					onClick={addOrder}
				>
					{status && <CheckIcon mx="2" />}
					{status ? 'Order Submitted' : 'Submit Order'}
				</Button>
				<Link style={{ textDecoration: 'none' }} isExternal href={`/pdf/pdf.html?fireKey=${fireKey}`}>
					<Button mx="2" isDisabled={!fireKey} colorScheme="teal">
						<SpinnerIcon mx="2" />Generate PDF
					</Button>
				</Link>
			</Flex>
			<Text align="center">{status}</Text>
		</Box>
	);
}
