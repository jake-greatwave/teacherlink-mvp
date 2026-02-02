import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

interface TermsModalProps {
  type: 'terms' | 'privacy'
  isOpen: boolean
  onClose: () => void
}

export const TermsModal = ({ type, isOpen, onClose }: TermsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                {type === 'terms' ? '이용약관' : '개인정보 수집 및 이용 동의'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              {type === 'terms' ? (
                <>
                  <h4 className="text-lg font-black text-gray-900 mb-3">제1조 (목적)</h4>
                  <p>
                    본 약관은 티처링크(이하 "회사")가 제공하는 유치원 및 어린이집 구인구직 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제2조 (정의)</h4>
                  <p>
                    1. "서비스"란 회사가 제공하는 유치원 및 어린이집 구인구직 플랫폼을 의미합니다.<br />
                    2. "이용자"란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.<br />
                    3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제3조 (약관의 효력 및 변경)</h4>
                  <p>
                    1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.<br />
                    2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.<br />
                    3. 회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제4조 (회원가입)</h4>
                  <p>
                    1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.<br />
                    2. 회사는 제1항과 같이 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현실적으로 불가능한 경우</li>
                  </ul>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제5조 (서비스의 제공 및 변경)</h4>
                  <p>
                    1. 회사는 다음과 같은 서비스를 제공합니다.<br />
                    - 구인구직 정보 제공 서비스<br />
                    - 채용 공고 등록 및 관리 서비스<br />
                    - 이력서 작성 및 관리 서비스<br />
                    - 기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제6조 (서비스의 중단)</h4>
                  <p>
                    1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.<br />
                    2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">제7조 (회원의 의무)</h4>
                  <p>
                    1. 회원은 다음 행위를 하여서는 안 됩니다.<br />
                    - 신청 또는 변경 시 허위내용의 등록<br />
                    - 타인의 정보 도용<br />
                    - 회사가 게시한 정보의 변경<br />
                    - 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시<br />
                    - 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해<br />
                    - 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위<br />
                    - 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-lg font-black text-gray-900 mb-3">1. 수집하는 개인정보의 항목 및 수집방법</h4>
                  <p>
                    회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br /><br />
                    <strong className="text-gray-900">가. 수집항목</strong><br />
                    - 필수항목: 이메일, 비밀번호, 닉네임, 회원유형(유치원/구직자)<br />
                    - 유치원 회원: 시설명, 전화번호, 주소, 홈페이지, 이메일<br />
                    - 구직자 회원: 이름, 전화번호, 주소, 최종졸업학교<br />
                    - 선택항목: 프로필 사진, 소개, 가입경로<br /><br />
                    <strong className="text-gray-900">나. 수집방법</strong><br />
                    - 홈페이지(회원가입, 상담게시판), 서면양식, 이메일, 전화, 팩스
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">2. 개인정보의 수집 및 이용목적</h4>
                  <p>
                    회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br /><br />
                    - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br />
                    - 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달<br />
                    - 마케팅 및 광고에 활용: 이벤트 및 광고성 정보 제공 및 참여기회 제공, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">3. 개인정보의 보유 및 이용기간</h4>
                  <p>
                    원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.<br /><br />
                    <strong className="text-gray-900">가. 회사 내부방침에 의한 정보보유 사유</strong><br />
                    - 부정이용기록: 보존 이유(부정 이용 방지), 보존 기간(1년)<br /><br />
                    <strong className="text-gray-900">나. 관련 법령에 의한 정보보유 사유</strong><br />
                    - 계약 또는 청약철회 등에 관한 기록: 보존 기간(5년)<br />
                    - 대금결제 및 재화 등의 공급에 관한 기록: 보존 기간(5년)<br />
                    - 소비자의 불만 또는 분쟁처리에 관한 기록: 보존 기간(3년)
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">4. 개인정보의 파기절차 및 방법</h4>
                  <p>
                    회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.<br /><br />
                    <strong className="text-gray-900">가. 파기절차</strong><br />
                    회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.<br /><br />
                    <strong className="text-gray-900">나. 파기방법</strong><br />
                    - 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">5. 개인정보 제공 및 공유</h4>
                  <p>
                    회사는 이용자들의 개인정보를 "2. 개인정보의 수집 및 이용목적"에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.<br />
                    - 이용자들이 사전에 동의한 경우<br />
                    - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                  </p>

                  <h4 className="text-lg font-black text-gray-900 mb-3 mt-6">6. 이용자 및 법정대리인의 권리와 그 행사방법</h4>
                  <p>
                    이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.<br />
                    이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을 위해서는 "개인정보변경"(또는 "회원정보수정" 등)을, 가입해지(동의철회)를 위해서는 "회원탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.
                  </p>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-black rounded-xl transition-all"
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
