import Book from '../models/Book.js';

// @desc    Get all books with filtering, sorting, pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Category filter
    if (req.query.category) {
      let categories = req.query.category;
      // Handle comma-separated string or single string
      if (typeof categories === 'string') {
        categories = categories.includes(',') ? categories.split(',') : [categories];
      }
      // If we have an array (or converted to one), use $in
      if (Array.isArray(categories) && categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }

    // Search query
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Author filter
    if (req.query.author) {
      query.author = { $regex: req.query.author, $options: 'i' };
    }

    // Sorting
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1, _id: 1 };
          break;
        case 'price-desc':
          sort = { price: -1, _id: 1 };
          break;
        case 'rating':
          sort = { rating: -1, _id: 1 };
          break;
        case 'latest':
          sort = { createdAt: -1, _id: 1 };
          break;
        default:
          sort = { createdAt: -1, _id: 1 };
      }
    } else {
      sort = { createdAt: -1, _id: 1 };
    }

    const books = await Book.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    // console.log('Books sent:', books[0]); // Debug log

    const total = await Book.countDocuments(query);

    res.json({
      books,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      isbn,
      publisher,
      publishedDate,
      language,
      pages,
      category,
      price,
      originalPrice,
      discount,
      stock,
      images,
      featured,
    } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      isbn,
      publisher,
      publishedDate,
      language,
      pages,
      category,
      price,
      originalPrice,
      discount,
      stock,
      images,
      featured,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.isbn = req.body.isbn || book.isbn;
      book.publisher = req.body.publisher || book.publisher;
      book.publishedDate = req.body.publishedDate || book.publishedDate;
      book.language = req.body.language || book.language;
      book.pages = req.body.pages || book.pages;
      book.category = req.body.category || book.category;
      book.price = req.body.price || book.price;
      book.originalPrice = req.body.originalPrice || book.originalPrice;
      book.discount = req.body.discount || book.discount;
      book.stock = req.body.stock !== undefined ? req.body.stock : book.stock;
      book.images = req.body.images || book.images;
      book.featured = req.body.featured !== undefined ? req.body.featured : book.featured;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ featured: true })
      .limit(8)
      .sort({ rating: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
