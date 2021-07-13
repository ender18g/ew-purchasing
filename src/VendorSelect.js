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

export default function VendorSelect(props) {
	const { setSelection } = props;
	const database = useDatabase();
	const databaseRef = database.ref('889');
	//status is whether loading the databse, list is obj with vendor / date and url
	const { status, data: vendorList } = useDatabaseObjectData(databaseRef);
	//fileURL is storage url
	const [ selected, setSelected ] = useState({ url: '' });
	// this will make button turn green when saved

	//Change is used for the INPUTS

	if (status === 'loading') {
		return <Spinner />;
	}

	//Select is used for the SELCT drop down
	const handleSelect = (event) => {
		const selectedVendor = vendorList[event.target.value];
		console.log(selectedVendor);
		setSelected(selectedVendor);
		setSelection(selectedVendor);
	};

	const inFY = (date) => {
		const today = new Date();
		const year = today.getFullYear();
		let oct1 = new Date().setFullYear(year, 10, 1);
		// if oct1 hasn't occured, then set last year's oct 1 date
		if (today - oct1 < 0) {
			oct1 = new Date().setFullYear(year - 1, 10, 1);
		}
		const diffTime = date - oct1;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		if (diffDays < 0) return false;
		return true;
	};
	return (
		<Flex alignItems="center">
			<Select onChange={handleSelect} mx="1" variant="outline" placeholder="Select Vendor 889">
				{Object.keys(vendorList).map((k, i) => {
					//avoid the database parent getting added to the list
					if (typeof vendorList[k] === 'object') {
						return (
							<option value={k} key={k}>
								{vendorList[k].vendor}
								&nbsp;&nbsp;&nbsp;
								{vendorList[k].date}
								{inFY(vendorList[k].dateObject) ? '  ✅ ' : '  ❌'}
							</option>
						);
					}
				})}
			</Select>
			<Link style={{ textDecoration: 'none' }} isExternal href={selected.url}>
				<Button isDisabled={!selected.url} colorScheme="teal" m="1">
					Download 889
				</Button>
			</Link>
		</Flex>
	);
}
