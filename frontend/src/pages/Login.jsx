import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Code2,
  Sparkles
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Login() {
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-background text-white flex">

      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-zinc-800">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed30,transparent_60%)]" />

        <div className="relative z-10 flex flex-col justify-center px-20">

          <Link
            to="/"
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Code2 size={24} />
            </div>

            <span className="text-3xl font-bold font-heading">
              CodeForge
            </span>
          </Link>

          <h1 className="text-6xl font-bold leading-tight">
            Build your
            <br />
            problem solving
            <br />
            skills.
          </h1>

          <p className="mt-8 text-zinc-400 text-lg max-w-xl leading-8">
            Practice algorithms, write better code,
            and improve your programming skills with
            an AI-powered coding platform.
          </p>

          <div className="mt-14 space-y-5">

            <div className="flex items-center gap-4 text-zinc-300">
              <Sparkles
                size={18}
                className="text-primary"
              />
              AI Coding Assistant
            </div>

            <div className="flex items-center gap-4 text-zinc-300">
              <Sparkles
                size={18}
                className="text-primary"
              />
              Online Judge System
            </div>

            <div className="flex items-center gap-4 text-zinc-300">
              <Sparkles
                size={18}
                className="text-primary"
              />
              Submission Tracking
            </div>

          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center p-8">

        <div
          className="w-full max-w-md rounded-4xl border border-zinc-800 bg-card p-10 shadow-2xl "
        >
          <div className="text-center">

            <h1 className="text-4xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-3 text-zinc-400">
              Sign in to continue solving problems.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 space-y-6"
          >
            {/* Email */}

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Email
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full h-13 rounded-2xl bg-zinc-900 border px-5 outline-none transition
                  ${
                    errors.email
                      ? "border-red-500"
                      : "border-zinc-800 focus:border-primary"
                  }
                `}
              />

              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Password
              </label>

              <div className="relative">

                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full h-13 rounded-2xl bg-zinc-900 border px-5 pr-14 outline-none transition
                    ${
                      errors.password
                        ? "border-red-500"
                        : "border-zinc-800 focus:border-primary"
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 "
                >
                  {showPass ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}

            <button
              type="submit"
              className="w-full h-13 rounded-2xl bg-primary font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 "
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center text-zinc-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-medium "
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;