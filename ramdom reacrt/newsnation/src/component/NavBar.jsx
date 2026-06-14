import React, { Component } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: props.category || 'General',
      menuOpen: false,
    };
  }

  handleCategoryClick = (category) => {
    document.title = `NewsNation - ${category}`;
    this.setState({ selectedCategory: category, menuOpen: false });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ menuOpen: !prevState.menuOpen }));
  };

  render() {
    const categories = [
      'General',
      'Business',
      'Technology',
      'Entertainment',
      'Sports',
      'Science',
      'Health',
    ];

    return (
      <header className="backdrop-blur-xl bg-zinc-950/50 text-white px-4 py-4 shadow-lg sticky top-0 z-50 min-w">
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center gap-4">

          {/* Logo + Hamburger */}
          <div className="w-full flex justify-between items-center">
            <span className="text-3xl font-bold tracking-wider drop-shadow-lg">
              News<span className="text-purple-300">Nation</span>
            </span>
            <button onClick={this.toggleMenu} className="sm:hidden text-white">
              {this.state.menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Category Buttons */}
          <ul
            className={`flex-col sm:flex sm:flex-row sm:space-x-6 items-center ${
              this.state.menuOpen ? 'flex mt-4' : 'hidden'
            } sm:mt-0`}
          >
            {categories.map((item, index) => (
              <li key={index} className="my-2 sm:my-0">
                <Link
                  to={`/${item.toLowerCase()}`}
                  onClick={() => this.handleCategoryClick(item)}
                  className={`px-4 py-2 rounded-full border transition duration-300 text-sm sm:text-base
                    ${
                      this.state.selectedCategory === item
                        ? 'bg-purple-500 text-white border-purple-500 scale-105'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105'
                    }`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }
}
