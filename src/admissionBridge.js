import {
  matchPrograms,
  matchInstitutions,
  buildRoadmap,
  parseProfile,
  INSTITUTIONS,
  COUNTRY_TITLES,
  LANGUAGE_TITLES,
  STUDY_FIELD_TITLES,
  ENT_MAX_TOTAL,
  entTotal,
  toUsd,
} from './lib/admission/index';

const FIELD_MAP = {
  IT: 'it',
  Инженерия: 'engineering',
  Бизнес: 'management',
  Экономика: 'economics',
  Медицина: 'medicine',
  Право: 'law',
  Дизайн: 'design',
};

const COUNTRY_MAP = {
  Казахстан: 'KZ',
  Германия: 'DE',
  Италия: 'IT',
  Корея: 'KR',
  Турция: 'TR',
  США: 'US',
};

const LOCALIZED_COUNTRIES = {
  KZ: { KZ: 'Қазақстан', US: 'АҚШ', DE: 'Германия', IT: 'Италия', KR: 'Оңтүстік Корея', TR: 'Түркия' },
  ENG: { KZ: 'Kazakhstan', US: 'USA', DE: 'Germany', IT: 'Italy', KR: 'South Korea', TR: 'Turkey' },
  RU: { KZ: 'Казахстан', US: 'США', DE: 'Германия', IT: 'Италия', KR: 'Южная Корея', TR: 'Турция' },
};

const LOCALIZED_CITIES = {
  KZ: { 'Алматы': 'Алматы', 'Астана': 'Астана', 'Падуя': 'Падуя', 'Милан': 'Милан', 'Мюнхен': 'Мюнхен', 'Гейдельберг': 'Гейдельберг', 'Ахен': 'Ахен', 'Сеул': 'Сеул', 'Тэджон': 'Тэджон', 'Стамбул': 'Стамбул', 'Анкара': 'Анкара', 'Кембридж': 'Кембридж', 'Стэнфорд': 'Стэнфорд', 'Беркли': 'Беркли', 'Нью-Йорк': 'Нью-Йорк', 'Питтсбург': 'Питтсбург', 'Атланта': 'Атланта', 'Сиэтл': 'Сиэтл', 'Уэст-Лафайетт': 'Уэст-Лафайетт', 'Темпе': 'Темпе' },
  ENG: { 'Алматы': 'Almaty', 'Астана': 'Astana', 'Падуя': 'Padua', 'Милан': 'Milan', 'Мюнхен': 'Munich', 'Гейдельберг': 'Heidelberg', 'Ахен': 'Aachen', 'Сеул': 'Seoul', 'Тэджон': 'Daejeon', 'Стамбул': 'Istanbul', 'Анкара': 'Ankara', 'Кембридж': 'Cambridge', 'Стэнфорд': 'Stanford', 'Беркли': 'Berkeley', 'Нью-Йорк': 'New York', 'Питтсбург': 'Pittsburgh', 'Атланта': 'Atlanta', 'Сиэтл': 'Seattle', 'Уэст-Лафайетт': 'West Lafayette', 'Темпе': 'Tempe' },
  RU: { 'Алматы': 'Алматы', 'Астана': 'Астана', 'Падуя': 'Падуя', 'Милан': 'Милан', 'Мюнхен': 'Мюнхен', 'Гейдельберг': 'Гейдельберг', 'Ахен': 'Ахен', 'Сеул': 'Сеул', 'Тэджон': 'Тэджон', 'Стамбул': 'Стамбул', 'Анкара': 'Анкара', 'Кембридж': 'Кембридж', 'Стэнфорд': 'Стэнфорд', 'Беркли': 'Беркли', 'Нью-Йорк': 'Нью-Йорк', 'Питтсбург': 'Питтсбург', 'Атланта': 'Атланта', 'Сиэтл': 'Сиэтл', 'Уэст-Лафайетт': 'Уэст-Лафайетт', 'Темпе': 'Темпе' },
};

const COUNTRY_DEADLINES_BY_LANG = {
  KZ: {
    KZ: '15 шілде 2027', DE: '15 шілде 2027', TR: '30 маусым 2027', US: '1 ақпан 2027', IT: '2 ақпан 2027', KR: '15 қаңтар 2027'
  },
  ENG: {
    KZ: 'Jul 15, 2027', DE: 'Jul 15, 2027', TR: 'Jun 30, 2027', US: 'Feb 1, 2027', IT: 'Feb 2, 2027', KR: 'Jan 15, 2027'
  },
  RU: {
    KZ: '15 июля 2027', DE: '15 июля 2027', TR: '30 июня 2027', US: '1 февраля 2027', IT: '2 февраля 2027', KR: '15 января 2027'
  }
};

const COUNTRY_DEADLINES_ISO = {
  KZ: '2027-07-15', DE: '2027-07-15', TR: '2027-06-30', US: '2027-02-01', IT: '2027-02-02', KR: '2027-01-15'
};

const INSTITUTION_DEADLINES_DATA = {
  nu: { iso: '2027-03-30', KZ: '30 наурыз 2027', ENG: 'Mar 30, 2027', RU: '30 марта 2027' },
  purdue: { iso: '2026-11-01', KZ: '1 қараша 2026', ENG: 'Nov 1, 2026', RU: '1 ноября 2026' },
  yonsei: { iso: '2026-12-20', KZ: '20 желтоқсан 2026', ENG: 'Dec 20, 2026', RU: '20 декабря 2026' },
  kaist: { iso: '2027-01-15', KZ: '15 қаңтар 2027', ENG: 'Jan 15, 2027', RU: '15 января 2027' },
  asu: { iso: '2027-02-01', KZ: '1 ақпан 2027', ENG: 'Feb 1, 2027', RU: '1 февраля 2027' },
  tum: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  rwth: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  metu: { iso: '2027-06-30', KZ: '30 маусым 2027', ENG: 'Jun 30, 2027', RU: '30 июня 2027' },
  koc: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  polimi: { iso: '2027-02-02', KZ: '2 ақпан 2027', ENG: 'Feb 2, 2027', RU: '2 февраля 2027' },
  padua: { iso: '2027-02-02', KZ: '2 ақпан 2027', ENG: 'Feb 2, 2027', RU: '2 февраля 2027' },
  aitu: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  kimep: { iso: '2027-07-20', KZ: '20 шілде 2027', ENG: 'Jul 20, 2027', RU: '20 июля 2027' },
  mit: { iso: '2027-01-01', KZ: '1 қаңтар 2027', ENG: 'Jan 1, 2027', RU: '1 января 2027' },
  stanford: { iso: '2027-01-05', KZ: '5 қаңтар 2027', ENG: 'Jan 5, 2027', RU: '5 января 2027' },
  harvard: { iso: '2027-01-01', KZ: '1 қаңтар 2027', ENG: 'Jan 1, 2027', RU: '1 января 2027' },
  berkeley: { iso: '2026-11-30', KZ: '30 қараша 2026', ENG: 'Nov 30, 2026', RU: '30 ноября 2026' },
  nyu: { iso: '2027-01-05', KZ: '5 қаңтар 2027', ENG: 'Jan 5, 2027', RU: '5 января 2027' },
  gatech: { iso: '2027-01-04', KZ: '4 қаңтар 2027', ENG: 'Jan 4, 2027', RU: '4 января 2027' },
  uw: { iso: '2026-11-15', KZ: '15 қараша 2026', ENG: 'Nov 15, 2026', RU: '15 ноября 2026' },
  columbia: { iso: '2027-01-01', KZ: '1 қаңтар 2027', ENG: 'Jan 1, 2027', RU: '1 января 2027' },
  cmu: { iso: '2027-01-03', KZ: '3 қаңтар 2027', ENG: 'Jan 3, 2027', RU: '3 января 2027' },
  bocconi: { iso: '2027-01-25', KZ: '25 қаңтар 2027', ENG: 'Jan 25, 2027', RU: '25 января 2027' },
  heidelberg: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  snu: { iso: '2027-03-10', KZ: '10 наурыз 2027', ENG: 'Mar 10, 2027', RU: '10 марта 2027' },
  bilkent: { iso: '2027-07-10', KZ: '10 шілде 2027', ENG: 'Jul 10, 2027', RU: '10 июля 2027' },
  satbayev: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  kazgasa: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
  amu: { iso: '2027-07-15', KZ: '15 шілде 2027', ENG: 'Jul 15, 2027', RU: '15 июля 2027' },
};

const COUNTRY_LIVING_COSTS_BY_LANG = {
  KZ: { KZ: '$300–450/ай', DE: '€850–1 100/ай', TR: '$350–550/ай', US: '$1 000–1 400/ай', IT: '€700–950/ай', KR: '$700–1 000/ай' },
  ENG: { KZ: '$300–450/mo', DE: '€850–1,100/mo', TR: '$350–550/mo', US: '$1,000–1,400/mo', IT: '€700–950/mo', KR: '$700–1,000/mo' },
  RU: { KZ: '$300–450/мес', DE: '€850–1 100/мес', TR: '$350–550/мес', US: '$1 000–1 400/мес', IT: '€700–950/мес', KR: '$700–1 000/мес' },
};

export function formatTuitionCost(tuition, countryCode, lang = 'RU') {
  const isKz = lang === 'KZ';
  const isEng = lang === 'ENG';

  if (!tuition || typeof tuition.amount !== 'number') {
    return isKz ? 'Конкурс бойынша грант' : isEng ? 'Merit-based grant' : 'Грант по конкурсу';
  }
  if (tuition.amount === 0) {
    return isKz ? 'Тегін (грант)' : isEng ? 'Tuition-free (Grant)' : 'Бесплатно (грант)';
  }

  if (countryCode !== 'KZ') {
    if (tuition.currency === 'USD') {
      return `$${tuition.amount.toLocaleString('ru-RU')}`;
    }
    const usdVal = Math.round(toUsd(tuition));
    return `$${usdVal.toLocaleString('ru-RU')}`;
  }

  if (tuition.currency === 'USD') {
    return `$${tuition.amount.toLocaleString('ru-RU')}`;
  }
  return `${tuition.amount.toLocaleString('ru-RU')} ₸`;
}

export const INSTITUTION_RISKS_BY_LANG = {
  KZ: {
    mit: 'Өте жоғары бәсеке (қабылдау < 4%). SAT 1540+, халықаралық олимпиадалар және зерттеу жобалары қажет.',
    stanford: 'Әлемдік деңгейдегі байқау (< 4%). Мінсіз GPA, SAT 1520+, көшбасшылық тәжірибе және эссе қажет.',
    harvard: 'Селективтілік < 3.5%. Үздік академиялық профиль (SAT 1530+), ұсыныс хаттар және портфолио қажет.',
    berkeley: 'IT мен инженерияға жоғары байқау (< 8%). Халықаралық студенттер үшін оқу ақысы жоғары ($50 000+/жыл).',
    columbia: 'Төмен қабылдау пайызы (< 4%). Нью-Йорктегі өмір сүру бағасы жоғары. SAT 1510+ талап етіледі.',
    cmu: 'CMU CS мектебі әлемдегі ең мықтылардың бірі. Тереңдетілген олимпиадалық математика қажет.',
    nyu: 'Манхэттендегі жоғары оқу және тұру құны ($70k+). Шетелдіктерге қаржылық көмек шектеулі.',
    gatech: 'CS бағытына тікелей қабылдау квоталанған. SAT математикасы бойынша жоғары шек (Math 750+).',
    uw: 'Computer Science бағыты бойынша бөлек Direct to Major конкурсы жүргізіледі.',
    purdue: 'Инженерия мен CS үшін SAT 1420+ және жоғары GPA (3.8-ден жоғары) қажет.',
    asu: 'Оқу ақысы $34 000/жыл. New American University академиялық гранты тек $5–15k жабады.',
    nu: 'Жоғары тілдік талап: IELTS 7.0 (әр секциядан 6.0-ден төмен емес). Үздіктер арасында қатаң конкурс.',
    kbtu: 'IT-грантқа ҰБТ шегі жоғары (118–122 балл). Ақылы бөлім жеке қаржылық жоспарлауды талап етеді.',
    sdu: 'Орташа бәсекелестік. Ішкі гранттар SDU олимпиадасы және ҰБТ нәтижелері бойынша бөлінеді.',
    aitu: 'IT және киберқауіпсіздік мемлекеттік гранттарына жоғары конкурс. ҰБТ 110+ балл қажет.',
    iitu: 'Software Engineering бойынша тығыз конкурс. Мемлекеттік грантқа ҰБТ 108–112 балл керек.',
    kaznu: 'Ауылдық және қалалық квоталар арасында үлкен конкурс. Балдар тең болғанда «Алтын белгі» иегерлеріне басымдық беріледі.',
    satbayev: 'Бейіндік математика мен физикадан сенімді балл қажет. Жатақхана орындары конкурспен беріледі.',
    kimep: 'Стипендия болмаған жағдайда оқу толық ақылы. IELTS 6.0 немесе ішкі тест қажет.',
    narxoz: 'Грант орындары ҒЖБМ квоталарымен шектелген. ҰБТ балдары тең болғанда аттестат бағасы шешеді.',
    kaznmu: 'Биология мен химиядан жоғары ҰБТ балы (грантқа 120+), сонымен қатар психометриялық емтихан қажет.',
    mnu: 'Құқық және бизнес бойынша жоғары академиялық стандарттар. Гранттар ішкі рейтингпен үлестіріледі.',
    kazgasa: 'Қорытынды рейтингті анықтайтын екі шығармашылық емтихан (сурет және сызу) міндетті.',
    amu: 'Елордадағы шектеулі грант орындары. Психометриялық емтиханнан өту міндетті.',
    padua: 'Жоғары бәсекелестік. Veneto DSU/ESU аймақтық шәкіртақысы мен D визасына құжаттарды уақытында тапсыру маңызды.',
    polimi: 'TOL/TIL онлайн емтиханы бойынша қатаң шектік балл. ЕО-дан тыс студенттер үшін орындар шектеулі.',
    bocconi: 'Bocconi / SAT (1420+) тестіне және мотивациялық профильге жоғары талаптар.',
    tum: 'Екі кезеңді іріктеу: бейіндік эссе, математикалық тест және сұхбат. ЕО-дан тыс студенттерге семестрлік жарна бар.',
    rwth: 'Математика мен механика бойынша күшті академиялық база керек. Studienkolleg немесе 1 курс қажет.',
    heidelberg: 'Медициналық және жаратылыстану мамандықтарына үлкен байқау. Немісше C1 немесе мықты ағылшын қажет.',
    kaist: 'Әлемнің үздік 1% абитуриенттері арасында толық шәкіртақыға конкурс. Математика мен физикадан күрделі сұхбаттар.',
    snu: 'Кореяның басты университеті. Корей тілінсіз халықаралық студенттерді қабылдау пайызы өте төмен.',
    yonsei: 'UIC ағылшын тілі колледжі мықты эссе, ұсыныс хаттар және сұхбат талап етеді. Сондода тұру міндетті.',
    metu: 'SAT бойынша қабылдау (кемінде 1350+, Math 700+). Шетелдіктерге орындар қатаң квоталанған.',
    koc: 'Элиталық жеке университет. Толық грант үшін SAT 1460+ және үздік жетістіктер қажет.',
    bilkent: 'Ағылшын тіліне (IELTS 6.5) және жеңілдік алу үшін SAT нәтижелеріне жоғары талаптар.'
  },
  ENG: {
    mit: 'Extreme selectivity (< 4% acceptance). Requires SAT 1540+, international STEM Olympiad awards and research projects.',
    stanford: 'World-class competition (< 4%). Flawless GPA, SAT 1520+, distinctive leadership, and compelling essays required.',
    harvard: 'Selectivity under 3.5%. Requires stellar academic profile (SAT 1530+), top recommendation letters and unique ECs.',
    berkeley: 'Intense competition for CS & Engineering (< 8%). High non-resident tuition costs ($50,000+/year).',
    columbia: 'Sub-4% acceptance rate. High cost of living in NYC. Requires SAT 1510+ and strong Core Curriculum essays.',
    cmu: 'CMU School of Computer Science is ranked top-1 globally with fierce competition. Requires advanced math contest background.',
    nyu: 'High tuition ($60k+) and Manhattan living costs. Financial aid for international students is strictly capped.',
    gatech: 'Direct admission to Computer Science is quota-governed. Demands high SAT Math percentile (750+).',
    uw: 'Computer Science major operates via direct-to-major admission with highest competitive score bar.',
    purdue: 'Engineering & CS college requires SAT 1420+ and top GPA (3.8+). Selective international applicant quotas.',
    asu: 'Annual out-of-state tuition ~$34,000. New American University merit scholarship covers partial $5–15k.',
    nu: 'High English requirement: IELTS 7.0 (no subscore below 6.0). Competitive state-funded scholarship pool.',
    kbtu: 'High ENT cutoff for IT state grant (118–122+). Commercial tracks require forward financial planning.',
    sdu: 'Moderate competition. Internal merit scholarships distributed via SDU Olympiad and ENT scores.',
    aitu: 'Intense competition for governmental grants in IT & Cybersecurity. Requires ENT score 110+.',
    iitu: 'Dense applicant pool in Software Engineering. State grants require ENT 108–112+.',
    kaznu: 'Broad competition across rural and municipal quotas. Priority granted to Altyn Belgi holders upon score parity.',
    satbayev: 'Solid performance required in advanced math and physics. Dormitory allocation determined by ranking.',
    kimep: 'Tuition-based unless awarded internal merit scholarship. Requires IELTS 6.0+ or internal English test.',
    narxoz: 'Grant seats strictly quota-governed by Ministry of Science & Higher Education. High school GPA tiebreaker.',
    kaznmu: 'High ENT benchmark in Biology & Chemistry (120+ for grant), plus mandatory psychometric examination.',
    mnu: 'Rigorous academic standards in Law & Business. Merit grants distributed via internal entrance ranking.',
    kazgasa: 'Two mandatory creative entrance examinations (drawing & drafting) establish the final qualification ranking.',
    amu: 'Limited state-funded grant allocation in the capital. Mandatory psychometric examination clearance.',
    padua: 'High competitive pool. Critical to submit early for Veneto DSU regional scholarship and Italian Type D Visa.',
    polimi: 'Strict online entrance exam cutoff (TOL/TIL). Stringent quota for non-EU international applicants.',
    bocconi: 'High percentile requirement on Bocconi / SAT test (1420+) and holistic profile. High tuition without scholarship.',
    tum: 'Two-stage assessment: motivational essay, math exam, and interview. Non-EU tuition fees apply (€2,000–3,000/sem).',
    rwth: 'Rigorous academic foundations required in calculus and mechanics. Studienkolleg or 1 year university completed required.',
    heidelberg: 'Intense applicant selectivity for medicine and life sciences. Requires German C1 or strong English credentials.',
    kaist: 'Full scholarship competition among top 1% global applicants. Comprehensive technical math/physics interviews.',
    snu: 'Korea’s flagship national institution. Highly selective international admission without fluent Korean.',
    yonsei: 'Underwood International College requires compelling essays, academic references, and interviews. Songdo campus living required.',
    metu: 'SAT-based admission (minimum 1350+, Math 700+). Stringent international student enrollment quotas.',
    koc: 'Elite private university. Full scholarship requires SAT 1460+ and outstanding extracurricular profile.',
    bilkent: 'High English requirements (IELTS 6.5) and competitive SAT benchmarks for tuition fee discount waivers.'
  },
  RU: {
    mit: 'Экстремальный конкурс (зачисление < 4%). Нужны SAT 1540+, олимпиады мирового уровня и исследовательские проекты.',
    stanford: 'Конкурс мирового уровня (< 4%). Нужен безупречный GPA, SAT 1520+, мощное лидерство и уникальные эссе.',
    harvard: 'Селективность < 3.5%. Требуется выдающийся академический профиль (SAT 1530+), рекомендации и внеучебное портфолио.',
    berkeley: 'Высочайший конкурс на IT и инженерию (< 8%). Высокая стоимость для международных студентов ($50 000+/год).',
    columbia: 'Низкий процент зачисления (< 4%). Высокая стоимость жизни в Нью-Йорке. Требуется SAT 1510+ и эссе по Core.',
    cmu: 'Школа CS в CMU — одна из сильнейших в мире, конкурс высочайший. Нужна сильная олимпиадная математика.',
    nyu: 'Высокая стоимость обучения ($60k+) и проживания на Манхэттене. Финансовая помощь иностранцам строго ограничена.',
    gatech: 'Прямое зачисление на CS квотировано. Высокий порог по профильной математике SAT (Math 750+).',
    uw: 'Направление Computer Science отбирается по отдельному конкурсу Direct to Major с максимальным порогом.',
    purdue: 'Колледж инженерии и CS требует SAT 1420+ и высокий GPA (от 3.8). Квоты на иностранных студентов.',
    asu: 'Стоимость обучения ($34 000/год). Академическая стипендия New American University покрывает только $5–15k.',
    nu: 'Высокий языковой порог: IELTS 7.0 (не ниже 6.0 по секциям). Жесткий конкурс на гранты среди лучших выпускников.',
    kbtu: 'Высокий порог ЕНТ на IT-грант (от 118–122 баллов). Платное обучение требует отдельного финансового планирования.',
    sdu: 'Конкуренция умеренная. Внутренние гранты и скидки распределяются по олимпиаде SDU и общему конкурсу ЕНТ.',
    aitu: 'Высокий конкурс на государственные гранты в IT и кибербезопасности. Требуется балл ЕНТ от 110+.',
    iitu: 'Плотный конкурс по Software Engineering. На государственный грант требуется ЕНТ от 108–112.',
    kaznu: 'Большой конкурс среди сельских и городских квот. Приоритет отдаётся обладателям «Алтын белгі» при равенстве.',
    satbayev: 'Требуется уверенный балл по профильной математике и физике. Места в общежитии распределяются по конкурсу.',
    kimep: 'Обучение полностью платное при отсутствии стипендии. Требуется IELTS от 6.0 или внутренний экзамен.',
    narxoz: 'Грантовые места ограничены квотами МОН РК. При равенстве баллов ЕНТ решает средний балл аттестата.',
    kaznmu: 'Высокий порог ЕНТ по биологии и химии (120+ на грант), плюс обязательный психометрический экзамен.',
    mnu: 'Высокие академические стандарты по праву и бизнесу. Гранты распределяются по строгому внутреннему рейтингу.',
    kazgasa: 'Обязательны два творческих экзамена (рисунок и черчение), которые определяют итоговый рейтинг.',
    amu: 'Ограниченное число грантовых мест в столице. Обязателен допуск по психометрическому экзамену.',
    padua: 'Конкуренция высокая. Важно вовремя подать документы на региональную стипендию ESU/ISEE и визу D.',
    polimi: 'Вступительный онлайн-тест TOL/TIL с жестким проходным баллом. Ограниченное число мест для non-EU студентов.',
    bocconi: 'Высокие требования к тесту Bocconi / SAT (1420+) и мотивационному профилю. Высокая стоимость без стипендии.',
    tum: 'Двухэтапный отбор: профильное эссе, математический тест и интервью. Введена плата для non-EU (€2 000–3 000/сем).',
    rwth: 'Строгие требования к академической базе по математике и механике. Необходим Studienkolleg или 1 курс вуза дома.',
    heidelberg: 'Высокий конкурс на медицинские и научные специальности. Требуется немецкий C1 или сильный английский.',
    kaist: 'Конкурс на полную стипендию среди топ-1% абитуриентов мира. Сложные технические интервью по математике и физике.',
    snu: 'Флагманский университет Кореи. Крайне низкий процент зачисления международных студентов без корейского языка.',
    yonsei: 'Англоязычный колледж UIC требует сильное эссе, рекомендательные письма и интервью. Проживание в Сондо обязательно.',
    metu: 'Конкурс по SAT (минимум 1350+, Math 700+). Количество мест для иностранных студентов строго квотировано.',
    koc: 'Элитный частный университет. Полная стипендия требует SAT 1460+ и выдающиеся внеучебные достижения.',
    bilkent: 'Высокие требования к английскому (IELTS 6.5) и результатам SAT/YÖS для получения скидки на обучение.'
  }
};

export const INSTITUTION_RISKS = INSTITUTION_RISKS_BY_LANG.RU;

const ULTRA_SELECTIVE_IDS = new Set([
  'mit', 'stanford', 'harvard', 'berkeley', 'columbia', 'cmu'
]);

const HIGH_SELECTIVE_IDS = new Set([
  'nu', 'kaist', 'tum', 'bocconi', 'gatech', 'uw', 'snu', 'purdue'
]);

export function buildEngineProfile({
  interests = ['IT'],
  gpa = 3.6,
  ielts = 6.5,
  ent = '',
  sat = '',
  budget = 3000,
  countries = ['Казахстан', 'Италия'],
  achievements = [],
}) {
  const fields = (interests || []).map((i) => FIELD_MAP[i] || 'it');
  const targetCountries = (countries || []).map((c) => COUNTRY_MAP[c] || 'KZ');

  const examScores = {
    ielts: Number(ielts) || 6.5,
    gpa_4: Number(gpa) || 3.6,
    gpa_5: Math.min(5.0, Number(((Number(gpa) || 3.6) * 1.25).toFixed(2))),
  };

  if (sat && !isNaN(Number(sat))) {
    examScores.sat_total = Number(sat);
  }

  let entProfilePair = ['ent_mathematics', 'ent_informatics'];
  if (fields.includes('medicine')) {
    entProfilePair = ['ent_biology', 'ent_chemistry'];
  } else if (fields.includes('engineering')) {
    entProfilePair = ['ent_mathematics', 'ent_physics'];
  } else if (fields.includes('economics') || fields.includes('management')) {
    entProfilePair = ['ent_mathematics', 'ent_geography'];
  } else if (fields.includes('law')) {
    entProfilePair = ['ent_world_history', 'ent_human_society_law'];
  }

  const entVal = ent !== '' && !isNaN(Number(ent)) ? Number(ent) : null;
  if (entVal !== null) {
    const ratio = Math.max(0, Math.min(1, entVal / 140));
    const h = Math.min(20, Math.round(20 * ratio));
    const ml = Math.min(10, Math.round(10 * ratio));
    const rl = Math.min(10, Math.round(10 * ratio));
    const p1 = Math.min(50, Math.round(50 * ratio));
    const p2 = Math.min(50, Math.max(0, entVal - (h + ml + rl + p1)));

    examScores.ent_history_kz = h;
    examScores.ent_math_literacy = ml;
    examScores.ent_reading_literacy = rl;
    examScores[entProfilePair[0]] = p1;
    examScores[entProfilePair[1]] = p2;
  }

  return {
    examScores,
    entProfilePair,
    achievements: achievements || [],
    preferences: {
      fields: fields.length ? fields : ['it'],
      countries: targetCountries.length ? targetCountries : ['KZ', 'IT'],
      languages: ['en', 'ru', 'kk'],
      maxTuitionPerYear: budget > 0 ? { amount: Number(budget), currency: 'USD' } : null,
      willingToRelocate: true,
    },
  };
}

export function evaluateAdmissionState(inputs) {
  try {
    const { lang = 'RU' } = inputs || {};
    const isKz = lang === 'KZ';
    const isEng = lang === 'ENG';
    const langKey = isKz ? 'kk' : isEng ? 'en' : 'ru';

    const rawProfile = buildEngineProfile(inputs);
    const parsed = parseProfile(rawProfile);

    const institutionMatches = matchInstitutions(rawProfile, { includeRejected: true });
    const programMatches = matchPrograms(rawProfile, { includeRejected: true });
    const roadmap = buildRoadmap(parsed, { asOf: '2026-09-17' });

    const ieltsNum = Number(inputs.ielts) || 6.0;
    const satNum = Number(inputs.sat) || 0;
    const gpaNum = Number(inputs.gpa) || 3.5;
    const entNum = inputs.ent !== '' && !isNaN(Number(inputs.ent)) ? Number(inputs.ent) : 0;

    const schools = institutionMatches.map(({ institution, bestMatch, matches }) => {
      const open = bestMatch.openTracks || [];
      const primaryTrack = open[0];
      const level = primaryTrack?.chance?.level || 'unknown';
      const prob = primaryTrack?.chance?.probability ?? null;

      const isUltra = ULTRA_SELECTIVE_IDS.has(institution.id);
      const isHigh = HIGH_SELECTIVE_IDS.has(institution.id);

      let matchPercent = 50;
      const rawScore = Math.round(bestMatch.matchScore * 100);

      if (isUltra) {
        if (satNum >= 1530 && gpaNum >= 3.9) {
          matchPercent = 75;
        } else if (satNum >= 1480 && gpaNum >= 3.7) {
          matchPercent = 65;
        } else {
          matchPercent = Math.min(58, Math.max(30, Math.round(rawScore * 0.7)));
        }
      } else if (isHigh) {
        if (institution.country === 'KZ') {
          if (ieltsNum >= 7.0 && satNum >= 1350) matchPercent = 88;
          else if (ieltsNum >= 6.5) matchPercent = 78;
          else matchPercent = 64;
        } else {
          if (satNum >= 1450 || (ieltsNum >= 7.0 && gpaNum >= 3.8)) matchPercent = 84;
          else matchPercent = Math.min(74, Math.max(45, rawScore));
        }
      } else {
        if (prob !== null) {
          matchPercent = Math.round(prob * 100);
        } else {
          matchPercent = rawScore;
        }
        if (bestMatch.factors?.fieldMatch) {
          matchPercent = Math.round(matchPercent * 0.7 + bestMatch.factors.fieldMatch * 30);
        }
      }

      matchPercent = Math.max(35, Math.min(98, matchPercent));

      let type = 'Target';
      let color = 'blue';

      const hasSafeTrack = open.some((t) => t.chance?.level === 'safe' || t.chance?.level === 'likely');
      const hasTargetTrack = open.some((t) => t.chance?.level === 'target' || t.chance?.level === 'moderate');

      if (isUltra) {
        type = 'Reach';
        color = 'amber';
      } else if (isHigh) {
        if (matchPercent >= 85) {
          type = 'Target';
          color = 'blue';
        } else {
          type = 'Reach';
          color = 'amber';
        }
      } else if (hasSafeTrack && rawScore >= 68) {
        type = 'Safety';
        color = 'green';
      } else if (hasTargetTrack || rawScore >= 65) {
        type = 'Target';
        color = 'blue';
      } else {
        type = 'Reach';
        color = 'amber';
      }

      const reasons = [];
      if (bestMatch.factors) {
        if (bestMatch.factors.fieldMatch > 0.7) {
          reasons.push(isKz ? 'Таңдалған бағытқа жоғары сәйкестік' : isEng ? 'High curriculum alignment with chosen major' : 'Высокое соответствие выбранному направлению');
        }
        if (bestMatch.factors.admissionRealism > 0.6) {
          reasons.push(isKz ? 'Академиялық көрсеткіштерің бәсекеге қабілетті' : isEng ? 'Academic profile in competitive range' : 'Академические баллы в конкурентном диапазоне');
        }
        if (bestMatch.factors.affordability > 0.8) {
          reasons.push(isKz ? 'Белгіленген оқу бюджетіне сәйкес келеді' : isEng ? 'Tuition fits within target budget' : 'Соответствует заданному бюджету на обучение');
        }
        if (bestMatch.factors.location > 0.8) {
          reasons.push(isKz ? 'Басым оқу өңірінде орналасқан' : isEng ? 'Located in priority target study destination' : 'В приоритетном регионе поступления');
        }
      }
      if (!reasons.length) {
        const progTitle = bestMatch.program.title[langKey] || bestMatch.program.title.ru || bestMatch.program.title.en;
        reasons.push(
          `${isKz ? 'Бағдарлама' : isEng ? 'Program' : 'Программа'}: ${progTitle}`,
          isKz ? 'Өзекті қабылдау жолдары ашық' : isEng ? 'Open admissions tracks available' : 'Доступны актуальные траектории приёма'
        );
      }

      const countryCode = bestMatch.institution.country || 'KZ';
      const tuition = bestMatch.program.tuitionPerYear;
      const formattedCost = formatTuitionCost(tuition, countryCode, lang);

      let risk = INSTITUTION_RISKS_BY_LANG[lang]?.[institution.id] || INSTITUTION_RISKS_BY_LANG.RU[institution.id] || null;

      if (!risk) {
        if (bestMatch.closedTracks?.length) {
          const trackTitles = bestMatch.closedTracks.map((t) => {
            const tr = t.track || t;
            return tr?.title?.[langKey] || tr?.title?.ru || tr?.title?.en || (isKz ? 'траектория' : isEng ? 'track' : 'трек');
          }).join(', ');
          risk = isKz ? `Жабық траекториялар: ${trackTitles}` : isEng ? `Closed tracks: ${trackTitles}` : `Закрыты треки: ${trackTitles}`;
        } else {
          risk = bestMatch.program.provenance?.caveat || (isKz ? 'Ресми сайттағы соңғы талаптарды нақтылаңыз.' : isEng ? 'Verify latest details on official university site.' : 'Уточняй финальные условия на официальном сайте.');
        }
      }

      const instDeadlines = INSTITUTION_DEADLINES_DATA[institution.id];
      const deadlineDate = instDeadlines ? instDeadlines[lang] : COUNTRY_DEADLINES_BY_LANG[lang]?.[countryCode] || COUNTRY_DEADLINES_BY_LANG.RU[countryCode];
      const deadlineIso = instDeadlines?.iso || COUNTRY_DEADLINES_ISO[countryCode] || '2027-07-15';
      const livingCost = COUNTRY_LIVING_COSTS_BY_LANG[lang]?.[countryCode] || COUNTRY_LIVING_COSTS_BY_LANG.RU[countryCode] || '$500–800/мес';

      let minIelts = null;
      let minSat = null;
      const checkRequirement = (item) => {
        if (!item) return;
        if (item.exam === 'ielts') {
          if (minIelts === null || item.min > minIelts) minIelts = item.min;
        }
        if (item.exam === 'sat_total') {
          if (minSat === null || item.min > minSat) minSat = item.min;
        }
      };

      const primaryTrackObj = primaryTrack?.track || primaryTrack;
      (primaryTrackObj?.required || []).forEach(checkRequirement);
      (primaryTrackObj?.anyOf || []).forEach((group) => (group || []).forEach(checkRequirement));
      if (minIelts === null || minSat === null) {
        (bestMatch.program.tracks || []).forEach((track) => {
          (track.required || []).forEach(checkRequirement);
          (track.anyOf || []).forEach((group) => (group || []).forEach(checkRequirement));
        });
      }

      const formattedIelts =
        minIelts !== null
          ? minIelts.toFixed(1)
          : countryCode === 'KZ'
          ? (isKz ? 'Қажет емес (ҰБТ)' : isEng ? 'Not required (ENT)' : 'Не требуется (ЕНТ)')
          : countryCode === 'DE'
          ? '6.5'
          : '6.0';

      const formattedSat =
        minSat !== null
          ? minSat.toLocaleString('en-US')
          : countryCode === 'KZ'
          ? (isKz ? 'Қажет емес' : isEng ? 'Not required' : 'Не требуется')
          : countryCode === 'US'
          ? (isKz ? '1 250 (ұсынылады)' : isEng ? '1,250 (recommended)' : '1 250 (рекомендуется)')
          : countryCode === 'TR'
          ? (isKz ? '1 200 (немесе YÖS)' : isEng ? '1,200 (or YÖS)' : '1 200 (или YÖS)')
          : (isKz ? 'Қажет емес' : isEng ? 'Not required' : 'Не требуется');

      let finalRisk = risk;
      if (minIelts !== null && ieltsNum < minIelts) {
        finalRisk = isKz
          ? `IELTS шегі: ${minIelts.toFixed(1)} (сенде ${ieltsNum.toFixed(1)}). Дедлайнға дейін қайта тапсыру қажет.`
          : isEng
          ? `IELTS minimum: ${minIelts.toFixed(1)} (current score: ${ieltsNum.toFixed(1)}). Retake required before deadline.`
          : `Порог IELTS: ${minIelts.toFixed(1)} (у тебя ${ieltsNum.toFixed(1)}). Потребуется пересдача экзамена до дедлайна.`;
      } else if (minSat !== null && satNum > 0 && satNum < minSat) {
        finalRisk = isKz
          ? `Ұсынылатын SAT балы: ${minSat} (сенде ${satNum}). Мүмкіндікті арттыру үшін қайта тапсырған жөн.`
          : isEng
          ? `Recommended SAT score: ${minSat} (current score: ${satNum}). Consider retaking to boost admission odds.`
          : `Рекомендуемый балл SAT: ${minSat} (у тебя ${satNum}). Желательно пересдать для повышения шансов.`;
      }

      const countryTitle = LOCALIZED_COUNTRIES[lang]?.[institution.country] || institution.country;
      const cityTitle = LOCALIZED_CITIES[lang]?.[institution.city] || institution.city;

      const instName = isKz
        ? (institution.name.kk || institution.name.ru || institution.name.en)
        : isEng
        ? (institution.name.en || institution.name.ru)
        : institution.name.ru;

      const progTitle = bestMatch.program.title[langKey] || bestMatch.program.title.ru || bestMatch.program.title.en;

      return {
        id: institution.id,
        name: instName,
        nameRu: institution.name.ru,
        nameKz: institution.name.kk,
        place: `${countryTitle} · ${cityTitle}`,
        type,
        match: matchPercent,
        mark: institution.shortName || institution.id.toUpperCase(),
        color,
        cost: formattedCost,
        living: livingCost,
        ielts: formattedIelts,
        sat: formattedSat,
        date: deadlineDate,
        iso: deadlineIso,
        url: institution.website,
        why: reasons.slice(0, 2),
        risk: finalRisk,
        confidence: bestMatch.program.provenance.confidence,
        confidenceTitle:
          bestMatch.program.provenance.confidence === 'verified'
            ? (isKz ? 'Ресми расталған' : isEng ? 'Officially Verified' : 'Официально подтверждено')
            : bestMatch.program.provenance.confidence === 'reported'
            ? (isKz ? 'БАҚ жарияланымдары бойынша' : isEng ? 'Reported in Media' : 'По публикациям СМИ')
            : (isKz ? 'Болжам (тексеруді қажет етеді)' : isEng ? 'Estimated (verify)' : 'Оценка (требует сверки)'),
        openTracksCount: open.length,
        bestProgramTitle: progTitle,
      };
    });

    return {
      schools: schools.length ? schools : null,
      roadmap,
      programMatches,
    };
  } catch (err) {
    console.error('Admission engine calculation error:', err);
    return null;
  }
}
