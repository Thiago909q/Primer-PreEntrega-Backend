import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const viewsRoutes = Router();

// Ruta al archivo de productos
const productsFilePath = path.resolve('src/data/products.json');

// Funciones de ayuda
const getProducts = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
    return [];
    }
};

const saveProducts = async (products) => {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
};

// Ruta para "home.handlebars"
viewsRoutes.get('/home', async (req, res) => {
    const products = await getProducts();
    res.render('home', { products });
});

// Ruta para "realTimeProducts.handlebars"
viewsRoutes.get('/realtimeproducts', async (req, res) => {
    const products = await getProducts();
    res.render('realTimeProducts', { products });
});

// API para WebSocket
viewsRoutes.post('/api/realtimeproducts', async (req, res) => {
    const io = req.app.get('io');
    const newProduct = req.body;

  // Validaciones
    if (!newProduct.title || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.description) {
        return res.status(400).send({ status: 'error', message: 'Campos incompletos' });
}

  // Guardar producto
const products = await getProducts();
newProduct.id = Math.floor(Math.random() * 10000);
products.push(newProduct);
await saveProducts(products);

  // Emitir evento de actualización
io.emit('product-added', products);

res.status(201).send({ status: 'ok', message: 'Producto agregado' });
});

viewsRoutes.delete('/api/realtimeproducts/:id', async (req, res) => {
const io = req.app.get('io');
const id = +req.params.id;

  // Eliminar producto
const products = await getProducts();
const filteredProducts = products.filter((p) => p.id !== id);

if (products.length === filteredProducts.length) {
    return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
}

await saveProducts(filteredProducts);

  // Emitir evento de actualización
io.emit('product-deleted', filteredProducts);

  res.status(200).send({ status: 'ok', message: 'Producto eliminado' });
});


export default viewsRoutes;