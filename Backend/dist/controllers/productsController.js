"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const productSchema_1 = __importDefault(require("../models/productSchema"));
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, discountThreshold } = req.body;
        const newProduct = new productSchema_1.default({
            name,
            description,
            price,
            category,
            discountThreshold,
        });
        if (discountThreshold && price >= discountThreshold) {
            newProduct.price = price - (price * 0.1);
        }
        yield newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error });
    }
});
exports.createProduct = createProduct;
// Get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productSchema_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error });
    }
});
exports.getAllProducts = getAllProducts;
// Get a product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield productSchema_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error });
    }
});
exports.getProductById = getProductById;
// Update a product by ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const { name, description, price, category, discountThreshold } = req.body;
        const updatedProduct = yield productSchema_1.default.findByIdAndUpdate(productId, { name, description, price, category, discountThreshold }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error });
    }
});
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const deletedProduct = yield productSchema_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error });
    }
});
exports.deleteProduct = deleteProduct;
