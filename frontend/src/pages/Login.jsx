import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../authSlice';
import { useEffect } from 'react';

// Schema Validation by using zod
const signupSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "password is to weak")
})

function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data))
  }

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-200 shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-2">
            Login
          </h1>

          <p className="text-center text-base-content/70 mb-6">
            Start solving coding problems today
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
            >
              Login
            </button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <span className="link link-primary cursor-pointer">
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;