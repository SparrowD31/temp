const mongoose = require('mongoose');

const addressSchema = {
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false
  },
  address: addressSchema,
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  }
});

// Add a pre-save middleware to log the role
userSchema.pre('save', function(next) {
  console.log('Saving user with role:', this.role);
  next();
});

// Add method to properly serialize user
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  console.log('Converting user to JSON:', {
    id: user._id,
    role: user.role
  });
  return user;
};

module.exports = mongoose.model('User', userSchema); 