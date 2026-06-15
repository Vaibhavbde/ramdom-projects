import React, { useState } from 'react';
import './App.css';

// Sample data for listings
const initialListings = [
  {
    id: 1,
    title: 'Power Drill',
    category: 'Tools',
    price: 15,
    image: 'https://via.placeholder.com/300x200/4A90E2/ffffff?text=Power+Drill',
    description: 'Professional cordless power drill for all your DIY needs',
    owner: 'John Doe',
    rating: 4.5,
    available: true
  },
  {
    id: 2,
    title: 'Lawn Mower',
    category: 'Equipment',
    price: 35,
    image: 'https://via.placeholder.com/300x200/50C878/ffffff?text=Lawn+Mower',
    description: 'Gas-powered lawn mower, perfect for medium-sized yards',
    owner: 'Jane Smith',
    rating: 4.8,
    available: true
  },
  {
    id: 3,
    title: 'Party Tent 20x20',
    category: 'Party Supplies',
    price: 75,
    image: 'https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Party+Tent',
    description: 'Large outdoor tent for parties and events, seats 50 people',
    owner: 'Mike Johnson',
    rating: 4.6,
    available: true
  },
  {
    id: 4,
    title: 'Pressure Washer',
    category: 'Equipment',
    price: 25,
    image: 'https://via.placeholder.com/300x200/FFD93D/ffffff?text=Pressure+Washer',
    description: 'High-pressure washer for cleaning driveways and decks',
    owner: 'Sarah Williams',
    rating: 4.7,
    available: false
  },
  {
    id: 5,
    title: 'Sound System',
    category: 'Party Supplies',
    price: 100,
    image: 'https://via.placeholder.com/300x200/A8E6CF/ffffff?text=Sound+System',
    description: 'Professional DJ sound system with speakers and mixer',
    owner: 'DJ Dave',
    rating: 4.9,
    available: true
  },
  {
    id: 6,
    title: 'Ladder 20ft',
    category: 'Tools',
    price: 20,
    image: 'https://via.placeholder.com/300x200/C5A3FF/ffffff?text=Ladder',
    description: 'Extension ladder, perfect for painting and repairs',
    owner: 'Bob Builder',
    rating: 4.4,
    available: true
  }
];

function App() {
  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  // Add to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      alert('This item is already in your cart!');
    } else {
      setCart([...cart, { ...item, days: 1 }]);
      alert('Item added to cart!');
    }
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Update rental days
  const updateDays = (itemId, days) => {
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, days: parseInt(days) || 1 } : item
    ));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.days), 0);
  };

  // Book item
  const openBookingForm = (item) => {
    setSelectedItem(item);
    setShowBookingForm(true);
  };

  // Handle booking submission
  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for ${selectedItem.title}! You will receive a confirmation email.`);
    setShowBookingForm(false);
    setSelectedItem(null);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>🏪 Renting Marketplace</h1>
          <p>Rent tools, equipment, and party supplies easily</p>
          <button className="cart-button" onClick={() => setShowCart(!showCart)}>
            🛒 Cart ({cart.length})
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <section className="search-section">
        <div className="container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="category-filters">
            {['All', 'Tools', 'Equipment', 'Party Supplies'].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="listings-section">
        <div className="container">
          <h2>Available Rentals ({filteredListings.length})</h2>
          <div className="listings-grid">
            {filteredListings.map(item => (
              <div key={item.id} className="listing-card">
                <img src={item.image} alt={item.title} className="listing-image" />
                <div className="listing-content">
                  <span className="category-badge">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p className="description">{item.description}</p>
                  <div className="listing-details">
                    <span className="owner">👤 {item.owner}</span>
                    <span className="rating">⭐ {item.rating}</span>
                  </div>
                  <div className="listing-footer">
                    <span className="price">${item.price}/day</span>
                    <div className="button-group">
                      <button 
                        className="btn-primary"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => openBookingForm(item)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredListings.length === 0 && (
            <div className="no-results">
              <p>No items found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛒 Your Cart</h2>
              <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.title} />
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p>${item.price}/day</p>
                        <div className="days-selector">
                          <label>Days: </label>
                          <input
                            type="number"
                            min="1"
                            value={item.days}
                            onChange={(e) => updateDays(item.id, e.target.value)}
                          />
                        </div>
                        <p className="item-total">Subtotal: ${item.price * item.days}</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="cart-total">
                    <h3>Total: ${calculateTotal()}</h3>
                    <button className="btn-checkout">Proceed to Checkout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book: {selectedItem.title}</h2>
              <button className="close-btn" onClick={() => setShowBookingForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="Enter your email" />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" required placeholder="Enter your phone number" />
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Number of Days</label>
                  <input type="number" min="1" defaultValue="1" />
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea rows="3" placeholder="Any special requirements?"></textarea>
                </div>
                <div className="booking-summary">
                  <p><strong>Item:</strong> {selectedItem.title}</p>
                  <p><strong>Price:</strong> ${selectedItem.price}/day</p>
                  <p><strong>Owner:</strong> {selectedItem.owner}</p>
                </div>
                <button type="submit" className="btn-submit">Confirm Booking</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 Renting Marketplace. Built with React for Hacktoberfest 2024</p>
          <p>A beginner-friendly project for learning React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;