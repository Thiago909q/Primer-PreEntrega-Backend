import express from 'express';
import { create } from 'express-handlebars'; 
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/cart.routes.js';
import viewsRoutes from './routes/views.routes.js';
import path from 'path';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const PORT = 8080;


const server = http.createServer(app);
const io = new SocketServer(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));


const handlebars = create({
    extname: '.handlebars',
    defaultLayout: 'main',
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve('src/views'));

app.use('/', viewsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);



io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

app.set('io', io);


server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});