/**
 * Персонализированный генератор SWOT-диагностики профиля абитуриента.
 * Формирует глубокие, контекстные сильные стороны и зоны внимания
 * на основе комбинации баллов, льгот, стран и финансовых рамок.
 */

export function getPersonalizedDiagnostics({
  gpa = 3.6,
  ielts = 6.5,
  ent = '',
  sat = '',
  budget = 0,
  countries = ['Казахстан'],
  interests = ['IT'],
  achievements = [],
  category = 1,
  engineResult = null,
  lang = 'RU',
}) {
  const isKz = lang === 'KZ';
  const isEng = lang === 'ENG';

  const strengths = [];
  const attentions = [];

  const entNum = ent !== '' && !isNaN(Number(ent)) ? Number(ent) : null;
  const satNum = sat !== '' && !isNaN(Number(sat)) ? Number(sat) : null;
  const gpaNum = Number(gpa) || 3.5;
  const ieltsNum = Number(ielts) || 6.0;

  const hasRural = achievements.includes('rural_quota');
  const hasAltyn = achievements.includes('altyn_belgi');
  const isAbroad = countries.some((c) => c !== 'Казахстан');
  const isOnlyKz = countries.length === 1 && countries[0] === 'Казахстан';
  const wantsGrant = budget === 0;

  // ==========================================
  // 1. СИЛЬНЫЕ СТОРОНЫ (STRENGTHS)
  // ==========================================

  // SAT
  if (satNum && satNum >= 1400) {
    strengths.push({
      title: isKz
        ? `Мықты халықаралық көрсеткіш: SAT ${satNum}`
        : isEng
        ? `Top-tier international score: SAT ${satNum}`
        : `Элитный результат SAT ${satNum}`,
      text: isKz
        ? `Әлемдік деңгейдегі топ-10% нәтиже. NU, KAIST, University of Padua сияқты университеттердің гранттары мен жеңілдіктеріне тікелей жол ашады.`
        : isEng
        ? `Top-10% global percentile. Grants direct access to merit scholarships at NU, KAIST, and University of Padua without internal exams.`
        : `Результат в топ-10% в мире. Открывает прямое зачисление на международные программы NU, KAIST и University of Padua без вступительных экзаменов.`,
    });
  } else if (satNum && satNum >= 1250) {
    strengths.push({
      title: isKz
        ? `Бәсекеге қабілетті SAT ${satNum}`
        : isEng
        ? `Competitive SAT score: ${satNum}`
        : `Конкурентный балл SAT ${satNum}`,
      text: isKz
        ? `Халықаралық бакалавриатқа түсу үшін жеткілікті балл және ішінара оқу гранттарына мүмкіндік береді.`
        : isEng
        ? `Solid baseline for international admission and partial tuition waiver scholarships.`
        : `Отличная база для международного поступления и получения скидок на обучение (tuition waivers).`,
    });
  }

  // ЕНТ
  if (entNum !== null) {
    if (entNum >= 120) {
      strengths.push({
        title: isKz
          ? `ҰБТ жоғары гранттық қоры: ${entNum} / 140`
          : isEng
          ? `High state grant buffer: ENT ${entNum} / 140`
          : `Высокий грантовый запас ЕНТ: ${entNum} / 140`,
        text: isKz
          ? `IT-гранттар бойынша шекті баллдан +30-дан астам артықшылық. ҚБТУ, SDU, ҚазҰУ гранттарын жеңіп алу ықтималдығы 90%-дан жоғары.`
          : isEng
        ? `Over +30 points buffer above grant cutoffs. Strong >90% likelihood for IT state grants at KBTU, SDU, KazNU.`
        : `Запас +30 баллов над порогом IT-грантов. Вероятность присуждения гранта в КБТУ, SDU, КазНУ оценивается выше 90%.`,
      });
    } else if (entNum >= 90) {
      strengths.push({
        title: isKz
          ? `ҰБТ бойынша сенімді база: ${entNum} / 140`
          : isEng
          ? `Confident ENT baseline: ${entNum} / 140`
          : `Уверенная база ЕНТ: ${entNum} / 140`,
        text: isKz
          ? `Инженерлік және IT саласындағы гранттар конкурсына қатысуға толық мүмкіндік бар (әсіресе Сәтбаев, МУИТ және квоталар бойынша).`
          : isEng
        ? `Eligible for competitive engineering and IT state grants (especially at Satbayev, IITU, or via quota tracks).`
        : `Открывает участие в конкурсе грантов на IT и инженерию (особенно эффективно в Satbayev, МУИТ или по специальным квотам).`,
      });
    }
  }

  // Сельская квота
  if (hasRural) {
    strengths.push({
      title: isKz
        ? '«Ауыл квотасы 35%» белсендірілді'
        : isEng
        ? '35% Rural Quota Advantage Activated'
        : 'Активирована «Ауыл квотасы 35%»',
      text: isKz
        ? 'ҚР заңы бойынша IT, техникалық және медициналық мамандықтардағы гранттардың 35%-ы ауыл мектептеріне бөлінген. Сен үшін өту балы 15–20 балға төмен.'
        : isEng
        ? 'Kazakhstan law reserves 35% of all STEM/medical grants for rural graduates with significantly lower cutoffs (15-20 pts lower).'
        : 'Закон РК резервирует 35% грантов по IT, инженерии и медицине за выпускниками сельских школ. Проходной балл для тебя снижен на 15–20 пунктов!',
    });
  }

  // Алтын белгі
  if (hasAltyn) {
    strengths.push({
      title: isKz
        ? '«Алтын белгі» артықшылығы (Тайбрейк)'
        : isEng
        ? 'Honors Badge (Tiebreak Priority)'
        : 'Преимущество знака «Алтын белгі»',
      text: isKz
        ? 'ҰБТ балдары тең түскен жағдайда мемлекеттік грант бәсекелестерден бұрын саған беріледі.'
        : isEng
        ? 'Direct priority tiebreak in grant assignment when test scores are tied.'
        : 'Решающий фактор при равенстве баллов ЕНТ: грант распределяется в твою пользу вперед других претендентов.',
    });
  }

  // IELTS
  if (ieltsNum >= 7.5) {
    strengths.push({
      title: isKz
        ? `Академиялық еркін ағылшын тілі: IELTS ${ieltsNum.toFixed(1)} (C1)`
        : isEng
        ? `Advanced English Proficiency: IELTS ${ieltsNum.toFixed(1)} (C1)`
        : `Свободный академический английский: IELTS ${ieltsNum.toFixed(1)} (C1)`,
      text: isKz
        ? `Еуропа, Азия және Назарбаев Университеті бағдарламаларының 95%-ының талабынан асып түседі. Тілдік шектеулер мүлдем жоқ.`
        : isEng
        ? `Surpasses requirements for 95% of international programs (NU, KAIST, Padua). Zero risk of language filter rejection.`
        : `Превышает пороги 95% международных программ (NU, KAIST, Padua). Полностью исключает риск отсева по языку.`,
    });
  } else if (ieltsNum >= 6.5) {
    strengths.push({
      title: isKz
        ? `Тұрақты тілдік деңгей: IELTS ${ieltsNum.toFixed(1)} (B2+)`
        : isEng
        ? `Strong language qualification: IELTS ${ieltsNum.toFixed(1)} (B2+)`
        : `Твёрдый уровень английского: IELTS ${ieltsNum.toFixed(1)} (B2+)`,
      text: isKz
        ? `SDU, ҚБТУ және шетелдік серіктес бағдарламалардың тікелей ағылшын тіліндегі бакалавриатына Foundation курсынсыз қабылдануға жеткілікті.`
        : isEng
        ? `Direct qualification for English-medium bachelor tracks at SDU, KBTU, Padua without a mandatory foundation year.`
        : `Достаточен для прямого зачисления на англоязычные программы SDU, КБТУ, Padua без подготовительного года Foundation.`,
    });
  }

  // GPA
  if (gpaNum >= 3.8) {
    strengths.push({
      title: isKz
        ? `Үздік академиялық үлгерім: GPA ${gpaNum.toFixed(1)}`
        : isEng
        ? `Outstanding academic record: GPA ${gpaNum.toFixed(1)}`
        : `Выдающийся средний балл: GPA ${gpaNum.toFixed(1)}`,
      text: isKz
        ? `Италиядағы DSU стипендиялары мен жеке меншік университеттердің жеңілдіктер конкурсында жоғары рейтинг береді.`
        : isEng
        ? `Maximizes candidate ranking for need-based & merit scholarships (Italy DSU, university tuition waivers).`
        : `Обеспечивает высокий рейтинг в конкурсах региональных стипендий (Veneto DSU в Италии) и академических скидок.`,
    });
  }

  // Направление
  if (interests.length > 0) {
    strengths.push({
      title: isKz
        ? `Сұранысқа ие бағыт: ${interests.join(', ')}`
        : isEng
        ? `High-demand STEM focus: ${interests.join(', ')}`
        : `Востребованный вектор: ${interests.join(', ')}`,
      text: isKz
        ? `Бұл мамандықтар бойынша Қазақстанда да, шетелде де мемлекеттік гранттар мен стипендиялар саны ең көп.`
        : isEng
        ? `Fields aligned with the highest volume of allocated government grants and research funding.`
        : `Направления с максимальной долей грантовых мест как в Казахстане (группа B057), так и за рубежом.`,
    });
  }

  // ==========================================
  // 2. НА ЧТО ОБРАТИТЬ ВНИМАНИЕ (ATTENTIONS / RISKS)
  // ==========================================

  // Зарубеж + Бюджет $0
  if (isAbroad && wantsGrant) {
    attentions.push({
      title: isKz
        ? 'Шетелдік гранттар: DSU құжаттары мен отбасы кірісі'
        : isEng
        ? 'Zero-Tuition Abroad: Family Income & DSU Docs'
        : 'Зарубежные гранты $0: пакет доходов ISEE и апостили',
      text: isKz
        ? 'Италияда (DSU) оқу ақысыз, бірақ шілде-тамыз айларына дейін отбасы кірісі анықтамаларын (ISEE Parificato) және аттестат апостилін дайындау қажет.'
        : isEng
        ? 'Full scholarships in Italy (DSU) require certified family income declarations (ISEE Parificato) and apostilled diplomas before summer deadlines.'
        : 'В Италии (DSU) обучение и проживание покрываются, но требуют перевода и апостиля справок о доходах семьи (ISEE Parificato) строго до дедлайна.',
    });
    attentions.push({
      title: isKz
        ? 'Визалық шотқа қаржылық кепілдік (€6 000)'
        : isEng
        ? 'Student Visa Financial Guarantee Deposit (€6,000)'
        : 'Визовый финансовый депозит (~€6 000)',
      text: isKz
        ? 'Стипендия ұтып алсаң да, Елшілік студенттік виза беру үшін банк шотында тұруға жететін қаражаттың бар екенін растауды талап етеді.'
        : isEng
        ? 'Embassies mandate proof of personal living funds on your bank account (~€6,000) for visa issuance prior to first grant disbursement in November.'
        : 'Консульство требует подтверждения средств на личном счету (~€6 000) для выдачи визы до первой выплаты региональной стипендии осенью.',
    });
  }

  // Зарубежные дедлайны
  if (isAbroad) {
    attentions.push({
      title: isKz
        ? 'Шетелдік дедлайндар ҰБТ-дан ерте аяқталады'
        : isEng
        ? 'International Deadlines Close Before ENT'
        : 'Зимние дедлайны зарубежных программ (январь–февраль)',
      text: isKz
        ? 'Padua мен KAIST-ке құжат қабылдау қаңтар-ақпанда жабылады. Мотивациялық хаттар мен транскрипттерді қазірден бастау қажет.'
        : isEng
        ? 'Intl admissions for Padua & KAIST close in Jan-Feb 2027. Personal statements and transcripts must be prepared this autumn.'
        : 'Прием в Padua и KAIST на осень 2027 закрывается в январе-феврале. Готовить мотивационное эссе и транскрипты нужно уже сейчас.',
    });
  }

  // ЕНТ конкурс в Казахстане
  if (isOnlyKz || entNum !== null) {
    if (entNum !== null && entNum < 110 && !hasRural) {
      attentions.push({
        title: isKz
          ? 'ҰБТ балы жалпы IT-конкурс үшін шекті аймақта'
          : isEng
          ? 'ENT Score in Borderline Range for General IT Grant'
          : `Балл ЕНТ ${entNum} — в зоне риска для общего IT-гранта`,
        text: isKz
          ? 'Алматы мен Астананың жетекші IT-вуздарында (ҚБТУ, МУИТ) жалпы грант 110–120 баллдан басталады. Қосымша жеңілдіктерді немесе облыстық квоталарды тексер.'
          : isEng
        ? 'Top IT institutions in Almaty require 110-120+ for general grants. Verify quota eligibility or target regional programs.'
        : `В КБТУ и МУИТ общий грант на IT стартует от 112–118. Рекомендуется подтянуть баллы на летнем ЕНТ либо активировать квоты.`,
      });
    }

    attentions.push({
      title: isKz
        ? 'Грант конкурсына 4 ЖОО таңдау стратегиясы (13–20 шілде)'
        : isEng
        ? '4-University Grant Preference Strategy (July 13-20)'
        : 'Стратегия 4 вузов в заявке на грант (13–20 июля)',
      text: isKz
        ? 'eGov-та өтініш беру кезінде 1-2 амбициялы (Target/Reach) және 3-4 кепілді (Safety) оқу орындарын міндетті түрде дұрыс ретпен орналастыр.'
        : isEng
        ? 'In the 7-day national grant application window, calibrate 1-2 ambitious targets and 1-2 guaranteed safety universities.'
        : 'Окно подачи через eGov длится всего 7 дней. Обязательно укажи 1–2 амбициозных вуза (Target/Reach) и 3–4 надежных (Safety).',
    });
  }

  // Язык IELTS дефицит
  if (ieltsNum < 6.5) {
    attentions.push({
      title: isKz
        ? `Ағылшын тілін 6.5 балына дейін жеткізу (${(6.5 - ieltsNum).toFixed(1)} балл жетпейді)`
        : isEng
        ? `Language target: +${(6.5 - ieltsNum).toFixed(1)} needed to reach IELTS 6.5`
        : `Языковой ориентир: нужно подтянуть IELTS на +${(6.5 - ieltsNum).toFixed(1)}`,
      text: isKz
        ? 'Ағылшын тіліндегі беделді гранттық бағдарламалар үшін ең төменгі талап — 6.0–6.5. Writing және Speaking бөлімдеріне басымдық бер.'
        : isEng
        ? 'Prestigious grant-funded English programs require at least 6.0-6.5 overall. Focus prep on Writing and Speaking sections.'
        : 'Для грантовых англоязычных групп и зарубежных вузов требуется минимум 6.0–6.5. Сделай упор на секции Writing и Speaking.',
    });
  }

  // 10 класс / Ранний старт
  if (category === 0) {
    strengths.push({
      title: isKz
        ? 'Ерте дайындық мүмкіндігі (10 сынып)'
        : isEng
        ? 'Early Strategic Runway (Grade 10)'
        : 'Преимущество раннего старта (10 класс)',
      text: isKz
        ? 'Алдыңда 1.5 жыл уақыт бар: бейінді пәндерді стресссіз көтеруге және олимпиадалар мен халықаралық сертификаттарды жинауға мүмкіндік мол.'
        : isEng
        ? 'You have 1.5 years ahead: ideal window to master specialized subjects, build portfolio and pass exams without crunch.'
        : 'У тебя в запасе 1.5 года: идеальное окно, чтобы подтянуть профильные предметы, собрать портфолио и сдать экзамены без стресса.',
    });
  }

  return {
    strengths: strengths.slice(0, 4),
    attentions: attentions.slice(0, 4),
  };
}
