import React from 'react';
import { Sparkle, Check, Lightning } from '@phosphor-icons/react';

export const DEMO_PRESETS = [
  {
    id: 'alikhan',
    icon: '🇰🇿',
    name: { RU: 'Алихан', KZ: 'Әлихан', ENG: 'Alikhan' },
    label: { RU: 'Алихан (ЕНТ 125)', KZ: 'Әлихан (ҰБТ 125)', ENG: 'Alikhan (ENT 125)' },
    tag: { RU: 'IT грант РК', KZ: 'ҚР IT гранты', ENG: 'KZ IT Grant' },
    desc: {
      RU: 'ЕНТ 125/140 · Информатика · Целевые гранты в КБТУ, SDU, NU',
      KZ: 'ҰБТ 125/140 · Информатика · ҚБТУ, SDU, NU мақсатты гранттары',
      ENG: 'ENT 125/140 · Informatics · Target grants at KBTU, SDU, NU',
    },
    data: {
      category: 1,
      interests: ['IT'],
      gpa: 3.8,
      ielts: 6.5,
      ent: '125',
      sat: '',
      budget: 0,
      countries: ['Казахстан'],
      achievements: [],
      favorite: 'kbtu',
      compare: ['kbtu', 'sdu', 'nu'],
    },
    toast: {
      RU: '⚡ Профиль Алихана загружен: ЕНТ 125, IT-грант РК (КБТУ / SDU / NU)',
      KZ: '⚡ Әлиханның бейнесі жүктелді: ҰБТ 125, ҚР IT гранты (ҚБТУ / SDU / NU)',
      ENG: '⚡ Alikhan profile loaded: ENT 125, KZ IT Grant (KBTU / SDU / NU)',
    },
  },
  {
    id: 'aruzhan',
    icon: '🌍',
    name: { RU: 'Аружан', KZ: 'Аружан', ENG: 'Aruzhan' },
    label: { RU: 'Аружан (SAT 1420)', KZ: 'Аружан (SAT 1420)', ENG: 'Aruzhan (SAT 1420)' },
    tag: { RU: 'Зарубеж · Грант $0', KZ: 'Шетел · Грант $0', ENG: 'Intl Grant $0' },
    desc: {
      RU: 'IELTS 7.5 · SAT 1420 · Знак «Алтын белгі» · Стипендии в Padua (DSU), KAIST',
      KZ: 'IELTS 7.5 · SAT 1420 · «Алтын белгі» · Padua (DSU), KAIST стипендиялары',
      ENG: 'IELTS 7.5 · SAT 1420 · Honors · Scholarships at Padua (DSU), KAIST',
    },
    data: {
      category: 2,
      interests: ['IT', 'Инженерия'],
      gpa: 3.9,
      ielts: 7.5,
      ent: '',
      sat: '1420',
      budget: 0,
      countries: ['Италия', 'Корея'],
      achievements: ['altyn_belgi'],
      favorite: 'padua',
      compare: ['padua', 'kaist', 'nu'],
    },
    toast: {
      RU: '⚡ Профиль Аружан загружен: IELTS 7.5, SAT 1420, Зарубежные гранты $0 (Padua DSU / KAIST)',
      KZ: '⚡ Аружанның бейнесі жүктелді: IELTS 7.5, SAT 1420, Шетелдік $0 гранттар (Padua / KAIST)',
      ENG: '⚡ Aruzhan profile loaded: IELTS 7.5, SAT 1420, Full Intl Grants (Padua DSU / KAIST)',
    },
  },
  {
    id: 'daniyar',
    icon: '🌾',
    name: { RU: 'Данияр (Квота 35%)', KZ: 'Данияр (Квота 35%)', ENG: 'Daniyar (Quota 35%)' },
    label: { RU: 'Данияр (Квота 35%)', KZ: 'Данияр (Квота 35%)', ENG: 'Daniyar (Quota 35%)' },
    tag: { RU: 'Сельская школа · ЕНТ 92', KZ: 'Ауыл мектебі · ҰБТ 92', ENG: 'Rural quota · ENT 92' },
    desc: {
      RU: '10–11 класс · Сельская школа · Ауыл квотасы 35% · Проходной грант в КазНУ / Сатпаев',
      KZ: '10–11 сынып · Ауыл мектебі · Ауыл квотасы 35% · ҚазҰУ / Сәтбаев гранттары',
      ENG: 'Grade 10-11 · Rural school · 35% Rural Quota · Passing grant at KazNU / Satbayev',
    },
    data: {
      category: 0,
      interests: ['IT', 'Инженерия'],
      gpa: 3.5,
      ielts: 5.5,
      ent: '92',
      sat: '',
      budget: 0,
      countries: ['Казахстан'],
      achievements: ['rural_quota'],
      favorite: 'satbayev',
      compare: ['kaznu', 'satbayev', 'kbtu'],
    },
    toast: {
      RU: '⚡ Профиль Данияра загружен: Сельская школа, ЕНТ 92, льгота «Ауыл квотасы 35%»',
      KZ: '⚡ Даниярдың бейнесі жүктелді: Ауыл мектебі, ҰБТ 92, «Ауыл квотасы 35%» жеңілдігі',
      ENG: '⚡ Daniyar profile loaded: Rural school, ENT 92, 35% Rural Quota track activated',
    },
  },
];

export function PitchPresetsRibbon({ activePreset, onSelect, lang = 'RU' }) {
  const titles = {
    RU: 'Быстрые демо-профили (для жюри):',
    KZ: 'Қазылар үшін жылдам демо-бейнелер:',
    ENG: 'Jury Demo Profiles:',
  };

  return (
    <aside className="pitch-presets-bar" aria-label={titles[lang] || titles.RU}>
      <div className="pitch-presets-container">
        <div className="pitch-presets-label">
          <Lightning size={15} weight="fill" />
          <span>{titles[lang] || titles.RU}</span>
        </div>
        <div className="pitch-presets-list" role="group">
          {DEMO_PRESETS.map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`pitch-preset-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(p.id)}
                title={p.desc[lang] || p.desc.RU}
                aria-pressed={isActive}
              >
                <span className="preset-icon">{p.icon}</span>
                <span className="preset-name">{p.label[lang] || p.label.RU}</span>
                <span className="preset-badge">{p.tag[lang] || p.tag.RU}</span>
                {isActive && <Check size={14} weight="bold" className="preset-check" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
