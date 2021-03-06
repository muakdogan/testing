import React from "react";
import logo from "../images/logo.png";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link className="navbar-brand-right nounderline pr-3 " to="#">
          <img src={logo} alt={"logo"} width="25px" />
          ePAD
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse pl-0" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/display">
                Display
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/anotate">
                Anotate
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/progress">
                Progress
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tools">
                Tools
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/edit">
                Edit
              </NavLink>
            </li>{" "}
          </ul>
          <ul className="navbar-nav ml-auto">
            {!user && (
              <li className="nav-item pull-right">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            )}
            {user && (
              <React.Fragment>
                <li className="nav-item pull-right">
                  <NavLink className="nav-link" to="/profile">
                    {user.displayname}
                  </NavLink>
                </li>
                <li className="nav-item-right pull-right">
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
