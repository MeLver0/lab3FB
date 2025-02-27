async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();
    const table = document.getElementById("productsTable");
    
    table.innerHTML = products.map(p => `
        <tr class="border-b">
            <td class="p-2">${p.name}</td>
            <td class="p-2">${p.price} ₽</td>
            <td class="p-2 hidden md:table-cell">${p.categories.join(", ")}</td>
            <td class="p-2 text-center">
                <button onclick="editProduct(${p.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded mr-2">✏️</button>
                <button onclick="deleteProduct(${p.id})" class="bg-red-500 hover:bg-red-600 text-white p-1 rounded">🗑</button>
            </td>
        </tr>
    `).join("");
}

async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const categories = document.getElementById("categories").value.split(",");

    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ name, price, description, categories }])
    });

    e.target.reset();
    loadProducts();
});

// Открытие модального окна редактирования
async function editProduct(id) {
    const res = await fetch("/api/products");
    const products = await res.json();
    const product = products.find(p => p.id === id);

    document.getElementById("editId").value = product.id;
    document.getElementById("editName").value = product.name;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editDescription").value = product.description;
    document.getElementById("editCategories").value = product.categories.join(", ");

    document.getElementById("editModal").classList.remove("hidden");
}

// Закрытие модального окна
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
});

// Сохранение изменений
document.getElementById("saveEdit").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const price = document.getElementById("editPrice").value;
    const description = document.getElementById("editDescription").value;
    const categories = document.getElementById("editCategories").value.split(",");

    await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description, categories })
    });

    document.getElementById("editModal").classList.add("hidden");
    loadProducts();
});

loadProducts();
