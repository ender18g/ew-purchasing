import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { useStorage, useStorageDownloadURL, useStorageTask } from 'reactfire';
import { Box, Text, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

const FileUploader = (props) => {
	const { setFileURL } = props;

	const [ ref, setRef ] = useState();
	const [ uploadTask, setUploadTask ] = useState();
	const storage = useStorage();

	const handleChange = (e) => {
		//get the file string from input
		const file = e.target.files[0];
		//make a firestore reference
		const newRef = storage.ref('documents').child(file.name);
		//save the reference
		setRef(newRef);
		//put the file there
		const uploadTask = newRef.put(file);
		setUploadTask(newRef.put(file));
		//when complete, get the url and save the URL!
		uploadTask.then(() => {
			console.log('upload complete');
			newRef.getDownloadURL().then((url) => {
				console.log(url);
				setFileURL(url);
			});
			setUploadTask();
		});
	};

	return (
		<Box>
			<InputGroup>
				<InputLeftAddon children="Upload 889:" />
				<Input mx="1" type="file" accept=".pdf" onChange={handleChange} />
			</InputGroup>
		</Box>
	);
};

export default FileUploader;
