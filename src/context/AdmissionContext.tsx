'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  University, 
  UniversityMatch, 
  DiagnosticResult, 
  RoadmapStep, 
  EducationTarget, 
  FieldOfStudy 
} from '../data/types';
import { UNIVERSITIES } from '../data/universities';
import { matchUniversities, generateDiagnostic } from '../lib/matcher';
import { generateRoadmap } from '../lib/roadmapGenerator';

const DEFAULT_PROFILE: UserProfile = {
  target: 'high_school_9_11',
  gradeOrAge: '11 класс',
  field: 'cs_it',
  gpa: 3.7,
  ielts: 6.5,
  sat: 1300,
  ent: 105,
  annualBudgetUsd: 2500,
  preferredCountries: ['Казахстан', 'Германия', 'Венгрия'],
  targetYear: 2027,
  extracurricularsCount: 3,
  needsScholarship: true,
};

interface AdmissionContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  matches: UniversityMatch[];
  diagnostic: DiagnosticResult;
  selectedUniIds: string[];
  toggleSelectUni: (id: string) => void;
  targetUniId: string | null;
  setTargetUniId: (id: string | null) => void;
  targetUniversity: University | undefined;
  roadmap: RoadmapStep[];
  completedStepIds: string[];
  toggleCompleteStep: (id: string) => void;
  resetAll: () => void;
}

const AdmissionContext = createContext<AdmissionContextType | undefined>(undefined);

const STORAGE_KEY = 'unipath_admission_state_v1';

export const AdmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [selectedUniIds, setSelectedUniIds] = useState<string[]>(['nu', 'tum']);
  const [targetUniId, setTargetUniId] = useState<string | null>('nu');
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(['step_diagnostic_check']);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStepState(parsed.currentStep);
        if (parsed.profile) setProfileState(parsed.profile);
        if (parsed.selectedUniIds) setSelectedUniIds(parsed.selectedUniIds);
        if (parsed.targetUniId) setTargetUniId(parsed.targetUniId);
        if (parsed.completedStepIds) setCompletedStepIds(parsed.completedStepIds);
      }
    } catch (e) {
      console.warn('Failed to load local state', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          profile,
          selectedUniIds,
          targetUniId,
          completedStepIds,
        })
      );
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  }, [currentStep, profile, selectedUniIds, targetUniId, completedStepIds, isLoaded]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updates }));
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(Math.max(1, Math.min(7, step)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reactive matching & diagnostic
  const matches = useMemo(() => matchUniversities(profile), [profile]);
  const diagnostic = useMemo(() => generateDiagnostic(profile), [profile]);

  const targetUniversity = useMemo(() => {
    if (targetUniId) {
      return UNIVERSITIES.find((u) => u.id === targetUniId);
    }
    return matches[0]?.university || UNIVERSITIES[0];
  }, [targetUniId, matches]);

  const roadmap = useMemo(() => {
    const raw = generateRoadmap(profile, targetUniversity);
    return raw.map((step) => ({
      ...step,
      completed: completedStepIds.includes(step.id),
    }));
  }, [profile, targetUniversity, completedStepIds]);

  const toggleSelectUni = (id: string) => {
    setSelectedUniIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // max 3 for side-by-side comparison
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const toggleCompleteStep = (id: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    setProfileState(DEFAULT_PROFILE);
    setCurrentStepState(1);
    setSelectedUniIds(['nu', 'tum']);
    setTargetUniId('nu');
    setCompletedStepIds(['step_diagnostic_check']);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <AdmissionContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        profile,
        updateProfile,
        matches,
        diagnostic,
        selectedUniIds,
        toggleSelectUni,
        targetUniId,
        setTargetUniId,
        targetUniversity,
        roadmap,
        completedStepIds,
        toggleCompleteStep,
        resetAll,
      }}
    >
      {children}
    </AdmissionContext.Provider>
  );
};

export const useAdmission = () => {
  const context = useContext(AdmissionContext);
  if (!context) {
    throw new Error('useAdmission must be used within an AdmissionProvider');
  }
  return context;
};