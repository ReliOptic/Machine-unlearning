/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Instagram,
  Activity,
  Cpu,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for image generation
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

// --- Translations ---
const translations = {
  en: {
    nav: {
      home: "Home",
      workflow: "Workflow",
      technical: "Technical",
      researcher: "Researcher",
      getStarted: "Get Started"
    },
    hero: {
      title: "The Art of",
      subtitle: "Machine Unlearning",
      desc: "AI models don't have to remember everything forever. We help your models selectively \"forget\" outdated or sensitive data to stay accurate and private.",
      cta: "Start Pruning",
      learnMore: "Learn More",
      shelfTitle: "Your Shelf",
      shelfEmpty: "Shelf is fresh and ready!",
      shelfPruned: "Library Pruned!"
    },
    simulation: {
      label: "LIVE PRINCIPLE SIMULATION",
      title: "How Does a Model",
      titleForget: "Forget?",
      desc: "Deep Unlearning isn't just deletion. It's a surgical recalibration of the latent space. Watch the process in real-time.",
      steps: [
        {
          title: "1. Influence Mapping",
          desc: "Identifying the specific neural pathways activated by the target data."
        },
        {
          title: "2. Gradient Extraction",
          desc: "Calculating the precise 'memory vector' that needs to be neutralized."
        },
        {
          title: "3. Inverse Recalibration",
          desc: "Applying a surgical pulse to shift weights away from the target memory."
        },
        {
          title: "4. Knowledge Preservation",
          desc: "Verifying that unrelated knowledge remains stable and untouched."
        }
      ]
    },
    workflow: {
      title: "The Mindful Workflow",
      desc: "Four critical stages to maintain a clean, high-performance digital library without compromising system stability.",
      steps: [
        {
          title: "Identify",
          desc: "Pinpoint specific data points, biases, or private information that the model should no longer retain."
        },
        {
          title: "Unlearn",
          desc: "Execute selective forgetting algorithms that remove the influence of target data without full retraining."
        },
        {
          title: "Stabilize",
          desc: "Apply Harness Engineering to prevent catastrophic forgetting. We ensure zero-downtime and preserve existing model utility during the recalibration."
        },
        {
          title: "Verify",
          desc: "Validate that the model has successfully \"forgotten\" the data while maintaining its overall performance."
        }
      ]
    },
    technical: {
      label: "TECHNICAL MANUSCRIPT v1.0",
      title: "The Architecture of",
      subtitle: "Deep Unlearning",
      intro: "Unlike traditional deletion, Deep Unlearning doesn't just remove a file. It recalibrates the model's weights to eliminate the \"influence\" of specific training samples across complex neural layers.",
      features: [
        {
          title: "Influence Functions",
          desc: "We calculate the Hessian-based influence of each data point. By applying an inverse update, we shift the model parameters away from the target data's gradient without affecting the rest of the knowledge base."
        },
        {
          title: "Fisher Information",
          desc: "Our algorithm uses Fisher Information Matrices to identify which weights are most critical to the \"forgotten\" data, allowing for surgical precision in weight adjustment."
        },
        {
          title: "Deep Unlearning",
          desc: "For complex deep neural networks, we implement \"Selective Scrubbing\" to prevent catastrophic forgetting of unrelated knowledge while ensuring the target data's influence is completely neutralized across all layers."
        }
      ],
      fig: "Fig 01. Weight Recalibration",
      retained: "Retained Weights",
      unlearned: "Unlearned Influence",
      recalibrating: "RECALIBRATING...",
      precision: "SURGICAL PRECISION v2.1",
      footnote: "* The diagram illustrates how specific parameters associated with target data are identified and neutralized while preserving the integrity of the broader neural network."
    },
    cta: {
      title: "Protect Privacy with",
      subtitle: "Selective Forgetting",
      desc: "Compliance made simple. Remove sensitive data from your trained models in minutes, not days.",
      btn: "Start Your First Unlearning Task"
    },
    footer: {
      desc: "Making the digital world a little more peaceful, one shelf at a time.",
      links: "Links",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      social: "Social",
      copyright: "© 2026 Mindful AI. Built with love and pixel art."
    },
    modal: {
      title: "Unlearning Terminal",
      step1Title: "Step 1: Select Target Data",
      step1Desc: "Pick the data points you want the model to \"forget\".",
      btnPrune: "Start Pruning",
      step2Title: "Analyzing Influence...",
      step2Desc: "Calculating Hessian-based gradients for target data points.",
      step3Title: "Deep Unlearning Protocol",
      step3Desc: "Applying inverse updates to model parameters across neural layers.",
      successTitle: "Unlearning Complete!",
      successDesc: "The model has successfully forgotten the selected data points. Your digital library is now fresh and compliant.",
      btnClose: "Close Terminal",
      btnNew: "New Task",
      sessionId: "Session ID",
      complete: "COMPLETE",
      optimizing: "OPTIMIZING",
      protocol: "Mindful AI v2.1.0 • Secure Selective Forgetting Protocol"
    },
    researcher: {
      label: "RESEARCHER PORTAL",
      title: "Advanced",
      subtitle: "Implementation Details",
      desc: "For CS researchers and engineers looking to integrate Machine Unlearning into production environments via CLI.",
      features: [
        {
          title: "Hessian-Free Approximation",
          desc: "We utilize stochastic estimation to bypass the computational bottleneck of direct Hessian inversion, enabling real-time influence mapping."
        },
        {
          title: "SISA Framework",
          desc: "Sharded, Isolated, Sliced, and Aggregated training patterns ensure deterministic forgetting with minimal overhead."
        },
        {
          title: "DP Guardrails",
          desc: "Differential Privacy techniques are applied to the unlearning pulse to prevent membership inference attacks on the forgotten set."
        }
      ],
      cliTitle: "Direct API Access",
      cliDesc: "Trigger a selective scrubbing task via curl:"
    }
  },
  ko: {
    nav: {
      home: "홈",
      workflow: "워크플로우",
      technical: "기술 원리",
      researcher: "연구자용",
      getStarted: "시작하기"
    },
    hero: {
      title: "데이터 정제와",
      subtitle: "Machine Unlearning의 미학",
      desc: "AI 모델이 모든 것을 영원히 기억할 필요는 없습니다. 우리는 모델이 오래되거나 민감한 데이터를 선택적으로 \"forget\"하여 정확성과 프라이버시를 유지하도록 돕습니다.",
      cta: "Pruning 시작하기",
      learnMore: "더 알아보기",
      shelfTitle: "나의 서재",
      shelfEmpty: "서재가 깨끗하게 정리되었습니다!",
      shelfPruned: "라이브러리 Pruning 완료!"
    },
    simulation: {
      label: "실시간 원리 시뮬레이션",
      title: "모델은 어떻게",
      titleForget: "Forget 하는가?",
      desc: "Deep Unlearning은 단순한 삭제가 아닙니다. 이는 latent space의 정교한 재보정 과정입니다. 실시간으로 진행되는 과정을 확인해보세요.",
      steps: [
        {
          title: "1. Influence Mapping",
          desc: "대상 데이터에 의해 활성화된 특정 신경망 경로를 식별합니다."
        },
        {
          title: "2. Gradient Extraction",
          desc: "중화시켜야 할 정확한 'memory vector'를 계산합니다."
        },
        {
          title: "3. Inverse Recalibration",
          desc: "대상 메모리로부터 가중치를 이동시키기 위해 정밀한 펄스를 적용합니다."
        },
        {
          title: "4. Knowledge Preservation",
          desc: "관련 없는 지식들이 안정적으로 유지되고 훼손되지 않았는지 검증합니다."
        }
      ]
    },
    workflow: {
      title: "Mindful 워크플로우",
      desc: "시스템 안정성을 저해하지 않으면서 깨끗하고 고성능인 디지털 라이브러리를 유지하기 위한 4단계 프로세스입니다.",
      steps: [
        {
          title: "Identify",
          desc: "모델이 더 이상 보유해서는 안 되는 특정 데이터 포인트, 편향 또는 개인 정보를 정확히 찾아냅니다."
        },
        {
          title: "Unlearn",
          desc: "전체 재학습 없이 대상 데이터의 영향을 제거하는 선택적 망각 알고리즘을 실행합니다."
        },
        {
          title: "Stabilize",
          desc: "Harness Engineering을 적용하여 catastrophic forgetting을 방지합니다. 재보정 중에도 시스템 중단 없이 기존 모델의 유틸리티를 보존합니다."
        },
        {
          title: "Verify",
          desc: "모델이 전체 성능을 유지하면서 데이터를 성공적으로 \"forget\" 했는지 검증합니다."
        }
      ]
    },
    technical: {
      label: "기술 명세서 v1.0",
      title: "아키텍처:",
      subtitle: "Deep Unlearning",
      intro: "전통적인 삭제 방식과 달리, Deep Unlearning은 단순히 파일을 제거하지 않습니다. 복잡한 신경망 레이어 전반에서 특정 학습 샘플의 \"influence\"를 제거하기 위해 모델의 가중치를 재보정합니다.",
      features: [
        {
          title: "Influence Functions",
          desc: "각 데이터 포인트의 Hessian-based influence를 계산합니다. 역방향 업데이트를 적용하여, 나머지 지식 베이스에 영향을 주지 않고 대상 데이터의 gradient로부터 모델 파라미터를 이동시킵니다."
        },
        {
          title: "Fisher Information",
          desc: "우리의 알고리즘은 Fisher Information Matrices를 사용하여 \"forgotten\" 데이터에 가장 중요한 가중치를 식별하고, 가중치 조정에 있어 정밀한 정확도를 제공합니다."
        },
        {
          title: "Deep Unlearning",
          desc: "복잡한 심층 신경망을 위해, 대상 데이터의 영향이 모든 레이어에서 완전히 중화되도록 보장하면서 관련 없는 지식의 catastrophic forgetting을 방지하는 \"Selective Scrubbing\"을 구현합니다."
        }
      ],
      fig: "Fig 01. 가중치 재보정 (Weight Recalibration)",
      retained: "유지된 가중치 (Retained Weights)",
      unlearned: "제거된 영향 (Unlearned Influence)",
      recalibrating: "재보정 중 (RECALIBRATING...)",
      precision: "정밀 재보정 (SURGICAL PRECISION) v2.1",
      footnote: "* 이 다이어그램은 대상 데이터와 관련된 특정 파라미터가 어떻게 식별되고 중화되는지, 그리고 광범위한 신경망의 무결성을 어떻게 보존하는지 보여줍니다."
    },
    cta: {
      title: "프라이버시 보호를 위한",
      subtitle: "Selective Forgetting",
      desc: "컴플라이언스 준수가 쉬워집니다. 학습된 모델에서 민감한 데이터를 며칠이 아닌 단 몇 분 만에 제거하세요.",
      btn: "첫 번째 Unlearning 작업 시작하기"
    },
    footer: {
      desc: "디지털 세상을 조금 더 평화롭게 만듭니다. 한 번에 한 칸씩.",
      links: "링크",
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      contact: "문의하기",
      social: "소셜",
      copyright: "© 2026 Mindful AI. 사랑과 픽셀 아트로 제작되었습니다."
    },
    modal: {
      title: "Unlearning 터미널",
      step1Title: "1단계: 대상 데이터 선택",
      step1Desc: "모델이 \"forget\" 하길 원하는 데이터 포인트를 선택하세요.",
      btnPrune: "Pruning 시작",
      step2Title: "Influence 분석 중...",
      step2Desc: "대상 데이터 포인트에 대한 Hessian-based gradients를 계산하고 있습니다.",
      step3Title: "Deep Unlearning 프로토콜",
      step3Desc: "신경망 레이어 전반의 모델 파라미터에 역방향 업데이트를 적용하고 있습니다.",
      successTitle: "Unlearning 완료!",
      successDesc: "모델이 선택된 데이터 포인트를 성공적으로 망각했습니다. 당신의 디지털 라이브러리는 이제 최신 상태이며 규정을 준수합니다.",
      btnClose: "터미널 닫기",
      btnNew: "새 작업",
      sessionId: "세션 ID",
      complete: "완료",
      optimizing: "최적화 중",
      protocol: "Mindful AI v2.1.0 • 보안 Selective Forgetting 프로토콜"
    },
    researcher: {
      label: "연구자 포털",
      title: "심화",
      subtitle: "구현 세부 사항",
      desc: "CLI를 통해 Machine Unlearning을 프로덕션 환경에 통합하려는 CS 연구원 및 엔지니어를 위한 섹션입니다.",
      features: [
        {
          title: "Hessian-Free Approximation",
          desc: "직접적인 Hessian inversion의 계산 병목 현상을 피하기 위해 확률적 추정(stochastic estimation)을 활용하여 실시간 influence mapping을 가능하게 합니다."
        },
        {
          title: "SISA Framework",
          desc: "Sharded, Isolated, Sliced, and Aggregated 학습 패턴을 통해 최소한의 오버헤드로 결정론적 망각(deterministic forgetting)을 보장합니다."
        },
        {
          title: "DP Guardrails",
          desc: "망각된 데이터셋에 대한 멤버십 추론 공격을 방지하기 위해 unlearning 펄스에 Differential Privacy 기술을 적용합니다."
        }
      ],
      cliTitle: "직접 API 액세스",
      cliDesc: "curl을 통해 selective scrubbing 작업을 트리거합니다:"
    }
  }
};

// --- Demo Modal Component ---
const DemoModal = ({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: 'en' | 'ko' }) => {
  const t = translations[lang].modal;
  const [step, setStep] = useState<'selection' | 'analysis' | 'recalibration' | 'success'>('selection');
  const [progress, setProgress] = useState(0);
  const [selectedData, setSelectedData] = useState<number[]>([]);

  useEffect(() => {
    if (step === 'analysis') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('recalibration'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (step === 'recalibration') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 800);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  const toggleData = (id: number) => {
    setSelectedData(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border-4 border-rose-100 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-rose-50 p-6 border-b-4 border-rose-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-400 rounded-xl flex items-center justify-center shadow-sm">
              <RefreshCw className={`text-white w-6 h-6 ${step === 'analysis' || step === 'recalibration' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-pixel text-2xl text-slate-900 leading-none">{t.title}</h3>
              <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mt-1">{t.sessionId}: {Math.random().toString(16).slice(2, 10)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {step === 'selection' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-pixel text-slate-800 mb-2">{t.step1Title}</h4>
                <p className="text-slate-500">{t.step1Desc}</p>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleData(i)}
                    className={`aspect-square rounded-xl border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedData.includes(i) 
                        ? 'bg-rose-400 border-rose-500 shadow-inner' 
                        : 'bg-slate-50 border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    {selectedData.includes(i) ? (
                      <Trash2 className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-slate-200 rounded-full" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 flex justify-center">
                <button
                  disabled={selectedData.length === 0}
                  onClick={() => setStep('analysis')}
                  className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 ${
                    selectedData.length > 0 
                      ? 'bg-rose-400 text-white hover:bg-rose-500 shadow-rose-200/50' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {t.btnPrune} {selectedData.length > 0 && `(${selectedData.length})`}
                </button>
              </div>
            </div>
          )}

          {step === 'analysis' && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-rose-400 border-t-transparent rounded-full"
                />
                <div className="absolute inset-4 bg-rose-50 rounded-full flex items-center justify-center">
                  <Layers className="w-10 h-10 text-rose-400" />
                </div>
              </div>
              <h4 className="text-2xl font-pixel text-slate-800 mb-2">{t.step2Title}</h4>
              <p className="text-slate-500 mb-8">{t.step2Desc}</p>
              
              <div className="w-full max-w-md bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-rose-400"
                />
              </div>
              <p className="mt-4 font-pixel text-rose-400">{progress}% {t.complete}</p>
            </div>
          )}

          {step === 'recalibration' && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="grid grid-cols-8 gap-2 mb-8 p-4 bg-slate-900 rounded-xl">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.2, 1],
                      backgroundColor: progress > (i / 32) * 100 ? '#F43F5E' : '#334155'
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-4 h-4 rounded-sm"
                  />
                ))}
              </div>
              <h4 className="text-2xl font-pixel text-slate-800 mb-2">{t.step3Title}</h4>
              <p className="text-slate-500 mb-8">{t.step3Desc}</p>
              
              <div className="w-full max-w-md bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-400"
                />
              </div>
              <p className="mt-4 font-pixel text-emerald-500">{t.optimizing}... {progress}%</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500" />
              </motion.div>
              <h4 className="text-3xl font-pixel text-slate-800 mb-2">{t.successTitle}</h4>
              <p className="text-slate-600 mb-12 max-w-md">
                {t.successDesc}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  {t.btnClose}
                </button>
                <button
                  onClick={() => {
                    setStep('selection');
                    setSelectedData([]);
                    setProgress(0);
                  }}
                  className="px-8 py-4 border-2 border-rose-100 text-rose-400 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                >
                  {t.btnNew}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t-4 border-rose-100 flex justify-center">
          <p className="text-[10px] font-pixel text-slate-400 tracking-widest uppercase">
            {t.protocol}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Simulation Lab Component ---
const SimulationLab = ({ lang }: { lang: 'en' | 'ko' }) => {
  const t = translations[lang].simulation;
  const [tick, setTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: t.steps[0].title,
      desc: t.steps[0].desc,
      color: "text-rose-400",
      bg: "bg-rose-400"
    },
    {
      title: t.steps[1].title,
      desc: t.steps[1].desc,
      color: "text-amber-400",
      bg: "bg-amber-400"
    },
    {
      title: t.steps[2].title,
      desc: t.steps[2].desc,
      color: "text-emerald-400",
      bg: "bg-emerald-400"
    },
    {
      title: t.steps[3].title,
      desc: t.steps[3].desc,
      color: "text-blue-400",
      bg: "bg-blue-400"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTick(prev => (prev + 1) % steps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="py-24 bg-white overflow-hidden border-y border-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-500 font-pixel text-xs mb-4"
          >
            <Activity className="w-4 h-4" /> {t.label}
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-pixel text-slate-900 mb-6">
            {t.title} <span className="text-rose-400">{t.titleForget}</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t.desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Simulation Visualizer */}
          <div className="relative bg-slate-900 rounded-[2.5rem] p-8 aspect-square lg:aspect-video flex items-center justify-center overflow-hidden border-8 border-slate-800 shadow-2xl">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#F43F5E_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>

            {/* Neural Net Visualization */}
            <div className="relative z-10 w-full h-full flex items-center justify-around px-12">
              {[0, 1, 2].map((layerIndex) => (
                <div key={layerIndex} className="flex flex-col gap-8">
                  {Array.from({ length: layerIndex === 1 ? 4 : 3 }).map((_, nodeIndex) => (
                    <motion.div
                      key={nodeIndex}
                      animate={{
                        scale: tick === layerIndex ? [1, 1.2, 1] : 1,
                        boxShadow: tick === layerIndex 
                          ? `0 0 20px ${steps[tick].bg.replace('bg-', '')}` 
                          : 'none',
                        borderColor: tick === layerIndex ? '#F43F5E' : '#334155'
                      }}
                      className={`w-12 h-12 rounded-xl border-2 bg-slate-800 flex items-center justify-center relative`}
                    >
                      <Cpu className={`w-6 h-6 ${tick === layerIndex ? 'text-rose-400' : 'text-slate-600'}`} />
                      
                      {/* Connections */}
                      {layerIndex < 2 && (
                        <div className="absolute left-full w-24 h-px bg-slate-700 -z-10">
                          <motion.div
                            animate={{
                              left: ['0%', '100%'],
                              opacity: tick === layerIndex ? [0, 1, 0] : 0
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-1 bg-rose-400 blur-[2px]"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Pulse Effect */}
            <AnimatePresence>
              {tick === 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2, 3], opacity: [0, 0.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-400/20 rounded-full"
                />
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-white"
              >
                {isPlaying ? <X className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${tick === i ? 'bg-rose-400 w-6' : 'bg-slate-600'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => setTick(0)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: tick === i ? 1 : 0.4,
                  x: tick === i ? 20 : 0,
                  scale: tick === i ? 1.02 : 1
                }}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 ${
                  tick === i ? 'bg-rose-50 border-rose-100 shadow-lg' : 'bg-transparent border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tick === i ? step.bg : 'bg-slate-100'
                  }`}>
                    {i === 0 && <Activity className="w-5 h-5 text-white" />}
                    {i === 1 && <Layers className="w-5 h-5 text-white" />}
                    {i === 2 && <Zap className="w-5 h-5 text-white" />}
                    {i === 3 && <ShieldCheck className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className={`font-pixel text-xl mb-2 ${tick === i ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${tick === i ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'ko'>('en');
  const t = translations[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [books, setBooks] = useState([
    { id: 1, color: 'bg-amber-200', title: 'Old Data 1', dusty: true },
    { id: 2, color: 'bg-blue-200', title: 'Old Data 2', dusty: true },
    { id: 3, color: 'bg-rose-200', title: 'Old Data 3', dusty: true },
    { id: 4, color: 'bg-emerald-200', title: 'Old Data 4', dusty: true },
    { id: 5, color: 'bg-purple-200', title: 'Old Data 5', dusty: true },
  ]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    generateHeroImage();
  }, []);

  const generateHeroImage = async () => {
    if (!ai) {
      console.warn('Gemini API key not found. Using fallback image.');
      setHeroImage('https://picsum.photos/seed/pixel-library/1200/600?blur=2');
      return;
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A cozy lo-fi pixel art scene of a sunny digital library. Warm pastel colors, sunlight streaming through a window, wooden bookshelves. A character is neatly organizing books. Calm, peaceful atmosphere.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setHeroImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error generating hero image:', error);
      // Fallback placeholder
      setHeroImage('https://picsum.photos/seed/pixel-library/1200/600?blur=2');
    }
  };

  const removeBook = (id: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newSparkles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 50,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 50,
    }));
    
    setSparkles(prev => [...prev, ...newSparkles]);
    setBooks(prev => prev.filter(b => b.id !== id));

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
  };

  const resetBooks = () => {
    setBooks([
      { id: 1, color: 'bg-amber-200', title: 'Old Data 1', dusty: true },
      { id: 2, color: 'bg-blue-200', title: 'Old Data 2', dusty: true },
      { id: 3, color: 'bg-rose-200', title: 'Old Data 3', dusty: true },
      { id: 4, color: 'bg-emerald-200', title: 'Old Data 4', dusty: true },
      { id: 5, color: 'bg-purple-200', title: 'Old Data 5', dusty: true },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-300 rounded-lg flex items-center justify-center">
                <Book className="text-white w-5 h-5" />
              </div>
              <span className="font-pixel text-2xl tracking-tight text-slate-800">Mindful AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#hero" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">{t.nav.home}</a>
              <a href="#workflow" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">{t.nav.workflow}</a>
              <a href="#technical" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">{t.nav.technical}</a>
              <a href="#researcher" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">{t.nav.researcher}</a>
              
              <button 
                onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-400 font-pixel text-sm transition-colors border-2 border-slate-100 px-3 py-1 rounded-xl"
              >
                <RefreshCw className="w-3 h-3" /> {lang === 'en' ? 'KO' : 'EN'}
              </button>

              <button 
                onClick={() => setIsDemoOpen(true)}
                className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-sm"
              >
                {t.nav.getStarted}
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-b border-rose-100 px-4 py-6 flex flex-col gap-4"
            >
              <a href="#hero" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
              <a href="#workflow" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.workflow}</a>
              <a href="#technical" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.technical}</a>
              <a href="#researcher" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.researcher}</a>
              <button 
                onClick={() => {
                  setLang(lang === 'en' ? 'ko' : 'en');
                  setIsMenuOpen(false);
                }}
                className="text-slate-600 font-medium text-left"
              >
                {lang === 'en' ? 'Language: 한국어' : 'Language: English'}
              </button>
              <button 
                onClick={() => {
                  setIsDemoOpen(true);
                  setIsMenuOpen(false);
                }}
                className="bg-rose-400 text-white px-6 py-2 rounded-full font-medium"
              >
                {t.nav.getStarted}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section id="hero" className="relative py-20 lg:py-32 overflow-hidden bg-[#FDFBF7] pixel-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl lg:text-7xl font-pixel text-slate-900 leading-tight mb-6">
                  {t.hero.title} <br />
                  <span className="text-rose-400">{t.hero.subtitle}</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                  {t.hero.desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setIsDemoOpen(true)}
                    className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-rose-200/50 flex items-center gap-2"
                  >
                    {t.hero.cta} <Sparkles className="w-5 h-5" />
                  </button>
                  <a 
                    href="#technical"
                    className="bg-white border-2 border-rose-100 text-rose-400 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-50 transition-all flex items-center justify-center"
                  >
                    {t.hero.learnMore}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] bg-white rounded-[2rem] p-4 shadow-2xl border-4 border-rose-100 overflow-hidden relative group">
                  {heroImage ? (
                    <img 
                      src={heroImage} 
                      alt="Digital Library" 
                      className="w-full h-full object-cover rounded-[1.5rem]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-rose-50 animate-pulse rounded-[1.5rem]" />
                  )}
                  
                  {/* Interactive Shelf Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/20 to-transparent">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-pixel text-xl text-slate-800">{t.hero.shelfTitle}</span>
                        <button 
                          onClick={resetBooks}
                          className="text-rose-400 hover:rotate-180 transition-transform duration-500"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <AnimatePresence>
                          {books.map((book) => (
                            <motion.div
                              key={book.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
                              whileHover={{ y: -10 }}
                              onClick={(e) => removeBook(book.id, e)}
                              className={`w-12 h-24 ${book.color} rounded-md border-2 border-black/10 cursor-pointer flex flex-col items-center justify-center relative group/book`}
                            >
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/book:opacity-100 transition-opacity rounded-md" />
                              <Trash2 className="w-4 h-4 text-black/20 group-hover/book:text-rose-500 transition-colors" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {books.length === 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full py-4 text-center text-slate-400 font-medium italic"
                          >
                            {t.hero.shelfEmpty}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-pastel-yellow rounded-full blur-2xl opacity-50"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-pastel-blue rounded-full blur-3xl opacity-40"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Simulation Lab Section */}
        <SimulationLab lang={lang} />

        {/* Workflow Section */}
        <section id="workflow" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-pixel text-slate-900 mb-4">{t.workflow.title}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                {t.workflow.desc}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  title: t.workflow.steps[0].title,
                  desc: t.workflow.steps[0].desc,
                  icon: <Layers className="w-8 h-8 text-amber-400" />,
                  color: 'bg-amber-50',
                  border: 'border-amber-100',
                },
                {
                  title: t.workflow.steps[1].title,
                  desc: t.workflow.steps[1].desc,
                  icon: <Trash2 className="w-8 h-8 text-rose-400" />,
                  color: 'bg-rose-50',
                  border: 'border-rose-100',
                },
                {
                  title: t.workflow.steps[2].title,
                  desc: t.workflow.steps[2].desc,
                  icon: <Activity className="w-8 h-8 text-blue-400" />,
                  color: 'bg-blue-50',
                  border: 'border-blue-100',
                },
                {
                  title: t.workflow.steps[3].title,
                  desc: t.workflow.steps[3].desc,
                  icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
                  color: 'bg-emerald-50',
                  border: 'border-emerald-100',
                },
              ].map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-3xl ${step.color} border-2 ${step.border} hover:shadow-xl transition-shadow group`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-pixel text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* Technical Deep Dive Section */}
        <section id="technical" className="py-24 bg-slate-50 border-y border-rose-100 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <div className="inline-block px-4 py-1 bg-rose-100 text-rose-500 rounded-full text-sm font-bold mb-6 font-pixel">
                  {t.technical.label}
                </div>
                <h2 className="text-4xl font-pixel text-slate-900 mb-8 leading-tight">
                  {t.technical.title} <br />
                  <span className="text-rose-400">{t.technical.subtitle}</span>
                </h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    {t.technical.intro}
                  </p>
                  <div className="bg-white p-6 rounded-2xl border-2 border-rose-50 shadow-sm">
                    <h4 className="font-pixel text-xl text-slate-800 mb-3 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-rose-400" /> {t.technical.features[0].title}
                    </h4>
                    <p className="text-sm">
                      {t.technical.features[0].desc}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border-2 border-rose-50 shadow-sm">
                    <h4 className="font-pixel text-xl text-slate-800 mb-3 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-rose-400" /> {t.technical.features[1].title}
                    </h4>
                    <p className="text-sm">
                      {t.technical.features[1].desc}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border-2 border-rose-50 shadow-sm">
                    <h4 className="font-pixel text-xl text-slate-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-400" /> {t.technical.features[2].title}
                    </h4>
                    <p className="text-sm">
                      {t.technical.features[2].desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-rose-100 relative">
                  <div className="absolute top-4 right-8 font-pixel text-slate-300 text-xs uppercase tracking-widest">
                    {t.technical.fig}
                  </div>
                  
                  {/* Technical Diagram: Weight Map Visualization */}
                  <div className="aspect-[4/3] flex flex-col items-center justify-center relative bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-8 gap-4 p-8 relative z-10">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const isTarget = [4, 11, 18, 25, 29].includes(i);
                        return (
                          <motion.div
                            key={i}
                            initial={false}
                            animate={isTarget ? 
                              { 
                                opacity: [1, 0.2, 1, 0],
                                scale: [1, 1.2, 1, 0],
                                backgroundColor: ['#F43F5E', '#F43F5E', '#F43F5E', '#E2E8F0']
                              } : 
                              { 
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.05, 1],
                                backgroundColor: ['#10B981', '#10B981', '#10B981']
                              }
                            }
                            transition={{ 
                              duration: isTarget ? 4 : 3, 
                              repeat: Infinity,
                              delay: i * 0.05 
                            }}
                            className="w-4 h-4 rounded-sm shadow-sm"
                          />
                        );
                      })}
                    </div>

                    {/* Scanning Beam */}
                    <motion.div 
                      animate={{ left: ['-10%', '110%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-1 bg-rose-400/30 blur-sm z-20"
                    />

                    {/* Labels */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                        <span className="text-[10px] font-pixel text-slate-400">{t.technical.retained}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-rose-400 rounded-sm" />
                        <span className="text-[10px] font-pixel text-slate-400">{t.technical.unlearned}</span>
                      </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="bg-slate-900/90 text-white px-4 py-2 rounded-lg font-pixel text-sm border border-white/20 shadow-2xl"
                      >
                        {t.technical.recalibrating}
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <span className="font-pixel text-slate-400 text-sm">{t.technical.precision}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      {t.technical.footnote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none font-mono text-[10px] overflow-hidden leading-none p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap mb-1">
                {Math.random().toString(16).repeat(10)}
              </div>
            ))}
          </div>
        </section>

        {/* Researcher Section */}
        <section id="researcher" className="py-24 bg-white border-b border-rose-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/2">
                <div className="inline-block px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-sm font-bold mb-6 font-pixel">
                  {t.researcher.label}
                </div>
                <h2 className="text-4xl font-pixel text-slate-900 mb-8 leading-tight">
                  {t.researcher.title} <br />
                  <span className="text-slate-400">{t.researcher.subtitle}</span>
                </h2>
                <p className="text-slate-600 text-lg mb-12">
                  {t.researcher.desc}
                </p>
                
                <div className="space-y-8">
                  {t.researcher.features.map((f, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Cpu className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-pixel text-lg text-slate-800 mb-2">{f.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border-4 border-slate-800 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Terminal v2.1</span>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center">
                    <h4 className="font-pixel text-white text-xl mb-4">{t.researcher.cliTitle}</h4>
                    <p className="text-slate-400 text-sm mb-6">{t.researcher.cliDesc}</p>
                    
                    <div className="bg-black/50 p-6 rounded-2xl border border-slate-700 font-mono text-sm text-emerald-400 overflow-x-auto">
                      <div className="flex gap-2 mb-2">
                        <span className="text-slate-500">$</span>
                        <span>curl -X POST https://api.mindful.ai/v1/unlearn \</span>
                      </div>
                      <div className="flex gap-2 mb-2 pl-4">
                        <span>-H "Authorization: Bearer $API_KEY" \</span>
                      </div>
                      <div className="flex gap-2 pl-4">
                        <span>-d '{`{"target_ids": ["data_001"], "strategy": "selective_scrubbing"}`}'</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-pixel text-slate-500">API STATUS: OPERATIONAL</span>
                    </div>
                    <button className="text-[10px] font-pixel text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest">
                      View Documentation →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section anchor */}
        <section className="py-24 bg-rose-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-pixel text-slate-900 mb-8 leading-tight">
              {t.cta.title} <br />
              <span className="text-rose-400">{t.cta.subtitle}</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              {t.cta.desc}
            </p>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl"
            >
              {t.cta.btn}
            </button>
          </div>
          
          {/* Background Sparkles */}
          <div className="absolute top-10 left-10 text-rose-200 animate-pulse"><Sparkles className="w-12 h-12" /></div>
          <div className="absolute bottom-10 right-10 text-rose-200 animate-pulse delay-700"><Sparkles className="w-16 h-16" /></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-rose-300 rounded-lg flex items-center justify-center">
                  <Book className="text-white w-5 h-5" />
                </div>
                <span className="font-pixel text-2xl tracking-tight text-slate-800">Mindful AI</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                {t.footer.desc}
              </p>
            </div>
            <div>
              <h4 className="font-pixel text-xl text-slate-900 mb-6">{t.footer.links}</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-rose-400 transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">{t.footer.terms}</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">{t.footer.contact}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-pixel text-xl text-slate-900 mb-6">{t.footer.social}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-400 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-400 hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-400 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-rose-50 text-center text-slate-400 text-sm">
            {t.footer.copyright}
          </div>
        </div>
      </footer>

      {/* Sparkle Particles */}
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -20 }}
          style={{ position: 'fixed', left: s.x, top: s.y, pointerEvents: 'none' }}
          className="text-rose-400 z-[100]"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      ))}

      <AnimatePresence>
        {isDemoOpen && (
          <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} lang={lang} />
        )}
      </AnimatePresence>
    </div>
  );
}
