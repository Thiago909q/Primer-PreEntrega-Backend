import express from 'express';
import { create } from 'express-handlebars'; 
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/cart.routes.js';
import viewsRoutes from './routes/views.routes.js';
import path from 'path';

const PORT = 8080;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});