import { Request, Response } from 'express';

export class HomeController {
  index(req: Request, res: Response) {
  res.json({ message: "API Backend đang hoạt động bình thường!" });
}
}

export const homeController = new HomeController();
