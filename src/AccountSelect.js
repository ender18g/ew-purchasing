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

export default function AccountSelect(props) {
	//Pass in handleAccount as Props!
	// option to pass in accountKey
	const { handleAccount } = props;

	const database = useDatabase();
	const databaseRef = database.ref('accounts');
	//status is whether loading the databse, list is obj with vendor / date and url
	const { status, data: accountList } = useDatabaseObjectData(databaseRef);
	//fileURL is storage url
	const [ selectedAccountKey, setSelectedAccountKey ] = useState(props.accountKey || '');
	// this will make button turn green when saved

	//Change is used for the INPUTS

	if (status === 'loading') {
		return <Spinner />;
	}

	//Select is used for the SELCT drop down
	const handleSelect = (event) => {
		const accountKey = event.target.value;
		const selectedItem = accountList[accountKey];
		setSelectedAccountKey(accountKey);
		handleAccount({ ...selectedItem, accountKey: accountKey });
	};

	return (
		<Select maxWidth="500px" onChange={handleSelect} mx="1" variant="outline" placeholder="Select Account">
			{Object.keys(accountList).map((k, i) => {
				//avoid the database parent getting added to the list
				if (typeof accountList[k] === 'object') {
					console.log(k);
					return (
						<option value={k} key={k} selected={selectedAccountKey === k}>
							{accountList[k].accountName}
						</option>
					);
				}
			})}
		</Select>
	);
}
