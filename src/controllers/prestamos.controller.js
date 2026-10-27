import * as servicio from '../services/prestamos.service.js';

export async function crear(req, res, next) {
	try {
		const prestamo = await servicio.crear({
			socioId: Number(req.body.socioId),
			libroId: Number(req.body.libroId),
		});
		res.status(201).json(prestamo);
	} catch (error) {
		next(error);
	}
}

export async function devolver(req, res, next) {
	try {
		const prestamo = await servicio.devolver(Number(req.params.id));
		res.json(prestamo);
	} catch (error) {
		next(error);
	}
}

export async function listarPorSocio(req, res, next) {
	try {
		const prestamos = await servicio.listarPorSocio(Number(req.params.id), {
			estado: req.query.estado,
		});
		res.json(prestamos);
	} catch (error) {
		next(error);
	}
}
