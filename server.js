const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Настройка хранения загружаемых файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Директория для сохранения загруженных файлов
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
  },
});

const upload = multer({ storage: storage });

// Создаем директорию uploads, если она не существует
const fs = require('fs');
const dir = './uploads';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Обработка POST-запроса на /upload для нескольких файлов
app.post('/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Файлы не были загружены.' });
  }
  const fileDetails = req.files.map((file) => ({
    filename: file.filename,
    path: file.path,
  }));

  res.json({
    message: 'Файлы успешно загружены!',
    files: fileDetails,
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
