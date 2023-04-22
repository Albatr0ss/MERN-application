import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function Posts() {
  const [data, setData] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setData(result.posts);
        // console.log(data);
      });
  }, [data,state]);


  const LikePost = (id) => {
    fetch("http://localhost:3001/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log(response)
        const newData = data.map((item) =>{
          if(item._id === response.result._id){
            return {
              ...item,
              response
            }
          }else{
            return item
          }
        })
        setData(newData)
      });
  };

  const UnLikePost = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });

      const result = await response.json();
      const ID = result.result._id;
      // console.log(result);

      const newData = data.map((item) => {
          if(item._id === response.result._id){
            return {
              item,
              response
            }
          }else{
            return item
          }
      });
      setData(newData);
      // window.location.reload()
    } catch (err) {
      console.error(err);
    }
  };

  const makeComment = async (text, postId) => {
    try {
      const response = await fetch("http://localhost:3001/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text,
          postId,
        }),
      });

      const result = await response.json();
      console.log(result);

      const newData = data.map((item) =>
        item._id === result._id ? result : item
      );
      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (postid) => {
    try {
      const response = await fetch(`http://localhost:3001/delete/${postid}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      
    
    <div className="container mt-4 homepage">
      {state?  data.map((item) => {
            return (
              <>
                <div className="card home mt-5 shadow-lg me-3" key={item._id}>
                  <div className="d-flex justify-content-space-around m-2">
                    <Avatar
                      src={
                        state.id === item.postedBy._id
                          ? state.pic
                          : item.postedBy.pic
                      }
                      alt=""
                    />
                    <h5 className="ps-3 pt-2">
                      <Link
                        to={
                          item.postedBy._id !== state.id
                            ? "/profile/" + item.postedBy._id
                            : "/profile"
                        }
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        {item.postedBy.name}
                      </Link>

                      {item.postedBy._id === state.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash-fill"
                          viewBox="0 0 16 16"
                          onClick={() => deletePost(item._id)}
                          style={{
                            marginLeft: 300,
                          }}
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0  1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                      )}
                    </h5>
                  </div>
                  <img
                    className="card-img ps-0 ps-md-5 pt-3 pb-3"
                    src={item.photo}
                    alt=""
                  />
                  <div className="card-content p-3">
                    {item.likes.includes(state.id) ? (
                      <button
                        className="btn-sm ms-2"
                        onClick={() => {
                          UnLikePost(item._id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-hand-thumbs-down-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="btn-sm ms-2 mb-2"
                        onClick={() => {
                          LikePost(item._id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-hand-thumbs-up-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                        </svg>
                      </button>
                    )}

                    <p>{item.likes.length} likes</p>
                    <h6>
                      <strong>{item.title}</strong>
                    </h6>
                    <p> {item.body}</p>
                    {item.comments.map((record) => {
                      return (
                        <>
                          <p key={record._id}>
                            <strong>{record.postedBy.name} </strong>{" "}
                            {record.text}
                          </p>
                        </>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                        setInput("");
                      }}
                    >
                      <input
                        className="container-fluid comment mb-2"
                        type="text"
                        placeholder="add a comment"
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                      />
                    </form>
                  </div>
                </div>
              </>
            );
          }) : "Loading..."
        }
    </div>
    
    </>
  );
}

export default Posts;
