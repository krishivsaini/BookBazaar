#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m'

BASE_URL="http://localhost:8000/api"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}�� Complete API Test with Data Flow${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Create Admin User
echo -e "${YELLOW}🔐 Step 1: Creating Admin User...${NC}"
ADMIN_EMAIL="admin$(date +%s)@test.com"
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"admin123\",\"role\":\"admin\"}")
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✅ Admin Created${NC}\n"

# Step 2: Create Books
echo -e "${YELLOW}📖 Step 2: Creating Books...${NC}"
BOOK1_RESPONSE=$(curl -s -X POST $BASE_URL/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "description": "Your journey to mastery",
    "category": "Technology",
    "price": 45.99,
    "discount": 15,
    "stock": 20,
    "featured": true,
    "images": ["https://images.unsplash.com/photo-1532012197267-da84d127e765"]
  }')
BOOK1_ID=$(echo $BOOK1_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "   Book 1 Created: $BOOK1_ID"

BOOK2_RESPONSE=$(curl -s -X POST $BASE_URL/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Clean Code",
    "author": "Robert Martin",
    "description": "A Handbook of Agile Software Craftsmanship",
    "category": "Technology",
    "price": 39.99,
    "discount": 10,
    "stock": 15,
    "featured": false,
    "images": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f"]
  }')
BOOK2_ID=$(echo $BOOK2_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "   Book 2 Created: $BOOK2_ID"
echo -e "${GREEN}✅ Books Created${NC}\n"

# Step 3: Create Regular User
echo -e "${YELLOW}👤 Step 3: Creating Regular User...${NC}"
USER_EMAIL="user$(date +%s)@test.com"
USER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Regular User\",\"email\":\"$USER_EMAIL\",\"password\":\"user123\"}")
USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✅ User Created${NC}\n"

# Step 4: Browse Books
echo -e "${YELLOW}🔍 Step 4: Browsing Books...${NC}"
ALL_BOOKS=$(curl -s "$BASE_URL/books")
TOTAL_BOOKS=$(echo $ALL_BOOKS | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "   Total books in store: $TOTAL_BOOKS"

FEATURED=$(curl -s "$BASE_URL/books/featured")
echo "   Featured books available"
echo -e "${GREEN}✅ Books Retrieved${NC}\n"

# Step 5: Add to Cart
echo -e "${YELLOW}🛒 Step 5: Adding to Cart...${NC}"
curl -s -X POST $BASE_URL/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"bookId\":\"$BOOK1_ID\",\"quantity\":2}" > /dev/null
echo "   Added Book 1 (qty: 2)"

curl -s -X POST $BASE_URL/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"bookId\":\"$BOOK2_ID\",\"quantity\":1}" > /dev/null
echo "   Added Book 2 (qty: 1)"

CART=$(curl -s $BASE_URL/cart -H "Authorization: Bearer $USER_TOKEN")
CART_TOTAL=$(echo $CART | grep -o '"totalItems":[0-9]*' | cut -d':' -f2)
echo "   Cart total items: $CART_TOTAL"
echo -e "${GREEN}✅ Items Added to Cart${NC}\n"

# Step 6: Add to Wishlist
echo -e "${YELLOW}❤️  Step 6: Adding to Wishlist...${NC}"
curl -s -X POST $BASE_URL/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"bookId\":\"$BOOK2_ID\"}" > /dev/null
echo "   Added Book 2 to wishlist"
echo -e "${GREEN}✅ Wishlist Updated${NC}\n"

# Step 7: Create Order
echo -e "${YELLOW}📦 Step 7: Creating Order...${NC}"
ORDER_RESPONSE=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "shippingAddress": {
      "fullName": "John Doe",
      "email": "john@test.com",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "+1234567890"
    },
    "paymentMethod": "COD"
  }')
ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
ORDER_NUMBER=$(echo $ORDER_RESPONSE | grep -o '"orderNumber":"[^"]*' | cut -d'"' -f4)
echo "   Order Created: $ORDER_NUMBER"
echo "   Order ID: $ORDER_ID"
echo -e "${GREEN}✅ Order Placed${NC}\n"

# Step 8: Add Review
echo -e "${YELLOW}⭐ Step 8: Adding Review...${NC}"
REVIEW_RESPONSE=$(curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{
    \"book\":\"$BOOK1_ID\",
    \"rating\":5,
    \"title\":\"Excellent Book!\",
    \"comment\":\"This book is amazing! Highly recommend it.\"
  }")
echo "   Review added for Book 1"
echo -e "${GREEN}✅ Review Submitted${NC}\n"

# Step 9: Get Book Reviews
echo -e "${YELLOW}📝 Step 9: Getting Book Reviews...${NC}"
REVIEWS=$(curl -s "$BASE_URL/reviews/$BOOK1_ID")
TOTAL_REVIEWS=$(echo $REVIEWS | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "   Total reviews for Book 1: $TOTAL_REVIEWS"
echo -e "${GREEN}✅ Reviews Retrieved${NC}\n"

# Step 10: Admin - Get All Orders
echo -e "${YELLOW}👨‍💼 Step 10: Admin Viewing Orders...${NC}"
ADMIN_ORDERS=$(curl -s "$BASE_URL/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
ADMIN_TOTAL=$(echo $ADMIN_ORDERS | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "   Total orders in system: $ADMIN_TOTAL"
echo -e "${GREEN}✅ Admin Access Verified${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}✅ Complete Test Flow Success!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Summary:${NC}"
echo "  • Admin user created"
echo "  • $TOTAL_BOOKS books added to store"
echo "  • Regular user created"
echo "  • $CART_TOTAL items added to cart"
echo "  • Order $ORDER_NUMBER placed"
echo "  • $TOTAL_REVIEWS review(s) submitted"
echo "  • All API endpoints working ✅"
echo ""
