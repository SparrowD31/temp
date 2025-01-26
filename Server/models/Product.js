const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    sizes: {
        type: [sizeStockSchema],
        required: true,
        validate: {
            validator: function(sizes) {
                return sizes.length > 0;
            },
            message: 'At least one size must be specified'
        }
    },
    totalStock: {
        type: Number,
        default: function() {
            return this.sizes.reduce((total, item) => total + item.quantity, 0);
        }
    },
    images: [{
        image_url: {
            type: String,
            required: true
        },
        cloudinary_id: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Add middleware to update totalStock when stock changes
productSchema.pre('save', function(next) {
    this.totalStock = this.sizes.reduce((total, item) => total + item.quantity, 0);
    next();
});

module.exports = mongoose.model('Product', productSchema);
