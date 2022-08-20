import express from 'express';

const router = express.Router();

import * as messageController from '../controller/messageController';

router.get('/:gid', messageController.fetchMessages);

export default router;
