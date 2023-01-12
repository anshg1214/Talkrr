import { validationResult } from 'express-validator';

import { prisma } from '../server';
import { Group } from '@prisma/client';

const fetchGroups = async (req: any, res: any, next: any) => {
	let group: any;

	try {
		group = await prisma.group.findMany({
			include: {
				users: true
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
		msg: 'Groups Fetched Successfully',
		group
	});
};

const fetchGroupData = async (req: any, res: any, next: any) => {
	const id = req.params.gid;
	let group: any;

	try {
		group = await prisma.group.findUniqueOrThrow({
			where: {
				id: id
			},
			include: {
				messages: true,
				users: true
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
		msg: 'Group Fetched Successfully',
		group
	});
};

const createNewGroup = async (req: any, res: any, next: any) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({
			msg: 'Invalid inputs passed, please check your data.',
			status: false
		});
	}

	const { title, description, userID } = req.body;

	let group: Group;
	try {
		group = await prisma.group.create({
			data: {
				name: title,
				description: description,
				users: {
					connect: {
						id: userID
					}
				}
			},
			include: {
				users: true
			}
		});
	} catch (err) {
		return res.json({
			msg: 'Could not create group',
			status: false
		});
	}

	return res.json({
		msg: 'Group Created Successfully',
		status: true,
		group
	});
};

const joinGroup = async (req: any, res: any, next: any) => {
	const { groupID, userID } = req.body;
	try {
		const group = await prisma.group.update({
			where: {
				id: groupID
			},
			data: {
				users: {
					connect: {
						id: userID
					}
				}
			},
			include: {
				users: true
			}
		});
		return res.json({ status: true, group });
	} catch (err) {
		return res.json({ status: false, msg: 'Could not join group' });
	}
};

export { fetchGroups, fetchGroupData, createNewGroup, joinGroup };
