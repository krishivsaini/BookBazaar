#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000/api"
TOKEN=""
BOOK_ID=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📚 BookBazaar API Testing Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1️⃣  Testing Health Check...${NC}"
RESPONSE=$(curl -s $BASE_URL/health)
if [[ $RESPONSE == *"ok"* ]]; then
  echo -e "${GREEN}✅ Health Check Passed${NC}"
  echo "   $RESPONSE"
else
  echo -e "${RED}❌ Health Check Failed${NC}"
fi
echo ""

# Test 2: Signup
echo -e "${YELLOW}2️⃣  Testing Signup...${NC}"
EMAIL="testuser$(date +%s)@test.com"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"test123\"}")
if [[ $RESPONSE == *"token"* ]]; then
  echo -e "${GREEN}✅ Signup Successful${NC}"
  TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "   Token: ${TOKEN:0:30}..."
else
  echo -e "${RED}❌ Signup Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 3: Login
echo -e "${YELLOW}3️⃣  Testing Login...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"test123\"}")
if [[ $RESPONSE == *"token"* ]]; then
  echo -e "${GREEN}✅ Login Successful${NC}"
  TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${RED}❌ Login Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 4: Get Profile
echo -e "${YELLOW}4️⃣  Testing Get Profile...${NC}"
RESPONSE=$(curl -s $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN")
if [[ $RESPONSE == *"email"* ]]; then
  echo -e "${GREEN}✅ Get Profile Successful${NC}"
  echo "   Email: $(echo $RESPONSE | grep -o '"email":"[^"]*' | cut -d'"' -f4)"
else
  echo -e "${RED}❌ Get Profile Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 5: Get All Books (should be empty initially)
echo -e "${YELLOW}5️⃣  Testing Get All Books...${NC}"
RESPONSE=$(curl -s $BASE_URL/books)
if [[ $RESPONSE == *"books"* ]]; then
  echo -e "${GREEN}✅ Get Books Successful${NC}"
  echo "   Total books: $(echo $RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)"
else
  echo -e "${RED}❌ Get Books Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 6: Get Featured Books
echo -e "${YELLOW}6️⃣  Testing Get Featured Books...${NC}"
RESPONSE=$(curl -s $BASE_URL/books/featured)
if [[ $RESPONSE == *"["* ]]; then
  echo -e "${GREEN}✅ Get Featured Books Successful${NC}"
else
  echo -e "${RED}❌ Get Featured Books Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 7: Get Cart
echo -e "${YELLOW}7️⃣  Testing Get Cart...${NC}"
RESPONSE=$(curl -s $BASE_URL/cart \
  -H "Authorization: Bearer $TOKEN")
if [[ $RESPONSE == *"items"* ]]; then
  echo -e "${GREEN}✅ Get Cart Successful${NC}"
  echo "   Total items: $(echo $RESPONSE | grep -o '"totalItems":[0-9]*' | cut -d':' -f2)"
else
  echo -e "${RED}❌ Get Cart Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 8: Get Wishlist
echo -e "${YELLOW}8️⃣  Testing Get Wishlist...${NC}"
RESPONSE=$(curl -s $BASE_URL/wishlist \
  -H "Authorization: Bearer $TOKEN")
if [[ $RESPONSE == *"items"* ]]; then
  echo -e "${GREEN}✅ Get Wishlist Successful${NC}"
  echo "   Total items: $(echo $RESPONSE | grep -o '"items":\[' | wc -l | tr -d ' ')"
else
  echo -e "${RED}❌ Get Wishlist Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

# Test 9: Get My Orders
echo -e "${YELLOW}9️⃣  Testing Get My Orders...${NC}"
RESPONSE=$(curl -s $BASE_URL/orders/my \
  -H "Authorization: Bearer $TOKEN")
if [[ $RESPONSE == *"orders"* ]]; then
  echo -e "${GREEN}✅ Get My Orders Successful${NC}"
  echo "   Total orders: $(echo $RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)"
else
  echo -e "${RED}❌ Get My Orders Failed${NC}"
  echo "   $RESPONSE"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}✅ API Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"
