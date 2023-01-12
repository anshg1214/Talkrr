import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

import * as groupsController from '../controller/groupsController';

router.get('/', groupsController.fetchGroups);
router.post(
	'/',
	body('title').isLength({ min: 3, max: 12 }),
	groupsController.createNewGroup
);
router.get('/:gid', groupsController.fetchGroupData);

router.post(
	'/join',
	body('groupID').isLength({ min: 1 }),
	body('userID').isLength({ min: 1 }),
	groupsController.joinGroup
);

export default router;
