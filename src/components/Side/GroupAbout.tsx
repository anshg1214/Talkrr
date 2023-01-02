const GroupAbout = (props: { groupName: string; groupDescription: string }) => {
	const { groupName, groupDescription } = props;
	return (
		<div className="flex flex-col items-center w-[95%]">
			<p className="text-[#E0E0E0] text-xl mx-5 font-bold">
				{groupName.toUpperCase()}
			</p>
			<p className="text-[#E0E0E0] text-sm mt-4 mb-4">
				{groupDescription}
			</p>
		</div>
	);
};

export default GroupAbout;
