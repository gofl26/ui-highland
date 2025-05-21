interface props {
  className: string
}

export default function OrderList({ className }: props) {
  return (
    <div className={className}>
      <div className="flex w-full items-center gap-4">
        <p>주문 목록</p>
        <div className="flex flex-1 h-1 border-b" />
      </div>
      <div className="flex flex-col w-full items-center mt-6"></div>
    </div>
  )
}
