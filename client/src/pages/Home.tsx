import Tags from "../components/tags/Tags";
import Articles from "../components/articles/Articles";
import {
  usePaginationStore,
  useStore,
  useTagStore,
} from "../components/store/globalStore";
import { useState, useEffect } from "react";
import { Filters } from "../types/Article";
function Home() {
  const page = usePaginationStore((state) => state.page);
  const initialFilters: Filters = {
    tag: "",
    feed: false,
    author: "",
    page: page,
    favourited: false,
    isProfile: false,
  };
  const [filterTag, clearTag] = useTagStore((state) => [
    state.filterTag,
    state.clearTag,
  ]);

  useEffect(() => {
    setFilters({ ...initialFilters });
    if (filterTag) {
      handleFilterTag(filterTag);
    }
  }, [filterTag, page]);

  const [isGlobalFeed, setIsGlobalFeed] = useState(true);
  const [isUserFeed, setIsUserFeed] = useState(false);
  const [isFilterTag, setIsFilterTag] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  const handleGlobalFeedClick = () => {
    setIsGlobalFeed(true);
    setIsUserFeed(false);
    setIsFilterTag(false);
    setFilters({ ...initialFilters, feed: false });
    clearTag();
  };

  const handleUserFeedClick = () => {
    setIsUserFeed(true);
    setIsGlobalFeed(false);
    setIsFilterTag(false);
    setFilters({ ...initialFilters, feed: true });
    clearTag();
  };

  const handleFilterTag = (filterTag: string) => {
    setIsFilterTag(true);
    setFilters({ ...initialFilters, tag: filterTag, limit: 10 });
    setIsUserFeed(false);
    setIsGlobalFeed(false);
  };

  const currentUser = useStore((state) => state.currentUser);
  return (
    <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto pt-1">
      <div className="xl:mt-12 md:mt-10 border-b-[1px] xl:w-[70%] md:w-[70%] w-full">
        <div className="flex flex-row">
          <button
            className="p-2 hover:text-gray-500 text-[#aaa]"
            onClick={handleGlobalFeedClick}
            style={{
              borderBottom: isGlobalFeed ? "1px solid green" : "white",
              color: isGlobalFeed ? "green" : "black",
            }}
          >
            Global Feed
          </button>
          {currentUser ? (
            <button
              className="p-2 text-[#aaa] hover:text-gray-500"
              onClick={handleUserFeedClick}
              style={{
                borderBottom: isUserFeed ? "1px solid green" : "white",
                color: isUserFeed ? "green" : "black",
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
        <Articles filters={filters} />
        <Tags />
      </div>
    </div>
  );
}

export default Home;
