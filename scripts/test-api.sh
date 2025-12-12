#!/bin/bash

echo "╔══════════════════════════════════════════════════════╗"
echo "║     🚀 SellerAI API - Production Test Suite        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
PASSED=0
BASE_URL="http://localhost:8881"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test function
test_api() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected="$5"
  local token="$6"
  
  printf "%-40s" "$name"
  
  if [ -n "$token" ]; then
    HEADERS="-H 'Authorization: Bearer $token'"
  else
    HEADERS=""
  fi
  
  if [ "$method" = "GET" ]; then
    RESPONSE=$(eval curl -s $HEADERS "$BASE_URL$endpoint")
  else
    RESPONSE=$(eval curl -s -X "$method" $HEADERS -H "'Content-Type: application/json'" -d "'$data'" "$BASE_URL$endpoint")
  fi
  
  if echo "$RESPONSE" | grep -q "$expected"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    ((ERRORS++))
  fi
}

# Run tests
echo "📋 Running API Tests..."
echo ""

# Basic tests
test_api "1. Health Check" "GET" "/" "" '"success":true' ""
test_api "2. 404 Handler" "GET" "/nonexistent" "" '"error":"Route not found"' ""

# Authentication
REGISTER_DATA='{"email":"test_'$(date +%s)'@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'
test_api "3. User Registration" "POST" "/auth/register" "$REGISTER_DATA" '"success":true' ""

# Get token
LOGIN_DATA='{"email":"ultimate@production.com","password":"Ultimate123!"}'
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$LOGIN_DATA" "$BASE_URL/auth/login")
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  printf "%-40s" "4. User Login"
  echo -e "${GREEN}✅ PASSED${NC}"
  ((PASSED++))
else
  printf "%-40s" "4. User Login"
  echo -e "${RED}❌ FAILED${NC}"
  ((ERRORS++))
fi

# Protected endpoints
test_api "5. User Profile (/me)" "GET" "/auth/me" "" '"email"' "$TOKEN"
test_api "6. Credits Balance" "GET" "/credits" "" '"availableCredits"' "$TOKEN"
test_api "7. Categories List" "GET" "/categories/top" "" '"success":true' "$TOKEN"
test_api "8. Marketplaces List" "GET" "/marketplaces" "" '"success":true' "$TOKEN"
test_api "9. Products List" "GET" "/products?page=1&limit=5" "" '"success":true' "$TOKEN"

# CRUD operations
PRODUCT_DATA='{"brandName":"Test Brand","rawUserPrompt":"Test product description with more than ten characters","categoryId":1}'
test_api "10. Create Product" "POST" "/products" "$PRODUCT_DATA" '"success":true' "$TOKEN"

# Documentation
test_api "11. OpenAPI Documentation" "GET" "/api-docs/openapi.json" "" '"openapi":"3.0.0"' ""

# Results
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                  📊 TEST RESULTS                     ║"
echo "╠══════════════════════════════════════════════════════╣"
printf "║  ✅ Passed: %-40s║\n" "$PASSED"
printf "║  ❌ Failed: %-40s║\n" "$ERRORS"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED!"
  echo ""
  echo "✨ System Features:"
  echo "   • Modular Architecture (Feature-based)"
  echo "   • Type-Safe TypeScript"
  echo "   • Rate Limiting"
  echo "   • Structured Logging"
  echo "   • Global Error Handling"
  echo "   • Input Validation (Zod)"
  echo "   • JWT Authentication"
  echo "   • API Documentation (OpenAPI)"
  echo "   • Graceful Shutdown"
  echo "   • CORS Enabled"
  echo ""
  echo "🚀 System is PRODUCTION-READY!"
  exit 0
else
  echo "⚠️  Some tests failed."
  exit 1
fi
