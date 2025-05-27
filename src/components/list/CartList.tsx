interface props {
  className: string
}

export default function CartList({ className }: props) {
  return (
    <div className={className}>
      <div className="flex flex-col w-full items-center"></div>
    </div>
  )
}
