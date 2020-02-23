import { Request, Response } from 'express';

class KnnController {
	public createTaskGet(req: Request, res: Response) {
		res.json({ amazing: 'amazing' });
	}
}

export const knnController = new KnnController();
