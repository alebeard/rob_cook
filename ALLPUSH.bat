@echo off
setlocal

echo.
echo ========================================
echo    🚀 SE 79th PDX - Quick Push Tool
echo ========================================
echo.

REM Prompt for a commit message
set /p commitMessage="Enter commit message (or press Enter for 'feat: Automated commit'): "

REM If no message is entered, use a default one
if "%commitMessage%"=="" set "commitMessage=feat: Automated commit"

echo.
echo [1/3] Staging all changes...
git add .
echo.
echo [2/3] Committing with message: "%commitMessage%"
git commit -m "%commitMessage%"
echo.
echo [3/3] Pushing to origin main...
git push origin main

echo.
echo ==== Push complete! ====
echo.
pause