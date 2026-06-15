// Import React and useState hook - useState allows us to manage component state
import React, { useState } from "react";
// Import all the child components we'll use in this App
import Logo from "./Logo";
import Form from "./Form";
import PackingList from "./PackingList";
import Stats from "./Stats";

/* Example of initial items (commented out - you can uncomment to test with sample data):
const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: true },
  { id: 3, description: "Charger", quantity: 12, packed: false },
]; */

// Main App component - this is the root component that manages all the application state
export default function App() {
  // State to store the list of items
  // items: array of objects, each with id, description, quantity, and packed status
  // setItems: function to update the items array
  // useState([]) initializes with an empty array
  const [items, setItems] = useState([]);

  // Function to add a new item to the list
  // Called when user submits the form
  function handleAddItems(item) {
    // Use the spread operator (...) to create a new array with all existing items
    // plus the new item. This is important because React needs a new array reference
    // to detect the change and re-render the component
    setItems((items) => [...items, item]);
  }

  // Function to delete a single item from the list
  // id: the unique identifier of the item to delete
  function handleDeleteItem(id) {
    // Use filter() to create a new array with all items EXCEPT the one with matching id
    // filter() keeps items where item.id !== id (not equal)
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Function to toggle the packed status of an item (checked/unchecked)
  // id: the unique identifier of the item to toggle
  function handleToggleItem(id) {
    setItems((items) =>
      // Use map() to create a new array where we update the matching item
      items.map((item) =>
        // If this item's id matches, toggle its packed status
        // Otherwise, return the item unchanged
        // The spread operator (...item) copies all properties, then we override packed
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // Function to delete all items from the list
  function handleDeleteList() {
    // Show a confirmation dialog to prevent accidental deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    // Only clear the list if user confirmed (clicked OK)
    if (confirmed) setItems([]);
  }

  // Render the app UI
  return (
    <div className="app">
      {/* Display the logo component */}
      <Logo />
      {/* Form component - allows user to add new items
          onAddItems prop passes the handleAddItems function to the Form */}
      <Form onAddItems={handleAddItems} />
      {/* PackingList component - displays all items and allows sorting/deleting
          Pass multiple props: items array and handler functions */}
      <PackingList
        items={items}
        onDeleteItems={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onDeleteList={handleDeleteList}
      />
      {/* Stats component - shows packing progress statistics
          Pass the items array so it can calculate stats */}
      <Stats items={items} />
    </div>
  );
}
