import React, { useEffect, useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState(undefined);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (url) {
      Signup();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ig-clone");
    data.append("cloud_name", "omen-india");

    fetch("https://api.cloudinary.com/v1_1/omen-india/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Signup = () => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
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
          } else {
            toast.success(" Signed Up successfully!", {
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
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      Signup();
    }
  };

  return (
    <div>
      <div className="container">
        <form className="shadow-lg mt-5 form">
        <img
            src="https://res.cloudinary.com/omen-india/image/upload/v1681987408/flg_logo3219_inaxnr.png"
            alt="logo"
            width="150px"
            height="100px"  
          />
          <h2>Sociofy</h2>
          <div className="mb-3 pt-2">
            <label ass="from-label" className="form-label">
              Username
            </label>
            <input
              vlaue={name}
              onChange={(e) => setname(e.target.value)}
              type="text"
              className="form-control borderBottom"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
            />
          </div>
          <div className="mb-3">
            <label ass="from-label" className="form-label">
              Email address
            </label>
            <input
              vlaue={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control borderBottom"
              id="exampleInputEmail2"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label ass="from-label" className="form-label">
              Password
            </label>
            <input
              vlaue={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control borderBottom"
              id="exampleInputPassword3"
            />
          </div>
          <div className="mb-3 ps-5">
            <label className="form-label mb-3 ps-5">Upload profile</label>
            <input
              className="form-control w-75 ps-5"
              type="file"
              id="formFileMultiple"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <button
            onClick={() => PostData()}
            type="button"
            className="btn btn-outline-primary mb-3 mt-3 p-2"
          >
            Sign in
          </button>
          <h6>
            {" "}
            <Link to="/signin">Already have an account?</Link>
          </h6>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
