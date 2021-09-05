import { Box, Button, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

export default function VendorEmail() {
	const [ show, setShow ] = useState(false);

	if (!show) {
		return (
			<Box>
				<Button my="3" onClick={() => setShow(!show)} colorScheme="blue">
					Show Sample 889 Request Email
				</Button>
			</Box>
		);
	}

	return (
		<Box m="5" p="5" bg="gray.100" borderRadius="md">
			<Text fontWeight="600">Subject:</Text>
			<Text>889 Form Request, Covered telecommunications equipment or services</Text>

			<Text mt="5" fontWeight="600">
				Body:
			</Text>
			<Text>
				To Whom It May Concern, I am interested in purchasing items from [VENDOR NAME]. Before any purchase can
				be made, I need a completed copy of the attached "889 form."
			</Text>
			<Text my="2">
				This form states that your organization does not conduct business with entities excluded from receiving
				federal awards for "covered telecommunications equipment or services." Examples include Huawei
				Technologies Company or ZTE Corporation or any of their subsidiaries, and more information can be found
				on the General Services Administration website (https://smartpay.gsa.gov/content/ndaa-section-889).
			</Text>
			<Text my="2">
				This is a requirement for all federal purchases, and no orders can be placed until a copy of this form
				is received.
				<Text my="2">
					Please let me know if you have any questions, and I look forward to hearing from you,
				</Text>
				<Text my="2">[YOUR NAME]</Text>
			</Text>
		</Box>
	);
}
