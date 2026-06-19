import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel"
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App() {

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to='/signup' />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to='/' /> : <Signup />} />
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to='/' />}></Route>
      </Routes>
    </>
  );
}

export default App;