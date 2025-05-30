import Image from 'next/image'

export default async function Introduce() {
  return (
    <div className="relative flex w-full flex-col items-center text-textDefault">
      <div
        className="absolute top-0 flex h-[1000px] w-full flex-col items-center bg-[url('/assets/images/introduce/apple_story_bg.svg')] bg-cover bg-center bg-no-repeat"
        style={{
          WebkitMaskImage: `
      linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%),
      linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%),
      linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%)
    `,
          WebkitMaskComposite: 'intersect',
          maskImage: `
      linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%),
      linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%),
      linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%)
    `,
          maskComposite: 'intersect',
        }}
      />
      <div className="flex h-auto w-full flex-col items-center justify-center md:h-[1000px]">
        <p className="md:text-lg">부지런한 농부가 있는</p>
        <Image
          src="/assets/images/introduce/apple_story_text.svg"
          alt="Apple story text"
          width={350}
          height={38}
          style={{ marginTop: '1rem' }}
        />
        <div className="md:3/5 flex w-4/5 flex-col items-center gap-4 md:flex-row md:justify-center md:gap-12">
          <Image
            src="/assets/images/introduce/apple_story01.jpg"
            alt="Apple story01"
            width={430}
            height={570}
            style={{
              marginTop: '3.5rem',
              borderRadius: '10px',
            }}
          />
          <div className="flex w-full flex-col items-center justify-end md:w-2/5 md:items-start">
            <p className="text-xl font-medium md:text-2xl">최고의 사과농원을 위해</p>
            <p className="mt-4">
              최고의 사과! 안전한 사과! 품질 좋은 사과를 생산하기 위해 경북 영천에서 강원도 양구
              펀치볼로 이주해 사과농원을 만들었습니다.
            </p>
            <p className="mt-4">
              오직 사과만을 생각하며, 사과가 잘 자랄 수 있도록 늘 헌신하고, 노력합니다
            </p>
            <Image
              src="/assets/images/introduce/apple_story02.jpg"
              alt="Apple story02"
              width={530}
              height={300}
              style={{
                marginTop: '3.5rem',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex min-h-[200px] w-full flex-col items-center justify-center bg-[url('/assets/images/common/background01.svg')] bg-cover bg-no-repeat">
        <p className="mt-4 text-2xl">언제나 발전하는 애플 하이랜드가 되겠습니다.</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Image src="/assets/images/introduce/gap_img.svg" alt="Gap img" width={38} height={38} />
          GAP 인증을 받은 애플 하이랜드 입니다.
        </div>
      </div>
      <div className="flex h-[700px] w-full flex-col items-center justify-center gap-8 py-8">
        <div className="flex h-36 w-3/5 items-center gap-16 md:h-72">
          <div className="aspect-square w-[280px] overflow-hidden rounded-full">
            <Image
              src="/assets/images/introduce/apple_story03.jpg"
              alt="Apple story03"
              width={280}
              height={280}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="flex h-[28px] w-[53px] items-center justify-center rounded-[3px] bg-[#856655] px-[10px] py-[5px] text-[14px] font-normal text-white">
              2022
            </span>
            <p className="mt-4 text-[18px] font-medium md:text-[24px]">양구군 우수사과 품평회</p>
            <div className="flex items-center justify-between gap-6">
              <p className="text-[14px] font-normal md:text-[18px]">부사 품종 부문</p>
              <p className="text-[32px] font-semibold text-[#30180B]">장려상</p>
            </div>
          </div>
        </div>
        <div className="flex h-36 w-3/5 items-center justify-end gap-16 md:h-72">
          <div className="flex flex-col justify-center">
            <span className="flex h-[28px] w-[53px] items-center justify-center rounded-[3px] bg-[#856655] px-[10px] py-[5px] text-[14px] font-normal text-white">
              2023
            </span>

            <p className="mt-4 text-[18px] font-medium text-[#3D1D00] md:text-[24px]">
              양구군 우수사과 품평회
            </p>

            <div className="flex items-center justify-between gap-6">
              <p className="text-[14px] font-normal text-[#3D1D00] md:text-[18px]">
                부사 품종 부문
              </p>
              <p className="text-[32px] font-semibold text-[#30180B]">대상</p>
            </div>
          </div>
          <div className="aspect-square w-[280px] overflow-hidden rounded-full">
            <Image
              src="/assets/images/introduce/apple_story04.jpg"
              alt="Apple story04"
              width={280}
              height={280}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex h-[800px] w-full flex-col items-center px-16 py-12 md:h-[700px]">
        <Image
          src="/assets/images/introduce/apple_story_text02.svg"
          alt="Apple story text02"
          width={460}
          height={130}
        />

        <p className="mt-4 text-[18px]">
          애플 하이랜드를 믿어주시는 고객님께 늘 좋은 품질로 보답 드리겠습니다.
        </p>

        <div className="relative mt-4 flex h-[800px] w-full flex-col items-center justify-center gap-8 px-16 md:h-[500px] md:flex-row">
          <Image
            src="/assets/images/introduce/apple_story07.svg"
            alt="Apple story7"
            width={400}
            height={350}
          />
          <Image
            src="/assets/images/introduce/apple_story08.svg"
            alt="Apple story8"
            width={400}
            height={350}
          />
        </div>
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
