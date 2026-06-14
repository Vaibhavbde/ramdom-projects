// App.js
import React, { useState } from "react";
import "./style.css";

// ✅ Import your local images
import bo from "./images/bo.jpeg";
import fish from "./images/fish.jpeg";
import idli from "./images/idli.jpeg";
import jamun from "./images/jamun.jpeg";
import moms from "./images/moms.jpeg";
import pane from "./images/pane.jpeg";
import paneerTikka from "./images/Paneer-Tikka-Pin-1.webp";
import pav from "./images/pav.jpeg";
import puri from "./images/puri.jpeg";
import ragi from "./images/ragi.jpeg";
import samosa from "./images/samosa.jpeg";


const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const [order, setOrder] = useState({
    name: "",
    email: "",
    address: "",
  });

  // ✅ Menu Items with local image references
  const menuItems = [
    {
      name: "Chicken lollipop",
      price: 180,
      category: "Non-Veg",
      description: "Say hello to your new favorite party snack: chicken lollipops!!",
      image:
        "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=1887&q=80",
    },
    {
      name: "Veg thali",
      price: 350,
      category: "Veg",
      description:
        "Where Indian food tastes better. Where diverse meets delicious.",
      image:
        "https://png.pngtree.com/background/20230611/original/pngtree-plate-full-of-vegetables-and-different-kinds-of-food-from-india-picture-image_3161481.jpg",
    },
    {
      name: "Dosa",
      price: 80,
      category: "South Indian",
      description: "Dosa is the perfect food for every mood! Dosa brings yum to your tum",
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    },
    {
      name: "Pizza",
      price: 150,
      category: "Fast Food",
      description: "A slice a day keeps the sads away",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Burger",
      price: 160,
      category: "Fast Food",
      description: "The best burgers are like life - messy and topped with bacon.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1899&q=80",
    },
    {
      name: "Biriyani",
      price: 250,
      category: "Non-Veg",
      description: "Biriyani is emotional, never underestimate the power of Biryani 😋",
      image:
        "https://img.freepik.com/free-photo/gourmet-chicken-biryani-with-steamed-basmati-rice-generated-by-ai_188544-13480.jpg?w=2000",
    },
    {
  name: "Samosa",
  price: 30,
  category: "Fast Food",
  description: "Crispy triangular pastry filled with spicy potato filling.",
  image: samosa,
},

    {
      name: "Rajma Chawal",
      price: 180,
      category: "North Indian",
      description: "Comfort food made of kidney beans and rice.",
      image:
        "https://img.freepik.com/free-psd/delicious-rajma-masala-with-rice-hearty-indian-dish_84443-47194.jpg",
    },
    {
      name: "Paneer Tikka",
      price: 180,
      category: "Veg",
      description:
        "Grilled chunks of marinated paneer with capsicum and onions.",
      image: paneerTikka,
    },
    {
      name: "Fish Fry",
      price: 220,
      category: "Non-Veg",
      description: "Crispy and spicy deep-fried fish fillets.",
      image: fish,
    },
    {
      name: "Idli Sambar",
      price: 90,
      category: "South Indian",
      description: "Steamed rice cakes served with lentil-based stew.",
      image: idli,
    },
    {
      name: "Gulab Jamun",
      price: 70,
      category: "Dessert",
      description: "Soft fried dumplings soaked in rose-flavored sugar syrup.",
      image: jamun,
    },
    {
      name: "Momos",
      price: 100,
      category: "Fast Food",
      description: "Steamed dumplings with a spicy dipping sauce.",
      image: moms,
    },
    {
      name: "Paneer Masala",
      price: 250,
      category: "North Indian",
      description: "Rich and creamy curry with soft paneer cubes.",
      image: pane,
    },
    {
      name: "Pav Bhaji",
      price: 120,
      category: "Fast Food",
      description: "A spicy blend of mashed vegetables served with buttered pav.",
      image: pav,
    },
    {
      name: "Chole Bhature",
      price: 160,
      category: "North Indian",
      description: "Spicy chickpeas with fluffy deep-fried bhature.",
      image: puri,
    },
    {
      name: "Ragi Balls",
      price: 100,
      category: "South Indian",
      description:
        "Soft and nutritious finger millet balls served with spicy sambar or curry.",
      image: ragi,
    },
    {
      name: "Chocolate Brownie",
      price: 90,
      category: "Dessert",
      description: "Moist and rich chocolate brownie topped with nuts.",
      image: bo,
    },
  ];

  // ✅ Filter logic
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ✅ Order form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = order.name.trim().toLowerCase();
    const email = order.email.trim().toLowerCase();
    const address = order.address.trim().toLowerCase();

    if (
      name === "salma" &&
      email === "salma123@gmail.com" &&
      address === "my home ladies pg"
    ) {
      alert("Your order is successful!");
    } else {
      alert("Oops! Order failed.");
    }
    setOrder({ name: "", email: "", address: "" });
  };

  return (
    <div className="container">
      {/* Header */}
      <header>
        <nav id="navbar">
          <div className="logo">
            <span>DaZzy FOod</span>
          </div>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu-section">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#order">Order</a></li>
          </ul>
        </nav>

        <div id="mobile">
          <div className="logo1"><span>DaZzy FOod</span></div>
          <button onClick={() => setMobileMenuVisible(!mobileMenuVisible)} className="menu-btn">☰</button>
          {mobileMenuVisible && (
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#menu-section">Menu</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#order">Order</a></li>
            </ul>
          )}
        </div>

        <div className="overlay">
          <section id="home">
            <h1 className="h-primary">Welcome to DaZzy FOod</h1>
            <p>
              Filling your tummy on time is what we care about.!!
              <br />Tasty, hot, and hygienic.
            </p>
          </section>
        </div>
      </header>

      {/* Menu Section */}
      <section id="menu-section">
        <div className="menu-header">
          <h1 className="menu-title">Menu</h1>
          <h3 className="menu-subtitle">Today's Special</h3>
          <div className="menu-filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Dessert">Dessert</option>
            </select>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div id="menu">
          {filteredItems.map((item, index) => (
            <div className="card" key={index}>
              <img src={item.image} alt={item.name} />
              <div className="details">
                <div className="details-sub">
                  <h5>{item.name}</h5>
                  <h5 className="price">₹{item.price}</h5>
                </div>
                <p>{item.description}</p>
                <a href="#order"><button>Order</button></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <div id="about">
        <h1 className="title">About us</h1>
        <div className="about_row">
          <div className="about_column">
            <p>
              Our mission is to help businesses succeed by providing the most impactful, creative and scalable content marketing services and technology solutions to organizations across the globe.
            </p>
            {showMore && (
              <p>
                We ensure customer satisfaction by using the best ingredients and delivering food fresh and fast with a friendly attitude. Our chefs constantly experiment with new recipes to bring you a variety of flavors.
              </p>
            )}
            <button id="btn1" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Show Less" : "Learn More"}
            </button>
          </div>
          <div className="about_column">
            <img
              src="https://t4.ftcdn.net/jpg/03/28/24/61/360_F_328246103_OPNZIajwRqkrPnbsUHqfzRwa2cpLObFd.jpg"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div id="order">
        <h1 className="title1">Order</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="inp_box"
            placeholder="Name"
            value={order.name}
            onChange={(e) => setOrder({ ...order, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="inp_box"
            placeholder="Email"
            value={order.email}
            onChange={(e) => setOrder({ ...order, email: e.target.value })}
            required
          />
          <textarea
            className="inp_box text_area"
            placeholder="Address"
            value={order.address}
            onChange={(e) => setOrder({ ...order, address: e.target.value })}
            required
          ></textarea>
          <button className="btn2" type="submit">
            Order Now
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer>
        <p>Designed by Salma Sunaina</p>
      </footer>
    </div>
  );
};

export default App;
