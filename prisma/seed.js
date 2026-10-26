import { prisma } from '../src/db.js';

async function main() {
	// TODO: Seed de la biblioteca según el enunciado
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
