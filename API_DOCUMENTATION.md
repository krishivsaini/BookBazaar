# BookBazaar API Documentation

## Base URL
- **Local:** `http://localhost:8000/api`
- **Production:** `https://bookbazaar-zy9o.onrender.com/api`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Books API

### Get All Books
**GET** `/books`

Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 12) - Books per page
- `category` - Filter by category (Fiction, Non-Fiction, Self-Help, Comics, Science, Biography, Mystery, Romance, Technology, History, Children)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `rating` - Minimum rating (0-5)
- `search` - Search in title and author
- `author` - Filter by author name
- `sort` - Sort by: `price-asc`, `price-desc`, `rating`, `latest`

Example: `/books?category=Fiction&minPrice=10&maxPrice=50&rating=4&sort=rating&page=1`

Response:
```json
{
  "books": [...],
  "page": 1,
  "pages": 5,
  "total": 60
}
```

### Get Single Book
**GET** `/books/:id`

### Get Featured Books
**GET** `/books/featured`

Returns top 8 featured books sorted by rating.

### Create Book (Admin)
**POST** `/books`

Auth: Admin required

Body:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "isbn": "1234567890",
  "publisher": "Publisher Name",
  "publishedDate": "2024-01-01",
  "language": "English",
  "pages": 300,
  "category": "Fiction",
  "price": 29.99,
  "originalPrice": 39.99,
  "discount": 25,
  "stock": 100,
  "images": ["url1", "url2"],
  "featured": false
}
```

### Update Book (Admin)
**PUT** `/books/:id`

Auth: Admin required

### Delete Book (Admin)
**DELETE** `/books/:id`

Auth: Admin required

---

## Cart API

### Get Cart
**GET** `/cart`

Auth: Required

### Add to Cart
**POST** `/cart`

Auth: Required

Body:
```json
{
  "bookId": "book_id_here",
  "quantity": 1
}
```

### Update Cart Item
**PUT** `/cart/:bookId`

Auth: Required

Body:
```json
{
  "quantity": 2
}
```

### Remove from Cart
**DELETE** `/cart/:bookId`

Auth: Required

### Clear Cart
**DELETE** `/cart`

Auth: Required

---

## Orders API

### Create Order
**POST** `/orders`

Auth: Required

Body:
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "COD"
}
```

Note: Order is created from current cart items. Cart is automatically cleared after order creation.

### Get My Orders
**GET** `/orders/my`

Auth: Required

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)

### Get Single Order
**GET** `/orders/:id`

Auth: Required (own orders) or Admin

### Get All Orders (Admin)
**GET** `/orders`

Auth: Admin required

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status: Pending, Processing, Shipped, Delivered, Cancelled

### Update Order Status (Admin)
**PUT** `/orders/:id/status`

Auth: Admin required

Body:
```json
{
  "status": "Shipped",
  "trackingNumber": "TRACK123"
}
```

### Update Payment Status
**PUT** `/orders/:id/pay`

Auth: Required

Marks order as paid.

---

## Reviews API

### Add Review
**POST** `/reviews`

Auth: Required

Body:
```json
{
  "book": "book_id_here",
  "rating": 5,
  "title": "Amazing book!",
  "comment": "This book changed my life..."
}
```

Note: Users can only review each book once. Reviews from verified purchases are marked as verified.

### Get Book Reviews
**GET** `/reviews/:bookId`

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)

### Update Review
**PUT** `/reviews/:id`

Auth: Required (own review)

Body:
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

### Delete Review
**DELETE** `/reviews/:id`

Auth: Required (own review) or Admin

### Mark Review as Helpful
**POST** `/reviews/:id/helpful`

Auth: Required

Increments the helpful count for a review.

---

## Wishlist API

### Get Wishlist
**GET** `/wishlist`

Auth: Required

### Add to Wishlist
**POST** `/wishlist`

Auth: Required

Body:
```json
{
  "bookId": "book_id_here"
}
```

### Remove from Wishlist
**DELETE** `/wishlist/:bookId`

Auth: Required

### Toggle Wishlist
**POST** `/wishlist/toggle`

Auth: Required

Body:
```json
{
  "bookId": "book_id_here"
}
```

Adds to wishlist if not present, removes if already in wishlist.

### Clear Wishlist
**DELETE** `/wishlist`

Auth: Required

---

## Authentication API

### Signup
**POST** `/auth/signup`

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Login
**POST** `/auth/login`

Body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Get Profile
**GET** `/auth/profile`

Auth: Required

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (not authenticated)
- **403** - Forbidden (not authorized for this action)
- **404** - Not Found
- **500** - Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

---

## Business Logic

### Order Creation
1. Validates cart is not empty
2. Checks stock availability for all items
3. Calculates totals:
   - Subtotal: Sum of (price × quantity)
   - Tax: 10% of subtotal
   - Shipping: ₹50 (free if subtotal > ₹500)
   - Total: Subtotal + Tax + Shipping
4. Creates order with denormalized book data
5. Decrements book stock
6. Clears user's cart

### Review System
- One review per user per book (compound unique index)
- Automatic book rating calculation
- Verified purchase badge for users who bought the book
- Helpful count for community feedback

### Stock Management
- Stock is decremented when order is created
- Cart validates stock before allowing add to cart
- Admin can manage stock via book update endpoint

### Pricing
- Books have price and discount percentage
- Virtual field `discountedPrice` calculates: price × (1 - discount/100)
- Cart stores price snapshot at time of adding (protects against price changes)
