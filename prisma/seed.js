import { prisma } from '../src/db.js';

async function main() {
	await prisma.$executeRawUnsafe(
		'TRUNCATE TABLE "Prestamo", "Libro", "Socio" RESTART IDENTITY CASCADE;'
	);

	const socios = [
		{ nombre: 'Laura Gómez', email: 'laura@ucaldas.edu.co' },
		{ nombre: 'Andrés Ríos', email: 'andres@ucaldas.edu.co' },
		{ nombre: 'Sofía Marín', email: 'sofia@ucaldas.edu.co' },
	];

	for (const socio of socios) {
		await prisma.socio.create({ data: socio });
	}

	const libros = [
		{
			titulo: 'Cien años de soledad',
			autor: 'Gabriel García Márquez',
			isbn: 'ISBN-001',
			ejemplaresTotales: 3,
			ejemplaresDisponibles: 3,
		},
		{
			titulo: 'El amor en los tiempos del cólera',
			autor: 'Gabriel García Márquez',
			isbn: 'ISBN-002',
			ejemplaresTotales: 2,
			ejemplaresDisponibles: 1,
		},
		{
			titulo: 'Clean Code',
			autor: 'Robert C. Martin',
			isbn: 'ISBN-003',
			ejemplaresTotales: 1,
			ejemplaresDisponibles: 0,
		},
		{
			titulo: 'Node.js Design Patterns',
			autor: 'Mario Casciaro',
			isbn: 'ISBN-004',
			ejemplaresTotales: 2,
			ejemplaresDisponibles: 1,
		},
		{
			titulo: 'La vorágine',
			autor: 'José Eustasio Rivera',
			isbn: 'ISBN-005',
			ejemplaresTotales: 1,
			ejemplaresDisponibles: 1,
		},
	];

	for (const libro of libros) {
		await prisma.libro.create({ data: libro });
	}

	const fechaLimite = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

	const prestamos = [
		{ socioId: 3, libroId: 2 },
		{ socioId: 3, libroId: 3 },
		{ socioId: 3, libroId: 4 },
	];

	for (const p of prestamos) {
		await prisma.prestamo.create({
			data: {
				socioId: p.socioId,
				libroId: p.libroId,
				estado: 'ACTIVO',
				fechaLimite,
			},
		});
	}

	console.log('Seed completado: 3 socios, 5 libros y 3 préstamos activos');
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
