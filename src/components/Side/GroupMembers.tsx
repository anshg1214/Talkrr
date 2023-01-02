import Image from 'next/legacy/image';
import { User } from '../../utils/types';

const GroupMember = (props: { user: User }) => {
	const user = props?.user;
	return (
		<div className="mt-5 mb-5 flex items-center">
			<span className="rounded-lg h-10 w-10 flex justify-center items-center font-semibold bg-[#252329]">
				<Image
					src={user.profileImage}
					className="w-12 h-12 rounded-lg mr-4"
					width={40}
					height={40}
					alt="profile"
					layout="fixed"
				/>
			</span>
			<p className="ml-5 font-bold">{user.name}</p>
		</div>
	);
};

const GroupMembers = (props: { members: User[] }) => {
	const members = props?.members;
	return (
		<div className="flex flex-col items-center w-[95%] overflow-y-auto mt-4">
			<p className="text-[#E0E0E0] text-xl mx-5 font-bold">Members</p>
			{members?.map(member => {
				return <GroupMember key={member.id} user={member} />;
			})}
		</div>
	);
};

export default GroupMembers;
