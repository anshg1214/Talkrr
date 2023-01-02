import Image from 'next/legacy/image';
import type { Message } from '../../utils/types';

const UserMessage = (props: { message: Message }) => {
	let { message } = props;

	const messageTime = new Date(message.time).toLocaleTimeString();

	return (
		<div className="w-[95%] flex items-center mb-5">
			<div className="flex self-start mt-6">
				<Image
					src={message.author.profileImage}
					className="w-12 h-12 rounded-lg mr-4"
					width={40}
					height={40}
					alt="profile"
					layout="fixed"
				/>
			</div>
			<div className="ml-7 mr-7 mt-6">
				<p className="text-[#828282] text-base font-bold">
					{message.author.name}{' '}
					<span className="text-sm ml-7 font-medium">
						{messageTime}
					</span>
				</p>
				<p className="text-[#E0E0E0] font-medium text-base">
					{message.text}
				</p>
			</div>
		</div>
	);
};

const Messages = (props: { messages: Message[] }) => {
	let { messages } = props;

	if (!messages) {
		messages = [];
	}

	return (
		<div
			id="chat"
			className="flex flex-col overflow-y-auto justify-center p-5 ml-10"
		>
			{messages.map((message: Message) => (
				<UserMessage key={message.id} message={message} />
			))}
		</div>
	);
};

export default Messages;
