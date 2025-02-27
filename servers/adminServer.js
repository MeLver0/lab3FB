const express = require("express");
const path = require("path");
const app = express();
const PORT = 6662;

// Настраиваем статическую папку
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public_admin")));

//Pastse json файла 
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

// Добавить товар/несколько товаров
app.post("/api/products", (req, res) => {
    try {
        const newProducts = req.body; // Ожидаем массив [{ name, price, description, categories }]
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));

        // Добавляем новые товары с уникальными ID
        newProducts.forEach(product => {
            product.id = Date.now();
            products.push(product);
        });

        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.status(201).json({ message: "Товар(ы) добавлен(ы)", products });
    } catch (error) {
        res.status(500).json({ error: "Ошибка добавления товара" });
    }
});

// Редактировать товар по ID
app.put("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        products[index] = { ...products[index], ...req.body };
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар обновлён", product: products[index] });
    } catch (error) {
        res.status(500).json({ error: "Ошибка обновления товара" });
    }
});

// Удалить товар по ID
app.delete("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
        products = products.filter(p => p.id !== id);

        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар удалён" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка удаления товара" });
    }
});







app.use((req, res) => {
    res.status(404).send("Страница не найдена");
});


// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public_admin/index.html"));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

