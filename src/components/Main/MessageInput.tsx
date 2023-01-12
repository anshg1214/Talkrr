import { useState } from 'react';
import { InputBase, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

type MessageInputProps = {
	sendMessage: (message: string) => Promise<void>;
};

const MessageInput = (props: MessageInputProps) => {
	const [message, setMessage] = useState('');

	const sendMessageHandler = () => {
		if (message !== '') {
			props.sendMessage(message);
			setMessage('');
		}
	};

	return (
		<div className="w-[90%] m-6 mt-0 ml-10 p-3 flex items-center bg-[#3C393F] rounded-lg">
			<InputBase
				className="text-[#e0e0e0] ml-1 text-sm font-medium flex-1"
				placeholder="Type a message here"
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						sendMessageHandler();
					}
				}}
			/>
			<IconButton
				className="bg-[#2F80ED] rounded-lg p-2"
				onClick={sendMessageHandler}
			>
				<Send className="text-white" />
			</IconButton>
		</div>
	);
};

export default MessageInput;
