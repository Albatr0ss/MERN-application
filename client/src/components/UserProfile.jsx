import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

function UserProfile() {
  const [userProfile, setProfile] = useState(null);
  // console.log(UserProfile)
  const { state, dispatch } = useContext(UserContext);
  // console.log(state)
  const { userid } = useParams();
  const [follow, setFollow] = useState(false);
  // console.log(userid)

  useEffect(() => {
    fetch(`http://localhost:3001/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
  }, []);

  const FollowUser = () =>{
    fetch("http://localhost:3001/follow",{
        method: "PUT",
        headers:{
            "Content-Type" : "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            followId : userid     
        })
    }).then(res => res.json()).then(data =>{
        // console.log(data)
        dispatch({type: "UPDATE",payload:{followers: data.followers, following: data.following}})
        localStorage.setItem("user",JSON.stringify(data))
        setProfile((prevState) =>{
            return{
                ...prevState,
                user: {
                  ...prevState.user,
                  followers:[ ...prevState.user.followers, data._id]
                }
            }
        })
        setFollow(!follow)
    })
  }


  const UnFollowUser = () =>{
    fetch("http://localhost:3001/unfollow",{
        method: "PUT",
        headers:{
            "Content-Type" : "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            unfollowId : userid     
        })
    }).then(res => res.json()).then(data =>{
        // console.log(data)
        dispatch({type: "UPDATE",payload:{followers: data.followers, following: data.following}})
        localStorage.setItem("user",JSON.stringify(data))
        setProfile((prevState) =>{
          const newFollower = prevState.user.followers.filter(item => item !== data._id)
            return{
                ...prevState,
                user: {
                  ...prevState.user,
                  followers:newFollower
                }
            }
        })
        setFollow(!follow)
        // setProfile(data)
    })
  }
  return (
    <>
      {userProfile ? (
        <div className="container profile">
          <div className="d-flex justify-content-space-around m-5 border-bottom">
            <div className="img">
              <img
                src={userProfile.user.pic}
                alt=""
                width="100"
                height="100"
              />
            </div>
            <div className="body m-3">
              <h4>{userProfile.user.name}</h4>
              <div className="d-flex justify-content-space-between ">
                <p className="p-2">{userProfile.posts.length} posts</p>
                <p className="p-2">{userProfile.user.followers.length} followers</p>
                <p className="p-2">{userProfile.user.following.length} following</p>
              </div>
              {!follow ? (

              <button
              className="mt-3  btn-sm btn-outline-info px-4 " 
              style={{
                marginLeft: 82
              }}
              onClick={() => FollowUser()}>Follow</button>
              ) :
              (
              <button
              className="mt-3  btn-sm btn-outline-info px-4 " 
              style={{
                marginLeft: 82,
              }}
              onClick={() => UnFollowUser()}>Unfollow</button>
              )}
            </div>
          </div>

          <div className=" conatiner gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item p-3"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only ms-5"></span>
        </div>
      )}
    </>
  );
}

export default UserProfile;
