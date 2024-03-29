import type { NextPage } from 'next';
import Search from '../components/Side/Search';
import TopBar from '../components/Side/TopBar';
import GroupAbout from '../components/Side/GroupAbout';
import GroupMembers from '../components/Side/GroupMembers';
import Groups from '../components/Side/Groups';
import BottomBar from '../components/Side/BottomBar';
import MainBar from '../components/Main/MainBar';
import Messages from '../components/Main/Messages';
import MessageInput from '../components/Main/MessageInput';
import Modal from '../components/Modal';
import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
import type { User, Group, Message } from '../utils/types';
import {
	fetchGroups,
	fetchMessages,
	sendMessage,
	createGroup,
	joinGroup
} from '../utils/common';
import JoinGroup from '../components/Main/JoinGroup';

const Home = (props: { user: User }) => {
	const router = useRouter();
	const { user: currentUser } = props;

	const [currentGroup, setCurrentGroup] = useState<Group>({
		id: '',
		name: '',
		description: '',
		groupImage: '',
		users: [],
		messages: []
	});
	const [groups, setGroups] = useState<Group[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [createChannelModal, setCreateChannelModal] = useState(false);
	const [aboutChannel, setAboutChannel] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);

	const handleModalToggle = useCallback(() => {
		setCreateChannelModal(!createChannelModal);
	}, [createChannelModal]);

	const handleAboutChannelToggle = useCallback(() => {
		setAboutChannel(!aboutChannel);
	}, [aboutChannel]);

	const handleMessageSender = async (message: string) => {
		const response = await sendMessage(message, currentUser, currentGroup);
		socket?.emit('sendMessage', currentGroup.id);
	};

	const handleCreateGroup = async (name: string, description: string) => {
		const response = await createGroup(name, description, currentUser);
		const newGroupId = response?.data?.group?.id;

		const groups = await fetchGroups();
		setGroups(groups);
		changeGroup(groups.find((group: Group) => group.id === newGroupId));

		socket?.emit('createGroup');
	};

	const changeGroup = async (group: Group) => {
		const groupId = group?.id;
		const groupMessages = await fetchMessages(groupId);
		setCurrentGroup(group);
		socket?.emit('joinGroup', groupId, currentUser.id);
		if (!checkIsMemberOfGroup(group, currentUser)) {
			setIsMemberOfGroup(false);
		} else {
			setIsMemberOfGroup(true);
			setMessages(groupMessages);
		}
		setAboutChannel(true);
	};

	const checkIsMemberOfGroup = (group: Group, user: User): boolean => {
		for (let i = 0; i < group.users.length; i++) {
			if (group.users[i].id === user.id) {
				return true;
			}
		}
		return false;
	};

	async function setGroupsInState() {
		const groups = await fetchGroups();
		setGroups(groups);
	}

	async function setMessagesInState(id: string) {
		const messages = await fetchMessages(id);
		setMessages(messages);
	}

	const JoinGroupHandler = async () => {
		const response = await joinGroup(currentGroup, currentUser);
		if (response?.data?.status) {
			console.log('joined group');
			setIsMemberOfGroup(true);
			changeGroup(response?.data?.group);
			socket?.emit('addedToGroup', currentGroup.id);
		}
	};

	useEffect(() => {
		const socket: Socket = io(process.env.SERVER_URL as string, {
			transports: ['websocket']
		});
		socket.emit('newUser', currentUser?.id);
		socket.on('fetchMessage', (id: string) => setMessagesInState(id));
		socket.on('fetchGroup', setGroupsInState);
		setSocket(socket);
		setGroupsInState();
	}, [router, currentUser]);

	const SidebarContent = (props: { aboutChannel: boolean }) => {
		const aboutChannel = props?.aboutChannel;
		let content;
		if (!aboutChannel) {
			content = (
				<div className="flex-1 flex-col justify-start overflow-y-hidden">
					<Search />
					<Groups
						groups={groups}
						selectedGroup={currentGroup}
						onGroupChange={changeGroup}
					/>
				</div>
			);
		} else {
			content = (
				<div className="flex-1 flex-col justify-start overflow-y-hidden mt-6">
					<GroupAbout
						groupName={currentGroup.name}
						groupDescription={currentGroup.description}
					/>
					<GroupMembers members={currentGroup.users} />
				</div>
			);
		}
		return content;
	};

	const MainContent = (props: { inGroup: boolean }) => {
		const inGroup = props?.inGroup;
		let content;
		if (inGroup) {
			content = (
				<div className="flex-[4] flex flex-col justify-between bg-[#252329]">
					<MainBar groupTitle={currentGroup.name} />
					<div className="flex-col justify-end">
						<Messages messages={messages} />
						<MessageInput sendMessage={handleMessageSender} />
					</div>
				</div>
			);
		} else {
			content = (
				<div className="flex-[4] flex flex-col bg-[#252329]">
					<MainBar groupTitle={currentGroup.name} />
					<div className="flex-col justify-center">
						<JoinGroup
							group={currentGroup}
							joinGroupHandler={JoinGroupHandler}
						/>
					</div>
				</div>
			);
		}
		return content;
	};

	return (
		<>
			<Modal
				showModal={createChannelModal}
				handleModalToggle={handleModalToggle}
				createGroup={handleCreateGroup}
			/>
			<div className="w-full h-screen flex justify-between">
				<div className="flex-1 flex flex-col justify-between bg-[#120F13] p-6">
					<TopBar
						inChannel={aboutChannel}
						toggleSideBar={handleAboutChannelToggle}
						toggleModal={handleModalToggle}
					/>
					<SidebarContent aboutChannel={aboutChannel} />
					<BottomBar name={currentUser.name} />
				</div>
				<MainContent inGroup={isMemberOfGroup} />
			</div>
		</>
	);
};

export const getServerSideProps = async (props: { req: any }) => {
	const { req } = props;

	let user = req ? req.session?.passport?.user : null;
	if (!user) {
		user = null;
	}

	return { props: { user } };
};

export default Home;
