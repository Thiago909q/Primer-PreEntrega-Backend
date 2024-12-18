import { Router } from 'express';
import fs from 'fs';

const productsRoutes = Router();

const getProducts = async () =>{
    try {
        const products = await fs.promises.readFile('src/data/products.json', 'utf-8');
        const productsConverter = JSON.parse(products);
        return (productsConverter);
    } catch (error) {
        return [];
    }
}

const saveProducts = async (products) =>{
    try {
        const parsedProducts = JSON.stringify(products);
        await fs.promises.writeFile('src/data/products.json', parsedProducts, 'utf-8')
        return true;
    } catch (error) {
        return false
    }
}

const getSingleProductById = async (pId) => {
    const products = await getProducts();
    const product = products.find(p => p.id === pId);
    return product;
}





productsRoutes.get('/', async (req, res) => {
    const limit = +req.query.limit;
    const products = await getProducts();
    if (isNaN(limit) || !limit){
        return res.send ({products});
    } 
    
    const productsLimited = products.slice(0, limit);

    res.send ({products: productsLimited});
});

productsRoutes.get('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const product = await getSingleProductById(pId)
    if(!product){
        return res.status(404).send ({status:'error', message: 'Product not found'})
    }
    res.send({product})
});

productsRoutes.post('/', async (req,res) =>{
    const product = req.body;
    product.id = Math.floor (Math.random() * 10000)
    if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category ){
    return res.status(400).send({status: 'error', message: 'product incompleted'})
}
    const products = await getProducts();
    products.push (product);
    const isOk = await saveProducts (products);
    if(!isOk){
        return res.send({status: 'error', message: 'product could not added'});
    }
    res.send({status: 'ok', message : 'product added'});
});

productsRoutes.delete('/:pid', async(req, res) =>{
    const id = +req.params.pid;
    const product = await getSingleProductById(id);
    if(!product){
        return res.status(404).send ({status: 'error', message: 'product not found'})
    }
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    const isOk = await saveProducts (filteredProducts);
    if(!isOk){
        return res.status(400).send ({status: 'error', message: 'something went wrong'});
    }
    res.send({status: 'ok', message : 'product delete'});
});


productsRoutes.put('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const productToUpdate = req.body;
    const products = await getProducts();
    let product = products.find(p => p.id === pId);
    if(!productToUpdate.title || !productToUpdate.description || !productToUpdate.code || !productToUpdate.price || !productToUpdate.stock || !productToUpdate .category)  {
        return res.status(400).send({status: 'error', message: 'product incompleted'})
    }
    if(!product){
        return res.status(404).send ({status: 'error', message: 'product not found'})
    }
    const updatedProducts = products.map (p => {
        if(p.id === pId){
            return{
                ...productToUpdate,
                id: pId
            }
        }
        return p;
    });
    const isOk = await saveProducts(updatedProducts);
    if (!isOk){
        return res.status(400).send ({status: 'error', message: 'something went wrong'});
    }
    res.send({status: 'ok', message : 'product updated'});

});


export default productsRoutes;

