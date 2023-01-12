import { Request, Response, NextFunction } from 'express';

function authenticationMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.status(401).redirect('/login');
	};
}

export default authenticationMiddleware;
