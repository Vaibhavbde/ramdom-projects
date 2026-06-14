# 🏪 Renting Marketplace

A modern, responsive React application for renting tools, equipment, and party supplies. Built as a beginner-friendly project for Hacktoberfest 2024.

## 📋 Features

### ✨ Core Functionality
- **Browse Listings**: View available rental items with images, descriptions, and prices
- **Search & Filter**: Search by keywords and filter by category (Tools, Equipment, Party Supplies)
- **Shopping Cart**: Add items to cart, adjust rental duration, and see total cost
- **Booking System**: Complete booking form with user details and date selection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎯 Key Highlights
- Clean, modern UI with gradient headers
- Real-time search and filtering
- Interactive cart with quantity management
- Modal-based booking and cart views
- Sample data with 6 different rental items
- Rating system for items
- Owner information display

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/React-projects-for-beginners.git
cd React-projects-for-beginners/Renting-Marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📦 Project Structure

```
Renting-Marketplace/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## 💻 Technologies Used

- **React 18.2.0** - UI library
- **React Hooks** - useState for state management
- **CSS3** - Modern styling with Flexbox and Grid
- **Placeholder Images** - via.placeholder.com for demo

## 🎨 Features Breakdown

### 1. Listing Display
- Grid layout for rental items
- Category badges
- Price per day display
- Owner and rating information
- Availability status

### 2. Search & Filter
- Real-time search across title and description
- Category filter buttons
- "All" option to view all items
- Results count display

### 3. Shopping Cart
- Add/remove items
- Adjust rental days
- Calculate total cost
- Modal overlay interface
- Subtotal per item

### 4. Booking System
- Complete booking form
- Required fields validation
- Date selection
- Additional notes field
- Booking summary display

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: > 768px (multi-column grid)
- **Tablet**: 768px (adjusted layout)
- **Mobile**: < 768px (single column, stacked buttons)

## 🔧 Customization

### Adding New Items
Edit the `initialListings` array in `App.js`:

```javascript
{
  id: 7,
  title: 'Your Item',
  category: 'Tools', // or 'Equipment', 'Party Supplies'
  price: 20,
  image: 'your-image-url',
  description: 'Your description',
  owner: 'Owner Name',
  rating: 4.5,
  available: true
}
```

### Changing Colors
Modify CSS variables in `App.css`:
- Primary color: `#667eea`
- Secondary color: `#764ba2`
- Background: `#f5f7fa`

### Adding Categories
Update the category array in the filter section:

```javascript
{['All', 'Tools', 'Equipment', 'Party Supplies', 'Your Category'].map(...)}
```

## 📸 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x400/667eea/ffffff?text=Renting+Marketplace+Homepage)

### Cart View
![Cart](https://via.placeholder.com/800x400/50C878/ffffff?text=Shopping+Cart)

### Booking Form
![Booking](https://via.placeholder.com/800x400/FF6B6B/ffffff?text=Booking+Form)

## 🎯 Learning Outcomes

This project helps beginners learn:
- **React Hooks** - useState for managing state
- **Component Structure** - Building reusable components
- **Event Handling** - User interactions and form submissions
- **Conditional Rendering** - Showing/hiding modals and elements
- **Array Methods** - filter, map, reduce
- **CSS Flexbox & Grid** - Modern layouts
- **Responsive Design** - Mobile-first approach
- **Form Handling** - User input and validation

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner (requires additional setup)

### `npm run build`
Builds the app for production to the `build` folder

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. Code is error-free
2. Project size stays under 15MB
3. Images are compressed (use placeholder images)
4. Code follows React best practices
5. README is updated if needed

## 📝 Future Enhancements

Potential features to add:
- [ ] User authentication
- [ ] Real payment integration
- [ ] Reviews and ratings system
- [ ] Image upload for listings
- [ ] Email notifications
- [ ] Calendar availability view
- [ ] Chat with owners
- [ ] Favorites/wishlist
- [ ] Order history
- [ ] Admin dashboard

## 🐛 Known Issues

None currently. Please report any bugs you find!

## 📄 License

This project is part of the React-projects-for-beginners repository and follows the MIT License.

## 👨‍💻 Author

Created for Hacktoberfest 2024 as a beginner-friendly React project.

## 🙏 Acknowledgments

- React team for the amazing library
- Hacktoberfest for promoting open source
- All contributors to this repository

## 📞 Support

If you have questions or need help:
- Open an issue in the repository
- Check existing documentation
- Reach out to the community

---

**Happy Coding! 🎉**

*Built with ❤️ for Hacktoberfest 2024*