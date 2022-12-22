import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Profile, LoginUser } from "../../types/User";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { APIError } from "../../types/Error";
import { useStore } from "../../utils/store/globalStore";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Error from "../../components/helper/Error";
import baseAPI from "../../utils/api/api";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";

function Login() {
  const navigate = useNavigate();
  const [currentUser, setUser] = useStore((state) => [
    state.currentUser,
    state.setUser,
  ]);

  const notify = (username: string, type: string) => {
    if (type === "Success") {
      toast.success(`Welcome back ${username}!`);
    } else {
      toast.error("An error occured logging in. Please try again later");
    }
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    ["signin"],
    baseAPI.signInUser,
    {
      onSuccess: (data: Profile) => {
        reset();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
        notify(data.data.username, "Success");
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
    mutate(data);
  };

  const handleIdpEvent = async (response: CredentialResponse) => {
    const token = {
      token: response.credential,
    };
    await baseAPI
      .IdpAuthenticate(token)
      .then((res: Profile) => {
        setUser(res);
        notify(res.data.username, "Success");
        localStorage.setItem("user", JSON.stringify(res));
        navigate("/");
      })
      .catch((err) => {
        let error = err as AxiosError<APIError>;
        notify(error.response?.data?.message, "Error");
      });
  };

  return (
    <>
      <div className="xl:w-2/5 md:w-3/5 w-full mx-auto p-3">
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
            <div className="flex justify-between">
              <GoogleLoginButton message={"signin_with"} />

              <button
                type="submit"
                className="p-2 bg-[#5CB85C] hover:bg-[#1e6d1e] duration-500 text-white font-bold rounded"
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
