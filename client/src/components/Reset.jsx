import React, { useState, useContext } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Reset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

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

    fetch("http://localhost:3001/resetpass", {
      crossDomain: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
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
         
          toast.success(" Check your mail", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          navigate("/signin");
        }
      });
  };

  return (
    <>
      <div className="container">
        <form className="shadow-lg mt-5 form">
          <h2>Sociofy</h2>
          <div className="mb-3 pt-5">
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
          <button
            onClick={signin}
            type="button"
            className="btn btn-outline-primary mt-5 p-2"
          >
            Reset password
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default Reset;
