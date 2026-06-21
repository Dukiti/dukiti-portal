@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ============================================
echo   Zip Folder - powered by 7-Zip
echo ============================================
echo.

:: ---------- Tim 7z.exe ----------
set "SZ="
for %%P in (
    "C:\Program Files\7-Zip\7z.exe"
    "C:\Program Files (x86)\7-Zip\7z.exe"
) do (
    if not defined SZ if exist %%P set "SZ=%%~P"
)
if not defined SZ (
    where 7z >nul 2>&1 && set "SZ=7z"
)
if not defined SZ (
    echo [LOI] Khong tim thay 7-Zip.
    echo Cai dat tai: https://www.7-zip.org/download.html
    pause
    exit /b 1
)

:: ---------- Nhap folder ----------
set /p "SOURCE=Folder can nen (keo thu muc vao day): "
set "SOURCE=%SOURCE:"=%"

if not exist "%SOURCE%" (
    echo [LOI] Khong tim thay: %SOURCE%
    pause
    exit /b 1
)

:: ---------- Nhap password ----------
set /p "PASS=Mat khau (Enter de bo qua): "

:: ---------- Ten file output ----------
for %%F in ("%SOURCE%") do set "FNAME=%%~nxF"
for %%F in ("%SOURCE%") do set "FPARENT=%%~dpF"
set "OUTPUT=%FPARENT%%FNAME%.zip"

echo.
echo Source : %SOURCE%
echo Output : %OUTPUT%
if defined PASS (
    if not "%PASS%"=="" echo Mat khau: [da dat]
)
echo.

:: ---------- Chay 7z ----------
if not defined PASS goto :nopass
if "%PASS%"=="" goto :nopass

"%SZ%" a -tzip -mx=5 -mmt "-p%PASS%" -mem=AES256 "%OUTPUT%" "%SOURCE%\*"
goto :done

:nopass
"%SZ%" a -tzip -mx=5 -mmt "%OUTPUT%" "%SOURCE%\*"

:done
if %ERRORLEVEL% equ 0 (
    echo.
    echo Hoan thanh! File: %OUTPUT%
) else (
    echo.
    echo [LOI] 7-Zip ket thuc voi ma loi %ERRORLEVEL%
)

echo.
pause
endlocal
