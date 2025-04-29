export default function PersonalInfoDocumentForm() {
  return (
    <div className="w-full h-full overflow-y-auto border border-[#D9D9D9] p-2 bg-white">
      <p className="text-[1.2rem] font-semibold text-[#343434]">개인정보 수집 및 이용 동의</p>
      <p className="mt-2 px-2 text-sm leading-relaxed text-gray-800">
        애플하이랜드(이하 `회사`라고 합니다)는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을
        준수하며 귀하의 개인정보보호에 최선을 다하고 있습니다. 회사는 개인정보보호법에 근거하여
        다음과 같은 내용으로 개인정보를 수집 및 처리하고자 합니다.
      </p>
      <p className="mt-2 px-2 text-sm leading-relaxed text-gray-800">
        다음의 내용을 자세히 읽어보시고 모든 내용을 이해하신 후에 동의 여부를 결정해주시기 바랍니다.
      </p>

      <p className="mt-2 px-2 font-semibold text-[#343434]">제1조(회원 가입을 위한 정보)</p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.
      </p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        [필수 수집 정보]: 이메일, 비밀번호, 닉네임 및 휴대폰 번호
      </p>

      <p className="mt-2 px-2 font-semibold text-[#343434]">제2조(본인 인증을 위한 정보)</p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.
      </p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        [필수 수집 정보]: 휴대폰 번호 및 이메일 주소
      </p>

      <p className="mt-2 px-2 font-semibold text-[#343434]">제3조(회사 서비스 제공을 위한 정보)</p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        회사는 이용자에게 회사의 서비스를 제공하기 위하여 다음과 같은 정보를 수집합니다.
      </p>
      <p className="mt-2 px-2 text-sm text-gray-800">[필수 수집 정보]: 이메일 주소 및 연락처</p>

      <p className="mt-2 px-2 font-semibold text-[#343434]">제4조(개인정보 보유 및 이용 기간)</p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        1. 수집한 개인정보는 수집, 이용 동의일로부터 보관 및 이용합니다.
      </p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        2. 개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이
        해당 개인정보를 파기합니다.
      </p>

      <p className="mt-2 px-2 font-semibold text-[#343434]">제5조(동의 거부 관리)</p>
      <p className="mt-2 px-2 text-sm text-gray-800">
        귀하는 본 안내에 따른 개인정보 수집, 이용에 대하여 동의를 거부할 권리가 있습니다. 다만,
        귀하가 개인정보 동의를 거부하시는 경우에 서비스 이용제한의 불이익이 발생할 수 있음을
        알려드립니다.
      </p>

      <p className="mt-8 px-2 text-sm text-gray-800">
        본인은 위의 동의서 내용을 충분히 숙지하였으며, 위와 같이 개인정보를 수집,이용하는데
        동의합니다.
      </p>
    </div>
  )
}
