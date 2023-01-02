import express from 'express';

const router = express.Router();

import * as messageController from '../controller/messageController';

router.get('/:gid', messageController.fetchMessages);
router.post('/', messageController.sendMessage);

export default router;
