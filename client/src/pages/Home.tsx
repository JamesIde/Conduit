import Tags from "../components/tags/Tags";
import Articles from "../components/articles/Articles";
import {
  usePaginationStore,
  useStore,
  useTagStore,
} from "../utils/store/globalStore";
import { useEffect, useReducer } from "react";

import articleReducer from "../utils/context/articleReducer";
import { Filters } from "../utils/context/articleReducer";
function Home() {
  // GLOBAL STATE
  const page = usePaginationStore((state) => state.page);
  const currentUser = useStore((state) => state.currentUser);
  const [filterTag, clearTag] = useTagStore((state) => [
    state.filterTag,
    state.clearTag,
  ]);
  // Requires page which must be loaded in this component
  const filterState: Filters = {
    tag: "",
    feed: false,
    author: "",
    page: page,
    favourited: false,
    isProfile: false,
    userFeed: false,
    globalFeed: true,
    isFilterTag: false,
  };

  const [state, dispatch] = useReducer(articleReducer, filterState);

  useEffect(() => {
    dispatch({ type: "GLOBAL_FEED", pageNum: page });
    if (filterTag) {
      dispatch({ type: "FILTER_TAG", tag: filterTag });
    }
  }, [filterTag, page]);

  // TOGGLE FEED HANDLERS
  const handleGlobalFeedClick = () => {
    dispatch({ type: "GLOBAL_FEED" });
    clearTag();
  };

  const handleUserFeedClick = () => {
    dispatch({ type: "USER_FEED" });
    clearTag();
  };

  return (
    <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto pt-1">
      <div className="xl:mt-12 md:mt-10 border-b-[1px] xl:w-[70%] md:w-[70%] w-full">
        <div className="flex flex-row">
          <button
            className="p-2 hover:text-gray-500 text-[#aaa]"
            onClick={handleGlobalFeedClick}
            style={{
              borderBottom: state.globalFeed ? "1px solid green" : "white",
              color: state.globalFeed ? "green" : "black",
            }}
          >
            Global Feed
          </button>
          {currentUser ? (
            <button
              className="p-2 text-[#aaa] hover:text-gray-500"
              onClick={handleUserFeedClick}
              style={{
                borderBottom: state.userFeed ? "1px solid green" : "white",
                color: state.userFeed ? "green" : "black",
              }}
            >
              Your Feed
            </button>
          ) : null}
          {filterTag ? (
            <>
              <button
                className="p-2 text-[#aaa] hover:text-gray-500"
                style={{
                  borderBottom: "1px solid green",
                  color: "green",
                }}
              >
                #{filterTag}
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex xl:flex-row md:flex-row flex-col-reverse p-2">
        <Articles filters={state} />
        <Tags />
      </div>
    </div>
  );
}

export default Home;
