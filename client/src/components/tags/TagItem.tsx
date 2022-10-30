import TagContext from "../store/context";
import { useContext } from "react";
interface tagProp {
  tag: string;
}

function TagItem({ tag }: tagProp) {
  const tagContext = useContext(TagContext);
  const handleClick = (tag: string) => {
    tagContext.tag = tag;
    console.log(tagContext.tag);
  };

  return (
    <p
      className="inline-block bg-[#818a91]  px-2 py-[2px] rounded text-white m-[2px] text-sm hover:cursor-pointer hover:bg-gray-600 hover:duration-500 "
      onClick={() => handleClick(tag)}
    >
      {tag}
    </p>
  );
}
export default TagItem;
