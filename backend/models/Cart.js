import mongoose from 'mongoose';
import Book from './Book.js';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

cartSchema.methods.addItem = async function(bookId, quantity) {
  const cart = this;
  const book = await Book.findById(bookId);
  
  if (!book) {
    throw new Error('Book not found');
  }

  const existingItemIndex = cart.items.findIndex(item => item.book.toString() === bookId.toString());

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      book: bookId,
      quantity: quantity,
      price: book.price
    });
  }
  
  await cart.save();
};

cartSchema.methods.updateQuantity = async function(bookId, quantity) {
  const cart = this;
  const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId.toString());

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
  } else {
    throw new Error('Item not found in cart');
  }
};

cartSchema.methods.removeItem = async function(bookId) {
  const cart = this;
  cart.items = cart.items.filter(item => item.book.toString() !== bookId.toString());
  await cart.save();
};

cartSchema.methods.clearCart = async function() {
  const cart = this;
  cart.items = [];
  await cart.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
