"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
const router = express_1.default.Router();
// Route to create a new product
router.post('/products', productsController_1.createProduct);
// Route to get all products
router.get('/products', productsController_1.getAllProducts);
// Route to get a single product by ID
router.get('/products/:id', productsController_1.getProductById);
// Route to update a product by ID
router.put('/products/:id', productsController_1.updateProduct);
// Route to delete a product by ID
router.delete('/products/:id', productsController_1.deleteProduct);
// Route to buy a product by ID
//router.post('/products/:productId/buy/:customerId', buyProduct);
exports.default = router;
