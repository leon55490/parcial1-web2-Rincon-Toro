import * as servicio from '../services/libros.service.js';

export async function listar(req, res, next) {
	try {
		const resultado = await servicio.listar({
			buscar: req.query.buscar,
			disponibles: req.query.disponibles === 'true',
			pagina: req.query.pagina ? Number(req.query.pagina) : 1,
			porPagina: req.query.porPagina ? Number(req.query.porPagina) : 10,
		});
		res.json(resultado);
	} catch (error) {
		next(error);
	}
}

export async function obtener(req, res, next) {
	try {
		const libro = await servicio.buscarPorId(Number(req.params.id));
		res.json(libro);
	} catch (error) {
		next(error);
	}
}

export async function crear(req, res, next) {
	try {
		const nuevo = await servicio.crear(req.body);
		res.status(201).json(nuevo);
	} catch (error) {
		next(error);
	}
}
