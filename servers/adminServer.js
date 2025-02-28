const express = require("express");
const path = require("path");

const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");

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

// Добавить товар
app.post("/api/products", (req, res) => {
    try {
        const newProducts = req.body;
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));


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



const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yaml"));
console.log("Swagger YAML загружен:", swaggerDocument);







// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public_admin/index.html"));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Документация доступна на http://localhost:${PORT}/api-docs`);
});

