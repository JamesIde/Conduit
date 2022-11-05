import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginUser, UserSignInSuccess } from "../../types/User";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { APIError } from "../../types/Error";
import Error from "../../components/helper/Error";
import baseAPI from "../../config/api";
import { useStore } from "../../components/store/userStore";
function Login() {
  const navigate = useNavigate();
  const [currentUser, setUser] = useStore((state) => [
    state.currentUser,
    state.setUser,
  ]);

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    ["signin"],
    baseAPI.signInUser,
    {
      onSuccess: (data: UserSignInSuccess) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUser>();

  const onSubmit: SubmitHandler<LoginUser> = (data, e) => {
    reset();
    mutate(data);
  };

  return (
    <>
      <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
        <h1 className="text-center font-tilly text-3xl p-2 text-neutral-700 font-medium xl:mt-24 md:mt-14 mt-0">
          Sign in
        </h1>

        <div className="flex justify-center">
          <Link to="/register">
            <p className="text-center text-green-500 hover:underline duration-500 cursor-pointer w-max">
              Need an account?
            </p>
          </Link>
        </div>
        <div className="text-center">
          {isLoading && <p>Signing you in...</p>}
          {isError && <Error error={error as AxiosError<APIError>} />}
          {isSuccess && (
            <p className="text-green-500">Signed in, hang tight!</p>
          )}
        </div>
        <div className="mx-auto xl:w-3/4 md:w-full w-full p-2">
          <form onSubmit={handleSubmit(onSubmit)}>
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
    </>
  );
}

export default Login;

// // If error is of API error
// if (isError && error instanceof AxiosError) {
//   console.log(
//     error.response?.data.message?.map((err: { message: any }) => {
//       return err;
//     })
//   );
// }
