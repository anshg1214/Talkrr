import { IconButton, Tooltip } from '@mui/material';
import { Add, ArrowBackIos } from '@mui/icons-material';

const TopBar = (props: {
	inChannel: boolean;
	toggleSideBar: () => void;
	toggleModal: () => void;
}) => {
	const toggleSideBar = props?.toggleSideBar;
	const inChannel = props?.inChannel;
	const toggleModal = props?.toggleModal;
	return (
		<div className="w-full h-[60px] flex items-center p-2">
			{inChannel ? (
				<>
					<Tooltip
						title="Back to channels list"
						placement="bottom"
						onClick={toggleSideBar}
					>
						<IconButton>
							<ArrowBackIos sx={{ color: 'white' }} />
						</IconButton>
					</Tooltip>
					<h2>All channels</h2>
				</>
			) : (
				<>
					<h2 className="text-lg font-bold">Channels</h2>
					<Tooltip
						title="Create Channel"
						placement="bottom"
						onClick={toggleModal}
					>
						<IconButton className="order-2">
							<Add className="text-white" />
						</IconButton>
					</Tooltip>
				</>
			)}
		</div>
	);
};

export default TopBar;
