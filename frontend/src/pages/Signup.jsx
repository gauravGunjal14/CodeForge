import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema Validation by using zod
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "password is to weak")
})

function Signup() {
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(signupSchema) });

  const submittedData = (data) => {
    console.log(data);
  }

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
            onSubmit={handleSubmit(submittedData)}
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
                className="input input-bordered w-full"
              />
              {errors.firstName && (
                <p className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                {...register("emailId")}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
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
              Sign Up
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span className="link link-primary cursor-pointer">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;