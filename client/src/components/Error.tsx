import { AxiosError } from "axios";

function Error({ error }: { error: AxiosError }) {
  return (
    <>
      <p>
        {error.response?.status} - {error.response?.statusText}
      </p>
    </>
  );
}

export default Error;
