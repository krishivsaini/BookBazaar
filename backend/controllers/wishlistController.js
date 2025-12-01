import Wishlist from '../models/Wishlist.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.book');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    } else {
      // Filter out null books (books that were deleted)
      const originalLength = wishlist.items.length;
      wishlist.items = wishlist.items.filter(item => item.book !== null);
      
      if (wishlist.items.length !== originalLength) {
        await wishlist.save();
      }
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    await wishlist.addItem(bookId);
    await wishlist.populate('items.book');

    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    await wishlist.removeItem(req.params.bookId);
    await wishlist.populate('items.book');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    if (wishlist.isInWishlist(bookId)) {
      await wishlist.removeItem(bookId);
    } else {
      await wishlist.addItem(bookId);
    }

    await wishlist.populate('items.book');

    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    await wishlist.clearWishlist();

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
