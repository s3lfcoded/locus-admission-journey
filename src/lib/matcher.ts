import { UserProfile, University, UniversityMatch, DiagnosticResult, MatchTier } from '../data/types';
import { UNIVERSITIES } from '../data/universities';

export function matchUniversities(profile: UserProfile): UniversityMatch[] {
  return UNIVERSITIES.map((uni) => {
    let score = 50;
    const matchReasons: string[] = [];
    const riskFactors: string[] = [];

    // 1. Предпочтительные страны
    const isPreferredCountry = profile.preferredCountries.length === 0 || 
      profile.preferredCountries.includes(uni.country) ||
      (uni.country.includes('США') && profile.preferredCountries.includes('США'));

    if (isPreferredCountry) {
      score += 15;
      matchReasons.push(`Страна (${uni.country}) совпадает с твоими приоритетами.`);
    } else {
      score -= 20;
      riskFactors.push(`Страна (${uni.country}) не была выбрана в качестве приоритетной.`);
    }

    // 2. Направление обучения (Мажор)
    if (uni.strongFields.includes(profile.field)) {
      score += 20;
      matchReasons.push(`Сильная академическая база и признанные лаборатории по твоему направлению.`);
    } else {
      score -= 10;
      riskFactors.push(`Твое направление не входит в топ ключевых профилей этого вуза.`);
    }

    // 3. Языковой балл (IELTS)
    const userIelts = profile.ielts > 0 ? profile.ielts : 5.5; // дефолт если еще не сдавал
    if (userIelts >= uni.minIelts + 0.5) {
      score += 15;
      matchReasons.push(`Твой IELTS (${userIelts}) выше минимального порога (${uni.minIelts}) с хорошим запасом.`);
    } else if (userIelts >= uni.minIelts) {
      score += 10;
      matchReasons.push(`Твой IELTS (${userIelts}) точно покрывает вступительное требование (${uni.minIelts}).`);
    } else {
      const diff = (uni.minIelts - userIelts).toFixed(1);
      score -= 25;
      riskFactors.push(`Нужно подтянуть IELTS минимум на +${diff} балла (требуется ${uni.minIelts}).`);
    }

    // 4. Успеваемость (GPA)
    if (profile.gpa >= uni.minGpa + 0.3) {
      score += 15;
      matchReasons.push(`Высокий средний балл (GPA ${profile.gpa} при минимуме ${uni.minGpa}) дает преимущество.`);
    } else if (profile.gpa >= uni.minGpa) {
      score += 5;
      matchReasons.push(`Текущий GPA (${profile.gpa}) удовлетворяет базовому цензу.`);
    } else {
      score -= 20;
      riskFactors.push(`GPA (${profile.gpa}) ниже среднего проходного балла (${uni.minGpa}).`);
    }

    // 5. Бюджет и стипендии
    const hasFullGrants = uni.availableGrants.some(g => g.toLowerCase().includes('100%') || g.toLowerCase().includes('государственный'));
    if (uni.tuitionUsdPerYear === 0) {
      score += 15;
      matchReasons.push(`Бесплатное обучение / 100% покрытие расходов на учебу.`);
    } else if (profile.annualBudgetUsd >= uni.tuitionUsdPerYear) {
      score += 15;
      matchReasons.push(`Стоимость ($${uni.tuitionUsdPerYear.toLocaleString()}/год) полностью укладывается в твой бюджет ($${profile.annualBudgetUsd.toLocaleString()}).`);
    } else if (hasFullGrants || profile.needsScholarship) {
      score += 5;
      matchReasons.push(`Платное обучение ($${uni.tuitionUsdPerYear.toLocaleString()}), но доступны полные гранты и стипендии.`);
    } else {
      score -= 25;
      riskFactors.push(`Стоимость ($${uni.tuitionUsdPerYear.toLocaleString()}/год) превышает заявленный бюджет ($${profile.annualBudgetUsd.toLocaleString()}).`);
    }

    // SAT для вузов где он нужен
    if (uni.minSat) {
      if (profile.sat >= uni.minSat) {
        score += 10;
        matchReasons.push(`Балл SAT (${profile.sat}) конкурентоспособен (порог ${uni.minSat}).`);
      } else if (profile.sat > 0) {
        riskFactors.push(`SAT (${profile.sat}) ниже рекомендуемого (${uni.minSat}). Желательна пересдача.`);
      }
    }

    // Нормализация скора 0 - 100
    const finalScore = Math.max(15, Math.min(99, score));

    // Определение корзины (Tier)
    let tier: MatchTier = 'Target';
    if (finalScore >= 80 && riskFactors.length <= 1) {
      tier = 'Safety';
    } else if (finalScore < 60 || uni.acceptanceRatePercent <= 15) {
      tier = 'Reach';
    } else {
      tier = 'Target';
    }

    // Совет по финансированию
    let scholarshipAdvice = 'Рекомендуется подавать документы в первую волну (Early Round) для максимального шанса на грант.';
    if (uni.availableGrants.length > 0) {
      scholarshipAdvice = `Доступны программы поддержки: ${uni.availableGrants.slice(0, 2).join(', ')}.`;
    }

    return {
      university: uni,
      matchScore: finalScore,
      tier,
      matchReasons: matchReasons.slice(0, 3),
      riskFactors: riskFactors.slice(0, 3),
      scholarshipAdvice,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function generateDiagnostic(profile: UserProfile): DiagnosticResult {
  const strongPoints: string[] = [];
  const bottlenecks: string[] = [];

  // Сильные стороны
  if (profile.gpa >= 3.6) {
    strongPoints.push(`Отличный академический показатель: GPA ${profile.gpa} открывает доступ к селективным вузам.`);
  }
  if (profile.ielts >= 6.5) {
    strongPoints.push(`Уверенное владение языком: IELTS ${profile.ielts} снимает языковые барьеры в Европе и Азии.`);
  }
  if (profile.sat >= 1300) {
    strongPoints.push(`Сильный результат SAT (${profile.sat}): дает право на серьезную финансовую поддержку.`);
  }
  if (profile.extracurricularsCount >= 3) {
    strongPoints.push(`Богатое портфолио внеучебной деятельности (олимпиады, проекты, волонтерство).`);
  }
  if (strongPoints.length === 0) {
    strongPoints.push(`Хорошая стартовая база и четкая мотивация в выбранной сфере.`);
  }

  // Узкие места (Bottlenecks)
  if (profile.ielts < 6.0) {
    bottlenecks.push(`Балл IELTS (${profile.ielts || 'не сдан'}) ограничивает подачу на прямые грантовые программы Европы.`);
  }
  if (profile.annualBudgetUsd < 3000 && !profile.needsScholarship) {
    bottlenecks.push(`Ограниченный бюджет требует точечного фокуса на государственных грантах РК, Венгрии или Италии.`);
  }
  if (profile.gpa < 3.2) {
    bottlenecks.push(`GPA ${profile.gpa} требует компенсации сильным мотивационным письмом и внеклассными проектами.`);
  }
  if (bottlenecks.length === 0) {
    bottlenecks.push(`Высокая конкуренция среди топ-кандидатов: ключевую роль сыграет персональное эссе.`);
  }

  // Оценка общего профиля
  let overallStrength: 'высокая' | 'средняя' | 'требует_усиления' = 'средняя';
  if (profile.gpa >= 3.6 && profile.ielts >= 6.5) {
    overallStrength = 'высокая';
  } else if (profile.gpa < 3.0 || (profile.ielts < 5.5 && profile.ielts > 0)) {
    overallStrength = 'требует_усиления';
  }

  const keyAdvice = overallStrength === 'высокая'
    ? 'Твой профиль конкурентен для топ-вузов с полным финансированием. Фокусируйся на портфолио и сильном эссе.'
    : 'Сделай упор на сдачу одного ключевого стандартизированного теста (IELTS/ЕНТ) и закладывай в список 2 надежных Safety-вуза.';

  const scholarshipEligibility = profile.needsScholarship || profile.annualBudgetUsd < 4000
    ? 'Высокие шансы на правительственные стипендии (Гранты РК, Stipendium Hungaricum, DSU Италия).'
    : 'Доступен широкий спектр академических скидок (Merit-based) от 20% до 70%.';

  return {
    overallStrength,
    strongPoints,
    bottlenecks,
    keyAdvice,
    scholarshipEligibility,
  };
}