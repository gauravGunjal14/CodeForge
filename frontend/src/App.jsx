import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import CreateProblem from "./pages/CreateProblem";
import ProblemList from "./components/ProblemList";
import UpdateProblem from "./pages/UpdateProblem";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from './components/Loader';
import LandingPage from "./pages/LandingPage";
function App() {

  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <Loader
        text="Checking authentication..."
        fullScreen
      />
    );
  }

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/problems"
          element={
            isAuthenticated
              ? <HomePage />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/problems" />
              : <Login />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/problems" />
              : <Signup />
          }
        />

        <Route
          path="/problem/:problemId"
          element={
            isAuthenticated
              ? <ProblemPage />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/admin"
          element={
            isAuthenticated &&
              user?.role === "admin"
              ? <AdminPanel />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/create"
          element={
            isAuthenticated &&
              user?.role === "admin"
              ? <CreateProblem />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/problems"
          element={
            isAuthenticated &&
              user?.role === "admin"
              ? <ProblemList />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/update/:problemId"
          element={
            isAuthenticated &&
              user?.role === "admin"
              ? <UpdateProblem />
              : <Navigate to="/" />
          }
        />

        {/* <Route
          path="/admin/delete"
          element={
            <ProblemList
            />
          }
        /> */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </>
  );
}

export default App;