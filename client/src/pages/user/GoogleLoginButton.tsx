import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
import baseAPI from "../../utils/api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../utils/store/globalStore";
import { Profile } from "../../types/User";

function GoogleLoginButton({ message }, { message: string }) {
  const navigate = useNavigate();

  const [currentUser, setUser] = useStore((state) => [
    state.currentUser,
    state.setUser,
  ]);

  const notify = (username: string, type: string) => {
    if (type === "Success") {
      toast.success(`Welcome ${username}!`);
    } else {
      toast.error("An error occured logging in. Please try again later");
    }
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
      <div>
        <GoogleLogin
          text={message}
          onSuccess={(credentialResponse) => {
            handleIdpEvent(credentialResponse);
          }}
        />
      </div>
    </>
  );
}
export default GoogleLoginButton;
