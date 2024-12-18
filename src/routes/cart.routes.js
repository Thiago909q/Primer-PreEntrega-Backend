import { Router } from 'express';
import fs from 'fs';

const cartsRoutes = Router();

const getCarts = async () => {
    try {
        const carts = await fs.promises.readFile('src/data/cart.json', 'utf-8');
        return JSON.parse(carts);
    } catch (error) {
        return [];
    }
};

const saveCarts = async (carts) => {
    try {
        const parsedCarts = JSON.stringify(carts);
        await fs.promises.writeFile('src/data/cart.json', parsedCarts, 'utf-8');
        return true;
    } catch (error) {
        return false;
    }
};

const getCartById = async (cId) => {
    const carts = await getCarts();
    return carts.find(c => c.id === cId);
};

cartsRoutes.post('/', async (req, res) => {
    const carts = await getCarts();
    const newCart = {
        id: Math.floor(Math.random() * 10000), // Generación de ID único
        products: []
    };
    carts.push(newCart);
    const isOk = await saveCarts(carts);
    if (!isOk) {
        return res.status(500).send({ status: 'error', message: 'Error al crear el carrito' });
    }
    res.status(201).send({ status: 'ok', message: 'Carrito creado', cart: newCart });
});

cartsRoutes.get('/', async (req, res) => {
    const carts = await getCarts();
    res.send({ status: 'ok', carts });
});

cartsRoutes.get('/:cid', async (req, res) => {
    const cId = +req.params.cid;
    const cart = await getCartById(cId);
    if (!cart) {
        return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.send({ status: 'ok', cart });
});

cartsRoutes.post('/:cid/product/:pid', async (req, res) => {
    const cId = +req.params.cid;
    const pId = +req.params.pid;

    const carts = await getCarts();
    const cart = carts.find(c => c.id === cId);

    if (!cart) {
        return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === pId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: pId, quantity: 1 });
    }

    const isOk = await saveCarts(carts);
    if (!isOk) {
        return res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
    res.send({ status: 'ok', message: 'Producto agregado al carrito', cart });
});

export default cartsRoutes;