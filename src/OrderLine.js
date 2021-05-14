import React from 'react';
import { Box, Text, Spinner, Input, Flex, Button, Heading, OrderedList } from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons';

export default function OrderLine({ removeOrder, order }) {
	return (
		<Box m="8">
			<Flex flexWrap="wrap" justifyContent="center">
				{Object.keys(order).map((k) => (
					<Text key={k} mx="2">
						{k}: {order[k]}
					</Text>
				))}
				<DeleteIcon onClick={removeOrder} />
			</Flex>
		</Box>
	);
}
