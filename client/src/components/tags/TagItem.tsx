import { usePaginationStore, useTagStore } from "../../utils/store/globalStore";

interface tagProp {
  tag: string;
}

function TagItem({ tag }: tagProp) {
  const [filterTag, updateTag] = useTagStore((state) => [
    state.filterTag,
    state.updateTag,
  ]);

  const [updatePage] = usePaginationStore((state) => [state.updatePage]);

  const onClick = (tag: string) => {
    updatePage(1);
    updateTag(tag);
  };

  return (
    <p
      onClick={() => onClick(tag)}
      className="inline-block bg-[#818a91]  px-2 py-[2px] rounded text-white m-[2px] text-sm hover:cursor-pointer hover:bg-gray-600 hover:duration-500 "
    >
      {tag}
    </p>
  );
}
export default TagItem;
