import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createReporte, getReportes, getReporteById, getStats, updateReporte, deleteReporte } from '../src/controllers/reporte.controller.js';

const reporteRouter = Router();

reporteRouter.get('/stats', getStats);
reporteRouter.get('/',      getReportes);
reporteRouter.get('/:id',   getReporteById);
reporteRouter.post('/',     verifyToken, createReporte);
reporteRouter.patch('/:id', verifyToken, updateReporte);
reporteRouter.delete('/:id', verifyToken, deleteReporte);

export default reporteRouter;
