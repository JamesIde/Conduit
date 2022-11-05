import { AxiosError } from "axios";
import { APIError } from "../../types/Error";

function Error({ error }: { error: AxiosError<APIError> }) {
  console.log("in error handler", error.response.data.message);

  return (
    <>
      <p className="text-red-500">{error.response?.data.message}</p>
      <div>
        {/* {error.response.data.message?.map((msg) => {
          return <p className="text-red-500">{msg as unknown as string}</p>;
        })} */}
      </div>
    </>
  );
}

export default Error;
