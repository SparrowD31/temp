const Address = require('../models/Address');
const User = require('../models/User');

const addressController = {
  // Get all addresses for a user
  getUserAddresses: async (req, res) => {
    try {
      const addresses = await Address.find({ userId: req.user.id });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add new address
  addAddress: async (req, res) => {
    try {
      const { name, phone, street, city, state, zipCode } = req.body;
      
      const newAddress = new Address({
        userId: req.user.id,
        name,
        phone,
        street,
        city,
        state,
        zipCode
      });

      const savedAddress = await newAddress.save();

      // Add address to user's addresses array
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { addresses: savedAddress._id } },
        { new: true }
      );

      res.status(201).json(savedAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete address
  deleteAddress: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      if (address.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Address.findByIdAndDelete(req.params.id);
      
      // Remove address from user's addresses array
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { addresses: req.params.id } }
      );

      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update address
  updateAddress: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      if (address.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(updatedAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = addressController; 