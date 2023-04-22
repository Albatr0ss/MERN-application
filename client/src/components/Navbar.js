import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import "../App.css";

function Navbar() {
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [search, setSearch] = useState("");
  const [userDetails, setDetails] = useState([]);

  const navigate = useNavigate();
  const renderList = () => {
    if (user) {
      return (
        <>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <Link
              className="nav-link "
              to="/subpost"
              style={{ color: "rgb(105 107 158)" }}
            >
              Explore
            </Link>
          </li>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <Link
              className="nav-link "
              to="/create"
              style={{ color: "rgb(105 107 158)" }}
            >
              Create
            </Link>
          </li>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <Link
              className="nav-link "
              to="/profile"
              style={{ color: "rgb(105 107 158)" }}
            >
              Profile
            </Link>
          </li>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <button
              type="button"
              className="btn btn-outline-secondary me-2 mb-2 mb-lg-0"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </li>

          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <button
              className=" btn-sm btn-outline-secondary "
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                navigate("/signin");
              }}
            >
              Logout
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <Link
              className="nav-link "
              to="/signin"
              style={{ color: "rgb(105 107 158)" }}
            >
              Sign in
            </Link>
          </li>
          <li className="nav-item ps-0 ps-lg-2 ms-0 ms-lg-2">
            <Link
              className="nav-link "
              to="/signup"
              style={{ color: "rgb(105 107 158)" }}
            >
              Sign up
            </Link>
          </li>
        </>
      );
    }
  };

  const searchUser = (query) => {
    setSearch(query);
    fetch("http://localhost:3001/searchuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        setDetails(result.user);
      });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to={user ? "/" : "/signin"}>
            <img
              src="https://res.cloudinary.com/omen-india/image/upload/v1681987408/flg_logo3216_t9ic4k.png"
              width="150px"
              height="100px"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-center align-items-center">
              {renderList()}
            </ul>
          </div>
        </div>

  {/* search user */}
        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                
                <input
                  onChange={(e) => searchUser(e.target.value)}
                  type="text"
                  value={search}
                  className="form-control borderBottom"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Search users"
                />
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {userDetails.map((item) => {
                    return (
                      <Link
                        to={
                          item._id === state.id
                            ? "/profile"
                            : "/profile/" + item._id
                        }
                        onClick={() => setSearch()}
                        style={{
                          textDecoration: "none"
                        }}
                      >
                        <li className="list-group-item" key={item._id}>
                          {item.name}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => setSearch('')}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
