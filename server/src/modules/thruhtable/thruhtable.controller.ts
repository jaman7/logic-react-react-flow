import { NextFunction, Request, Response } from 'express';
import clientPrisma from '@/prisma-client';

// GET /api/thruetable/dictionary
export const getThrueTableDictionaryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(res);
  try {
    const thruetables = await clientPrisma.truthTable.findMany({
      include: {
        entries: true,
      },
    });

    res.status(200).json(thruetables);
  } catch (error) {
    next(error);
  }
};
