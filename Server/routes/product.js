const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products', upload.array('images', 5), async (req, res) => {
    try {
        const images = [];
        
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                
                try {
                    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
                        folder: 'products',
                        resource_type: 'auto'
                    });
                    console.log('File Upload successful:', uploadResponse.secure_url);
                    images.push({
                        image_url: uploadResponse.secure_url,
                        cloudinary_id: uploadResponse.public_id
                    });
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error('Image upload failed');
                }
            }
        }
        
        if (req.body.image_urls && Array.isArray(req.body.image_urls)) {
            for (const url of req.body.image_urls) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(url, {
                        folder: 'products'
                    });
                    console.log('URL Upload successful:', uploadResponse.secure_url);
                    images.push({
                        image_url: uploadResponse.secure_url,
                        cloudinary_id: uploadResponse.public_id
                    });
                } catch (uploadError) {
                    console.error('URL upload error:', uploadError);
                    throw new Error('Image URL upload failed');
                }
            }
        }

        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
            images: images
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/products/:id', upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let images = [...product.images]; 
        
        if (req.body.deleteImages) {
            const deleteImages = JSON.parse(req.body.deleteImages);
            for (const cloudinaryId of deleteImages) {
                try {
                    await cloudinary.uploader.destroy(cloudinaryId);
                    images = images.filter(img => img.cloudinary_id !== cloudinaryId);
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                try {
                    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
                        folder: 'products'
                    });
                    images.push({
                        image_url: uploadResponse.secure_url,
                        cloudinary_id: uploadResponse.public_id
                    });
                } catch (uploadError) {
                    console.error('Error handling image:', uploadError);
                    throw new Error('Failed to process image');
                }
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                category: req.body.category,
                price: parseFloat(req.body.price),
                stock: parseInt(req.body.stock),
                images: images
            },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        for (const image of product.images) {
            try {
                await cloudinary.uploader.destroy(image.cloudinary_id);
                console.log('Successfully deleted image from Cloudinary:', image.cloudinary_id);
            } catch (cloudinaryError) {
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        console.log('Successfully deleted product from database');

        res.json({ 
            message: 'Product and all associated images deleted successfully',
            deletedProductId: req.params.id
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
