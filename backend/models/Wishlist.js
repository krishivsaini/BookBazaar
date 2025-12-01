import mongoose from 'mongoose';
import Book from './Book.js';

const wishlistSchema = new mongoose.Schema(
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
        addedAt: {
          type: Date,
          default: Date.now,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.methods.addItem = async function(bookId) {
  const wishlist = this;
  
  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }

  // Check if already in wishlist
  const isExisting = wishlist.items.some(item => item.book.toString() === bookId.toString());

  if (!isExisting) {
    wishlist.items.push({ book: bookId });
    await wishlist.save();
  }
};

wishlistSchema.methods.removeItem = async function(bookId) {
  const wishlist = this;
  wishlist.items = wishlist.items.filter(item => item.book.toString() !== bookId.toString());
  await wishlist.save();
};

wishlistSchema.methods.isInWishlist = function(bookId) {
  return this.items.some(item => item.book.toString() === bookId.toString());
};

wishlistSchema.methods.clearWishlist = async function() {
  const wishlist = this;
  wishlist.items = [];
  await wishlist.save();
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
