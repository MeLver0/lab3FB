const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;

// Настраиваем статическую папку
app.use(express.static(path.join(__dirname, "../public_user")));

//Parse json файла 
const fs = require("fs");
const productsFile = path.join(__dirname, "products.json");


app.get("/api/products", (req,res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
        res.json(products);
    }
    catch(error) {
        res.status(500).json({error: "Ошибка загрузки товаров"})
    }
});


app.use((req, res) => {
    res.status(404).send("Страница не найдена");
});


// Главная страница
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "../public/index.html");
    console.log(`Отправка файла: ${filePath}`);
    res.sendFile(filePath);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});


