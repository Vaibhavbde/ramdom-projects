import CategoryRow from "../CategoryRow.jsx"

export default function DairyBread() {
    const items = [
        { id: 32, img: "rowImages/first.avif", title: "prod 1", desc: "1 unit (32 pieces)", price: 50 },
        { id: 33, img: "rowImages/second.avif", title: "prod 2", desc: "1 pack (32+32 pieces)", price: 50 },
        { id: 34, img: "rowImages/third.avif", title: "prod 3", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 35, img: "rowImages/fourth.avif", title: "prod 4", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 36, img: "rowImages/fifth.avif", title: "prod 5", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 37, img: "rowImages/sixth.avif", title: "prod 6", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 38, img: "rowImages/seventh.avif", title: "prod 7", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 39, img: "rowImages/eighth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 40, img: "rowImages/ninth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 41, img: "rowImages/tenth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 42, img: "rowImages/eleventh.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 43, img: "rowImages/tweleveth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 44, img: "rowImages/thirteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 45, img: "rowImages/fourteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 46, img: "rowImages/fifteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 47, img: "rowImages/sixteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },

    ]

    return (
        <div className="p-6">
            <CategoryRow category="category 3" items={items} />
        </div>
    )
}
