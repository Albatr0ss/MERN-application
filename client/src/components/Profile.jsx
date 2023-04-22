import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

function  Profile()  {
  const[myPics,setMyPics] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const[image,setImage] = useState("")
  const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user)

  useEffect(() =>{
    fetch("http://localhost:3001/mypost",{
      headers:{
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json()).then(result =>{
      // console.log(result)
      setMyPics(result.mypost)
    })
  },[])

    useEffect(() =>{
      if(image){
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
          // console.log(data)
          fetch("http://localhost:3001/updatepic",{
            method: "PUT",
            headers:{
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json()).then(result =>{
            // console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic: result.pic}))
            dispatch({type: "UPDATEPIC",payload: result.pic})
          })
        })
        .catch((err) => {
          console.log(err);
        });
      }
    },[image])

    const UpdatePic = (file) => {
      setImage(file)
    };

  return (
    <div className="container profile shadow">
      <div className="d-flex justify-content-space-around m-5 border-bottom">
        <div className="img pe-4">
          <img
            src={state? state.pic : "loading"}
            alt=""
            width="100"
            height="100"
          />
          <div className="mb-3 mt-3">
        <label className="form-label">update Profile pic</label>
        <input
          className="form-control w-50"
          type="file"
          id="formFileMultiple"
          onChange={(e) => {
            UpdatePic(e.target.files[0]);
          }}
        />
      </div>
        </div>
        <div className="body m-3">
          <h4>{user.name}</h4>
          <div className="d-flex justify-content-space-between ">
            <p className="p-2">{myPics.length} posts</p>
            <p className="p-2">{state? state.followers.length : "0"} followers</p>
            <p className="p-2">{state? state.following.length : "0"} following</p>
          </div>
        </div>
      </div>

        <div className=" conatiner gallery">
         {myPics.map((item) =>{
          return(
          <img
            key={item._id}
            className="item p-3"
            src={item.photo}
            alt={item.title}
          />
          )
        })}
         
        </div>
    </div>
  );
}

export default Profile;
