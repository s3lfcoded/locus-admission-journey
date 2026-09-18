import {useEffect, useState} from 'react';
export function useSavedState(key, initial) {
  const [value,setValue]=useState(()=>{try {const parsed=JSON.parse(localStorage.getItem('unipath-v1-'+key));return parsed!==null && typeof parsed===typeof initial && Array.isArray(parsed)===Array.isArray(initial)?parsed:initial;}catch{return initial;}});
  useEffect(()=>{try{localStorage.setItem('unipath-v1-'+key,JSON.stringify(value));}catch{/* Private browsing may disable storage. */}},[key,value]);
  return [value,setValue];
}
export const taskGuides=[
 ['15 минут','Запроси выписку с оценками и проверь имя, период обучения и шкалу оценивания.','Читаемая копия выписки сохранена в твоей папке документов.'],
 ['20 минут','Сравни учебные планы двух программ и выпиши предметы, которые тебе интересны.','Выбрано направление и записаны причины выбора.'],
 ['10–15 минут','Проверь формат экзамена, доступные даты и срок получения результатов.','Дата и экзаменационный центр выбраны; условия регистрации проверены.'],
 ['Первый черновик · 45 минут','Запиши три примера своих проектов, причину выбора программы и цель обучения.','Есть первый черновик письма с конкретными примерами.'],
 ['По расписанию экзамена','Подготовь документ для идентификации и проверь инструкции экзаменационного центра.','Результат получен и внесён в профиль.'],
 ['30–60 минут','Сверь документы с требованиями программы, проверь файлы и отправь заявку.','Письмо или номер подтверждения подачи сохранены.']
];
export function MatchDetails(){return <details className="match-explainer"><summary>Как читать подборку и Match?</summary><div><b>Три опоры для решения</b><div className="match-factors"><span>01 · Интересы и программа</span><span>02 · Баллы и требования</span><span>03 · Бюджет и страна</span></div><p>UniPath AI в реальном времени пересчитывает соответствие по каталогу из 36 университетов на основе выбранных направлений, академических баллов (GPA, IELTS, ЕНТ, SAT), бюджета и стран поступления. Карточки отсортированы по проценту Match и разделены на категории Safety, Target и Reach.</p></div></details>}
