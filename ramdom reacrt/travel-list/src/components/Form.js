// Import useState hook to manage form input state
import { useState } from "react";

// Form component - allows users to add new items to the packing list
// onAddItems: function passed from parent (App) to add new items
export default function Form({ onAddItems }) {
  // State for the item description (what the user types in the text input)
  // Starts as empty string
  const [description, setDescription] = useState("");
  // State for the quantity (number selected from dropdown)
  // Starts at 1 (first option)
  const [selectElement, setSelectElement] = useState(1);

  // Function called when form is submitted (user clicks "Add" or presses Enter)
  // e: event object containing information about the form submission
  function handleSubmit(e) {
    // Prevent default form behavior (page refresh)
    // This is important in React to handle form submission ourselves
    e.preventDefault();

    // If description is empty, don't do anything (return early)
    // This prevents adding empty items
    if (!description) return;

    // Create a new item object with all required properties
    const newItem = {
      description, // Shorthand for description: description
      quantity: selectElement, // The selected quantity from dropdown
      packed: false, // New items start as unpacked
      id: Date.now(), // Use current timestamp as unique ID
    };

    // Call the function passed from parent to add this item to the list
    onAddItems(newItem);

    // Reset form fields after adding item
    setDescription(""); // Clear the text input
    setSelectElement(1); // Reset dropdown to 1
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>

      {/* Dropdown to select quantity (1-20) */}
      <select
        value={selectElement} // Controlled component - value comes from state
        onChange={(e) => setSelectElement(Number(e.target.value))}
        // When user selects a number, update state
        // Number() converts string to number (e.target.value is always a string)
      >
        {/* Generate options 1 through 20 dynamically */}
        {/* Array.from creates an array, map creates an option for each number */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      {/* Text input for item description */}
      <input
        type="text"
        placeholder="Item..." // Hint text shown when input is empty
        value={description} // Controlled component - value comes from state
        onChange={(e) => setDescription(e.target.value)}
        // When user types, update state with the new value
        // e.target.value is what the user typed
      />

      {/* Submit button - triggers handleSubmit when clicked */}
      <button>Add</button>
    </form>
  );
}
