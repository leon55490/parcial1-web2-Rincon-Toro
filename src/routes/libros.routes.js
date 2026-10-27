import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as controlador from '../controllers/libros.controller.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const reglasCrearLibro = [
	body('titulo')
		.isString()
		.withMessage('El título debe ser texto')
		.trim()
		.notEmpty()
		.withMessage('El título es obligatorio'),
	body('autor')
		.isString()
		.withMessage('El autor debe ser texto')
		.trim()
		.notEmpty()
		.withMessage('El autor es obligatorio'),
	body('isbn')
		.isString()
		.withMessage('El isbn debe ser texto')
		.trim()
		.notEmpty()
		.withMessage('El isbn es obligatorio'),
	body('ejemplares')
		.isInt({ min: 1, max: 50 })
		.withMessage('ejemplares debe ser un entero entre 1 y 50'),
];

// L1 · GET /api/libros — listar con filtros y paginación
router.get(
	'/',
	query('buscar').optional().isString(),
	query('disponibles')
		.optional()
		.isIn(['true', 'false'])
		.withMessage('disponibles debe ser true o false'),
	query('pagina')
		.optional()
		.isInt({ min: 1 })
		.withMessage('pagina debe ser un entero ≥ 1'),
	query('porPagina')
		.optional()
		.isInt({ min: 1, max: 20 })
		.withMessage('porPagina debe ser un entero entre 1 y 20'),
	validar,
	controlador.listar
);

// L2 · GET /api/libros/:id — ver un libro
router.get(
	'/:id',
	param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
	validar,
	controlador.obtener
);

// L3 · POST /api/libros — registrar un libro
router.post('/', reglasCrearLibro, validar, controlador.crear);

export default router;
