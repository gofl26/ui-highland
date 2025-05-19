export default async function OrderList() {
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">주문 / 배송 관리</p>
      <div className="w-full mt-20">
        <div className="flex w-full items-center gap-4">
          <p>나의 주문현황</p>
          <div className="flex flex-1 h-1 border-b" />
        </div>
        <div className="flex flex-col w-full items-center mt-6">
          <div className="flex justify-center gap-8">
            <div className="flex border rounded-lg py-4 px-2">
              <div className="flex flex-col items-center min-w-24 px-2 border-r">
                <p>주문완료</p>
                <p>0건</p>
              </div>
              <div className="flex flex-col items-center min-w-24 px-2 border-r">
                <p>출고대기</p>
                <p>0건</p>
              </div>
              <div className="flex flex-col items-center min-w-24 px-2 border-r">
                <p>배송중</p>
                <p>0건</p>
              </div>
              <div className="flex flex-col items-center min-w-24 px-2">
                <p>배송완료</p>
                <p>0건</p>
              </div>
            </div>
            <div className="flex border rounded-lg py-4 px-2">
              <div className="flex flex-col items-center min-w-24 px-2 border-r">
                <p>취소</p>
                <p>0건</p>
              </div>
              <div className="flex flex-col items-center min-w-24 px-2">
                <p>교환/반품</p>
                <p>0건</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex flex-col min-w-96 border rounded-lg p-4 gap-4">
              <p className="flex justify-center pb-1 border-b">문의</p>
              <div className="flex justify-between px-4">
                <p>답변대기</p>
                <p>0건</p>
              </div>
              <div className="flex justify-between px-4">
                <p>답변완료</p>
                <p>0건</p>
              </div>
            </div>
            <div className="flex flex-col min-w-96 border rounded-lg p-4 gap-4">
              <p className="flex justify-center pb-1 border-b">후기</p>
              <div className="flex justify-between px-4">
                <p>작성가능</p>
                <p>0건</p>
              </div>
              <div className="flex justify-between px-4">
                <p>작성완료</p>
                <p>0건</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
