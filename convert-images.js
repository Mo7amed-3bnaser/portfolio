const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// المجلد الذي يحتوي على الصور الأصلية
const sourceDir = path.join(__dirname, 'images');
// المجلد الذي سيتم حفظ الصور المحولة فيه
const targetDir = path.join(__dirname, 'images/optimized');

// التأكد من وجود المجلد الهدف
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// قراءة محتويات المجلد المصدر
fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('خطأ في قراءة المجلد:', err);
        return;
    }

    // تصفية الملفات للحصول على الصور فقط
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    console.log(`تم العثور على ${imageFiles.length} صورة للتحويل.`);

    // تحويل كل صورة إلى WebP
    imageFiles.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const fileNameWithoutExt = path.basename(file, path.extname(file));
        const targetPath = path.join(targetDir, `${fileNameWithoutExt}.webp`);

        // استخدام cwebp لتحويل الصورة
        const command = `cwebp -q 80 "${sourcePath}" -o "${targetPath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`خطأ في تحويل ${file}:`, error);
                return;
            }
            console.log(`تم تحويل ${file} إلى WebP بنجاح!`);
        });
    });
}); 