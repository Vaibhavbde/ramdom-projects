import Card from "./Card.jsx"
import { useNavigate } from "react-router-dom"

export default function CategoryRow({ category, items, onSeeAll }) {
    const navigate = useNavigate()

    const handleSeeAll = () => {
        if (typeof onSeeAll === "function") return onSeeAll(category)
        const slug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))
        // pass the items (and category) via navigation state so the Category page can render them vertically
        navigate(`/category/${slug}`, { state: { category, items } })
    }

    return (
        <div className="mb-8 mx-12">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">{category}</h2>
                <button
                    type="button"
                    aria-label={`See all ${category}`}
                    className="text-green-600 text-sm font-medium hover:underline"
                    onClick={handleSeeAll}
                >
                    see all
                </button>
            </div>

            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                {items.map((item, idx) => (
                    <Card
                        key={idx}
                        img={item.img}
                        title={item.title}
                        desc={item.desc}
                        price={item.price}
                        id = {item.id}
                    />
                ))}
            </div>
        </div>
    )
}