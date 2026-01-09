@echo off
setlocal enabledelayedexpansion
TITLE YAVER Full Stack Control
echo.
echo 🚀 YAVER Başlatılıyor...
echo.

:: Bun yolunu kontrol et
set "BUN_PATH=%USERPROFILE%\.bun\bin\bun.exe"
where bun >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "%BUN_PATH%" (
        set "PATH=%PATH%;%USERPROFILE%\.bun\bin"
        set "BUN_CMD=%BUN_PATH%"
    ) else (
        echo ❌ Bun bulunamadi! Lutfen once Bun kurun.
        pause
        exit /b 1
    )
) else (
    set "BUN_CMD=bun"
)

:: Node_modules kontrolü
if not exist "node_modules\" (
    echo ⚠️ Backend paketleri eksik! Yukleniyor...
    call %BUN_CMD% install
)

if not exist "frontend\node_modules\" (
    echo ⚠️ Frontend paketleri eksik! Yukleniyor...
    cd frontend
    call %BUN_CMD% install
    cd ..
)

:: Env kontrolü
if not exist ".env" (
    echo ⚠️ .env dosyasi bulunamadi! .env.example'dan kopyalaniyor...
    copy .env.example .env
)

:: Portları temizleme
echo ⏳ Mevcut portlar kontrol ediliyor (8881, 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8881') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a 2>nul

echo 📦 Backend başlatılıyor (port 8881)...
start "YAVER Backend" cmd /k "%BUN_CMD% run dev"

echo 🎨 Frontend başlatılıyor (port 3001)...
cd frontend
start "YAVER Frontend" cmd /k "%BUN_CMD% run dev --port 3001"
cd ..

echo.
echo ✅ YAVER servisleri baslatildi!
echo --------------------------------------------
echo Backend:  http://localhost:8881
echo Frontend: http://localhost:3001
echo --------------------------------------------
echo.
echo Not: Acilan pencerelerde hata olup olmadigini kontrol edin.
pause
