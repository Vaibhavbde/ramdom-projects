import CategoryRow from "../CategoryRow.jsx"

export default function Hookah() {
    const items = [
        { id: 80, img: "rowImages/first.avif", title: "prod 1", desc: "1 unit (32 pieces)", price: 50 },
        { id: 81, img: "rowImages/second.avif", title: "prod 2", desc: "1 pack (32+32 pieces)", price: 50 },
        { id: 82, img: "rowImages/third.avif", title: "prod 3", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 83, img: "rowImages/fourth.avif", title: "prod 4", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 84, img: "rowImages/fifth.avif", title: "prod 5", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 85, img: "rowImages/sixth.avif", title: "prod 6", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 86, img: "rowImages/seventh.avif", title: "prod 7", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 87, img: "rowImages/eighth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 88, img: "rowImages/ninth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 89, img: "rowImages/tenth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 90, img: "rowImages/eleventh.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 91, img: "rowImages/tweleveth.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 92, img: "rowImages/thirteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 93, img: "rowImages/fourteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 94, img: "rowImages/fifteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
        { id: 95, img: "rowImages/sixteen.avif", title: "Classic Filter Tips & Rolling Paper (King Size) - RAW", desc: "1 pack (32+32 pieces)", price: 150 },
      ];
      

    return (
        <div className="p-6">
            <CategoryRow category="hookah" items={items} />
        </div>
    )
}
