// Import React (needed for JSX)
import React from "react";

// Item component - displays a single packing list item
// Props:
//   item: object containing id, description, quantity, and packed status
//   onDeleteItems: function to delete this item (passed from parent)
//   onToggleItem: function to toggle packed status (passed from parent)
export default function Item({ item, onDeleteItems, onToggleItem }) {
  return (
    <li>
      {/* Checkbox to mark item as packed/unpacked */}
      <input
        type="checkbox"
        checked={item.packed} // checked prop controls if checkbox is checked
        onChange={() => onToggleItem(item.id)}
        // When checkbox is clicked, call onToggleItem with this item's id
      />

      {/* Display item quantity and description */}
      {/* If item is packed, add strikethrough style */}
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {/* Show quantity and description, e.g., "2 Passports" */}
        {item.quantity} {item.description}
      </span>

      {/* Delete button - removes this item from the list */}
      <button onClick={() => onDeleteItems(item.id)}>⚔️</button>
      {/* When clicked, call onDeleteItems with this item's id */}
    </li>
  );
}
