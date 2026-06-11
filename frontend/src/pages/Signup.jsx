import { useForm } from 'react-hook-form';

function Signup() {
  const { register, handleSubmit, formState: { errors },} = useForm();

  const submittedData = (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(submittedData)}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('email')} placeholder="Email" />
      <input {...register('password')} placeholder="Password" />

      <button className='btn btn-lg' type="submit">Submit</button>
    </form>
  );
}

export default Signup;