import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../utils/store/globalStore";
import baseAPI from "../../utils/api/api";
import { APIError } from "../../types/Error";
import { RegisterUser, UserSignInSuccess } from "../../types/User";
import Error from "../../components/helper/Error";
import { toast } from "react-hot-toast";
function Register() {
  const navigate = useNavigate();
  const [currentUser, setUser] = useStore((state) => [
    state.currentUser,
    state.setUser,
  ]);

  const notify = (username: string) =>
    toast.success(`Welcome to Conduit, ${username}!`);

  const { mutate, isLoading, isSuccess, isError, error } = useMutation(
    ["register"],
    baseAPI.signUpUser,
    {
      onSuccess: (data: UserSignInSuccess) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
        notify(data.user.username);
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUser>();

  const onSubmit: SubmitHandler<RegisterUser> = (data, e) => {
    console.log(data);
    reset();
    mutate(data);
  };

  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
      <h1 className="text-center font-tilly text-3xl p-2 text-neutral-700 font-medium xl:mt-24 md:mt-14 mt-0">
        Sign Up
      </h1>
      <div className="flex justify-center">
        <Link to="/login">
          <p className="text-center text-green-500 hover:underline duration-500 cursor-pointer w-max">
            Already have an account?
          </p>
        </Link>
      </div>
      <div className="text-center">
        {isLoading && <p>Signing you in...</p>}
        {isError && <Error error={error as AxiosError<APIError>} />}
      </div>
      <div className="mx-auto xl:w-3/4 md:w-full w-full p-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group  mb-4">
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: true })}
              className="border-2 rounded p-2 w-[100%] mx-auto mb-1"
            />
            {errors.username && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
          <div className="form-group  mb-4">
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              className="border-2 rounded p-2 w-[100%] mx-auto mb-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="border-2 rounded p-2 w-[100%] mx-auto mb-1"
            />
            {errors.password && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", { required: true })}
              className="border-2 rounded p-2 w-[100%] mx-auto mb-1"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-2 bg-[#5CB85C] text-white font-bold rounded"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
