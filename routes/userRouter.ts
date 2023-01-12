import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

import * as userController from '../controller/userController';

router.post('/logout', userController.logout);

router.get('/me', userController.getUserInfo);

router.post(
	'/signup',
	body('email').isEmail(),
	body('password').isLength({ min: 6, max: 20 }),
	body('username').isLength({ min: 3, max: 20 }),
	userController.signup
);

export default router;
