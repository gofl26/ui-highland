interface props {
  className: string
}

export default function OrderList({ className }: props) {
  return (
    <div className={className}>
      <div className="flex w-full items-center gap-4">
        <p>주문 목록</p>
        <div className="flex h-1 flex-1 border-b" />
      </div>
      <div className="mt-6 flex w-full flex-col items-center"></div>
    </div>
  )
}
