import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import connectDB from './config/db.js';

dotenv.config();

const checkImages = async () => {
  try {
    await connectDB();

    const books = await Book.find({});
    console.log(`Found ${books.length} books.`);

    books.forEach(book => {
      console.log(`Title: ${book.title}`);
      console.log(`Image URL: ${book.image}`);
      console.log('---');
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkImages();
