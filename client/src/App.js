import "./App.css";
import { useEffect, useContext } from "react";
import { createContext, useReducer } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Create from "./components/Create";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import { reducer, initialState } from "./reducers/UserReducer";
import Posts from "./components/Subposts";
import Reset from "./components/Reset";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const {state, dispatch} = useContext(UserContext);
// eslint-disable-next-line
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user)
    if (user) {
      dispatch({ type: "USER", payload: user });
      // navigate("/");
    } else {
      
            // navigate("/signin");
    }
  }, []);
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing/>
          <Routes>
          
            <Route path="/signup" element={<Signup />}></Route>
            <Route excat path="/" element={<Home />}></Route>
            <Route path="/create" element={<Create />}></Route>
            <Route excat path="/profile" element={<Profile />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/profile/:userid" element={<UserProfile />}></Route>
            <Route path="/subpost" element={<Posts />}></Route>
            <Route path="/resetpass" element={<Reset />}></Route>
            
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
