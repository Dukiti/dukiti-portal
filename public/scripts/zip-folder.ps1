#Requires -Version 5.1
<#
.SYNOPSIS
    Zip một folder, tuỳ chọn đặt password. Yêu cầu 7-Zip.

.PARAMETER Source
    Đường dẫn folder cần nén.

.PARAMETER Output
    Đường dẫn file .zip đầu ra. Mặc định: <tên folder>.zip tại cùng vị trí.

.PARAMETER Password
    Mật khẩu bảo vệ file zip. Bỏ trống nếu không cần.

.PARAMETER SevenZipPath
    Đường dẫn tới 7z.exe nếu không nằm trong PATH.
    Mặc định thử: PATH, C:\Program Files\7-Zip\7z.exe

.EXAMPLE
    .\zip-folder.ps1 -Source "C:\MyFolder"
    .\zip-folder.ps1 -Source "C:\MyFolder" -Output "D:\backup.zip" -Password "s3cr3t"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory)][string] $Source,
    [string] $Output,
    [string] $Password,
    [string] $SevenZipPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------- Tìm 7z.exe ----------
function Find-7Zip {
    param([string]$hint)
    $candidates = @(
        $hint,
        '7z',
        'C:\Program Files\7-Zip\7z.exe',
        'C:\Program Files (x86)\7-Zip\7z.exe'
    ) | Where-Object { $_ }

    foreach ($c in $candidates) {
        $cmd = Get-Command $c -ErrorAction SilentlyContinue
        if ($cmd) { return $cmd.Source }
    }
    return $null
}

$sevenZip = Find-7Zip $SevenZipPath
if (-not $sevenZip) {
    Write-Error @"
Không tìm thấy 7-Zip. Cài tại: https://www.7-zip.org/download.html
Hoặc truyền tham số: -SevenZipPath "C:\path\to\7z.exe"
"@
    exit 1
}

# ---------- Kiểm tra Source ----------
$Source = Resolve-Path $Source | Select-Object -ExpandProperty Path
if (-not (Test-Path $Source)) {
    Write-Error "Không tìm thấy folder: $Source"
    exit 1
}

# ---------- Đường dẫn output ----------
if (-not $Output) {
    $folderName = Split-Path $Source -Leaf
    $Output = Join-Path (Split-Path $Source -Parent) "$folderName.zip"
}

# Đảm bảo thư mục cha của output tồn tại
$outputParent = Split-Path $Output -Parent
if ($outputParent -and -not (Test-Path $outputParent)) {
    New-Item -ItemType Directory -Path $outputParent -Force | Out-Null
}

# ---------- Build tham số 7z ----------
# a   = add/create archive
# -tzip = định dạng zip (tương thích rộng)
# -mx=5 = mức nén trung bình (0-9)
# -mmt  = dùng đa luồng
$args7z = @('a', '-tzip', '-mx=5', '-mmt', $Output, "$Source\*")

if ($Password) {
    # -mem=AES256 = mã hoá AES-256 (mạnh hơn ZipCrypto mặc định)
    $args7z += "-p$Password"
    $args7z += '-mem=AES256'
}

# ---------- Chạy ----------
Write-Host "7-Zip : $sevenZip"
Write-Host "Source: $Source"
Write-Host "Output: $Output"
if ($Password) { Write-Host "Mật khẩu: [đã đặt]" }
Write-Host ""

& $sevenZip @args7z

if ($LASTEXITCODE -eq 0) {
    $size = (Get-Item $Output).Length / 1MB
    Write-Host "`nHoàn thành! File: $Output ($([math]::Round($size,2)) MB)" -ForegroundColor Green
} else {
    Write-Error "7-Zip kết thúc với mã lỗi $LASTEXITCODE"
    exit $LASTEXITCODE
}
