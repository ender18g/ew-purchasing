import React from 'react';
import {
	Box,
	Flex,
	Text,
	Button,
	Heading,
	Select,
	Input,
	InputGroup,
	InputLeftAddon,
	Spinner,
	Link
} from '@chakra-ui/react';
import FileUploader from './FileUploader';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { useDatabase, useSigninCheck, useDatabaseObjectData } from 'reactfire';

export default function VendorPage() {
	const database = useDatabase();
	const databaseRef = database.ref('889');
	const { status, data: vendorList } = useDatabaseObjectData(databaseRef);
	const [ fileURL, setFileURL ] = useState('');
	const [ selected, setSelected ] = useState({ url: '' });
	// Button that will add an order to an existing fireky OR to a newly generated Fire key
	const addItem = () => {
		const newRef = databaseRef.push();
		newRef.set({ ...data, url: fileURL });
	};

	const [ data, setData ] = useState({
		vendor: ''
	});
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });
	};

	if (status === 'loading') {
		return <Spinner />;
	}
	const handleSelect = (event) => {
		console.log('changed');
		const selectedVendor = vendorList[event.target.value];
		console.log(selectedVendor);
		setSelected(selectedVendor);
	};

	console.log(vendorList);
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
			<Heading my="4" fontWeight="200" letterSpacing=".1em" size="lg" align="center">
				Approved Vendors
			</Heading>
			<Box>
				<Heading my="2" size="md" fontWeight="400">
					View existing 889 forms:
				</Heading>
			</Box>

			<Flex justifyContent="left">
				<Select onChange={handleSelect} mx="1" variant="outline" placeholder="Select Vendor">
					{Object.keys(vendorList).map((k, i) => (
						<option value={k} key={k}>
							{vendorList[k].vendor}
						</option>
					))}
				</Select>
			</Flex>
			<Link style={{ textDecoration: 'none' }} isExternal href={selected.url}>
				<Button colorScheme="teal" m="1">
					Download 889
				</Button>
			</Link>
			<Box my="10">
				<Heading my="2" size="md" fontWeight="400">
					Upload a new form:
				</Heading>
				<Flex justifyContent="left" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
					<Input
						onChange={handleChange}
						name="vendor"
						width="800px"
						value={data.vendor}
						placeholder="Vendor Name"
						mx="1"
					/>
					<InputGroup>
						<InputLeftAddon children="Date Signed:" />
						<Input
							type="date"
							onChange={handleChange}
							name="date"
							width="300px"
							value={data.date}
							placeholder="Date Signed"
							mx="1"
						/>
					</InputGroup>
				</Flex>

				<Flex m="1" w="500px">
					<FileUploader setFileURL={setFileURL} />
				</Flex>
				<Button isDisabled={!fileURL} colorScheme="teal" m="1" onClick={addItem}>
					Add New 889
				</Button>
			</Box>
		</Box>
	);
}
