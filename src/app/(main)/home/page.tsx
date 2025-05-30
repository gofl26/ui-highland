import Image from 'next/image'

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center overflow-auto text-textDefault">
      <div className="flex min-h-[700px] w-full flex-col items-center justify-center bg-[url('/assets/images/common/background01.svg')] bg-cover bg-no-repeat">
        <Image src="/assets/images/home/apple_logo.svg" alt="logo" width="270" height="200" />
        <Image src="/assets/images/home/home_text.svg" alt="logo" width="620" height="45" />
        <p className="mt-4">
          남다른 재배 방법을 이용한 사과 생산으로 최소한의 방제도 건강한 사과 생산을 하기 위해
          노력합니다.
        </p>
      </div>
      <div className="flex w-full flex-col px-4 py-20 md:px-24 lg:px-40">
        <div className="relative flex w-full flex-wrap items-center justify-center gap-16 md:justify-start">
          <div className="absolute left-40 top-14 h-[330px] w-[450px] rounded-lg border-2 border-[#ECD5C8] bg-transparent"></div>
          <Image
            src="/assets/images/home/introduce01.jpg"
            alt="introduce01"
            width="450"
            height="330"
            className="z-20 rounded-lg"
          />
          <div className="z-20 flex w-4/5 flex-col items-center bg-transparent md:w-2/5 md:items-start">
            <p className="text-2xl">언제나 소비자에게</p>
            <p className="text-2xl">정직함을 약속합니다.</p>
            <p className=" mt-4">
              강원도 양구 펀치볼 650고지 청정지역에서 잔류 농약 걱정 없이 껍질째 먹을 수 있는 건강한
              안심 먹거리를 생각하기 위해 노력하는 착한 농부가 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col px-4 py-20 md:px-24 lg:px-40">
        <div className="relative flex w-full flex-wrap items-center justify-center gap-16 md:justify-end">
          <div className="md-2/5 z-20 flex w-4/5 flex-col items-center bg-transparent md:items-end">
            <p className="text-2xl">건강하고 안전한 사과</p>
            <p className="text-2xl">생산에 노력합니다.</p>
            <p className=" mt-4">건강한 사과만을 위해 강원도 양구 펀치볼로 이주했습니다.</p>
            <p className="">병충해와 기후온난화에 보다 안전한 지역인 펀치볼은</p>
            <p className="">안전한 사과 생산에 최적지입니다.</p>
          </div>
          <div className="absolute right-40 top-14 h-[330px] w-[450px] rounded-lg bg-[rgba(236,213,200,0.3)]"></div>
          <Image
            src="/assets/images/home/introduce02.png"
            alt="introduce02"
            width="450"
            height="330"
            className="z-20 rounded-lg"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-24 px-4 py-20 md:px-24 lg:px-40">
        <div className="flex w-4/5 flex-col items-center border-y-2 border-borderLayout bg-transparent px-5 py-12 md:w-1/2 lg:w-2/5">
          <p className="text-xl font-semibold">애플 하이랜드의</p>
          <p className="text-xl font-semibold">사과와 사과즙을 소개합니다.</p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-24 px-4 py-12 md:px-24 lg:px-40">
        <div>상품설명</div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-24 px-4 py-12 md:px-24 lg:px-40">
        <Image
          src="/assets/images/home/introduce03.svg"
          alt="introduce03"
          width="450"
          height="330"
          className="z-20 rounded-lg"
        />
        <Image
          src="/assets/images/home/introduce04.svg"
          alt="introduce04"
          width="450"
          height="330"
          className="z-20 rounded-lg"
        />
      </div>
      <div className="flex min-h-[700px] w-full flex-col items-center justify-center gap-5 bg-[url('/assets/images/common/background01.svg')] bg-cover bg-no-repeat md:flex-row">
        <div className="flex h-60 w-4/5 flex-col items-center px-5 py-8 md:w-2/5">
          <div className="flex h-12 w-full items-center justify-center border-y border-borderLayout">
            <p className="text-lg">고객센터 안내</p>
          </div>
          <p className="mt-8 text-2xl">010 - 3522 - 6848</p>
          <p className="mt-2">평일 오전 9시 - 오후 6시</p>
          <p className="mt-2">주말 오전 9시 - 오후 6시</p>
        </div>
        <div className="flex h-60 w-4/5 flex-col items-center px-5 py-8 md:w-2/5">
          <div className="flex h-12 w-full items-center justify-center border-y border-borderLayout">
            <p className="text-lg">계좌</p>
          </div>
          <p className="mt-8 text-2xl">농협 352-1748-2227-33</p>
          <p className="mt-4">박현수</p>
        </div>
        <div className="flex h-60 w-4/5 flex-col items-center px-5 py-8 md:w-2/5">
          <div className="flex h-12 w-full items-center justify-center border-y border-borderLayout">
            <p className="text-lg">주소</p>
          </div>
          <p className="mt-4">강원도 양구군 해안면</p>
          <p className="mt-4">만대리 2397</p>
        </div>
      </div>
    </div>
  )
}
