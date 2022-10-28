function TagItem({ tag }) {
  return (
    <p className="inline-block bg-gray-400  px-2 py-[2px] rounded text-white m-[2px] text-sm hover:cursor-pointer hover:bg-gray-600 hover:duration-500">
      {tag}
    </p>
  );
}
export default TagItem;
