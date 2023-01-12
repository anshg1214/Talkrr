import { IconButton, Tooltip } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { getInitials, logoutUser } from '../../utils/common';
import { useRouter } from 'next/router';

const BottomBar = (props: { name: string }) => {
	const router = useRouter();

	const handleLogout = async () => {
		await logoutUser();
		router.push('/login');
	};

	const name = props?.name;
	return (
		<div className="h-[90px] flex items-center justify-between">
			<div className="flex items-center">
				<Tooltip title="Edit profile" placement="top">
					<div className="w-14 h-14 border rounded-md items-center mr-4 flex justify-center">
						{getInitials(name)}
					</div>
				</Tooltip>

				<div className="text-lg font-bold">{name}</div>
			</div>
			<div className="flex">
				<Tooltip title="Logout" placement="top" onClick={handleLogout}>
					<IconButton>
						<ExitToApp className="text-white-custom" />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
};

export default BottomBar;
