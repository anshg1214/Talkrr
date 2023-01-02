type User = {
	id: string;
	name: string;
	email: string;
	profileImage: string;
};
type Group = {
	id: string;
	name: string;
	description: string;
	groupImage: string | null;
	users: User[];
	messages: Message[];
};
type Message = {
	id: string;
	time: Date;
	text: string;
	isImage: boolean;
	author: User;
	Group: Group;
};

export type { User, Group, Message };
