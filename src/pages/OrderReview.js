import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Spinner,
	Table,
	TableCaption,
	Tbody,
	Td,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
import 'firebase/database';
import React, { useState } from 'react';
import { useDatabase, useDatabaseObjectData } from 'reactfire';
import AccountWidget from '../components/AccountWidget';
import OrderCounter from '../components/OrderCounter';
import SubmittedBox from '../components/SubmittedBox';
import OrderPage from './OrderPage';

export default function OrderReview() {
	const database = useDatabase();
	const ref = database.ref('orders');
	const [ showOrder, setShowOrder ] = useState({ show: false, data: false, key: false });
	const [ showAccounts, setShowAccounts ] = useState(false);
	const { status, data: orderList } = useDatabaseObjectData(ref);
	if (status === 'loading') {
		return <Spinner />;
	}

	const removeOrder = (k) => {
		ref.child(k).remove();
		console.log(`removed ${k}`);
		setShowOrder({ show: false });
	};

	return (
		<Box m="5">
			<Heading
				onClick={() => setShowAccounts(!showAccounts)}
				fontWeight="200"
				letterSpacing=".1em"
				size="lg"
				align="center"
			>
				Order Review
			</Heading>
			<OrderCounter orderList={orderList} />
			{/* account widget is hidden! */}
			{showAccounts && <AccountWidget orderList={orderList} />}
			<Flex maxHeight="100vh" my="5" w="100%" overflow="auto">
				<Table size="sm" colorScheme="facebook">
					<TableCaption fontSize="md">Click on a row to review order details </TableCaption>

					{/* HERE IS TABLE HEADING */}
					<Thead>
						<Tr>
							<Th display={{ base: 'none', md: 'revert' }}>Title</Th>
							<Th>Created Date</Th>
							<Th>Emailed AO</Th>

							<Th>Requestor</Th>
							<Th display={{ base: 'none', md: 'revert' }}>Merchant</Th>
							<Th>Total</Th>
						</Tr>
					</Thead>
					{/* HERE IS TABLE BODY */}
					<Tbody>
						{Object.keys(orderList).map((k) => {
							if (k.length < 13) {
								return '';
							}
							return (
								<Tr
									onClick={() => {
										setShowOrder({ show: false });
										setTimeout(() => {
											setShowOrder({
												show: true,
												data: orderList[k],
												key: k
											});
										}, 100);
									}}
									className="tableRow"
									key={k}
									bg={showOrder.key === k && 'blue.100'}
								>
									<Td display={{ base: 'none', md: 'revert' }}>{orderList[k]['orderTitle']}</Td>
									<Td>{orderList[k]['date']}</Td>
									<Td>
										<SubmittedBox
											displayText="Submitted AO"
											orderFireKey={k}
											keyName="submittedAO"
										/>
									</Td>
									<Td>{orderList[k]['requestor']}</Td>
									<Td display={{ base: 'none', md: 'revert' }}>{orderList[k]['merchant']}</Td>
									<Td>${orderList[k]['orderTotal'].toFixed(2)}</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Flex>
			{showOrder.show && (
				<Flex justifyContent="center">
					<Button colorScheme="teal" onClick={() => setShowOrder({ ...showOrder, show: false })}>
						Hide Order Form
					</Button>
				</Flex>
			)}
			{showOrder.show && (
				<Box my="6">
					<Flex alignItems="center" justifyContent="center">
						<Button mx="2" colorScheme="red" onClick={() => removeOrder(showOrder.key)}>
							<DeleteIcon className="icon" mx="2" />
							Delete Order
						</Button>
						<Button
							mx="2"
							colorScheme="teal"
							onClick={() => {
								setShowOrder({ show: false });
								setTimeout(() => {
									setShowOrder({
										show: true,
										data: { ...orderList[showOrder.key], orderTitle: 'Duplicate Order' },
										key: false
									});
								}, 100);
							}}
						>
							<CopyIcon className="icon" mx="2" />
							Copy Order
						</Button>
					</Flex>
					<OrderPage data={showOrder.data} fireKey={showOrder.key} type="review" />
				</Box>
			)}
			<Flex justifyContent="center">
				<Link color="teal" href="https://ew-purchasing-default-rtdb.firebaseio.com/orders.json">
					Firebase JSON
				</Link>
			</Flex>
		</Box>
	);
}
