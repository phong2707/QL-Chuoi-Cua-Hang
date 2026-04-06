import e, { Response } from 'express';
export const BadRequestError = (message: string, res: Response) => {
  return res.status(400).json({
    error: message,
  });
};