import { useEffect, useState } from "react"
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getCategories,
} from "../../../services/api"

export default function AdminProducts() {
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        description: "",
        price: "",
        category: "",
    })
    const [editingProduct, setEditingProduct] = useState(null)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function loadData() {
            const productsData = await getProducts()
            const categoriesData = await getCategories()

            setProducts(productsData)
            setCategories(categoriesData)
        }

        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const productData = {
            ...formData,
            price: Number(formData.price),
        }

        if (editingProduct) {
            const updatedProduct = await updateProduct(
                editingProduct.id,
                productData,
            )

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === editingProduct.id ? updatedProduct : product,
                ),
            )

            setEditingProduct(null)
        } else {
            const createdProduct = await createProduct(productData)

            setProducts((prev) => [...prev, createdProduct])
        }

        setFormData({
            name: "",
            description: "",
            image: "",
            price: "",
            category: "",
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleEdit = (product) => {
        setEditingProduct(product)

        setFormData({
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            category: product.category,
        })
    }

    async function handleDelete(id) {
        await deleteProduct(id)

        setProducts((prev) => prev.filter((product) => product.id !== id))
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="image"
                    placeholder="URL da imagem"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Preço"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione</option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
                </button>
            </form>

            <h1>Gerenciar Produtos</h1>

            {products.map((product) => (
                <div key={product.id}>
                    <img
                        src={product.image}
                        alt={product.category}
                        width="150"
                    />
                    <h3>{product.name}</h3>

                    <p>R$ {product.price}</p>

                    <button onClick={() => handleEdit(product)}>Editar</button>

                    <button onClick={() => handleDelete(product.id)}>
                        Excluir
                    </button>
                </div>
            ))}
        </div>
    )
}
