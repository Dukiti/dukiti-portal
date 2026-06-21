@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo   Zip Folder - powered by 7-Zip + PowerShell
echo ============================================
echo.

:: Nhập folder cần nén
set /p "SOURCE=Folder can nen (keo thu muc vao day): "

:: Bỏ dấu ngoặc kép nếu user kéo thả folder vào
set SOURCE=%SOURCE:"=%

if not exist "%SOURCE%" (
    echo [LOI] Khong tim thay: %SOURCE%
    pause
    exit /b 1
)

:: Nhập password (bỏ trống nếu không cần)
set /p "PASS=Mat khau (Enter de bo qua): "

echo.

:: Tìm script .ps1 cùng thư mục với file .bat này
set "PS1=%~dp0zip-folder.ps1"

if not exist "%PS1%" (
    echo [LOI] Khong tim thay zip-folder.ps1 ben canh file .bat nay.
    pause
    exit /b 1
)

:: Chạy PowerShell với tham số tương ứng
if "%PASS%"=="" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Source "%SOURCE%"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Source "%SOURCE%" -Password "%PASS%"
)

echo.
pause
endlocal
