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
// import socketIOClient from 'socket.io-client';
import { useRouter } from 'next/router';
import type { User, Group, Message } from '../utils/types';
import {
	fetchGroups,
	fetchMessages,
	sendMessage,
	createGroup
} from '../utils/common';

const Home: NextPage = () => {
	const router = useRouter();

	const [currentUser, setCurrentUser] = useState<User>({
		id: '',
		name: '',
		email: '',
		profileImage: ''
	});

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

	const handleModalToggle = useCallback(() => {
		setCreateChannelModal(!createChannelModal);
	}, [createChannelModal]);

	const handleAboutChannelToggle = useCallback(() => {
		setAboutChannel(!aboutChannel);
	}, [aboutChannel]);

	const handleMessageSender = async (message: string) => {
		const response = await sendMessage(message, currentUser, currentGroup);
	};

	const handleCreateGroup = async (name: string, description: string) => {
		const response = await createGroup(name, description, currentUser);
        const newGroupId = response?.data?.group?.id;

        const groups = await fetchGroups();
        setGroups(groups);
		changeGroup(groups.find((group: Group) => group.id === newGroupId));

		// socket emit group created
		// Switch to group page
	};

	// const [socket, setSocket] = useState(undefined);

	const changeGroup = async (group: Group) => {
		const groupId = group?.id;
		const groupMessages = await fetchMessages(groupId);
		setCurrentGroup(group);
		setMessages(groupMessages);
		setAboutChannel(true);
	};

	useEffect(() => {
		async function checkUser() {
			const user = localStorage.getItem('chat-app-user');
			if (!user) {
				router.push('/login');
			} else {
				setCurrentUser(JSON.parse(user));
			}
		}
		checkUser();
	}, [router]);

	useEffect(() => {
		async function setGroupsInState() {
			const groups = await fetchGroups();
			setGroups(groups);
		}
		setGroupsInState();
	}, [router]);

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
					<BottomBar />
				</div>
				<div className="flex-[4] flex flex-col justify-between bg-[#252329]">
					<MainBar groupTitle={currentGroup.name} />
					<div className="flex-col justify-end">
						<Messages messages={messages} />
						<MessageInput sendMessage={handleMessageSender} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
