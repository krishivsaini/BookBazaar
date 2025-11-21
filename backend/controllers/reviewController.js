import Review from '../models/Review.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';

// @desc    Add a review for a book
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { book, rating, title, comment } = req.body;

    // Check if book exists
    const bookDoc = await Book.findById(book);
    if (!bookDoc) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ user: req.user._id, book });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Check if user has purchased this book (verified review)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.book': book,
      orderStatus: 'Delivered',
    });

    // Create review
    const review = await Review.create({
      user: req.user._id,
      book,
      rating,
      title,
      comment,
      verified: !!hasPurchased,
    });

    // Update book rating
    const reviews = await Review.find({ book });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    bookDoc.rating = avgRating;
    bookDoc.numReviews = reviews.length;
    await bookDoc.save();

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
export const getBookReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: req.params.bookId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name');

    const total = await Review.countDocuments({ book: req.params.bookId });

    res.json({
      reviews,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.title = req.body.title || review.title;
    review.comment = req.body.comment || review.comment;

    const updatedReview = await review.save();

    // Update book rating
    const book = await Book.findById(review.book);
    const reviews = await Review.find({ book: review.book });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    book.rating = avgRating;
    await book.save();

    await updatedReview.populate('user', 'name');
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookId = review.book;
    await review.deleteOne();

    // Update book rating
    const book = await Book.findById(bookId);
    const reviews = await Review.find({ book: bookId });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      book.rating = avgRating;
      book.numReviews = reviews.length;
    } else {
      book.rating = 0;
      book.numReviews = 0;
    }
    await book.save();

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpful += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
