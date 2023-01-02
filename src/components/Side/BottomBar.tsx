import { IconButton, Tooltip } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { getInitials } from '../../utils/common';

const BottomBar = () => {
	return (
		<div className="h-[90px] flex items-center justify-between">
			<div className="flex items-center">
				<Tooltip title="Edit profile" placement="top">
					<div className="w-14 h-14 border rounded-md items-center mr-4 flex justify-center">
						{getInitials('Ansh Goyal')}
					</div>
				</Tooltip>

				<div className="text-lg font-bold">Ansh Goyal</div>
			</div>
			<div className="flex">
				<Tooltip title="Logout" placement="top">
					<IconButton>
						<ExitToApp className="text-white-custom" />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
};

export default BottomBar;
