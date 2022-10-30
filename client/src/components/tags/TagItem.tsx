interface tagProp {
  tag: string;
}

function TagItem({ tag }: tagProp) {
  return (
    <p className="inline-block bg-[#818a91]  px-2 py-[2px] rounded text-white m-[2px] text-sm hover:cursor-pointer hover:bg-gray-600 hover:duration-500">
      {tag}
    </p>
  );
}
export default TagItem;
