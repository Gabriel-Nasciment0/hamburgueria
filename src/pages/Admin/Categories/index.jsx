import { useEffect, useState } from "react"
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} from "../../../services/api"

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        image: "",
    })
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        async function loadCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        loadCategories()
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editingId) {
            const updatedCategory = await updateCategory(editingId, formData)

            setCategories((prev) =>
                prev.map((category) =>
                    category.id === editingId ? updatedCategory : category,
                ),
            )

            setEditingId(null)
        } else {
            const newCategory = await createCategory(formData)

            setCategories((prev) => [...prev, newCategory])
        }

        setFormData({
            name: "",
            image: "",
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleEdit = (category) => {
        setEditingId(category.id)

        setFormData({
            name: category.name,
            image: category.image,
        })
    }

    const handleDelete = async (id) => {
        await deleteCategory(id)

        setCategories((prev) => prev.filter((category) => category.id !== id))
    }
    return (
        <div>
            <h1>Categorias</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome da categoria"
                    value={formData.name}
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

                <button type="submit">
                    {editingId ? "Salvar Alterações" : "Adicionar Categoria"}
                </button>
            </form>
            {categories.map((category) => (
                <div key={category.id}>
                    <img
                        src={category.image}
                        alt={category.name}
                        width="150"
                    />

                    <h3>{category.name}</h3>
                    <button onClick={() => handleEdit(category)}>Editar</button>
                    <button onClick={() => handleDelete(category.id)}>
                        Excluir
                    </button>
                </div>
            ))}
        </div>
    )
}
