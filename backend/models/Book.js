import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please add an author name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    language: {
      type: String,
      default: 'English',
    },
    pages: {
      type: Number,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Fiction',
        'Non-Fiction',
        'Self-Help',
        'Comics',
        'Science',
        'Biography',
        'Mystery',
        'Romance',
        'Fantasy',
        'History',
        'Technology',
        'Business',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, price: 1 });
bookSchema.index({ rating: -1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
