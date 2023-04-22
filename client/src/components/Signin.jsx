import React, { useState, useContext } from "react";
import "../App.css";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {} from "../../public/images"

function Signin() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = () => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error(" Please enter valid email address", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    fetch("http://localhost:3001/signin", {
      crossDomain: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          console.log(data.error);
          return;
        } else {
          localStorage.setItem("jwt", data[0].token);
          localStorage.setItem("user", JSON.stringify(data[0].user));
          dispatch({ type: "USER", payload: data[0].user });
          toast.success(" Signed in successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          navigate("/");
          
        }
      });
  };

  return (
    <>
      <div className="container">
        <form className="shadow-lg mt-5 form">
        
          <img
            src="https://res.cloudinary.com/omen-india/image/upload/v1681987408/flg_logo3219_inaxnr.png"
            alt="logo"
            width="200px"
            height="150px"  
          />
          <h2>Sociofy</h2>
          <div className="mb-3 pt-2">
            <label ass="form-label" className="form-label">
              Email address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control borderBottom"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label ass="from-label" className="form-label">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control borderBottom"
              id="exampleInputPassword1"
            />
          </div>
          <button
            onClick={signin}
            type="button"
            className="btn btn-outline-primary mt-5 p-2"
          >
            Login
          </button>
          <h6 className="mt-5">
            <Link to="/signup">Don't have an account?</Link>
          </h6>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default Signin;
