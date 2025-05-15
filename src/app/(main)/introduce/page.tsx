import Image from 'next/image'

export default async function Introduce() {
  return (
    <div className="flex flex-col w-full relative items-center text-textDefault">
      <div
        className="absolute top-0 w-full h-[1000px] bg-[url('/assets/images/introduce/apple_story_bg.svg')] bg-cover bg-center bg-no-repeat flex flex-col items-center"
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
      <div className="w-full h-auto md:h-[1000px] flex flex-col items-center justify-center">
        <p className="md:text-lg">부지런한 농부가 있는</p>
        <Image
          src="/assets/images/introduce/apple_story_text.svg"
          alt="Apple story text"
          width={350}
          height={38}
          style={{ marginTop: '1rem' }}
        />
        <div className="flex flex-col md:flex-row w-4/5 md:3/5 items-center md:justify-center gap-4 md:gap-12">
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
          <div className="flex flex-col w-full md:w-2/5 justify-end items-center md:items-start">
            <p className="text-xl md:text-2xl font-medium">최고의 사과농원을 위해</p>
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
      <div className="flex flex-col justify-center items-center w-full min-h-[200px] bg-[url('/assets/images/common/background01.svg')] bg-no-repeat bg-cover">
        <p className="mt-4 text-2xl">언제나 발전하는 애플 하이랜드가 되겠습니다.</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Image src="/assets/images/introduce/gap_img.svg" alt="Gap img" width={38} height={38} />
          GAP 인증을 받은 애플 하이랜드 입니다.
        </div>
      </div>
      <div className="flex flex-col w-full h-[700px] justify-center items-center gap-8 py-8">
        <div className="flex items-center w-3/5 gap-16 h-36 md:h-72">
          <div className="w-[280px] aspect-square overflow-hidden rounded-full">
            <Image
              src="/assets/images/introduce/apple_story03.jpg"
              alt="Apple story03"
              width={280}
              height={280}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-normal text-white bg-[#856655] px-[10px] py-[5px] rounded-[3px] w-[53px] h-[28px] flex items-center justify-center">
              2022
            </span>
            <p className="mt-4 text-[18px] md:text-[24px] font-medium">양구군 우수사과 품평회</p>
            <div className="flex items-center justify-between gap-6">
              <p className="text-[14px] md:text-[18px] font-normal">부사 품종 부문</p>
              <p className="text-[32px] font-semibold text-[#30180B]">장려상</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-3/5 gap-16 h-36 md:h-72">
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-normal text-white bg-[#856655] px-[10px] py-[5px] rounded-[3px] w-[53px] h-[28px] flex items-center justify-center">
              2023
            </span>

            <p className="mt-4 text-[18px] md:text-[24px] font-medium text-[#3D1D00]">
              양구군 우수사과 품평회
            </p>

            <div className="flex items-center justify-between gap-6">
              <p className="text-[14px] md:text-[18px] font-normal text-[#3D1D00]">
                부사 품종 부문
              </p>
              <p className="text-[32px] font-semibold text-[#30180B]">대상</p>
            </div>
          </div>
          <div className="w-[280px] aspect-square overflow-hidden rounded-full">
            <Image
              src="/assets/images/introduce/apple_story04.jpg"
              alt="Apple story04"
              width={280}
              height={280}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center py-12 px-16 h-[800px] md:h-[700px]">
        <Image
          src="/assets/images/introduce/apple_story_text02.svg"
          alt="Apple story text02"
          width={460}
          height={130}
        />

        <p className="text-[18px] mt-4">
          애플 하이랜드를 믿어주시는 고객님께 늘 좋은 품질로 보답 드리겠습니다.
        </p>

        <div className="relative w-full mt-4 flex flex-col md:flex-row items-center justify-center gap-8 px-16 h-[800px] md:h-[500px]">
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
