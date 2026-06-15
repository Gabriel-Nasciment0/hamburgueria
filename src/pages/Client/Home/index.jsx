import { CartContext } from "../../../contexts/CartContext.js"
import { useEffect, useState, useContext } from "react"
import { getProducts } from "../../../services/api.js"
import ProductCard from "../../../components/ProductCard/index.jsx"
import "./styles.css"

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}
function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState("")

    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const { addToCart } = useContext(CartContext)

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    const categories = [
        "Todos",
        ...new Set(products.map((product) => product.category)),
    ]

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory

        const matchesSearch = normalizeText(product.name).includes(
            normalizeText(search),
        )

        return matchesCategory && matchesSearch
    })

    if (loading) {
        return (
            <div className="state-message">
                <h2>Carregando produtos...</h2>
            </div>
        )
    }

    if (error) {
        return (
            <div className="state-message">
                <h2>Erro ao carregar produtos.</h2>
            </div>
        )
    }

    return (
        <div className="home-container">
            <h1>Produtos</h1>
            <div className="filters">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar produto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <h2>Categorias</h2>
                <div className="category">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={
                                selectedCategory === category ? "active" : ""
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP._I8w8NZABcrN1lmGf2gNlQHaHa%3Fpid%3DApi&f=1&ipt=02eaf23d36bffc12d4fd7d601dbaee6aaee7d7a904eb6465cd60d814bfc9b209&ipo=images"
                                alt={category}
                            />
                            <p>{category}</p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="state-message">
                        <h2>Nenhum produto encontrado.</h2>
                    </div>
                ) : (
                    filteredProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onAdd={() => addToCart(p)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Home
