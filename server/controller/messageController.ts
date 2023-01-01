import { prisma } from '../index';

const fetchMessages = async (req: any, res: any, next: any) => {
	const gid = req.params.gid;
	console.log('fetchMessages');
	if (!gid) {
		return res.json({
			msg: 'No group id provided',
			status: false
		});
	}

	let group: any;
	try {
		group = await prisma.group.findUniqueOrThrow({
			where: {
				id: gid
			},
			include: {
				messages: {
					include: {
						author: true
					},
					orderBy: {
						time: 'asc'
					}
				}
			}
		});
	} catch (err) {
		return res.json({
			msg: 'Could not find group',
			status: false
		});
	}
	if (!group) {
		return res.json({
			msg: 'No group found',
			status: false
		});
	}

	return res.json({
		msg: 'Messages Fetched Successfully',
		messages: group.messages
	});
};

const sendMessage = async (req: any, res: any, next: any) => {
	const { uid, gid, text, isImage } = req.body;

	try {
		await prisma.message.create({
			data: {
				text: text,
				authorID: uid,
				groupID: gid,
				isImage: isImage
			}
		});
	} catch (err) {
		console.log(err.message);
		return res.json({
			msg: 'Could not send message',
			status: false
		});
	}

	return res.json({
		msg: 'Message sent successfully',
		status: true
	});
};

export { fetchMessages, sendMessage };
