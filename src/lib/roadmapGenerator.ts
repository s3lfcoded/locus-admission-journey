import { RoadmapStep, UserProfile, University } from '../data/types';

export function generateRoadmap(profile: UserProfile, targetUni?: University): RoadmapStep[] {
  const isAbroad = profile.target === 'abroad_study' || (targetUni && targetUni.country !== 'Казахстан');
  const uniName = targetUni ? targetUni.name : 'выбранные вузы';

  const steps: RoadmapStep[] = [
    {
      id: 'step_diagnostic_check',
      title: 'Сверить проходные баллы и зафиксировать целевые университеты',
      category: 'активности',
      deadlineDate: '2026-10-15',
      timeRemaining: '30 дней',
      description: `Утвердить список из 1 Safety, 2 Target и 1 Reach вузов, включая ${uniName}.`,
      completed: true,
      priority: 'высокий',
    },
    {
      id: 'step_language_exam',
      title: isAbroad ? 'Сдать языковой сертификат IELTS / TOEFL' : 'Сдать пробное ЕНТ / диагностический тест',
      category: 'экзамены',
      deadlineDate: '2026-11-20',
      timeRemaining: '2 месяца',
      description: isAbroad
        ? `Необходимый целевой балл для поступления: ${targetUni ? targetUni.minIelts : '6.5+'}. Записаться на официальную сессию.`
        : 'Подтянуть профильные предметы и набрать минимум 95+ баллов для гарантии гранта.',
      completed: false,
      priority: 'высокий',
      links: [
        { title: 'Официальная запись на экзамен', url: 'https://www.britishcouncil.kz' }
      ]
    },
    {
      id: 'step_transcripts_recommendations',
      title: 'Подготовить академический транскрипт и взять 2 рекомендации',
      category: 'документы',
      deadlineDate: '2026-12-10',
      timeRemaining: '3 месяца',
      description: 'Запросить выписку оценок за 9–11 классы с нотариальным переводом на английский язык и договориться с учителями точных наук о характеристиках.',
      completed: false,
      priority: 'средний',
    },
    {
      id: 'step_motivation_letter',
      title: 'Написать персональное мотивационное эссе (Statement of Purpose)',
      category: 'документы',
      deadlineDate: '2027-01-10',
      timeRemaining: '4 месяца',
      description: 'Отразить личную мотивацию, связь внеучебных проектов с будущей профессией и почему именно эта учебная программа.',
      completed: false,
      priority: 'высокий',
    },
    {
      id: 'step_scholarship_application',
      title: 'Подать заявку на гранты и стипендиальные программы',
      category: 'дедлайны',
      deadlineDate: targetUni?.fallDeadline || '2027-01-25',
      timeRemaining: '5 месяцев',
      description: `Критический дедлайн подачи документов на финансовую помощь и стипендии в ${uniName}.`,
      completed: false,
      priority: 'высокий',
      links: [
        { title: 'Портал подачи заявки', url: targetUni?.officialUrl || 'https://nu.edu.kz' }
      ]
    },
    {
      id: 'step_visa_and_departure',
      title: 'Получение студенческой визы и бронирование общежития',
      category: 'дедлайны',
      deadlineDate: '2027-06-01',
      timeRemaining: '9 месяцев',
      description: 'Финальный этап после получения заветного приглашения (Letter of Acceptance). Оформление визы и подготовка к переезду.',
      completed: false,
      priority: 'плановый',
    }
  ];

  return steps;
}

export function getNextAction(steps: RoadmapStep[]): RoadmapStep | null {
  return steps.find(s => !s.completed) || null;
}