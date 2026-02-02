-- ============================================
-- 유치원 구인구직 서비스 Supabase 데이터베이스
-- Authentication 미사용, 직접 인증 구현
-- ============================================

-- ============================================
-- 1. ENUMS (열거형 타입)
-- ============================================

CREATE TYPE user_type AS ENUM ('kindergarten', 'job_seeker', 'admin');
CREATE TYPE posting_status AS ENUM ('active', 'closed', 'hidden');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected', 'cancelled');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'temporary');
CREATE TYPE career_level AS ENUM ('newcomer', 'experienced', 'irrelevant');

-- ============================================
-- 2. 공통 코드 테이블
-- ============================================

-- 직종 코드
CREATE TABLE job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE job_categories IS '직종 코드 (담임교사, 부담임교사 등)';

-- 지역 코드
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE regions IS '지역 코드 (계층 구조: 시/도 > 시/군/구 > 읍/면/동)';

CREATE INDEX idx_regions_parent ON regions(parent_id);
CREATE INDEX idx_regions_level ON regions(level);

-- ============================================
-- 3. 사용자 관련 테이블
-- ============================================

-- 사용자 프로필 (Supabase Auth 미사용)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type user_type NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  signup_source VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS '사용자 기본 프로필 (직접 인증 관리)';
COMMENT ON COLUMN user_profiles.email IS '[필수] 로그인 ID (이메일)';
COMMENT ON COLUMN user_profiles.password_hash IS '[필수] 암호화된 비밀번호 (bcrypt 등)';
COMMENT ON COLUMN user_profiles.nickname IS '[필수] 닉네임';
COMMENT ON COLUMN user_profiles.signup_source IS '[선택] 가입경로 (통계용)';
COMMENT ON COLUMN user_profiles.user_type IS '[필수] 회원 유형 (kindergarten/job_seeker/admin)';

CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- 유치원 정보
CREATE TABLE kindergartens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  facility_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_full TEXT NOT NULL,
  address_sido VARCHAR(50) NOT NULL,
  address_sigungu VARCHAR(50) NOT NULL,
  address_detail TEXT,
  region_id UUID REFERENCES regions(id),
  homepage_url VARCHAR(500),
  business_email VARCHAR(255),
  profile_image_url TEXT,
  introduction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE kindergartens IS '유치원 상세 정보';
COMMENT ON COLUMN kindergartens.facility_name IS '[필수] 시설명';
COMMENT ON COLUMN kindergartens.phone IS '[필수] 시설 연락처';
COMMENT ON COLUMN kindergartens.address_full IS '[필수] 전체 주소';
COMMENT ON COLUMN kindergartens.address_sido IS '[필수] 시/도 (지역 검색용)';
COMMENT ON COLUMN kindergartens.address_sigungu IS '[필수] 시/군/구 (지역 검색용)';
COMMENT ON COLUMN kindergartens.homepage_url IS '[선택] 홈페이지';
COMMENT ON COLUMN kindergartens.business_email IS '[선택] 시설 대표 이메일';
COMMENT ON COLUMN kindergartens.profile_image_url IS '[선택] 시설 사진';

CREATE INDEX idx_kindergartens_user ON kindergartens(user_id);
CREATE INDEX idx_kindergartens_region ON kindergartens(region_id);
CREATE INDEX idx_kindergartens_sido ON kindergartens(address_sido);

-- 구직자 정보
CREATE TABLE job_seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address_full TEXT,
  address_sido VARCHAR(50),
  address_sigungu VARCHAR(50),
  address_detail TEXT,
  region_id UUID REFERENCES regions(id),
  profile_image_url TEXT,
  final_education VARCHAR(200),
  introduction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE job_seekers IS '구직자 상세 정보';
COMMENT ON COLUMN job_seekers.full_name IS '[필수] 이름';
COMMENT ON COLUMN job_seekers.phone IS '[필수] 연락처';
COMMENT ON COLUMN job_seekers.email IS '[선택] 이메일 (로그인 이메일과 다를 수 있음)';
COMMENT ON COLUMN job_seekers.address_full IS '[선택] 주소';
COMMENT ON COLUMN job_seekers.final_education IS '[선택] 최종졸업학교';
COMMENT ON COLUMN job_seekers.profile_image_url IS '[선택] 프로필 사진';

CREATE INDEX idx_job_seekers_user ON job_seekers(user_id);
CREATE INDEX idx_job_seekers_region ON job_seekers(region_id);

-- ============================================
-- 4. 학력/경력/자격증 테이블
-- ============================================

-- 학력 정보
CREATE TABLE educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  school_name VARCHAR(200) NOT NULL,
  major VARCHAR(100),
  degree_level VARCHAR(50),
  admission_date DATE,
  graduation_date DATE,
  is_graduated BOOLEAN DEFAULT false,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE educations IS '구직자 학력 정보';

CREATE INDEX idx_educations_job_seeker ON educations(job_seeker_id);

-- 경력 정보
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  job_category_id UUID REFERENCES job_categories(id),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE careers IS '구직자 경력 정보';

CREATE INDEX idx_careers_job_seeker ON careers(job_seeker_id);
CREATE INDEX idx_careers_job_category ON careers(job_category_id);

-- 자격증 정보
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  certificate_name VARCHAR(200) NOT NULL,
  issuer VARCHAR(200),
  issue_date DATE,
  certificate_number VARCHAR(100),
  description TEXT,
  attachment_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE certificates IS '구직자 자격증 정보';

CREATE INDEX idx_certificates_job_seeker ON certificates(job_seeker_id);

-- ============================================
-- 5. 구인 공고 테이블
-- ============================================

CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id UUID NOT NULL REFERENCES kindergartens(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  status posting_status DEFAULT 'active',
  facility_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address_full TEXT NOT NULL,
  address_sido VARCHAR(50),
  address_sigungu VARCHAR(50),
  region_id UUID REFERENCES regions(id),
  job_category_id UUID REFERENCES job_categories(id),
  employment_type employment_type,
  salary_type VARCHAR(50),
  salary_min NUMERIC(12, 2),
  salary_max NUMERIC(12, 2),
  salary_negotiable BOOLEAN DEFAULT false,
  career_level career_level,
  deadline_date DATE,
  commute_regions JSONB,
  content_html TEXT,
  view_count INT DEFAULT 0,
  application_count INT DEFAULT 0,
  is_recommended BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  hidden_reason TEXT,
  hidden_at TIMESTAMPTZ,
  hidden_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE job_postings IS '구인 공고';

CREATE INDEX idx_job_postings_kindergarten ON job_postings(kindergarten_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_region ON job_postings(region_id);
CREATE INDEX idx_job_postings_job_category ON job_postings(job_category_id);
CREATE INDEX idx_job_postings_deadline ON job_postings(deadline_date);
CREATE INDEX idx_job_postings_created ON job_postings(created_at DESC);

-- ============================================
-- 6. 이력서 테이블
-- ============================================

CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address_full TEXT,
  profile_image_url TEXT,
  desired_facility_type VARCHAR(100),
  desired_job_category_id UUID REFERENCES job_categories(id),
  desired_salary_min NUMERIC(12, 2),
  desired_salary_max NUMERIC(12, 2),
  desired_salary_negotiable BOOLEAN DEFAULT false,
  desired_regions JSONB,
  content_html TEXT,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE resumes IS '이력서';

CREATE INDEX idx_resumes_job_seeker ON resumes(job_seeker_id);
CREATE INDEX idx_resumes_job_category ON resumes(desired_job_category_id);
CREATE INDEX idx_resumes_is_primary ON resumes(is_primary);

-- ============================================
-- 7. 지원 관련 테이블
-- ============================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  kindergarten_id UUID NOT NULL REFERENCES kindergartens(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  snapshot_posting JSONB,
  snapshot_resume JSONB,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),
  review_note TEXT,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_posting_id, resume_id)
);

COMMENT ON TABLE applications IS '지원 내역';

CREATE INDEX idx_applications_job_posting ON applications(job_posting_id);
CREATE INDEX idx_applications_resume ON applications(resume_id);
CREATE INDEX idx_applications_job_seeker ON applications(job_seeker_id);
CREATE INDEX idx_applications_kindergarten ON applications(kindergarten_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at DESC);

-- ============================================
-- 8. 첨부파일 테이블
-- ============================================

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE attachments IS '첨부파일 (공고, 이력서, 자격증 등)';

CREATE INDEX idx_attachments_user ON attachments(user_id);
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);

-- ============================================
-- 9. 회원 탈퇴 관련 테이블
-- ============================================

CREATE TABLE withdrawal_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type user_type NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE withdrawal_reasons IS '회원 탈퇴 사유 (통계/개선 목적)';

CREATE INDEX idx_withdrawal_user_type ON withdrawal_reasons(user_type);
CREATE INDEX idx_withdrawal_created ON withdrawal_reasons(created_at DESC);

-- ============================================
-- 11. 트리거 함수 (updated_at 자동 갱신)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kindergartens_updated_at BEFORE UPDATE ON kindergartens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seekers_updated_at BEFORE UPDATE ON job_seekers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_categories_updated_at BEFORE UPDATE ON job_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. 초기 데이터 - 직종 코드
-- ============================================

INSERT INTO job_categories (code, name, description, display_order) VALUES
  ('MAIN_TEACHER', '담임교사', '주 담임교사', 1),
  ('ASSISTANT_TEACHER', '부담임교사', '부 담임교사', 2),
  ('SPECIAL_TEACHER', '특수교사', '특수교육 담당', 3),
  ('ENGLISH_TEACHER', '영어교사', '영어 전담', 4),
  ('ART_TEACHER', '미술교사', '미술 전담', 5),
  ('MUSIC_TEACHER', '음악교사', '음악 전담', 6),
  ('PHYSICAL_TEACHER', '체육교사', '체육 전담', 7),
  ('NURSE', '간호사', '보건교사', 8),
  ('NUTRITION', '영양사', '급식 담당', 9),
  ('COOK', '조리사', '조리 담당', 10),
  ('ADMIN', '사무원', '행정 담당', 11),
  ('BUS_TEACHER', '차량교사', '통학버스 관리', 12),
  ('BUS_DRIVER', '운전기사', '통학버스 운전', 13);

-- ============================================
-- 13. 초기 데이터 - 전국 시/도
-- ============================================

INSERT INTO regions (code, name, level, display_order) VALUES
  ('11', '서울특별시', 1, 1),
  ('26', '부산광역시', 1, 2),
  ('27', '대구광역시', 1, 3),
  ('28', '인천광역시', 1, 4),
  ('29', '광주광역시', 1, 5),
  ('30', '대전광역시', 1, 6),
  ('31', '울산광역시', 1, 7),
  ('36', '세종특별자치시', 1, 8),
  ('41', '경기도', 1, 9),
  ('42', '강원도', 1, 10),
  ('43', '충청북도', 1, 11),
  ('44', '충청남도', 1, 12),
  ('45', '전라북도', 1, 13),
  ('46', '전라남도', 1, 14),
  ('47', '경상북도', 1, 15),
  ('48', '경상남도', 1, 16),
  ('50', '제주특별자치도', 1, 17);

-- ============================================
-- 14. 초기 데이터 - 전국 시/군/구
-- ============================================

DO $$
DECLARE
  seoul_id UUID;
  busan_id UUID;
  daegu_id UUID;
  incheon_id UUID;
  gwangju_id UUID;
  daejeon_id UUID;
  ulsan_id UUID;
  gyeonggi_id UUID;
  gangwon_id UUID;
  chungbuk_id UUID;
  chungnam_id UUID;
  jeonbuk_id UUID;
  jeonnam_id UUID;
  gyeongbuk_id UUID;
  gyeongnam_id UUID;
  jeju_id UUID;
BEGIN
  -- 각 시/도 ID 가져오기
  SELECT id INTO seoul_id FROM regions WHERE code = '11';
  SELECT id INTO busan_id FROM regions WHERE code = '26';
  SELECT id INTO daegu_id FROM regions WHERE code = '27';
  SELECT id INTO incheon_id FROM regions WHERE code = '28';
  SELECT id INTO gwangju_id FROM regions WHERE code = '29';
  SELECT id INTO daejeon_id FROM regions WHERE code = '30';
  SELECT id INTO ulsan_id FROM regions WHERE code = '31';
  SELECT id INTO gyeonggi_id FROM regions WHERE code = '41';
  SELECT id INTO gangwon_id FROM regions WHERE code = '42';
  SELECT id INTO chungbuk_id FROM regions WHERE code = '43';
  SELECT id INTO chungnam_id FROM regions WHERE code = '44';
  SELECT id INTO jeonbuk_id FROM regions WHERE code = '45';
  SELECT id INTO jeonnam_id FROM regions WHERE code = '46';
  SELECT id INTO gyeongbuk_id FROM regions WHERE code = '47';
  SELECT id INTO gyeongnam_id FROM regions WHERE code = '48';
  SELECT id INTO jeju_id FROM regions WHERE code = '50';

  -- 서울특별시 구
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (seoul_id, '11010', '종로구', 2, 1),
    (seoul_id, '11020', '중구', 2, 2),
    (seoul_id, '11030', '용산구', 2, 3),
    (seoul_id, '11040', '성동구', 2, 4),
    (seoul_id, '11050', '광진구', 2, 5),
    (seoul_id, '11060', '동대문구', 2, 6),
    (seoul_id, '11070', '중랑구', 2, 7),
    (seoul_id, '11080', '성북구', 2, 8),
    (seoul_id, '11090', '강북구', 2, 9),
    (seoul_id, '11100', '도봉구', 2, 10),
    (seoul_id, '11110', '노원구', 2, 11),
    (seoul_id, '11120', '은평구', 2, 12),
    (seoul_id, '11130', '서대문구', 2, 13),
    (seoul_id, '11140', '마포구', 2, 14),
    (seoul_id, '11150', '양천구', 2, 15),
    (seoul_id, '11160', '강서구', 2, 16),
    (seoul_id, '11170', '구로구', 2, 17),
    (seoul_id, '11180', '금천구', 2, 18),
    (seoul_id, '11190', '영등포구', 2, 19),
    (seoul_id, '11200', '동작구', 2, 20),
    (seoul_id, '11210', '관악구', 2, 21),
    (seoul_id, '11220', '서초구', 2, 22),
    (seoul_id, '11230', '강남구', 2, 23),
    (seoul_id, '11240', '송파구', 2, 24),
    (seoul_id, '11250', '강동구', 2, 25);

  -- 부산광역시 구/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (busan_id, '26010', '중구', 2, 1),
    (busan_id, '26020', '서구', 2, 2),
    (busan_id, '26030', '동구', 2, 3),
    (busan_id, '26040', '영도구', 2, 4),
    (busan_id, '26050', '부산진구', 2, 5),
    (busan_id, '26060', '동래구', 2, 6),
    (busan_id, '26070', '남구', 2, 7),
    (busan_id, '26080', '북구', 2, 8),
    (busan_id, '26090', '해운대구', 2, 9),
    (busan_id, '26100', '사하구', 2, 10),
    (busan_id, '26110', '금정구', 2, 11),
    (busan_id, '26120', '강서구', 2, 12),
    (busan_id, '26130', '연제구', 2, 13),
    (busan_id, '26140', '수영구', 2, 14),
    (busan_id, '26150', '사상구', 2, 15),
    (busan_id, '26160', '기장군', 2, 16);

  -- 대구광역시 구/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (daegu_id, '27010', '중구', 2, 1),
    (daegu_id, '27020', '동구', 2, 2),
    (daegu_id, '27030', '서구', 2, 3),
    (daegu_id, '27040', '남구', 2, 4),
    (daegu_id, '27050', '북구', 2, 5),
    (daegu_id, '27060', '수성구', 2, 6),
    (daegu_id, '27070', '달서구', 2, 7),
    (daegu_id, '27080', '달성군', 2, 8),
    (daegu_id, '27090', '군위군', 2, 9);

  -- 인천광역시 구/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (incheon_id, '28010', '중구', 2, 1),
    (incheon_id, '28020', '동구', 2, 2),
    (incheon_id, '28030', '미추홀구', 2, 3),
    (incheon_id, '28040', '연수구', 2, 4),
    (incheon_id, '28050', '남동구', 2, 5),
    (incheon_id, '28060', '부평구', 2, 6),
    (incheon_id, '28070', '계양구', 2, 7),
    (incheon_id, '28080', '서구', 2, 8),
    (incheon_id, '28090', '강화군', 2, 9),
    (incheon_id, '28100', '옹진군', 2, 10);

  -- 광주광역시 구
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (gwangju_id, '29010', '동구', 2, 1),
    (gwangju_id, '29020', '서구', 2, 2),
    (gwangju_id, '29030', '남구', 2, 3),
    (gwangju_id, '29040', '북구', 2, 4),
    (gwangju_id, '29050', '광산구', 2, 5);

  -- 대전광역시 구
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (daejeon_id, '30010', '동구', 2, 1),
    (daejeon_id, '30020', '중구', 2, 2),
    (daejeon_id, '30030', '서구', 2, 3),
    (daejeon_id, '30040', '유성구', 2, 4),
    (daejeon_id, '30050', '대덕구', 2, 5);

  -- 울산광역시 구/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (ulsan_id, '31010', '중구', 2, 1),
    (ulsan_id, '31020', '남구', 2, 2),
    (ulsan_id, '31030', '동구', 2, 3),
    (ulsan_id, '31040', '북구', 2, 4),
    (ulsan_id, '31050', '울주군', 2, 5);

  -- 경기도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (gyeonggi_id, '41010', '수원시', 2, 1),
    (gyeonggi_id, '41020', '성남시', 2, 2),
    (gyeonggi_id, '41030', '의정부시', 2, 3),
    (gyeonggi_id, '41040', '안양시', 2, 4),
    (gyeonggi_id, '41050', '부천시', 2, 5),
    (gyeonggi_id, '41060', '광명시', 2, 6),
    (gyeonggi_id, '41070', '평택시', 2, 7),
    (gyeonggi_id, '41080', '동두천시', 2, 8),
    (gyeonggi_id, '41090', '안산시', 2, 9),
    (gyeonggi_id, '41100', '고양시', 2, 10),
    (gyeonggi_id, '41110', '과천시', 2, 11),
    (gyeonggi_id, '41120', '구리시', 2, 12),
    (gyeonggi_id, '41130', '남양주시', 2, 13),
    (gyeonggi_id, '41140', '오산시', 2, 14),
    (gyeonggi_id, '41150', '시흥시', 2, 15),
    (gyeonggi_id, '41160', '군포시', 2, 16),
    (gyeonggi_id, '41170', '의왕시', 2, 17),
    (gyeonggi_id, '41180', '하남시', 2, 18),
    (gyeonggi_id, '41190', '용인시', 2, 19),
    (gyeonggi_id, '41200', '파주시', 2, 20),
    (gyeonggi_id, '41210', '이천시', 2, 21),
    (gyeonggi_id, '41220', '안성시', 2, 22),
    (gyeonggi_id, '41230', '김포시', 2, 23),
    (gyeonggi_id, '41240', '화성시', 2, 24),
    (gyeonggi_id, '41250', '광주시', 2, 25),
    (gyeonggi_id, '41260', '양주시', 2, 26),
    (gyeonggi_id, '41270', '포천시', 2, 27),
    (gyeonggi_id, '41280', '여주시', 2, 28),
    (gyeonggi_id, '41290', '연천군', 2, 29),
    (gyeonggi_id, '41300', '가평군', 2, 30),
    (gyeonggi_id, '41310', '양평군', 2, 31);

  -- 강원도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (gangwon_id, '42010', '춘천시', 2, 1),
    (gangwon_id, '42020', '원주시', 2, 2),
    (gangwon_id, '42030', '강릉시', 2, 3),
    (gangwon_id, '42040', '동해시', 2, 4),
    (gangwon_id, '42050', '태백시', 2, 5),
    (gangwon_id, '42060', '속초시', 2, 6),
    (gangwon_id, '42070', '삼척시', 2, 7),
    (gangwon_id, '42080', '홍천군', 2, 8),
    (gangwon_id, '42090', '횡성군', 2, 9),
    (gangwon_id, '42100', '영월군', 2, 10),
    (gangwon_id, '42110', '평창군', 2, 11),
    (gangwon_id, '42120', '정선군', 2, 12),
    (gangwon_id, '42130', '철원군', 2, 13),
    (gangwon_id, '42140', '화천군', 2, 14),
    (gangwon_id, '42150', '양구군', 2, 15),
    (gangwon_id, '42160', '인제군', 2, 16),
    (gangwon_id, '42170', '고성군', 2, 17),
    (gangwon_id, '42180', '양양군', 2, 18);

  -- 충청북도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (chungbuk_id, '43010', '청주시', 2, 1),
    (chungbuk_id, '43020', '충주시', 2, 2),
    (chungbuk_id, '43030', '제천시', 2, 3),
    (chungbuk_id, '43040', '보은군', 2, 4),
    (chungbuk_id, '43050', '옥천군', 2, 5),
    (chungbuk_id, '43060', '영동군', 2, 6),
    (chungbuk_id, '43070', '증평군', 2, 7),
    (chungbuk_id, '43080', '진천군', 2, 8),
    (chungbuk_id, '43090', '괴산군', 2, 9),
    (chungbuk_id, '43100', '음성군', 2, 10),
    (chungbuk_id, '43110', '단양군', 2, 11);

  -- 충청남도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (chungnam_id, '44010', '천안시', 2, 1),
    (chungnam_id, '44020', '공주시', 2, 2),
    (chungnam_id, '44030', '보령시', 2, 3),
    (chungnam_id, '44040', '아산시', 2, 4),
    (chungnam_id, '44050', '서산시', 2, 5),
    (chungnam_id, '44060', '논산시', 2, 6),
    (chungnam_id, '44070', '계룡시', 2, 7),
    (chungnam_id, '44080', '당진시', 2, 8),
    (chungnam_id, '44090', '금산군', 2, 9),
    (chungnam_id, '44100', '부여군', 2, 10),
    (chungnam_id, '44110', '서천군', 2, 11),
    (chungnam_id, '44120', '청양군', 2, 12),
    (chungnam_id, '44130', '홍성군', 2, 13),
    (chungnam_id, '44140', '예산군', 2, 14),
    (chungnam_id, '44150', '태안군', 2, 15);

  -- 전라북도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (jeonbuk_id, '45010', '전주시', 2, 1),
    (jeonbuk_id, '45020', '군산시', 2, 2),
    (jeonbuk_id, '45030', '익산시', 2, 3),
    (jeonbuk_id, '45040', '정읍시', 2, 4),
    (jeonbuk_id, '45050', '남원시', 2, 5),
    (jeonbuk_id, '45060', '김제시', 2, 6),
    (jeonbuk_id, '45070', '완주군', 2, 7),
    (jeonbuk_id, '45080', '진안군', 2, 8),
    (jeonbuk_id, '45090', '무주군', 2, 9),
    (jeonbuk_id, '45100', '장수군', 2, 10),
    (jeonbuk_id, '45110', '임실군', 2, 11),
    (jeonbuk_id, '45120', '순창군', 2, 12),
    (jeonbuk_id, '45130', '고창군', 2, 13),
    (jeonbuk_id, '45140', '부안군', 2, 14);

  -- 전라남도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (jeonnam_id, '46010', '목포시', 2, 1),
    (jeonnam_id, '46020', '여수시', 2, 2),
    (jeonnam_id, '46030', '순천시', 2, 3),
    (jeonnam_id, '46040', '나주시', 2, 4),
    (jeonnam_id, '46050', '광양시', 2, 5),
    (jeonnam_id, '46060', '담양군', 2, 6),
    (jeonnam_id, '46070', '곡성군', 2, 7),
    (jeonnam_id, '46080', '구례군', 2, 8),
    (jeonnam_id, '46090', '고흥군', 2, 9),
    (jeonnam_id, '46100', '보성군', 2, 10),
    (jeonnam_id, '46110', '화순군', 2, 11),
    (jeonnam_id, '46120', '장흥군', 2, 12),
    (jeonnam_id, '46130', '강진군', 2, 13),
    (jeonnam_id, '46140', '해남군', 2, 14),
    (jeonnam_id, '46150', '영암군', 2, 15),
    (jeonnam_id, '46160', '무안군', 2, 16),
    (jeonnam_id, '46170', '함평군', 2, 17),
    (jeonnam_id, '46180', '영광군', 2, 18),
    (jeonnam_id, '46190', '장성군', 2, 19),
    (jeonnam_id, '46200', '완도군', 2, 20),
    (jeonnam_id, '46210', '진도군', 2, 21),
    (jeonnam_id, '46220', '신안군', 2, 22);

  -- 경상북도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (gyeongbuk_id, '47010', '포항시', 2, 1),
    (gyeongbuk_id, '47020', '경주시', 2, 2),
    (gyeongbuk_id, '47030', '김천시', 2, 3),
    (gyeongbuk_id, '47040', '안동시', 2, 4),
    (gyeongbuk_id, '47050', '구미시', 2, 5),
    (gyeongbuk_id, '47060', '영주시', 2, 6),
    (gyeongbuk_id, '47070', '영천시', 2, 7),
    (gyeongbuk_id, '47080', '상주시', 2, 8),
    (gyeongbuk_id, '47090', '문경시', 2, 9),
    (gyeongbuk_id, '47100', '경산시', 2, 10),
    (gyeongbuk_id, '47110', '의성군', 2, 11),
    (gyeongbuk_id, '47120', '청송군', 2, 12),
    (gyeongbuk_id, '47130', '영양군', 2, 13),
    (gyeongbuk_id, '47140', '영덕군', 2, 14),
    (gyeongbuk_id, '47150', '청도군', 2, 15),
    (gyeongbuk_id, '47160', '고령군', 2, 16),
    (gyeongbuk_id, '47170', '성주군', 2, 17),
    (gyeongbuk_id, '47180', '칠곡군', 2, 18),
    (gyeongbuk_id, '47190', '예천군', 2, 19),
    (gyeongbuk_id, '47200', '봉화군', 2, 20),
    (gyeongbuk_id, '47210', '울진군', 2, 21),
    (gyeongbuk_id, '47220', '울릉군', 2, 22);

  -- 경상남도 시/군
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (gyeongnam_id, '48010', '창원시', 2, 1),
    (gyeongnam_id, '48020', '진주시', 2, 2),
    (gyeongnam_id, '48030', '통영시', 2, 3),
    (gyeongnam_id, '48040', '사천시', 2, 4),
    (gyeongnam_id, '48050', '김해시', 2, 5),
    (gyeongnam_id, '48060', '밀양시', 2, 6),
    (gyeongnam_id, '48070', '거제시', 2, 7),
    (gyeongnam_id, '48080', '양산시', 2, 8),
    (gyeongnam_id, '48090', '의령군', 2, 9),
    (gyeongnam_id, '48100', '함안군', 2, 10),
    (gyeongnam_id, '48110', '창녕군', 2, 11),
    (gyeongnam_id, '48120', '고성군', 2, 12),
    (gyeongnam_id, '48130', '남해군', 2, 13),
    (gyeongnam_id, '48140', '하동군', 2, 14),
    (gyeongnam_id, '48150', '산청군', 2, 15),
    (gyeongnam_id, '48160', '함양군', 2, 16),
    (gyeongnam_id, '48170', '거창군', 2, 17),
    (gyeongnam_id, '48180', '합천군', 2, 18);

  -- 제주특별자치도 시
  INSERT INTO regions (parent_id, code, name, level, display_order) VALUES
    (jeju_id, '50010', '제주시', 2, 1),
    (jeju_id, '50020', '서귀포시', 2, 2);

END $$;