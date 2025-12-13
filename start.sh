#!/bin/bash

# YAVER - Full Stack Startup Script
# Backend (Hono + Bun) + Frontend (Next.js)

echo "🚀 YAVER Başlatılıyor..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill any existing processes on ports
echo -e "${YELLOW}⏳ Mevcut portlar temizleniyor...${NC}"
lsof -ti:8881 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Start Backend
echo -e "${BLUE}📦 Backend başlatılıyor (port 8881)...${NC}"
cd "$SCRIPT_DIR"
bun run dev &
BACKEND_PID=$!
sleep 2

# Start Frontend
echo -e "${BLUE}🎨 Frontend başlatılıyor (port 3001)...${NC}"
cd "$SCRIPT_DIR/frontend"
bun run dev --port 3001 &
FRONTEND_PID=$!
sleep 3

# Print info
echo ""
echo -e "${GREEN}✅ YAVER çalışıyor!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${BLUE}Backend API:${NC}    http://localhost:8881"
echo -e "  ${BLUE}API Docs:${NC}       http://localhost:8881/api-docs"
echo -e "  ${GREEN}Frontend:${NC}       http://localhost:3001"
echo -e "  ${GREEN}Dashboard:${NC}      http://localhost:3001/dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Durdurmak için: Ctrl+C${NC}"
echo ""

# Trap to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Servisler durduruluyor...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    lsof -ti:8881 | xargs kill -9 2>/dev/null
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Tüm servisler durduruldu.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
