import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App() {

  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;