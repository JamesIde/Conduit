import { AxiosError } from "axios";
import { APIError } from "../../types/Error";

function Error({ error }: { error: AxiosError<APIError> }) {
  console.log("in error handler", error.response.data.message);

  return (
    <>
      <p className="text-red-500"></p>
      {error.response?.status === 413 ? (
        <>Hey! This site doesn't support images yet!</>
      ) : (
        error.response?.data.message
      )}
      <div>
        {/* {error.response.data.message?.map((msg) => {
          return <p className="text-red-500">{msg as unknown as string}</p>;
        })} */}
      </div>
    </>
  );
}

export default Error;
