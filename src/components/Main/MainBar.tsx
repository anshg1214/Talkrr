const MainBar = (props: { groupTitle: string }) => {
	const groupTitle = props?.groupTitle;
	return (
		<div className="flex items-center h-[60px] font-bold text-lg p-6 mt-6 ml-6 shadow-xl">
			{groupTitle}
		</div>
	);
};

export default MainBar;
