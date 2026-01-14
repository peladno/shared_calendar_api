import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: z.treeifyError(result.error),
      });
    }
    req.body = result.data;
    next();
  };
}
