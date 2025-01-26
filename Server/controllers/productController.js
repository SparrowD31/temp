exports.updateProductStock = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { 
        _id: productId,
        'sizes.size': size 
      },
      { 
        $set: { 'sizes.$.quantity': quantity }
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product or size not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 