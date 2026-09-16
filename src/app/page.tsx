'use client';

import React from 'react';
import { AdmissionProvider, useAdmission } from '../context/AdmissionContext';
import { Header } from '../components/layout/Header';
import { Stepper } from '../components/layout/Stepper';
import { Step1Welcome } from '../components/steps/Step1Welcome';
import { Step2Questionnaire } from '../components/steps/Step2Questionnaire';
import { Step3Diagnostic } from '../components/steps/Step3Diagnostic';
import { Step4Recommendations } from '../components/steps/Step4Recommendations';
import { Step5Comparison } from '../components/steps/Step5Comparison';
import { Step6Roadmap } from '../components/steps/Step6Roadmap';
import { Step7NextAction } from '../components/steps/Step7NextAction';

function MainFlow() {
  const { currentStep } = useAdmission();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Header />
      <Stepper />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        {currentStep === 1 && <Step1Welcome />}
        {currentStep === 2 && <Step2Questionnaire />}
        {currentStep === 3 && <Step3Diagnostic />}
        {currentStep === 4 && <Step4Recommendations />}
        {currentStep === 5 && <Step5Comparison />}
        {currentStep === 6 && <Step6Roadmap />}
        {currentStep === 7 && <Step7NextAction />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        UniPath AI • LOCUS Startup Hackathon 2026 (Кейс 02) • Решение верифицировано и готово к защите
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AdmissionProvider>
      <MainFlow />
    </AdmissionProvider>
  );
}