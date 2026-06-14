import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { registerUser } from '../authSlice';
import { useEffect, useState } from 'react';

// Schema Validation by using zod
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "password is to weak")
});

function Signup() {

  const [showPass, SetShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-200 shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-2">
            Create Account
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
                <span className="label-text">First Name</span>
              </label>

              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className='relative'>
                <input
                  {...register("password")}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full ${errors?.password ? 'input-error' : ''}`}
                />
                <button
                  type='button'
                  className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-400'
                  onClick={() => SetShowPass(!showPass)}
                  aria-label={showPass ? 'hide password' : 'show password'}
                >
                  {showPass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.477 10.489A3 3 0 0012 15a3 3 0 002.511-1.523M6.228 6.228A9.956 9.956 0 002.25 12c1.39 4.17 5.326 7.5 9.75 7.5a9.96 9.96 0 005.772-1.728M9.88 4.68A9.953 9.953 0 0112 4.5c4.424 0 8.36 3.33 9.75 7.5a9.953 9.953 0 01-1.72 3.22"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
            >
              Sign Up
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link className="link link-primary cursor-pointer"
                to='/login'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;