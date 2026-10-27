import { prisma } from '../db.js';
import { conflicto, noEncontrado } from '../errores.js';

export async function listar({
	buscar,
	disponibles = false,
	pagina = 1,
	porPagina = 10,
} = {}) {
	const where = {
		...(disponibles ? { ejemplaresDisponibles: { gt: 0 } } : {}),
		...(buscar
			? {
					OR: [
						{ titulo: { contains: buscar, mode: 'insensitive' } },
						{ autor: { contains: buscar, mode: 'insensitive' } },
					],
				}
			: {}),
	};

	const skip = (pagina - 1) * porPagina;

	const [datos, total] = await Promise.all([
		prisma.libro.findMany({
			where,
			orderBy: { titulo: 'asc' },
			skip,
			take: porPagina,
		}),
		prisma.libro.count({ where }),
	]);

	return {
		datos,
		paginacion: {
			pagina,
			porPagina,
			total,
			totalPaginas: Math.ceil(total / porPagina),
		},
	};
}

export async function buscarPorId(id) {
	const libro = await prisma.libro.findUnique({ where: { id } });
	if (!libro) throw noEncontrado('Libro no encontrado');
	return libro;
}

export async function crear({ titulo, autor, isbn, ejemplares }) {
	const duplicado = await prisma.libro.findUnique({ where: { isbn } });
	if (duplicado) {
		throw conflicto(`Ya existe un libro con el ISBN "${isbn}"`);
	}

	const cantidad = Number(ejemplares);

	return prisma.libro.create({
		data: {
			titulo,
			autor,
			isbn,
			ejemplaresTotales: cantidad,
			ejemplaresDisponibles: cantidad,
		},
	});
}
