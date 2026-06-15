import React, { useState, FC } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink } from "react-router-dom";

interface HeaderTopProps {
  isAuthenticated: boolean;
  handleLogout: (item: any) => void;
  handleDeleteAccount: (item: any) => void;
  username: string;
}

const HeaderTop: FC<HeaderTopProps> = ({
  isAuthenticated,
  handleLogout,
  handleDeleteAccount,
  username,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <section className="top-area">
        <div className="header-area">
          <nav
            className="navbar navbar-default bootsnav navbar-sticky navbar-scrollspy"
            data-minus-value-desktop="70"
            data-minus-value-mobile="55"
            data-speed="1000"
          >
            <div className="container">
              <div className="navbar-header">
                <button
                  title="b"
                  type="button"
                  className="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#navbar-menu"
                >
                  <i className="fa fa-bars"></i>
                </button>
                <a href="/">
                  <img
                    className="kalogo"
                    src="/assets/img/KaStore-removebg-preview.png"
                    title="Logo"
                  />
                </a>
              </div>

              <div
                className="collapse navbar-collapse menu-ui-design"
                id="navbar-menu"
              >
                <ul className="nav navbar-nav navbar-right">
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
 
                  {isAuthenticated ? (
                    <li>
                      <a href="/" onClick={(e) => e.preventDefault()}>
                        <IconButton
                          sx={{ padding: 0, marginTop: "-3.5px" }}
                          onClick={handleMenuOpen}
                        >
                          <AccountCircleIcon sx={{ fontSize: "31px" }} />
                        </IconButton>
                        <Menu
                          sx={{ marginTop: "5px", color: "#0D1430" }}
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          disableScrollLock={true}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          {" "}
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "bold",
                              textAlign: "center",
                              marginBottom: "5px",
                              color: "black",
                            }}
                          >
                            {username}
                          </Typography>
                          <MenuItem
                            sx={{
                              fontSize: "16px",
                              margin: "0px 10px 5px",
                              borderRadius: "5px",
                              backgroundColor: "#0D1430",
                              color: "white",
                              padding: "10px 30px",
                             
                              ":hover": {
                                backgroundColor: "#E6F1FF",
                                color: "black",
                              },
                            }}
                            onClick={handleLogout}
                          >
                            Sign Out
                          </MenuItem>
                          <MenuItem
                            sx={{
                              fontSize: "16px",
                              margin: "0px 10px",
                              borderRadius: "5px",
                              backgroundColor: "#FF0004",
                              color: "white",
                              padding: "10px 15px",
                              ":hover": {
                                backgroundColor: "#FF7077",
                                color: "black",
                              },
                            }}
                            onClick={handleDeleteAccount}
                          >
                            Delete Account
                          </MenuItem>
                        </Menu>
                      </a>
                    </li>
                  ) : (
                    <li>
                      <NavLink
                        to="/sign_in"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Sign In
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="clearfix"></div>
      </section>
    </div>
  );
};

export default HeaderTop;
