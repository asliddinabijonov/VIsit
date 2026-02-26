import CardItem from "./CardItem.jsx";

export default function CardList({ items, category, imagesMap }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <CardItem key={item.id} item={item} category={category} imagesMap={imagesMap} />
      ))}
    </div>
  );
}
