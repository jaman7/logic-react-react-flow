import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import express from 'express';
import { getThrueTableDictionaryHandler } from './thruhtable.controller';

const thrueTableRoutes = express.Router();

thrueTableRoutes.use(deserializeUser, requireUser);
thrueTableRoutes.get('/dictionary', getThrueTableDictionaryHandler);

export default thrueTableRoutes;
