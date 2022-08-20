import { validationResult } from 'express-validator';

import Group from '../models/group';

const fetchGroups = async (req: any, res: any, next: any) => {
	let group: any;

	try {
		group = await Group.find().populate('members');
	} catch (err) {
		return res.json({
			msg: 'Could not find group',
			status: false
		});
	}

	return res.json({
		'Groups Fetched Successfully': group
	});
};

const fetchGroupData = async (req: any, res: any, next: any) => {
	const id = req.params.gid;
	let group: any;

	try {
		group = await Group.findById(id).populate('members');
	} catch (err) {
		return res.json({
			msg: 'Could not find group',
			status: false
		});
	}

	return res.json({
		'Group Fetched Successfully': group
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

	const { title, description } = req.body;
	const newGroup = new Group({
		title,
		description,
		members: [],
		messages: []
	});

	try {
		await newGroup.save();
	} catch (err) {
		return res.json({
			msg: 'Could not create group',
			status: false
		});
	}

	return res.json({
		msg: 'Group Created Successfully',
		status: true
	});
};

export { fetchGroups, fetchGroupData, createNewGroup };
