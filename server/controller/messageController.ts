import Group from '../models/group';

const fetchMessages = async (req: any, res: any, next: any) => {
	const gid = req.params.gid;
	if (!gid) {
		return res.json({
			msg: 'No group id provided',
			status: false
		});
	}

	let group: any;
	try {
		group = await Group.findById(gid).populate('messages');
	} catch (err) {
		return res.json({
			msg: 'Could not find group',
			status: false
		});
	}

	return res.json({
		'Messages Fetched Successfully': group.messages
	});
};

export { fetchMessages };
