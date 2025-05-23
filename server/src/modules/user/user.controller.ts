import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// PATCH /api/users/me/password
export const changePasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await clientPrisma.user.findUnique({
      where: { id: res.locals.user.id },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) return next(new AppError(400, 'Incorrect old password'));

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await clientPrisma.user.update({
      where: { id: res.locals.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/users
export const getUsersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sortBy = 'name', sortOrder = 'asc', page = 1, pageSize = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const users = await clientPrisma.user.findMany({
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take,
    });

    const totalUsers = await clientPrisma.user.count();

    res.status(200).json({
      data: users,
      pagination: {
        total: totalUsers,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalUsers / Number(pageSize)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me
export const getMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = res.locals || {};

    if (!user?.id) return next(new AppError(401, 'Unauthorized'));

    const me = await clientPrisma.user.findUnique({
      where: { id: user.id },
    });

    if (!me) return next(new AppError(404, `User with id ${user.id} not found`));

    const { ...rest } = me || {};

    res.status(200).json({
      ...rest,
      dateSync: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// CRUD dla ADMIN

// POST /api/users
export const createUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = await clientPrisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });

    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
export const getUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await clientPrisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) return next(new AppError(404, 'User not found'));

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
export const updateMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await clientPrisma.user.update({
      where: { id: res.locals.user.id },
      data: req.body,
    });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await clientPrisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    if ((error as any).code === 'P2025') return next(new AppError(404, 'User not found'));

    next(error);
  }
};

// DELETE /api/users/:id
export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = res.locals.user;

    // Sprawdzenie czy zalogowany użytkownik jest ADMINEM
    if (currentUser.role !== 'ADMIN') return next(new AppError(403, 'Only administrators can delete users'));

    // Zabezpieczenie przed usunięciem samego siebie
    if (currentUser.id === id) return next(new AppError(400, 'You cannot delete yourself'));

    const userToDelete = await clientPrisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) return next(new AppError(404, `User with id ${id} not found`));

    // Usunięcie użytkownika
    await clientPrisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') return next(new AppError(404, 'User not found'));

    next(error);
  }
};
