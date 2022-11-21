import { AxiosError } from "axios";
import { APIError } from "../../types/Error";

function Error({ error }: { error: AxiosError<APIError> }) {
  return (
    <>
      <div>
        <p className="text-red-500">
          {error.response?.status === 413 ? (
            <>Hey! This site doesn't support images yet!</>
          ) : (
            error.response?.data.message
          )}
        </p>
      </div>
    </>
  );
}

export default Error;
