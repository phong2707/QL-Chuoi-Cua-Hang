import { Request, Response } from "express";

export class DevController {
  index(req: Request, res: Response) {
    res.send("Dev Index");
  }
  show(req: Request, res: Response) {
    res.send(`Show Dev ${req.params.id}`);
  }
  new(req: Request, res: Response) {
    res.send("New Dev Form");
  }
  edit(req: Request, res: Response) {
    res.send(`Edit Dev ${req.params.id}`);
  }
  create(req: Request, res: Response) {
    res.send("Create Dev");
  }
  update(req: Request, res: Response) {
    res.send(`Update Dev ${req.params.id}`);
  }
  destroy(req: Request, res: Response) {
    res.send(`Delete Dev ${req.params.id}`);
  }
}

export const devController = new DevController();
