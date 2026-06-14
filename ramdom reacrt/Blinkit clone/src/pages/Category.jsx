import React from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import Card from "../landing page/Card.jsx"

export default function Category() {
  const { slug } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const items = state?.items ?? []

  console.log("Category page mounted:", { slug, itemsLength: items.length })

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{state?.category ?? decodeURIComponent(slug)}</h1>
        <button type="button" className="text-sm text-green-600" onClick={() => navigate(-1)}>Back</button>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">
          <p>DEBUG: No items were passed to this page.</p>
          <p className="mt-2">If you navigated directly, implement fetching by slug or ensure CategoryRow passes items via navigate state.</p>
        </div>
      ) : (
        // responsive grid: 1 / 2 / 3 / 4 / 5 columns depending on viewport
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, idx) => (
            <div key={item?.id ?? idx} className="w-full">
              <Card
                img={item.img}
                title={item.title}
                desc={item.desc}
                price={item.price}
                id={item.id}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}