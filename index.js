const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            files = [];
        }
        res.render('index', { files: files });
    });
});

app.post('/upload', upload.single('zipfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const file = req.file;
    if (path.extname(file.originalname).toLowerCase() !== '.zip') {
        fs.unlinkSync(file.path);
        return res.status(400).send('Please upload a zip file.');
    }

    res.render('success', { message: 'File uploaded successfully!' });

    // Extract the zip file

    //res.redirect('/');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});