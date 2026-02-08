@echo off
echo Starting Todo App...
echo.

echo Starting Server...
start "Todo Server" cmd /k "cd server && npm run dev"

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Starting Client...
start "Todo Client" cmd /k "cd client && npm run dev"

echo.
echo Both client and server are starting...
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
