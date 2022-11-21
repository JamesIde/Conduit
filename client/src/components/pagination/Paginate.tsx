import { Metadata } from "../../types/Article";
import { usePaginationStore } from "../store/globalStore";
function Paginate({ metadata }: { metadata: Metadata }) {
  const [updatePage] = usePaginationStore((state) => [state.updatePage]);
  const handleNext = async (page: number) => {
    updatePage(page);
  };
  const handlePrevious = async (page: number) => {
    updatePage(page);
  };
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="inline-flex mt-2 xs:mt-0">
          {metadata?.previous ? (
            <button
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePrevious(metadata.previous.page)}
            >
              Prev
            </button>
          ) : (
            <button className="py-2 px-4 text-sm font-medium text-white bg-gray-700 rounded-l hover:cursor-not-allowed">
              Prev
            </button>
          )}

          {metadata?.next ? (
            <button
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handleNext(metadata.next.page)}
            >
              Next
            </button>
          ) : (
            <>
              <button className="py-2 px-4 text-sm font-medium text-white bg-gray-700 rounded-r hover:cursor-not-allowed">
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Paginate;
