import { Metadata } from "../../types/Article";
import { usePaginationStore } from "../store/globalStore";
import { useQueryClient } from "@tanstack/react-query";
function Paginate({ metadata }: { metadata: Metadata }) {
  const queryClient = useQueryClient();
  const [updatePage] = usePaginationStore((state) => [state.updatePage]);
  const handleNext = (page: number) => {
    updatePage(page);
    // queryClient.invalidateQueries(["articles"]);
  };
  const handlePrevious = (page: number) => {
    updatePage(page);
    // queryClient.invalidateQueries(["articles"]);
  };
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="inline-flex mt-2 xs:mt-0">
          {metadata?.previous && (
            <button
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePrevious(metadata.previous.page)}
            >
              Prev
            </button>
          )}

          {metadata?.next && (
            <button
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handleNext(metadata.next.page)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Paginate;

{
  /* <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">1</span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            100
          </span>{" "}
          Entries
        </span> */
}
