@echo off
REM ─────────────────────────────────────────────────────────────────
REM  File Converter — Build Script
REM ─────────────────────────────────────────────────────────────────

echo.
echo  ====================================
echo   File Converter - Building .exe
echo  ====================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Python not found on PATH.
    pause
    exit /b 1
)

REM Install / upgrade PyInstaller via python -m so PATH doesn't matter
echo  Installing / verifying PyInstaller...
python -m pip install --upgrade pyinstaller --quiet

REM Clean previous build
echo  Cleaning previous build...
if exist build\  rmdir /s /q build
if exist dist\   rmdir /s /q dist

REM Build — always call via "python -m PyInstaller" to avoid PATH issues
echo  Building...
echo.
python -m PyInstaller fileconverter.spec --noconfirm

if errorlevel 1 (
    echo.
    echo  ====================================
    echo   BUILD FAILED
    echo   Scroll up to see the error.
    echo  ====================================
    pause
    exit /b 1
)

echo.
echo  ====================================
echo   BUILD SUCCESSFUL!
echo  ====================================
echo.
echo  Your app is at:
echo    dist\FileConverter\FileConverter.exe
echo.
echo  To share: zip the entire dist\FileConverter\ folder.
echo.
pause
