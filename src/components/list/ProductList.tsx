export default function ProductList() {
  return (
    <div className="flex-col w-full items-center">
      <div className="flex justify-center gap-6 mt-12">
        <button className="flex justify-center bg-bgPrimary text-textPrimary w-28 rounded-full px-3 py-2">
          전체
        </button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">가정용</button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">선물용</button>
      </div>
    </div>
  )
}
