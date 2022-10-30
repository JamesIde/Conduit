import Tags from "../components/tags/Tags";
import Articles from "../components/articles/Articles";
import { useStore } from "../components/store/userStore";
import { useState, useEffect, useContext } from "react";
import TagContext from "../components/store/context";
function Home() {
  const initialFilters = { tag: "", feed: false, offset: null, take: 10 };
  useEffect(() => {
    setIsGlobalFeed(true);
    setFilters({ ...initialFilters });
  }, []);

  const [isGlobalFeed, setIsGlobalFeed] = useState(false);
  const [isUserFeed, setIsUserFeed] = useState(false);
  const [filters, setFilters] = useState({
    tag: "",
    feed: false,
    offset: null,
    take: 10,
  });

  const handleGlobalFeedClick = () => {
    setIsGlobalFeed(true);
    setIsUserFeed(false);
    setFilters({ ...initialFilters });
  };

  const handleUserFeedClick = () => {
    setIsUserFeed(true);
    setIsGlobalFeed(false);
    setFilters({ ...initialFilters, feed: true });
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
          {currentUser && (
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
          )}
        </div>
      </div>
      <div className="flex xl:flex-row md:flex-row flex-col-reverse mt-0">
        <Articles filters={filters} />
        <Tags />
      </div>
    </div>
  );
}

export default Home;
