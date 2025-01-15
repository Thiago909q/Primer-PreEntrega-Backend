import { Router } from 'express';

const viewsRoutes = Router();
let products = []; // Lista de productos en memoria

// Ruta para renderizar la vista "home"
viewsRoutes.get('/', (req, res) => {
    res.render('home', {
        title: 'Listado de Productos',
        products, // Pasar los productos a la vista
    });
});

// Endpoint para agregar productos
viewsRoutes.post('/add-product', (req, res) => {
    const product = req.body;

    // Validar que todos los campos estén presentes
    if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.stock ||
        !product.category
    ) {
        return res.status(400).send({
            status: 'error',
            message: 'Todos los campos son obligatorios',
        });
    }

    // Asignar un ID único al producto
    product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    // Agregar el producto a la lista
    products.push(product);

    res.send({
        status: 'ok',
        message: 'Producto agregado exitosamente',
        product,
    });
});

export default viewsRoutes;