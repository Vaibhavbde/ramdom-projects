// Import React (needed for JSX)
import React from "react";

// Stats component - displays packing progress statistics
// Props:
//   items: array of item objects to calculate statistics from
export default function Stats({ items }) {
  // Early return: if there are no items, show a message encouraging user to add items
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list</em>
      </p>
    );

  // Calculate statistics from the items array
  const numItems = items.length; // Total number of items
  const numPacked = items.filter((item) => item.packed).length;
  // filter() creates a new array with only items where packed is true
  // .length gives us the count of packed items

  // Calculate percentage of items that are packed
  // Math.round() rounds to nearest whole number
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {/* Conditional rendering: show different message based on completion */}
        {percentage === 100
          ? // If 100% packed, show success message
            "You got everything! Ready to go"
          : // Otherwise, show progress with counts and percentage
            `You have ${numItems} item on your list, and you have already packed ${numPacked}
        (${percentage}%)`}
      </em>
    </footer>
  );
}
