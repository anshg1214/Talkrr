import type { Group } from '../../utils/types';

const GroupButton = (props: {
	group: Group;
	onSelectGroup: (group: Group) => void;
	selectedGroup: Group;
}) => {
	const name: string = props?.group?.name;
	return (
		<div
			className="mt-5 mb-5 flex items-center"
			onClick={props.onSelectGroup.bind(null, props.group)}
		>
			<span className="border rounded-lg h-10 w-10 flex justify-center items-center font-semibold bg-[#252329]">
				{name[0]?.toUpperCase()}
			</span>
			<p className="ml-5 font-bold">{name.toUpperCase()}</p>
		</div>
	);
};

const Groups = (props: {
	groups: Group[];
	selectedGroup: Group;
	onGroupChange: (group: Group) => Promise<void>;
}) => {
	let groups: Group[] = props?.groups;
	const onGroupChange = props?.onGroupChange;
	const selectedGroup = props?.selectedGroup;

	if (!groups) {
		groups = [];
	}

	return (
		<div className="overflow-y-auto flex p-2">
			<div>
				{groups.map((group: Group) => {
					return (
						<GroupButton
							key={group.id}
							group={group}
							onSelectGroup={onGroupChange}
							selectedGroup={selectedGroup}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Groups;
