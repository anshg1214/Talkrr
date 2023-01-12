import type { Group } from '../../utils/types';
import Button from '../Button';

const JoinGroup = (props: {
	group: Group;
	joinGroupHandler: () => Promise<void>;
}) => {
	const group = props?.group;
	const joinGroupHandler = props?.joinGroupHandler;

	return (
		<div
			id="chat"
			className="flex flex-col overflow-y-auto justify-center p-5 ml-10 items-center flex-1"
		>
			<h1 className="text-xl font-bold text-[#E0E0E0] mb-5">
				You are not a part of this group. Do you wish to join?
			</h1>
			<div className="w-50">
				<Button
					type="button"
					text="Join Group"
					onClickHandler={joinGroupHandler}
				/>
			</div>
		</div>
	);
};

export default JoinGroup;
