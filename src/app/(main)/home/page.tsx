import Image from 'next/image'

export default async function Home() {
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <div className="flex flex-col justify-center items-center w-full min-h-[700px] bg-[url('/assets/images/common/background01.svg')] bg-no-repeat bg-cover">
        <Image src="/assets/images/home/apple_logo.svg" alt="logo" width="270" height="200" />
        <Image src="/assets/images/home/home_text.svg" alt="logo" width="620" height="45" />
        <p className="mt-4">
          남다른 재배 방법을 이용한 사과 생산으로 최소한의 방제도 건강한 사과 생산을 하기 위해
          노력합니다.
        </p>
      </div>
      <div className="flex flex-col w-full px-4 md:px-24 lg:px-40 py-20">
        <div className="relative flex w-full items-center flex-wrap gap-16 justify-center md:justify-start">
          <div className="absolute left-40 top-14 w-[450px] h-[330px] bg-transparent border-2 border-[#ECD5C8] rounded-lg"></div>
          <Image
            src="/assets/images/home/introduce01.jpg"
            alt="introduce01"
            width="450"
            height="330"
            className="rounded-lg z-20"
          />
          <div className="flex flex-col w-4/5 md:w-2/5 bg-transparent items-center md:items-start z-20">
            <p className="text-2xl">언제나 소비자에게</p>
            <p className="text-2xl">정직함을 약속합니다.</p>
            <p className=" mt-4">
              강원도 양구 펀치볼 650고지 청정지역에서 잔류 농약 걱정 없이 껍질째 먹을 수 있는 건강한
              안심 먹거리를 생각하기 위해 노력하는 착한 농부가 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full px-4 md:px-24 lg:px-40 py-20">
        <div className="relative flex w-full items-center flex-wrap gap-16 justify-center md:justify-end">
          <div className="flex flex-col items-center md:items-end w-4/5 md-2/5 bg-transparent z-20">
            <p className="text-2xl">건강하고 안전한 사과</p>
            <p className="text-2xl">생산에 노력합니다.</p>
            <p className=" mt-4">건강한 사과만을 위해 강원도 양구 펀치볼로 이주했습니다.</p>
            <p className="">병충해와 기후온난화에 보다 안전한 지역인 펀치볼은</p>
            <p className="">안전한 사과 생산에 최적지입니다.</p>
          </div>
          <div className="absolute right-40 top-14 w-[450px] h-[330px] bg-[rgba(236,213,200,0.3)] rounded-lg"></div>
          <Image
            src="/assets/images/home/introduce02.png"
            alt="introduce02"
            width="450"
            height="330"
            className="rounded-lg z-20"
          />
        </div>
      </div>
      <div className="flex flex-col w-full items-center py-20 px-4 md:px-24 lg:px-40 gap-24">
        <div className="flex flex-col items-center w-4/5 md:w-1/2 lg:w-2/5 bg-transparent border-t-2 border-borderLayout border-b-2 px-5 py-12">
          <p className="text-xl font-semibold">애플 하이랜드의</p>
          <p className="text-xl font-semibold">사과와 사과즙을 소개합니다.</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center flex-wrap gap-24 py-12 px-4 md:px-24 lg:px-40">
        <div>상품설명</div>
      </div>
      <div className="flex w-full items-center justify-center flex-wrap gap-24 py-12 px-4 md:px-24 lg:px-40">
        <Image
          src="/assets/images/home/introduce03.svg"
          alt="introduce03"
          width="450"
          height="330"
          className="rounded-lg z-20"
        />
        <Image
          src="/assets/images/home/introduce04.svg"
          alt="introduce04"
          width="450"
          height="330"
          className="rounded-lg z-20"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center w-full min-h-[700px] bg-[url('/assets/images/common/background01.svg')] bg-no-repeat bg-cover gap-5">
        <div className="w-4/5 md:w-2/5 h-60 flex flex-col items-center px-5 py-8">
          <div className="flex w-full h-12 justify-center items-center border-borderLayout border-t border-b">
            <p className="text-lg">고객센터 안내</p>
          </div>
          <p className="text-2xl mt-8">010 - 3522 - 6848</p>
          <p className="mt-2">평일 오전 9시 - 오후 6시</p>
          <p className="mt-2">주말 오전 9시 - 오후 6시</p>
        </div>
        <div className="w-4/5 md:w-2/5 h-60 flex flex-col items-center px-5 py-8">
          <div className="flex w-full h-12 justify-center items-center border-borderLayout border-t border-b">
            <p className="text-lg">계좌</p>
          </div>
          <p className="text-2xl mt-8">농협 352-1748-2227-33</p>
          <p className="mt-4">박현수</p>
        </div>
        <div className="w-4/5 md:w-2/5 h-60 flex flex-col items-center px-5 py-8">
          <div className="flex w-full h-12 justify-center items-center border-borderLayout border-t border-b">
            <p className="text-lg">주소</p>
          </div>
          <p className="mt-4">강원도 양구군 해안면</p>
          <p className="mt-4">만대리 2397</p>
        </div>
      </div>
    </div>
  )
}
