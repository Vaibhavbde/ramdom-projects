import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="text-teal-600">
            <Link to="/" className="flex items-center">
              <img
                src="https://plus.unsplash.com/premium_photo-1709470017351-19aafda9bcea?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="mr-3 h-12 rounded-xl"
                alt="Logo"
              />
              <span className="text-2xl font-bold text-white">MoviesHub</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4 lg:mt-0">
            <div>
              <p className="font-medium text-white">Company</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-white">Services</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    to="/movies"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Movies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tvshows"
                    className="text-gray-300 transition hover:text-white"
                  >
                    TV Shows
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Top 100 Movies
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Subscription
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-white">Support</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-white">Legal</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="sm:flex sm:justify-between">
            <p className="text-xs text-gray-400">
              &copy; 2024 Your Brand. All rights reserved.
            </p>

            <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
              <li>
                <Link
                  to="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-6 sm:justify-end">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Facebook"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Twitter"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>

          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Instagram"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.753 13.663 3.753 12.366c0-1.297.49-2.448 1.368-3.328.878-.88 2.031-1.368 3.328-1.368 1.297 0 2.448.488 3.328 1.368.88.88 1.368 2.031 1.368 3.328 0 1.297-.488 2.448-1.368 3.325-.88.807-2.031 1.297-3.328 1.297z" />
            </svg>
          </a>

          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="LinkedIn"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
