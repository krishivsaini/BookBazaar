import mongoose from 'mongoose';
import Book from './models/Book.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleBooks = [
  // Fiction
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    category: "Fiction",
    price: 299,
    discount: 10,
    stock: 50,
    images: ["https://covers.openlibrary.org/b/id/10590366-L.jpg"],
    publisher: "Scribner",
    language: "English",
    pages: 180,
    isbn: "9780743273565",
    format: "Paperback",
    rating: 4.5,
    featured: true
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    category: "Fiction",
    price: 350,
    discount: 15,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/12606502-L.jpg"],
    publisher: "J. B. Lippincott & Co.",
    language: "English",
    pages: 324,
    isbn: "9780061120084",
    format: "Paperback",
    rating: 4.8,
    featured: true
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    category: "Fiction",
    price: 399,
    discount: 10,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/10432365-L.jpg"],
    publisher: "Bantam Books",
    language: "English",
    pages: 328,
    isbn: "9780451524935",
    format: "Paperback",
    rating: 4.7,
    featured: true
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A mystical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.",
    category: "Fiction",
    price: 250,
    discount: 0,
    stock: 80,
    images: ["https://covers.openlibrary.org/b/id/7463992-L.jpg"],
    publisher: "HarperOne",
    language: "English",
    pages: 197,
    isbn: "9780062315007",
    format: "Paperback",
    rating: 4.3,
    featured: false
  },

  // Non-Fiction
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A brief history of humankind, exploring how Homo sapiens came to dominate the world.",
    category: "Non-Fiction",
    price: 599,
    discount: 10,
    stock: 60,
    images: ["https://covers.openlibrary.org/b/id/14844454-L.jpg"],
    publisher: "Harper",
    language: "English",
    pages: 464,
    isbn: "9780062316097",
    format: "Hardcover",
    rating: 4.6,
    featured: true
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "The major New York Times bestseller that explains the two systems that drive the way we think.",
    category: "Non-Fiction",
    price: 499,
    discount: 5,
    stock: 45,
    images: ["https://covers.openlibrary.org/b/id/8393874-L.jpg"],
    publisher: "Farrar, Straus and Giroux",
    language: "English",
    pages: 499,
    isbn: "9780374275631",
    format: "Paperback",
    rating: 4.5,
    featured: false
  },

  // Self-Help
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    category: "Self-Help",
    price: 499,
    discount: 15,
    stock: 100,
    images: ["https://covers.openlibrary.org/b/id/12539702-L.jpg"],
    publisher: "Avery",
    language: "English",
    pages: 320,
    isbn: "9780735211292",
    format: "Hardcover",
    rating: 4.9,
    featured: true
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    description: "The classic guide to achieving wealth and success through positive thinking.",
    category: "Self-Help",
    price: 299,
    discount: 0,
    stock: 90,
    images: ["https://covers.openlibrary.org/b/id/14542536-L.jpg"],
    publisher: "The Ralston Society",
    language: "English",
    pages: 238,
    isbn: "9781585424337",
    format: "Paperback",
    rating: 4.4,
    featured: false
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    description: "A counterintuitive approach to living a good life.",
    category: "Self-Help",
    price: 399,
    discount: 10,
    stock: 75,
    images: ["https://covers.openlibrary.org/b/id/12826110-L.jpg"],
    publisher: "Harper",
    language: "English",
    pages: 224,
    isbn: "9780062457714",
    format: "Paperback",
    rating: 4.2,
    featured: false
  },

  // Business
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness.",
    category: "Business",
    price: 449,
    discount: 10,
    stock: 70,
    images: ["https://covers.openlibrary.org/b/id/15137999-L.jpg"],
    publisher: "Harriman House",
    language: "English",
    pages: 256,
    isbn: "9780857197689",
    format: "Paperback",
    rating: 4.7,
    featured: true
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    category: "Business",
    price: 549,
    discount: 10,
    stock: 60,
    images: ["https://covers.openlibrary.org/b/id/7104760-L.jpg"],
    publisher: "Crown Business",
    language: "English",
    pages: 336,
    isbn: "9780307887894",
    format: "Hardcover",
    rating: 4.3,
    featured: false
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    description: "Notes on startups, or how to build the future.",
    category: "Business",
    price: 499,
    discount: 5,
    stock: 50,
    images: ["https://covers.openlibrary.org/b/id/8259443-L.jpg"],
    publisher: "Crown Business",
    language: "English",
    pages: 224,
    isbn: "9780804139298",
    format: "Hardcover",
    rating: 4.5,
    featured: false
  },

  // Biography
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a young woman who leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    category: "Biography",
    price: 550,
    discount: 20,
    stock: 45,
    images: ["https://covers.openlibrary.org/b/id/8314077-L.jpg"],
    publisher: "Random House",
    language: "English",
    pages: 334,
    isbn: "9780399590504",
    format: "Hardcover",
    rating: 4.8,
    featured: false
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    description: "The exclusive biography of Steve Jobs, based on interviews with Jobs himself.",
    category: "Biography",
    price: 699,
    discount: 15,
    stock: 35,
    images: ["https://covers.openlibrary.org/b/id/12374726-L.jpg"],
    publisher: "Simon & Schuster",
    language: "English",
    pages: 656,
    isbn: "9781451648539",
    format: "Hardcover",
    rating: 4.5,
    featured: false
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    description: "The memoir of former United States First Lady Michelle Obama.",
    category: "Biography",
    price: 599,
    discount: 10,
    stock: 80,
    images: ["https://covers.openlibrary.org/b/id/8431682-L.jpg"],
    publisher: "Crown",
    language: "English",
    pages: 448,
    isbn: "9781524763138",
    format: "Hardcover",
    rating: 4.7,
    featured: true
  },

  // Mystery
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description: "A murder in the Louvre Museum and cryptic clues in Leonardo da Vinci's paintings lead to the discovery of a religious mystery.",
    category: "Mystery",
    price: 399,
    discount: 15,
    stock: 55,
    images: ["https://covers.openlibrary.org/b/id/9255229-L.jpg"],
    publisher: "Doubleday",
    language: "English",
    pages: 454,
    isbn: "9780385504201",
    format: "Paperback",
    rating: 4.2,
    featured: false
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    description: "A thriller about a woman who disappears on her fifth wedding anniversary.",
    category: "Mystery",
    price: 350,
    discount: 10,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/8259299-L.jpg"],
    publisher: "Crown",
    language: "English",
    pages: 432,
    isbn: "9780307588371",
    format: "Paperback",
    rating: 4.1,
    featured: false
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    description: "A journalist and a hacker team up to solve a decades-old disappearance.",
    category: "Mystery",
    price: 399,
    discount: 5,
    stock: 50,
    images: ["https://covers.openlibrary.org/b/id/12547198-L.jpg"],
    publisher: "Norstedts Förlag",
    language: "English",
    pages: 480,
    isbn: "9780307269751",
    format: "Paperback",
    rating: 4.4,
    featured: false
  },

  // Fantasy
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first novel in the Harry Potter series about a young wizard's journey.",
    category: "Fantasy",
    price: 450,
    discount: 10,
    stock: 120,
    images: ["https://covers.openlibrary.org/b/id/6509920-L.jpg"],
    publisher: "Scholastic",
    language: "English",
    pages: 309,
    isbn: "9780590353427",
    format: "Paperback",
    rating: 4.9,
    featured: true
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of Bilbo Baggins.",
    category: "Fantasy",
    price: 399,
    discount: 0,
    stock: 60,
    images: ["https://covers.openlibrary.org/b/id/8406786-L.jpg"],
    publisher: "George Allen & Unwin",
    language: "English",
    pages: 310,
    isbn: "9780547928227",
    format: "Paperback",
    rating: 4.8,
    featured: true
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    description: "The first book in A Song of Ice and Fire series.",
    category: "Fantasy",
    price: 599,
    discount: 15,
    stock: 45,
    images: ["https://covers.openlibrary.org/b/id/8259557-L.jpg"],
    publisher: "Bantam Spectra",
    language: "English",
    pages: 694,
    isbn: "9780553103540",
    format: "Paperback",
    rating: 4.7,
    featured: false
  },

  // Science
  {
    title: "Brief History of Time",
    author: "Stephen Hawking",
    description: "From the Big Bang to Black Holes - a landmark volume in science writing.",
    category: "Science",
    price: 599,
    discount: 25,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/10582913-L.jpg"],
    publisher: "Bantam",
    language: "English",
    pages: 256,
    isbn: "9780553380163",
    format: "Hardcover",
    rating: 4.6,
    featured: true
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    description: "A journey through the universe, exploring science and civilization.",
    category: "Science",
    price: 499,
    discount: 10,
    stock: 50,
    images: ["https://covers.openlibrary.org/b/id/12640483-L.jpg"],
    publisher: "Random House",
    language: "English",
    pages: 365,
    isbn: "9780345331359",
    format: "Paperback",
    rating: 4.8,
    featured: false
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    description: "A book on evolution by natural selection.",
    category: "Science",
    price: 450,
    discount: 5,
    stock: 30,
    images: ["https://covers.openlibrary.org/b/id/8259447-L.jpg"],
    publisher: "Oxford University Press",
    language: "English",
    pages: 360,
    isbn: "9780198788607",
    format: "Paperback",
    rating: 4.5,
    featured: false
  },

  // Romance
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.",
    category: "Romance",
    price: 279,
    discount: 0,
    stock: 65,
    images: ["https://covers.openlibrary.org/b/id/14348537-L.jpg"],
    publisher: "T. Egerton",
    language: "English",
    pages: 432,
    isbn: "9780141439518",
    format: "Paperback",
    rating: 4.7,
    featured: false
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    description: "A contemporary romance novel set in pre- and post-World War II North Carolina.",
    category: "Romance",
    price: 350,
    discount: 10,
    stock: 55,
    images: ["https://covers.openlibrary.org/b/id/8259301-L.jpg"],
    publisher: "Warner Books",
    language: "English",
    pages: 214,
    isbn: "9780446605236",
    format: "Paperback",
    rating: 4.3,
    featured: false
  },
  {
    title: "Me Before You",
    author: "Jojo Moyes",
    description: "A romance novel about a young woman who becomes a caregiver for a paralyzed man.",
    category: "Romance",
    price: 399,
    discount: 15,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/8259449-L.jpg"],
    publisher: "Pamela Dorman Books",
    language: "English",
    pages: 369,
    isbn: "9780670026609",
    format: "Paperback",
    rating: 4.4,
    featured: false
  },

  // History
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    description: "A transdisciplinary non-fiction book about the history of human societies.",
    category: "History",
    price: 550,
    discount: 10,
    stock: 35,
    images: ["https://covers.openlibrary.org/b/id/8259451-L.jpg"],
    publisher: "W. W. Norton",
    language: "English",
    pages: 480,
    isbn: "9780393061314",
    format: "Paperback",
    rating: 4.5,
    featured: false
  },
  {
    title: "A People's History of the United States",
    author: "Howard Zinn",
    description: "A non-fiction book about the history of the United States from the perspective of the common people.",
    category: "History",
    price: 499,
    discount: 5,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/8259453-L.jpg"],
    publisher: "Harper & Row",
    language: "English",
    pages: 729,
    isbn: "9780060838652",
    format: "Paperback",
    rating: 4.6,
    featured: false
  },

  // Technology
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    category: "Technology",
    price: 899,
    discount: 0,
    stock: 30,
    images: ["https://covers.openlibrary.org/b/id/12539704-L.jpg"],
    publisher: "Prentice Hall",
    language: "English",
    pages: 464,
    isbn: "9780132350884",
    format: "Paperback",
    rating: 4.8,
    featured: true
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    description: "A guide to software engineering best practices.",
    category: "Technology",
    price: 799,
    discount: 10,
    stock: 40,
    images: ["https://covers.openlibrary.org/b/id/12539706-L.jpg"],
    publisher: "Addison-Wesley",
    language: "English",
    pages: 352,
    isbn: "9780201616224",
    format: "Paperback",
    rating: 4.7,
    featured: false
  },

  // Comics
  {
    title: "Watchmen",
    author: "Alan Moore",
    description: "A deconstruction of the superhero genre.",
    category: "Comics",
    price: 450,
    discount: 10,
    stock: 50,
    images: ["https://covers.openlibrary.org/b/id/8259455-L.jpg"],
    publisher: "DC Comics",
    language: "English",
    pages: 416,
    isbn: "9780930289232",
    format: "Paperback",
    rating: 4.8,
    featured: true
  },
  {
    title: "Maus",
    author: "Art Spiegelman",
    description: "A graphic novel depicting the author's father's experiences as a Polish Jew and Holocaust survivor.",
    category: "Comics",
    price: 399,
    discount: 5,
    stock: 45,
    images: ["https://covers.openlibrary.org/b/id/8259457-L.jpg"],
    publisher: "Pantheon Books",
    language: "English",
    pages: 296,
    isbn: "9780394747231",
    format: "Paperback",
    rating: 4.9,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbazaar');
    console.log('Connected to MongoDB');

    // Find or create an admin user to be the seller
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@bookbazaar.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created!');
    } else {
      console.log('Using existing admin user:', adminUser.email);
    }

    // Add seller ID to all books
    const booksWithSeller = sampleBooks.map(book => ({
      ...book,
      seller: adminUser._id
    }));

    // Clear existing books (optional - comment out if you want to keep existing books)
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const result = await Book.insertMany(booksWithSeller);
    console.log(`Successfully added ${result.length} books!`);

    // Display added books
    result.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (₹${book.price})`);
    });

    console.log('\n✅ Seeding completed!');
    console.log(`Admin credentials: ${adminUser.email} / admin123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
