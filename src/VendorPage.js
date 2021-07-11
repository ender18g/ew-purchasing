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
	//status is whether loading the databse, list is obj with vendor / date
	const { status, data: vendorList } = useDatabaseObjectData(databaseRef);
	//fileURL is storage url
	const [ fileURL, setFileURL ] = useState('');
	//sleected is the current vendor KEY
	const [ selected, setSelected ] = useState({ url: '' });
	// this will make button turn green when saved
	const [ saved, setSaved ] = useState(false);
	// Button that will add an order to an existing fireky OR to a newly generated Fire key

	const addItem = () => {
		const newRef = databaseRef.push();
		newRef.set({ ...data, url: fileURL, dateObject: makeDate(data.date) });
		setSaved(true);
	};

	const [ data, setData ] = useState({
		vendor: ''
	});

	//Change is used for the INPUTS
	const handleChange = (event) => {
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const makeDate = (dateString) => {
		const dateArray = dateString.split('-');
		const dateObject = new Date().setFullYear(dateArray[0], dateArray[1], dateArray[2]);
		return dateObject;
	};

	if (status === 'loading') {
		return <Spinner />;
	}

	//Select is used for the SELCT drop down
	const handleSelect = (event) => {
		console.log('changed');
		const selectedVendor = vendorList[event.target.value];
		console.log(selectedVendor);
		setSelected(selectedVendor);
	};

	const getDays = (date) => {
		console.log(date);
		const today = new Date();
		const diffTime = today - date;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
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
					{Object.keys(vendorList).map((k, i) => {
						//avoid the database parent getting added to the list
						if (typeof vendorList[k] === 'object') {
							return (
								<option value={k} key={k}>
									{vendorList[k].vendor}
									&nbsp;&nbsp;&nbsp;
									{vendorList[k].date}
									{getDays(vendorList[k].dateObject) < 360 ? '✅ ' : '❌'}
								</option>
							);
						}
					})}
				</Select>
			</Flex>
			<Link style={{ textDecoration: 'none' }} isExternal href={selected.url}>
				<Button isDisabled={!selected.url} colorScheme="teal" m="1">
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
				<Button isDisabled={!fileURL} colorScheme={saved ? 'teal' : 'blue'} m="1" onClick={addItem}>
					{saved ? 'Added' : 'Add New 889'}
				</Button>
			</Box>
			<Heading my="2" size="md" fontWeight="400">
				Vendor not listed?
			</Heading>
			<Link
				color="teal"
				isExternal
				href="https://firebasestorage.googleapis.com/v0/b/ew-purchasing.appspot.com/o/documents%2F889_Representation_Form_-_31_Aug_20.pdf?alt=media&token=f2fb09fe-cb26-4dd7-aa77-afb1ab070751"
			>
				Download a Blank 889 Form (Fillable PDF)
			</Link>
		</Box>
	);
}
