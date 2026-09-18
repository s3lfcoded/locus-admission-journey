import React, {useState, useEffect, useMemo} from 'react';
import {useSavedState,taskGuides,MatchDetails} from './Experience.jsx';
import {TRANSLATIONS} from './i18n.js';
import {UiKit} from './UiKit.jsx';
import {DesignGallery} from './DesignGallery.jsx';
import {PresentationDeck} from './PresentationDeck.jsx';
import {EssayAssistant} from './EssayAssistant.jsx';
import {evaluateAdmissionState} from './admissionBridge.js';
import {DEMO_PRESETS, PitchPresetsRibbon} from './PitchPresets.jsx';
import {getPersonalizedDiagnostics} from './diagnosticEngine.js';
import {RoadmapPdfDocument} from './RoadmapPdf.jsx';
import './roadmap-pdf.css';
import {ArrowRight,ArrowLeft,Check,GraduationCap,GlobeHemisphereWest,Student,Sparkle,Target,MapTrifold,CheckCircle,WarningCircle,ArrowUpRight,Plus,Clock,ListChecks,Path,CalendarBlank,Lightning,FilePdf,ShieldCheck,TrendUp,Info,Coins,MapPin,Scales,Desktop,Gear,ChartBar,Stethoscope,Palette,Users,CaretDown,X} from '@phosphor-icons/react';
import {UniversityLogo} from './components/UniversityLogo.jsx';
import {UniPathLogo} from './components/UniPathLogo.jsx';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
const defaultSchools=[{id:'sdu',name:'SDU University',nameRu:'SDU University',place:'Казахстан · Каскелен',type:'Safety',match:94,mark:'SDU',color:'green',cost:'$2 800',living:'$300–450',ielts:'6.0',sat:'Не требуется',date:'15 июля 2027',iso:'2027-07-15',url:'https://sdu.edu.kz/',why:['Направление Computer Science','Обучение рядом с домом'],risk:'Грант зависит от отдельного конкурса.',confidenceTitle:'Официально подтверждено',bestProgramTitle:'Компьютерные науки (бакалавриат)'},{id:'padua',name:'University of Padua',nameRu:'Университет Падуи',place:'Италия · Падуя',type:'Target',match:89,mark:'UP',color:'blue',cost:'$2 900',living:'$700–950',ielts:'6.5',sat:'Зависит от программы',date:'2 февраля 2027',iso:'2027-02-02',url:'https://www.unipd.it/en/',why:['Программы информационных технологий','Варианты стипендий по конкурсу'],risk:'Учти проживание и перевод документов.',confidenceTitle:'Официально подтверждено',bestProgramTitle:'Information Engineering & Computer Science'},{id:'nu',name:'Nazarbayev University',nameRu:'Назарбаев Университет',place:'Казахстан · Астана',type:'Reach',match:78,mark:'NU',color:'amber',cost:'Грант по конкурсу',living:'$350–550',ielts:'7.0',sat:'1 400',date:'15 января 2027',iso:'2027-01-15',url:'https://nu.edu.kz/',why:['Англоязычная академическая среда','Исследовательские проекты в IT'],risk:'Высокая конкуренция; проверь требования к тестам.',confidenceTitle:'Официально подтверждено',bestProgramTitle:'Инженерия и цифровые науки'}];
const initialTasks=[{name:'Добавить академическую выписку',date:'12 сентября',tag:'Документы',done:true},{name:'Определиться с направлением',date:'14 сентября',tag:'Активности',done:true},{name:'Выбрать дату IELTS',date:'23 сентября',tag:'Экзамены',done:false},{name:'Подготовить мотивационное письмо',date:'20 октября',tag:'Документы',done:false},{name:'Сдать IELTS и добавить результат',date:'10 ноября',tag:'Экзамены',done:false},{name:'Отправить заявку в университет',date:'',tag:'Дедлайны',done:false}];
const catIcons=[Student,GraduationCap,GlobeHemisphereWest];
function downloadIcsCalendar(tasks, school, taskDates) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UniPath AI//Admission Journey 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  tasks.forEach((task, idx) => {
    const rawIso = taskDates[idx] || '2026-10-20';
    const cleanDate = rawIso.replace(/-/g, '');
    lines.push(
      'BEGIN:VEVENT',
      `UID:unipath-${idx}-${cleanDate}@unipath.ai`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      `SUMMARY:UniPath: ${task.name} (${school.name})`,
      `DESCRIPTION:Этап поступления: ${task.name}. Целевой университет: ${school.name}. Сформировано UniPath AI.`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `admission-journey-${school.id || 'unipath'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const STEP_LABELS = {
  RU: ['Профиль', 'Диагностика', 'Университеты', 'Сравнение', 'Маршрут', 'Следующий шаг'],
  KZ: ['Профиль', 'Диагностика', 'Университеттер', 'Салыстыру', 'Маршрут', 'Келесі қадам'],
  ENG: ['Profile', 'Diagnostics', 'Universities', 'Comparison', 'Roadmap', 'Next Step'],
};

export function App(){
 const [lang,setLang]=useSavedState('lang','RU');
 const t=TRANSLATIONS[lang]||TRANSLATIONS.RU;
 const steps=t.steps;
 const categories=t.categories.map((c,i)=>[c.title,c.desc,catIcons[i]]);
 const [step,setStep]=useState(readStep),[category,setCategory]=useSavedState('category',0),[interests,setInterests]=useSavedState('interests',['IT']),[gpa,setGpa]=useSavedState('gpa',3.6),[ielts,setIelts]=useSavedState('ielts',6.5),[budget,setBudget]=useSavedState('budget',3000),[countries,setCountries]=useSavedState('countries',['Казахстан','Италия']),[achievements,setAchievements]=useSavedState('achievements',[]),[filter,setFilter]=useState('Все'),[compare,setCompare]=useSavedState('compare',['sdu','padua']),[favorite,setFavorite]=useSavedState('favorite','padua'),[tasks,setTasks]=useSavedState('tasks',initialTasks),[toast,setToast]=useState(''),[activePreset,setActivePreset]=useSavedState('activePreset',null);
 const [undoTasks,setUndoTasks]=useState(null);
 const [showLangMenu,setShowLangMenu]=useState(false);
 const [showPresets,setShowPresets]=useState(false);
 const [ent,setEnt]=useSavedState('ent',''),[sat,setSat]=useSavedState('sat','');
 const applyPreset=(presetId)=>{
   const p=DEMO_PRESETS.find(x=>x.id===presetId);
   if(!p)return;
   const d=p.data;
   setCategory(d.category);
   setInterests(d.interests);
   setGpa(d.gpa);
   setIelts(d.ielts);
   setEnt(d.ent);
   setSat(d.sat);
   setBudget(d.budget);
   setCountries(d.countries);
   setAchievements(d.achievements);
   setFavorite(d.favorite);
   setCompare(d.compare);
   setActivePreset(presetId);
   setToast(p.toast[lang]||p.toast.RU);
   if(step===0)go(1);
 };
 useEffect(()=>{document.querySelector('nav .current')?.scrollIntoView({block:'nearest',inline:'center'});},[step]);
 useEffect(()=>{const sync=()=>setStep(readStep());window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync)},[]);
 const entError=ent!==''&&(!Number.isInteger(Number(ent))||Number(ent)<0||Number(ent)>140);
 const satError=sat!==''&&(!Number.isInteger(Number(sat))||Number(sat)<400||Number(sat)>1600);
 const formError=entError?'ЕНТ: введи целый балл от 0 до 140.':satError?'SAT: введи целый балл от 400 до 1600.':!interests.length?'Выбери хотя бы одно направление.':!countries.length?'Выбери хотя бы одну страну.':'';
 const engineResult=useMemo(()=>{
   return evaluateAdmissionState({interests,gpa,ielts,ent,sat,budget,countries,category,achievements});
 },[interests,gpa,ielts,ent,sat,budget,countries,category,achievements]);
  const diagnostics=useMemo(()=>{
    return getPersonalizedDiagnostics({
      gpa,
      ielts,
      ent,
      sat,
      budget,
      countries,
      interests,
      achievements,
      category,
      engineResult,
      lang
    });
  },[gpa,ielts,ent,sat,budget,countries,interests,achievements,category,engineResult,lang]);
 const schools=engineResult?.schools?.length?engineResult.schools:defaultSchools;
 const school=schools.find(s=>s.id===favorite)||schools[0]||defaultSchools[0];
 const done=tasks.filter(t=>t.done).length,next=tasks.findIndex(t=>!t.done);
 const go=n=>{setStep(n);const url=new URL(window.location.href);url.searchParams.set('screen',n+1);window.history.pushState({},'',url);window.scrollTo({top:0,behavior:'instant'});};
 const taskDates=['2026-09-12','2026-09-14','2026-09-23','2026-10-20','2026-11-10',school.iso||'2027-07-15'];
 const taskDays=next<0?0:Math.max(0,Math.ceil((new Date(taskDates[next]+'T00:00:00')-new Date().setHours(0,0,0,0))/86400000));
 const toggle=(x,items,set)=>set(items.includes(x)?items.filter(v=>v!==x):[...items,x]);
 const select=id=>{setFavorite(id);go(5);};
 const complete=()=>{if(next<0)return;setUndoTasks(tasks);setTasks(tasks.map((t,i)=>i===next?{...t,done:true}:t));setToast('Готово! Следующий шаг уже перед тобой.');};
 const undo=()=>{if(undoTasks)setTasks(undoTasks);setUndoTasks(null);setToast('');};
 const notice=<div className="notice"><WarningCircle size={20}/><span><b>{lang==='KZ'?'Адал белгісіздік.':lang==='ENG'?'Honest uncertainty.':'Честная неопределённость.'}</b> {t.notice}</span></div>;
 if(window.location.pathname==='/ui-kit')return <UiKit/>;
 if(window.location.pathname==='/designs')return <DesignGallery/>;
 if(window.location.pathname==='/presentation')return <PresentationDeck/>;
  return <>
    <header className="modern-header-wrap">
      <div className="modern-topbar">
        <div className="modern-brand-group">
          <button type="button" className="modern-brand-btn" onClick={()=>go(0)}>
            <UniPathLogo size={30} />
            <span className="modern-brand-title">UniPath <span>AI</span></span>
          </button>
        </div>

        <div className="modern-topbar-actions">
          <a href="/designs" style={{color:'#64748b',fontSize:'13px',fontWeight:500,marginRight:'8px'}}>{t.allDesigns}</a>

          <div className="modern-lang-dropdown">
            <button
              type="button"
              className="modern-lang-btn"
              onClick={()=>setShowLangMenu(!showLangMenu)}
              aria-label="Выбор языка"
            >
              <GlobeHemisphereWest size={16} />
              <span>{lang}</span>
              <CaretDown size={12} weight="bold" />
            </button>
            {showLangMenu && (
              <div className="modern-lang-menu">
                {['RU', 'KZ', 'ENG'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`modern-lang-option ${lang === l ? 'active' : ''}`}
                    onClick={() => { setLang(l); setShowLangMenu(false); }}
                  >
                    <span>{l === 'RU' ? 'Русский' : l === 'KZ' ? 'Қазақша' : 'English'}</span>
                    {lang === l && <Check size={12} weight="bold" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`modern-demo-badge-btn ${showPresets ? 'active' : ''}`}
            onClick={()=>setShowPresets(!showPresets)}
            title="Быстрые демо-профили для жюри"
          >
            <Lightning size={15} weight="fill" style={{ color: '#1765ed' }} />
            <span>{t.demoBadge}</span>
          </button>
        </div>
      </div>

      {step > 0 && (
        <div className="modern-stepper-bar">
          <div className="modern-stepper-list">
            {(STEP_LABELS[lang] || STEP_LABELS.RU).map((name, i) => {
              const stepIdx = i + 1;
              const isActive = step === stepIdx;
              const isPast = step > stepIdx;
              return (
                <React.Fragment key={name}>
                  <button
                    type="button"
                    className={`modern-step-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => go(stepIdx)}
                  >
                    <span className="modern-step-circle">
                      {isPast ? <Check size={13} weight="bold" /> : stepIdx}
                    </span>
                    <span>{name}</span>
                  </button>
                  {i < 5 && (
                    <span className={`modern-step-sep ${isPast ? 'completed' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </header>

    {(showPresets || activePreset) && (
      <PitchPresetsRibbon activePreset={activePreset} onSelect={applyPreset} lang={lang}/>
    )}

  <main className={step===0?'landing':'workspace'}>{step===0?<><section className="hero-copy"><div className="eyebrow"><span/>{t.landing.eyebrow}</div><h1>{t.landing.h1_1}<br/>{t.landing.h1_2}<br/><em>{t.landing.h1_em}</em></h1><p className="lead">{t.landing.lead}</p><div className="category-label">{t.landing.catLabel}</div><div className="categories" role="radiogroup" aria-label="Категория абитуриента">{categories.map(([title,desc,Icon],i)=><button key={title} className={'category '+(category===i?'selected':'')} onClick={()=>setCategory(i)} role="radio" aria-checked={category===i} tabIndex={category===i?0:-1} onKeyDown={e=>{if(["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(e.key)){e.preventDefault();const n=(i+(["ArrowRight","ArrowDown"].includes(e.key)?1:2))%3;setCategory(n);e.currentTarget.parentElement.children[n].focus();}}}><span className="category-icon"><Icon size={26}/></span><span><b>{title}</b><small>{desc}</small></span><span className="radio">{category===i&&<span/>}</span></button>)}</div><button className="primary hero-cta" onClick={()=>go(1)}>{t.landing.cta} <ArrowRight size={22}/></button><p className="micro">{t.landing.micro}</p></section><aside className="hero-art"><div className="photo-wrap"><img src="/assets/campus.png" alt="Иллюстрация университетского кампуса"/></div><div className="photo-caption">{t.landing.caption}</div>{t.landing.routes.map((rc,i)=>{const Icon=catIcons[i];const color=['blue','green','amber'][i];return <div key={rc.title} className={`route-card route-${i}`}><span className={'route-icon '+color}><Icon size={25}/></span><div><small>0{i+1} / {rc.eyebrow}</small><b>{rc.title}</b><p>{rc.text}</p></div>{i===0?<CheckCircle size={23} weight="fill" className="green-text"/>:i===1?<span className="match">94%<small>match</small></span>:<ArrowRight size={22}/>}</div>;})}<div className="art-note"><Sparkle size={18}/>{t.landing.note}</div></aside></>:<><div className="page-top"><button className="back" onClick={()=>go(step-1)}><ArrowLeft/>{t.nav.back}</button><span>{t.nav.stepOf(step)}</span></div>
    {step===1&&(
      <>
        <div className="step1-hero-section">
          <div className="step1-eyebrow">
            {lang==='KZ'?'СЕНІҢ ЖОЛЫҢ ОСЫ ЖЕРДЕН БАСТАЛАДЫ':lang==='ENG'?'YOUR JOURNEY STARTS HERE':'ТВОЙ ПУТЬ НАЧИНАЕТСЯ ЗДЕСЬ'}
          </div>
          <h1 className="step1-hero-title">
            {lang==='KZ'?'Үлкен жоспарлар сенен басталады.':lang==='ENG'?'Big plans start with you.':'Большие планы начинаются с тебя.'}
          </h1>
          <p className="step1-hero-sub">
            {lang==='KZ'?'Өзің туралы айтып бер — біз жеке маршрут құрастырамыз.':lang==='ENG'?'Tell us about yourself — we will build a personalized roadmap.':'Расскажи о себе — мы соберём персональный маршрут.'}
          </p>
          <div className="step1-handwriting-note">
            <span className="step1-handwriting-text">
              {lang==='KZ'?'Үлкен мақсатқа бірнеше қадам':lang==='ENG'?'A few steps to big goals':'Пару шагов до больших целей'}
            </span>
            <svg className="step1-handwriting-arrow" width="54" height="38" viewBox="0 0 54 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4 C 20 2, 42 12, 46 32 M 46 32 L 38 26 M 46 32 L 50 22" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="step1-layout-grid">
          {/* Main Left Form Card */}
          <section className="step1-form-card">
            {/* Question 1: Interests */}
            <div className="step1-q-block">
              <div className="step1-q-header">
                <h3 className="step1-q-title">
                  1. {lang==='KZ'?'Саған не қызық?':lang==='ENG'?'What are you interested in?':'Что тебе интересно?'}
                  <span className="step1-q-hint">({lang==='KZ'?'бірнешеуін таңдауға болады':lang==='ENG'?'multiple choice':'можно выбрать несколько'})</span>
                </h3>
              </div>
              <div className="step1-interests-grid">
                {[
                  { id: 'IT', label: 'IT', icon: Desktop },
                  { id: 'Инженерия', label: lang==='KZ'?'Инженерия':lang==='ENG'?'Engineering':'Инженерия', icon: Gear },
                  { id: 'Бизнес', label: lang==='KZ'?'Бизнес':lang==='ENG'?'Business':'Бизнес', icon: ChartBar },
                  { id: 'Медицина', label: lang==='KZ'?'Медицина':lang==='ENG'?'Medicine':'Медицина', icon: Stethoscope },
                  { id: 'Право', label: lang==='KZ'?'Құқық':lang==='ENG'?'Law':'Право', icon: Scales },
                  { id: 'Дизайн', label: lang==='KZ'?'Дизайн':lang==='ENG'?'Design':'Дизайн', icon: Palette },
                ].map((item) => {
                  const isChosen = interests.includes(item.id);
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isChosen}
                      className={`step1-interest-btn ${isChosen ? 'chosen' : ''}`}
                      onClick={() => toggle(item.id, interests, setInterests)}
                    >
                      <IconComp size={18} weight="bold" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions 2 & 3: GPA & IELTS */}
            <div className="step1-two-col">
              <div className="step1-q-col">
                <div className="step1-q-header">
                  <div className="step1-q-title">
                    <span>2. {lang==='KZ'?'Орташа балл (GPA)':lang==='ENG'?'Grade Point Average (GPA)':'Средний балл (GPA)'}</span>
                    <Info size={15} weight="bold" className="step1-info-icon" title="Средний балл аттестата по шкале 4.0" />
                  </div>
                  <span className="step1-range-hint">2.5 – 4.0</span>
                </div>
                <div className="step1-slider-row">
                  <div className="step1-slider-track-wrap">
                    <input
                      type="range"
                      min="2.5"
                      max="4.0"
                      step="0.1"
                      value={gpa}
                      className="step1-range-input"
                      style={{
                        background: `linear-gradient(to right, #1765ed 0%, #1765ed ${((gpa - 2.5) / 1.5) * 100}%, #e2e8f0 ${((gpa - 2.5) / 1.5) * 100}%, #e2e8f0 100%)`
                      }}
                      onChange={(e) => setGpa(Number(e.target.value))}
                    />
                    <div className="step1-ticks-row">
                      <span>2.5</span>
                      <span>3.0</span>
                      <span>3.5</span>
                      <span>4.0</span>
                    </div>
                  </div>
                  <div className="step1-val-box">{gpa.toFixed(1)}</div>
                </div>
              </div>

              <div className="step1-q-col">
                <div className="step1-q-header">
                  <div className="step1-q-title">
                    <span>3. {lang==='KZ'?'IELTS нәтижесі':lang==='ENG'?'IELTS Score':'Результат IELTS'}</span>
                    <Info size={15} weight="bold" className="step1-info-icon" title="Общий балл IELTS Academic" />
                  </div>
                  <span className="step1-range-hint">4.5 – 9.0</span>
                </div>
                <div className="step1-slider-row">
                  <div className="step1-slider-track-wrap">
                    <input
                      type="range"
                      min="4.5"
                      max="9.0"
                      step="0.5"
                      value={ielts}
                      className="step1-range-input"
                      style={{
                        background: `linear-gradient(to right, #1765ed 0%, #1765ed ${((ielts - 4.5) / 4.5) * 100}%, #e2e8f0 ${((ielts - 4.5) / 4.5) * 100}%, #e2e8f0 100%)`
                      }}
                      onChange={(e) => setIelts(Number(e.target.value))}
                    />
                    <div className="step1-ticks-row">
                      <span>4.5</span>
                      <span>6.0</span>
                      <span>7.5</span>
                      <span>9.0</span>
                    </div>
                  </div>
                  <div className="step1-val-box">{ielts.toFixed(1)}</div>
                </div>
              </div>
            </div>

            {/* Questions 4 & 5: ЕНТ & SAT */}
            <div className="step1-two-col">
              <div className="step1-q-col">
                <div className="step1-q-header">
                  <div className="step1-q-title">
                    <span>4. {lang==='KZ'?'ҰБТ (міндетті емес)':lang==='ENG'?'UNT (optional)':'ЕНТ (необязательно)'}</span>
                    <Info size={15} weight="bold" className="step1-info-icon" title="Балл Единого национального тестирования (0–140)" />
                  </div>
                </div>
                <div className="step1-input-wrap">
                  <input
                    type="number"
                    min="0"
                    max="140"
                    placeholder={lang==='KZ'?'Мысалы, 110':lang==='ENG'?'e.g. 110':'Например, 110'}
                    value={ent}
                    onChange={(e) => setEnt(e.target.value)}
                    className="step1-num-input"
                    aria-invalid={entError}
                  />
                  <span className="step1-input-badge">0 – 140</span>
                </div>
              </div>

              <div className="step1-q-col">
                <div className="step1-q-header">
                  <div className="step1-q-title">
                    <span>5. {lang==='KZ'?'SAT (міндетті емес)':lang==='ENG'?'SAT (optional)':'SAT (необязательно)'}</span>
                    <Info size={15} weight="bold" className="step1-info-icon" title="Балл теста SAT (400–1600)" />
                  </div>
                </div>
                <div className="step1-input-wrap">
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    placeholder={lang==='KZ'?'Мысалы, 1200':lang==='ENG'?'e.g. 1200':'Например, 1200'}
                    value={sat}
                    onChange={(e) => setSat(e.target.value)}
                    className="step1-num-input"
                    aria-invalid={satError}
                  />
                  <span className="step1-input-badge">400 – 1600</span>
                </div>
              </div>
            </div>

            {/* Question 6: Budget */}
            <div className="step1-q-block">
              <div className="step1-q-header">
                <div className="step1-q-title">
                  <span>6. {lang==='KZ'?'Оқуға жылдық бюджет (USD)':lang==='ENG'?'Annual Tuition Budget (USD)':'Годовой бюджет на обучение (USD)'}</span>
                  <Info size={15} weight="bold" className="step1-info-icon" title="Годовой бюджет без учёта проживания" />
                </div>
              </div>
              <div className="step1-slider-row">
                <div className="step1-slider-track-wrap">
                  <span className="step1-range-hint" style={{ marginBottom: '2px' }}>0 – 50 000+</span>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={budget}
                    className="step1-range-input"
                    style={{
                      background: `linear-gradient(to right, #1765ed 0%, #1765ed ${(budget / 50000) * 100}%, #e2e8f0 ${(budget / 50000) * 100}%, #e2e8f0 100%)`
                    }}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                  <div className="step1-ticks-row">
                    <span>0</span>
                    <span>10 000</span>
                    <span>25 000</span>
                    <span>50 000+</span>
                  </div>
                </div>
                <div className="step1-val-box" style={{ minWidth: '78px' }}>
                  {budget === 0 ? (lang==='KZ'?'Грант':'0') : budget.toLocaleString('ru-RU')}
                </div>
              </div>
              <div className="step1-budget-presets">
                {[
                  { val: 0, label: lang==='KZ'?'Тек грант':lang==='ENG'?'Grant only':'Только грант' },
                  { val: 3000, label: lang==='KZ'?'$3 000 дейін':lang==='ENG'?'Up to $3 000':'До $3 000' },
                  { val: 8000, label: lang==='KZ'?'$8 000 дейін':lang==='ENG'?'Up to $8 000':'До $8 000' },
                  { val: 35000, label: lang==='KZ'?'Жоғары бюджет':lang==='ENG'?'High budget':'Высокий бюджет' },
                ].map((bTier) => {
                  const isActive = bTier.val === 0 ? budget === 0 : bTier.val === 3000 ? budget > 0 && budget <= 3000 : bTier.val === 8000 ? budget > 3000 && budget <= 8000 : budget > 8000;
                  return (
                    <button
                      key={bTier.val}
                      type="button"
                      className={`step1-preset-pill ${isActive ? 'active' : ''}`}
                      onClick={() => setBudget(bTier.val)}
                    >
                      {bTier.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 7: Countries */}
            <div className="step1-q-block" style={{ marginBottom: '12px' }}>
              <div className="step1-q-header">
                <h3 className="step1-q-title">
                  7. {lang==='KZ'?'Қай елдерде оқуды қарастырасың?':lang==='ENG'?'Which countries are you considering?':'В каких странах рассматриваешь обучение?'}
                  <span className="step1-q-hint">({lang==='KZ'?'бірнешеуін таңдауға болады':lang==='ENG'?'multiple choice':'можно выбрать несколько'})</span>
                </h3>
              </div>
              <div className="step1-countries-list">
                {[
                  { code: 'kz', name: 'Казахстан', label: lang==='KZ'?'Қазақстан':lang==='ENG'?'Kazakhstan':'Казахстан' },
                  { code: 'de', name: 'Германия', label: lang==='KZ'?'Германия':lang==='ENG'?'Germany':'Германия' },
                  { code: 'it', name: 'Италия', label: lang==='KZ'?'Италия':lang==='ENG'?'Italy':'Италия' },
                  { code: 'kr', name: 'Корея', label: lang==='KZ'?'Корея':lang==='ENG'?'South Korea':'Корея' },
                  { code: 'tr', name: 'Турция', label: lang==='KZ'?'Түркия':lang==='ENG'?'Turkey':'Турция' },
                  { code: 'us', name: 'США', label: lang==='KZ'?'АҚШ':lang==='ENG'?'USA':'США' },
                ].map((c) => {
                  const isChosen = countries.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={isChosen}
                      className={`step1-country-chip ${isChosen ? 'chosen' : ''}`}
                      onClick={() => toggle(c.name, countries, setCountries)}
                    >
                      <span className={`fi fi-${c.code}`} style={{ borderRadius: '50%', width: '18px', height: '18px', objectFit: 'cover' }} />
                      <span>{c.label}</span>
                      {isChosen && (
                        <span className="step1-check-circle">
                          <Check size={11} weight="bold" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quotas & Honors */}
              <div className="step1-quotas-wrap">
                <div className="step1-quotas-title">
                  {lang==='KZ'?'Жеке жетістіктер мен квоталар:':lang==='ENG'?'Achievements & Quotas:':'Индивидуальные достижения и льготы:'}
                </div>
                <div className="step1-countries-list">
                  <button
                    type="button"
                    aria-pressed={achievements.includes('rural_quota')}
                    className={`step1-country-chip ${achievements.includes('rural_quota') ? 'chosen' : ''}`}
                    onClick={() => toggle('rural_quota', achievements, setAchievements)}
                  >
                    <span>🌾</span>
                    <span>{lang==='KZ'?'Ауыл квотасы (35% грант)':lang==='ENG'?'Rural school quota (35%)':'Сельская школа (Ауыл квотасы 35%)'}</span>
                    {achievements.includes('rural_quota') && (
                      <span className="step1-check-circle"><Check size={11} weight="bold" /></span>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-pressed={achievements.includes('altyn_belgi')}
                    className={`step1-country-chip ${achievements.includes('altyn_belgi') ? 'chosen' : ''}`}
                    onClick={() => toggle('altyn_belgi', achievements, setAchievements)}
                  >
                    <span>🎖️</span>
                    <span>{lang==='KZ'?'Алтын белгі / Олимпиада':lang==='ENG'?'Honors / Olympiad winner':'Знак «Алтын белгі» / Призёр олимпиад'}</span>
                    {achievements.includes('altyn_belgi') && (
                      <span className="step1-check-circle"><Check size={11} weight="bold" /></span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Amber Alert Banner */}
            <div className="step1-amber-banner">
              <WarningCircle size={20} weight="fill" style={{ color: '#ca8a04', flexShrink: 0 }} />
              <span>
                <b>{lang==='KZ'?'Адал белгісіздік.':lang==='ENG'?'Honest uncertainty.':'Честная неопределённость'}</b> • {lang==='KZ'?'Деректер демонстрациялық. Шарттарды ЖОО сайтында тексеріңіз.':lang==='ENG'?'Demo data. Verify official criteria on university websites.':'Данные демонстрационные. Условия проверяй на сайте вуза.'}
              </span>
            </div>
          </section>

          {/* Right Sidebar Card */}
          <aside className="step1-side-card">
            <div className="step1-sparkle-icon">
              <Sparkle size={28} weight="fill" />
            </div>
            <h2 className="step1-side-title">
              {lang==='KZ'?'Мінсіз емес. Дәл сенікі.':lang==='ENG'?'Not ideal. Truly yours.':'Не идеальный. Именно твой.'}
            </h2>
            <p className="step1-side-desc">
              {lang==='KZ'?'«Дұрыс» жауаптар жоқ. Сенің қызығушылығың маңызды. Біз мықты тұстарыңды ескеріп, сен білмеген мүмкіндіктерді ашуға көмектесеміз.':lang==='ENG'?'There are no "right" answers. What matters is what interests you. We identify your strengths and help you see opportunities you might not have known about.':'Нет «правильных» ответов. Важно, что интересно тебе. Мы учитываем твои сильные стороны и помогаем увидеть возможности, о которых ты мог не знать.'}
            </p>

            <div className="step1-side-features">
              <div className="step1-side-feature-item">
                <div className="step1-feature-icon-box">
                  <Target size={18} weight="bold" />
                </div>
                <span className="step1-feature-text">
                  {lang==='KZ'?'Қызығушылығыңа сай ЖОО таңдаймыз':lang==='ENG'?'Match universities to your interests':'Подбираем вузы под твои интересы'}
                </span>
              </div>
              <div className="step1-side-feature-item">
                <div className="step1-feature-icon-box">
                  <ChartBar size={18} weight="bold" />
                </div>
                <span className="step1-feature-text">
                  {lang==='KZ'?'Нақты мүмкіндіктерді көрсетеміз':lang==='ENG'?'Show real opportunities':'Показываем реальные возможности'}
                </span>
              </div>
              <div className="step1-side-feature-item">
                <div className="step1-feature-icon-box">
                  <Users size={18} weight="bold" />
                </div>
                <span className="step1-feature-text">
                  {lang==='KZ'?'Сенімді таңдау жасауға көмектесеміз':lang==='ENG'?'Help make a confident choice':'Помогаем сделать уверенный выбор'}
                </span>
              </div>
            </div>

            <div className="step1-inspire-art-wrap">
              <img
                src="/assets/campus-inspire.jpg"
                alt="Образование открывает мир"
                className="step1-inspire-img"
              />
            </div>
          </aside>
        </div>

        {formError && (
          <p id="form-error" className="form-error" role="status" style={{ marginTop: '16px' }}>
            <WarningCircle /> {formError}
          </p>
        )}

        {/* Bottom Navigation / Action Bar */}
        <div className="step1-bottom-bar">
          <div className="step1-footer-left">
            UniPath AI — {lang==='KZ'?'білім әлеміндегі шарлаушың':lang==='ENG'?'your education journey navigator':'твой навигатор в мире образования'}
          </div>
          <div className="step1-footer-date">
            17 сентября 2026
          </div>
          <div className="step1-footer-actions">
            <button
              type="button"
              className="step1-save-btn"
              onClick={() => setToast(lang==='KZ'?'Профиль сақталды!':lang==='ENG'?'Profile saved!':'Профиль сохранён в браузере!')}
            >
              {lang==='KZ'?'Сақтау және шығу':lang==='ENG'?'Save & Exit':'Сохранить и выйти'}
            </button>
            <button
              type="button"
              className="step1-cta-next"
              disabled={Boolean(formError)}
              onClick={() => go(2)}
            >
              <span>{lang==='KZ'?'Диагностиканы көру':lang==='ENG'?'View Diagnostics':'Посмотреть диагностику'}</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </>
    )}
    {step===2&&<><Title label={t.step2.eyebrow} title={gpa>=3.5?t.step2.titleHigh:t.step2.titleGrow} desc={t.step2.desc}/><div className={"profile-banner "+(gpa<3.5?"needs-growth":"")}><div><span className={"badge "+(gpa>=3.5?"green":"amber")}>{gpa>=3.5?t.step2.badgeHigh:t.step2.badgeGrow}</span><h2>{t.step2.bannerTitle}</h2><p>{interests.join(', ')} · {countries.join(', ')}</p></div><div className="stats"><div><b>{gpa.toFixed(1)}</b><span>GPA / 4.0</span></div><div><b>{ielts.toFixed(1)}</b><span>IELTS / 9.0</span></div>{ent&&<div><b>{ent}</b><span>ЕНТ / 140</span></div>}{sat&&<div><b>{sat}</b><span>SAT / 1600</span></div>}<div><b>{budget===0?t.step2.budgetGrant:`$${budget.toLocaleString('en-US')}`}</b><span>{t.step2.budgetPerYear}</span></div></div></div><div className="two-col"><section className="panel"><h3><CheckCircle className="green-text"/>{t.step2.strengthsTitle}</h3>{diagnostics.strengths.map((item,idx)=><Insight key={idx} good title={item.title} text={item.text}/>)}</section><section className="panel"><h3><WarningCircle className="amber-text"/>{t.step2.attentionTitle}</h3>{diagnostics.attentions.map((item,idx)=><Insight key={idx} title={item.title} text={item.text}/>)}</section></div><section className="strategy"><Sparkle size={28}/><div><div className="eyebrow">{t.step2.strategyEyebrow}</div><h2>{t.step2.strategyTitle}</h2><p>{t.step2.strategyDesc}</p></div></section>{notice}<div className="actions"><button className="secondary" onClick={()=>go(1)}>{t.step2.editProfile}</button><button className="primary" onClick={()=>go(3)}>{t.step2.nextUnis} <ArrowRight/></button></div></>}
    {step===3&&<><Title label={t.step3.eyebrow} title={t.step3.title} desc={t.step3.desc}/><div className="filter-row"><div className="tabs" role="tablist" aria-label="Фильтр категорий вузов"><button role="tab" aria-selected={filter==='Все'} className={filter==='Все'?'active':''} onClick={()=>setFilter('Все')}>{t.step3.allTab} ({schools.length})</button><button role="tab" aria-selected={filter==='Safety'} className={filter==='Safety'?'active':''} onClick={()=>setFilter('Safety')}><ShieldCheck size={16} weight="bold"/> Safety ({schools.filter(s=>s.type==='Safety').length})</button><button role="tab" aria-selected={filter==='Target'} className={filter==='Target'?'active':''} onClick={()=>setFilter('Target')}><Target size={16} weight="bold"/> Target ({schools.filter(s=>s.type==='Target').length})</button><button role="tab" aria-selected={filter==='Reach'} className={filter==='Reach'?'active':''} onClick={()=>setFilter('Reach')}><TrendUp size={16} weight="bold"/> Reach ({schools.filter(s=>s.type==='Reach').length})</button></div><button className="secondary compare-btn-nav" disabled={compare.length<2} onClick={()=>go(4)}><Scales size={18} weight="bold"/> {t.step3.compareBtn} <span className="count">{compare.length}</span></button></div><p className="small muted">{t.step3.safetyHint}</p><MatchDetails/><div className="university-grid">{schools.filter(s=>filter==='Все'||s.type===filter).map(s=><article className={"university panel tone-"+s.color} key={s.id}><div className="school-art" style={{backgroundImage:`url(/assets/campus-${s.id}.jpg), url(/assets/campus.png)`}} role="img" aria-label={`Кампус ${s.name}`} /><div className="school-body"><div className="school-header"><div className="school-emblem-wrap"><UniversityLogo id={s.id} mark={s.mark} size={42} /></div><div className="school-info-wrap"><h2 className="school-name">{s.name}</h2><div className="school-location"><MapPin size={13} weight="fill" /><span>{s.place}</span></div></div><div className={"school-badge " + s.type.toLowerCase()}>{s.type==='Safety'&&<ShieldCheck size={14} weight="bold" />}{s.type==='Target'&&<Target size={14} weight="bold" />}{s.type==='Reach'&&<TrendUp size={14} weight="bold" />}<span>{s.type}</span></div></div><div className="school-match-section"><div className="school-match-label-row"><span>Соответствие профилю</span><Info size={14} weight="bold" className="match-info-icon" title="Соответствие профилю рассчитывается на основе экзаменов, бюджета и требований программы" /></div><div className="school-match-score-row"><span className={"school-match-percent tone-" + s.color}>{s.match}%</span><div className="school-match-track"><span className={"school-match-fill tone-" + s.color} style={{width:`${s.match}%`}} /></div></div></div><div className="school-program-row"><GraduationCap size={22} weight="duotone" className="program-icon" /><div className="program-text"><small>Программа</small><b>{s.bestProgramTitle || 'Computer Science'}</b></div></div><div className="school-why-section"><h4>{lang==='KZ'?'Неліктен сәйкес келеді':lang==='ENG'?'Why it matches':'Почему подходит'}</h4>{s.why.slice(0, 2).map(x=><p className="reason-item" key={x}><CheckCircle size={16} weight="fill" className="why-check-icon" /><span>{x}</span></p>)}</div><div className="school-caution-box"><WarningCircle size={18} weight="fill" className="caution-icon" /><span>{s.risk}</span></div><div className="school-facts-grid"><div className="fact-col"><Coins size={20} weight="duotone" className="fact-icon" /><div className="fact-text"><small>{lang==='KZ'?'Оқу ақысы':lang==='ENG'?'Tuition fee':'Стоимость обучения'}</small><b>{s.cost}{s.cost.includes('$') || s.cost.includes('₸') ? ' / год' : ''}</b></div></div><div className="fact-col"><CalendarBlank size={20} weight="duotone" className="fact-icon" /><div className="fact-text"><small>{lang==='KZ'?'Құжат тапсыру мерзімі':lang==='ENG'?'Application deadline':'Крайний срок подачи'}</small><b>{s.date}</b></div></div></div><div className="school-card-actions"><label className="compare-checkbox-label"><input type="checkbox" checked={compare.includes(s.id)} onChange={()=>toggle(s.id,compare,setCompare)}/><span>{lang==='KZ'?'Салыстыруға қосу':lang==='ENG'?'Add to compare':'Добавить к сравнению'}</span></label><a href={s.url} target="_blank" rel="noreferrer" className="official-link">{t.step3.officialSite || 'Официальный сайт'} <ArrowUpRight size={13} /></a></div><button className="primary full select-target-cta" onClick={()=>select(s.id)}>{t.step3.setTarget || 'Выбрать целевым'}</button></div></article>)}</div>{notice}<div className="compare-tray"><div><b>{t.step3.trayTitle} <span className="count">{compare.length} / 3</span></b><p>{compare.length>=2?t.step3.traySubReady:t.step3.traySubNeed}</p></div><div className="selected-schools">{schools.filter(s=>compare.includes(s.id)).map(s=><button key={s.id} aria-label={`Убрать ${s.name} из сравнения`} onClick={()=>toggle(s.id,compare,setCompare)}>{s.mark} <span>×</span></button>)}</div><button className="primary" disabled={compare.length<2} onClick={()=>go(4)}>{t.step3.compareBtn} {compare.length>0&&compare.length}<ArrowRight/></button></div></>}
   {step===4&&<><Title label={t.step4.eyebrow} title={t.step4.title} desc={t.step4.desc}/><div className="comparison-tools"><span className="small muted">{compare.length} из {schools.length} вариантов · голубым выделена текущая цель</span><button className="text-button" onClick={()=>go(3)}><Plus/>{t.step4.changeList}</button></div><p className="small muted mobile-hint">Листай таблицу вправо, чтобы увидеть остальные вузы →</p><div className="comparison-wrap" role="region" aria-label="Сравнение университетов" tabIndex={0}>{compare.length>0&&<table><thead><tr><th>Что важно для тебя</th>{schools.filter(s=>compare.includes(s.id)).map(s=><th key={s.id} className={s.id===favorite?'favored':''}><span className={'badge '+s.color}>{s.type}</span><h2>{s.name}</h2><span className="muted">{s.place}</span><button className="remove-school" aria-label={`Убрать ${s.name} из сравнения`} onClick={()=>toggle(s.id,compare,setCompare)}>{t.step4.removeSchool}</button></th>)}</tr></thead><tbody>{[[t.step4.rowTuition,'cost'],[t.step4.rowLiving,'living'],[t.step4.rowIelts,'ielts'],[t.step4.rowSat,'sat'],[t.step4.rowDeadline,'date'],['Достоверность данных','confidenceTitle'],[t.step4.rowGrants,null],[t.step4.rowAcceptRate,null]].map(([title,key],i)=><tr key={title}><th>{title}</th>{schools.filter(s=>compare.includes(s.id)).map(s=><td key={s.id} className={s.id===favorite?'favored':''}>{key?s[key]:i===6?'По отдельному конкурсу':'Нет проверенных данных'}</td>)}</tr>)}<tr><th>{t.step4.nextStepHeader}</th>{schools.filter(s=>compare.includes(s.id)).map(s=><td key={s.id} className={s.id===favorite?'favored':''}><button className="primary" onClick={()=>select(s.id)}>{t.step4.confirmRoadmap} <ArrowRight/></button></td>)}</tr></tbody></table>}{compare.length<2&&<p className="empty">{t.step4.emptyHint} <button className="text-button" onClick={()=>go(3)}>Выбрать вузы →</button></p>}</div>{notice}</>}
    {step===5&&<><Title label={t.step5.eyebrow} title={t.step5.title} desc={t.step5.desc(school.name)}/><div className="roadmap-layout"><section><div className="progress-panel"><div><b>{t.step5.progressDone(done)}</b><strong>{Math.round(done/6*100)}%</strong></div><div className="progress-track" role="progressbar" aria-label="Прогресс маршрута" aria-valuemin={0} aria-valuemax={6} aria-valuenow={done}><span style={{width:`${done/6*100}%`}}/></div><p className="muted small">{done===6?t.step5.allDone:t.step5.keepGoing}</p></div><div className="timeline">{tasks.map((tItem,i)=><div key={tItem.name} className={'task '+(tItem.done?'done':'')+(i===next?' next':'')}><button className="task-check" aria-label={`${tItem.done?'Снять отметку':'Выполнить'}: ${tItem.name}`} aria-pressed={tItem.done} onClick={()=>setTasks(tasks.map((x,j)=>j===i?{...x,done:!x.done}:x))}>{tItem.done&&<Check weight="bold"/>}</button><div className="task-content"><div className="task-meta"><span>{tItem.date||school.date}</span><span className={'badge '+({Экзамены:'blue',Документы:'slate',Дедлайны:'amber',Активности:'green'}[tItem.tag])}>{tItem.tag}</span></div><h3>{tItem.name}</h3><p>{tItem.done?t.step5.stepDone:i===next?t.step5.stepNext:t.step5.stepPlan}</p><details className="task-details"><summary>{t.step5.detailsPrep}</summary><p>{taskGuides[i][1]}</p><small><Clock size={13}/> {taskGuides[i][0]}</small></details>{i===3&&<div style={{marginTop:'0.85rem'}}><EssayAssistant schoolName={school.name} interests={interests} gpa={gpa} lang={lang} onCopied={msg=>setToast(msg)} defaultOpen={false}/></div>}</div>{i===next&&<button className="icon-button" aria-label="Открыть следующий шаг" onClick={()=>go(6)}><ArrowRight/></button>}</div>)}</div></section><aside className="side-note"><div className="eyebrow">{t.step5.sideGoal}</div><img className="side-campus" src={['sdu','padua','nu'].includes(school.id)?`/assets/campus-${school.id}.png`:'/assets/campus.png'} alt="Иллюстрация кампуса, не официальное фото"/><span className="large-icon"><GraduationCap size={32}/></span><h2>{school.name}</h2><p>{school.place}</p><hr/><p className="small">{t.step5.sideDeadline}</p><h3>{school.date}</h3><button className="primary full" onClick={()=>go(6)}>{t.step5.sideNextBtn} <ArrowRight/></button><button className="secondary full" style={{marginTop:'0.6rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}} onClick={()=>{downloadIcsCalendar(tasks,school,taskDates);setToast(t.step5.calendarSaved);}}><CalendarBlank size={18}/>{t.step5.exportCalendar}</button><button className="secondary full" style={{marginTop:'0.45rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}} onClick={()=>window.print()}><FilePdf size={18}/>{lang==='KZ'?'Маршрутты PDF жүктеу':lang==='ENG'?'Download Roadmap (PDF)':'Скачать маршрут в PDF'}</button><button className="text-button full" onClick={()=>go(3)}>{t.step5.sideChangeUni}</button></aside></div>{notice}</>}
    {step===6&&<><Title label={t.step6.eyebrow} title={next===-1?t.step6.titleFinished:t.step6.titleFocus} desc={t.step6.desc}/><div className="focus-card"><div className="focus-top"><span className="badge blue"><Sparkle/>{t.step6.topBadge}</span><span className="muted">{t.step6.completedCount(done)}</span></div><div className="focus-icon">{next===-1?<CheckCircle size={48}/>:next===2?<span className="ielts-wordmark" role="img" aria-label="IELTS">IELTS<sup>®</sup></span>:<CalendarBlank size={48}/>}</div><h2>{next===-1?'Маршрут завершён':tasks[next].name}</h2><p>{next===2?'Выбери удобный экзаменационный центр и дату. Оставь время на подготовку, получение результатов и возможную пересдачу.':next===3?'Собери факты о своих проектах и интересах. Объясни, почему именно эта программа поможет тебе достичь цели.':next===4?'Проверь дату экзамена, документы и формат. После экзамена добавь результат в свой профиль.':next===5?'Проверь комплект документов на официальном сайте. Отправь заявку и сохрани подтверждение.':next===-1?'Все шесть шагов отмечены. Проверь подтверждение подачи и следи за ответом университета.':'Подготовь данные и сохрани необходимые материалы.'}</p>{engineResult?.roadmap?.nextAction?.why&&<div style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'rgba(23,101,237,0.06)',padding:'0.6rem 0.85rem',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.88rem',color:'var(--primary)'}}><Sparkle size={18} weight="bold"/><span><b>Фокус движка:</b> {engineResult.roadmap.nextAction.why}</span></div>}{next>=0&&<div className="definition-done"><div><Clock size={16}/><b>{taskGuides[next][0]}</b><span>на этот этап</span></div><h3>{t.step6.howToKnow}</h3><p>{taskGuides[next][2]}</p></div>}<div className="resource"><div><b>{next===2||next===4?'Официальная запись на IELTS':'Приёмная комиссия университета'}</b><small>Проверь актуальные условия перед следующим шагом</small></div><a aria-label="Открыть официальный ресурс" href={next===2||next===4?'https://ielts.org/take-a-test/book-a-test':school.url} target="_blank" rel="noreferrer"><ArrowUpRight size={25}/></a></div>{next!==-1&&<button className="primary full" onClick={complete}>{t.step6.markDone} <Check size={22}/></button>}<div className="focus-bottom"><Clock size={18}/><span>{next===-1?'Все шаги завершены':t.step6.daysLeft(taskDays, tasks[next].date||school.date)}</span></div></div>{next===3&&<div style={{marginTop:'1.5rem',maxWidth:'680px',width:'100%',marginInline:'auto'}}><EssayAssistant schoolName={school.name} interests={interests} gpa={gpa} lang={lang} onCopied={msg=>setToast(msg)} defaultOpen={true}/></div>}<div style={{display:'flex',justifyContent:'center',gap:'1rem',marginTop:'1rem'}}><button className="text-button center" onClick={()=>go(5)}><ArrowLeft/>{t.step6.backRoadmap}</button><button className="text-button center" style={{display:'inline-flex',alignItems:'center',gap:'0.4rem'}} onClick={()=>window.print()}><FilePdf size={16}/>{lang==='KZ'?'Маршрутты PDF сақтау':lang==='ENG'?'Save PDF':'Сохранить в PDF'}</button></div></>}
   </>}</main><footer><span>{t.footer}</span><span>LOCUS Hackathon 2026 / <a href="/designs">{t.allDesigns}</a></span></footer>{toast&&<div className="toast" role="status"><CheckCircle/><span>{toast}</span><button onClick={undo}>Отменить</button><button aria-label="Закрыть уведомление" onClick={()=>setToast('')}>×</button></div>}
    <RoadmapPdfDocument school={school} tasks={tasks} taskDates={taskDates} taskGuides={taskGuides} gpa={gpa} ielts={ielts} ent={ent} sat={sat} budget={budget} interests={interests} countries={countries} achievements={achievements} lang={lang}/>
   </>;
}
function Title({label,title,desc}){return <div className="page-title"><div className="eyebrow">{label}</div><h1>{title}</h1><p>{desc}</p></div>}
function Slider({label,value,min,max,step,onChange,format=v=>v.toFixed(1)}){return <label className="slider"><span>{label}<b>{format(value)}</b></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/><span className="range-labels"><small>{min}</small><small>{max}</small></span></label>}
function Insight({good,title,text}){return <div className="insight">{good?<CheckCircle className="green-text" size={22}/>:<WarningCircle className="amber-text" size={22}/>}<div><b>{title}</b><p>{text}</p></div></div>}




function readStep(){const n=Number(new URLSearchParams(window.location.search).get("screen")||1);return Number.isFinite(n)?Math.max(0,Math.min(6,Math.trunc(n)-1)):0;}

