// Import useState to manage sorting state
import { useState } from "react";
// Import Item component to display each individual item
import Item from "./Item";

// PackingList component - displays all items and provides sorting/clearing options
// Props:
//   items: array of item objects (defaults to empty array if not provided)
//   onDeleteItems: function to delete a single item
//   onToggleItem: function to toggle an item's packed status
//   onDeleteList: function to clear all items
export default function PackingList({
  items = [],
  onDeleteItems,
  onToggleItem,
  onDeleteList,
}) {
  // State to track how items should be sorted
  // "input" = original order, "description" = alphabetical, "packed" = by packed status
  const [sortBy, setSortBy] = useState("input");

  // Variable to hold the sorted array of items
  let sortedItems;

  // Determine how to sort items based on sortBy state
  if (sortBy === "input") {
    // Keep items in the order they were added (no sorting)
    sortedItems = items;
  } else if (sortBy === "description") {
    // Sort alphabetically by description
    sortedItems = items
      .slice() // Create a copy of the array (don't modify original)
      .sort((a, b) => a.description.localeCompare(b.description));
    // localeCompare() compares strings alphabetically
  } else if (sortBy === "packed") {
    // Sort by packed status (unpacked items first, then packed items)
    sortedItems = items
      .slice() // Create a copy of the array
      .sort((a, b) => Number(a.packed) - Number(b.packed));
    // Convert boolean to number: false=0, true=1
    // So unpacked (0) comes before packed (1)
  }

  return (
    <div className="list">
      {/* Unordered list to display all items */}
      <ul>
        {/* Map through sortedItems array and render an Item component for each */}
        {sortedItems.map((item) => (
          <Item
            item={item} // Pass the item object
            onDeleteItems={onDeleteItems} // Pass delete function
            onToggleItem={onToggleItem} // Pass toggle function
            key={item.id} // Unique key required by React for list items
          />
        ))}
      </ul>

      {/* Controls for sorting and clearing the list */}
      <div className="actions">
        {/* Dropdown to select sorting method */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>

        {/* Button to clear all items from the list */}
        <button onClick={onDeleteList}>Clear list</button>
      </div>
    </div>
  );
}
