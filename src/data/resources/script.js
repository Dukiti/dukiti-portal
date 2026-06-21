// Mục có `file` (đường dẫn tính từ public/) sẽ hiện viewer + nút tải về.
export const script = [
  {
    title: 'Zip Folder (.ps1)',
    description: 'Nén folder thành .zip, tuỳ chọn đặt mật khẩu AES-256. Yêu cầu 7-Zip.',
    file: 'scripts/zip-folder.ps1',
    category: 'script',
    icon: 'FileTerminal',
    tags: ['powershell', 'windows', '7zip', 'zip'],
  },
  {
    title: 'Zip Folder (.bat)',
    description: 'Click đúp chạy ngay — hỏi folder và password, gọi thẳng 7-Zip.',
    file: 'scripts/zip-folder.bat',
    category: 'script',
    icon: 'FileTerminal',
    tags: ['bat', 'windows', '7zip', 'zip'],
  },
]
