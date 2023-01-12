import axios from 'axios';
import { Message, User, Group } from './types';
import { host } from './APIRoutes';

let hostURL = host || 'http://localhost:4000';

const getInitials = (string: string) => {
	const names = string.split(' ');
	let initials = names[0].substring(0, 1).toUpperCase();

	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase();
	}
	return initials;
};

const fetchGroups = async () => {
	let response;
	try {
		response = await axios.get(`${hostURL}/api/groups`);
	} catch (error) {}
	return response?.data?.group;
};

const fetchMessages = async (groupId: Group['id']) => {
	let response;
	try {
		response = await axios.get(`${hostURL}/api/messages/${groupId}`);
	} catch (error) {
		console.log(error);
	}
	return response?.data?.messages;
};

const sendMessage = async (
	message: Message['text'],
	currentUser: User,
	currentGroup: Group
) => {
	await axios.post(`${hostURL}/api/messages`, {
		uid: currentUser.id,
		gid: currentGroup.id,
		text: message,
		isImage: false
	});
};

const createGroup = async (
	title: string,
	description: string,
	currentUser: User
) => {
	let response;
	try {
		response = await axios.post(`${hostURL}/api/groups`, {
			title,
			description: description ? description : 'No description.',
			userID: currentUser?.id
		});
	} catch (error) {
		console.log(error);
	}
	return response;
};

const joinGroup = async (group: Group, currentUser: User) => {
	let response;
	try {
		response = await axios.post(`${hostURL}/api/groups/join`, {
			groupID: group.id,
			userID: currentUser.id
		});
	} catch (error) {
		console.log(error);
	}
	return response;
};

const getLoggedInUserInfo = async () => {
	let response;
	try {
		response = await axios.get(`${hostURL}/api/users/me`);
		response = response.data;
	} catch (error) {
		console.log(error);
	}
	return response;
};

const logoutUser = async () => {
	let response;
	try {
		response = await axios.get(`${hostURL}/api/users/logout`);
	} catch (error) {
		console.log(error);
	}
	return response;
};

export {
	getInitials,
	fetchGroups,
	fetchMessages,
	sendMessage,
	createGroup,
	joinGroup,
	getLoggedInUserInfo,
	logoutUser
};
