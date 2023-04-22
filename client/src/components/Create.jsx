import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setbody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("http://localhost:3001/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
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
            navigate("/subpost");
            return toast.success("Posted successfully", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        });
    }
  }, [url]);

  const create = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ig-clone");
    data.append("cloud_name", "omen-india");
    console.log(image)

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

  return (
    <div className="container mt-5 shadow-lg create pt-5 w-50">
      <input
        className="w-75 m-2 border border-2"
        type="text"
        placeholder="Title to your post"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <input
        className="w-75 m-2 border border-2"
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => {
          setbody(e.target.value);
        }}
      />
      <br />
      <div className="mb-3">
        <label className="form-label mb-3">Select Your Photos</label>
        <input
          className="form-control w-75"
          type="file"
          id="formFileMultiple"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
      </div>
      <button className="btn btn-outline-primary m-3" onClick={create}>
        Create Post
      </button>
      <ToastContainer />
    </div>
  );
}

export default Create;
