import { prisma } from '../db.js';
import { conflicto, noEncontrado } from '../errores.js';

const DIAS_PRESTAMO = 14;

export async function crear({ socioId, libroId }) {
	return prisma.$transaction(async (tx) => {
		const socio = await tx.socio.findUnique({ where: { id: socioId } });
		if (!socio) throw noEncontrado('Socio no encontrado');

		const libro = await tx.libro.findUnique({ where: { id: libroId } });
		if (!libro) throw noEncontrado('Libro no encontrado');

		const activos = await tx.prestamo.count({
			where: { socioId, estado: 'ACTIVO' },
		});
		if (activos >= 3) {
			throw conflicto('El socio ya tiene 3 préstamos activos');
		}

		const { count } = await tx.libro.updateMany({
			where: { id: libroId, ejemplaresDisponibles: { gte: 1 } },
			data: { ejemplaresDisponibles: { decrement: 1 } },
		});
		if (count === 0) {
			throw conflicto('El libro no tiene ejemplares disponibles');
		}

		const fechaLimite = new Date(Date.now() + DIAS_PRESTAMO * 24 * 60 * 60 * 1000);

		return tx.prestamo.create({
			data: {
				socioId,
				libroId,
				fechaLimite,
			},
			include: {
				libro: { select: { id: true, titulo: true } },
			},
		});
	});
}

export async function devolver(id) {
	return prisma.$transaction(async (tx) => {
		const prestamo = await tx.prestamo.findUnique({ where: { id } });
		if (!prestamo) throw noEncontrado('Préstamo no encontrado');

		const { count } = await tx.prestamo.updateMany({
			where: { id, estado: 'ACTIVO' },
			data: {
				estado: 'DEVUELTO',
				fechaDevolucion: new Date(),
			},
		});

		if (count === 0) {
			throw conflicto('El préstamo ya fue devuelto');
		}

		await tx.libro.update({
			where: { id: prestamo.libroId },
			data: {
				ejemplaresDisponibles: { increment: 1 },
			},
		});

		return tx.prestamo.findUnique({ where: { id } });
	});
}

export async function listarPorSocio(socioId, { estado } = {}) {
	const socio = await prisma.socio.findUnique({ where: { id: socioId } });
	if (!socio) throw noEncontrado('Socio no encontrado');

	return prisma.prestamo.findMany({
		where: {
			socioId,
			...(estado ? { estado } : {}),
		},
		orderBy: [{ fechaPrestamo: 'desc' }, { id: 'desc' }],
		include: {
			libro: { select: { id: true, titulo: true, autor: true } },
		},
	});
}
