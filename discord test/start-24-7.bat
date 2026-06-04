@echo off
cd /d "%~dp0"
echo Starting Discord bot (24/7)...
call npm run 24
call npx pm2 save
echo.
echo Bot is running in background. Close this window safely.
echo Status: npm run 24:status
pause
