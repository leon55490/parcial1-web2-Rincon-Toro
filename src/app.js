import express from 'express';
import morgan from 'morgan';
import librosRouter from './routes/libros.routes.js';
import { manejadorErrores } from './middlewares/errores.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.json({ nombre: 'Biblioteca API', version: '1.0' }));
app.use('/api/libros', librosRouter);

// 404 para todo lo demás (va al final)
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(manejadorErrores);

export default app;
