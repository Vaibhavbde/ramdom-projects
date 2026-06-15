import React, { FC } from "react";
import { NavLink } from "react-router-dom";
const Footer: FC = () => {
  return (
    <div>
      <section id="contact" className="subscription">
        <div className="container">
          <div className="subscribe-title text-center">
            <h2>Want to explore and enjoy top movies and TV shows?</h2>
            <p>
              Kastore gives you access to a vast collection of the latest movies
              and TV shows. Discover, stream, and enjoy entertainment tailored
              just for you.
            </p>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="subscription-input-group">
                <form action="/Sign_in">
                  <input
                    type="email"
                    className="subscription-input-form"
                    placeholder="Enter your email here"
                  />
                  <button className="appsLand-btn subscribe-btn">
                    create account
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-menu">
            <div className="row">
              <div className="col-sm-3">
                <div className="navbar-header">
                  <a className="navbar-brand" href="index.html">
                    <img
                      className="kalogos"
                      src="/assets/img/KaStore-removebg-preview.png"
                      title="s"
                    />
                  </a>
                </div>
              </div>
              <div className="col-sm-9">
                <ul className="footer-menu-item">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/movies"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Movies
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tvshows"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      TV Shows
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/favorites"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Favorites
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hm-footer-copyright">
            <div className="row">
              <div className="col-sm-5">
                <p>
                  &copy;copyright. designed and developed by{" "}
                  <a href="https://github.com/KhataiAlizade" target="_blank">
                    Khatai Alizade
                  </a>
                </p>
              </div>
              <div className="col-sm-7">
                <div className="footer-social">
                  <span>
                    <i className="fa fa-phone"> +48 (505) 311 907</i>
                  </span>
                  <a
                    title="#"
                    href="https://www.facebook.com/profile.php?id=100010698766233"
                    target="_blank"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a
                    title="#"
                    href="https://www.linkedin.com/in/khatai-alizade-857235242/"
                    target="_blank"
                  >
                    <i className="fa fa-linkedin"></i>
                  </a>
                  <a
                    title="#"
                    href="https://github.com/KhataiAlizade"
                    target="_blank"
                  >
                    <i className="fa fa-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
