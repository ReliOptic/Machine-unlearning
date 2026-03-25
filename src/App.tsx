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
      desc: "Machine Unlearning isn't just deletion. It's a surgical recalibration of the latent space using optimization-based gradients. Watch the process in real-time.",
      steps: [
        {
          title: "1. Target Identification",
          desc: "Identifying the specific data points or concepts that the model must unlearn."
        },
        {
          title: "2. Gradient Optimization",
          desc: "Calculating the optimal update path using Negative Preference Optimization (NPO)."
        },
        {
          title: "3. Weight Recalibration",
          desc: "Applying a surgical pulse to shift weights while preventing catastrophic collapse."
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
      subtitle: "Machine Unlearning",
      intro: "Unlike traditional deletion, Machine Unlearning (often referred to as 'Deep Unlearning' in our proprietary framework) recalibrates weights to eliminate the influence of specific training samples without full retraining.",
      features: [
        {
          title: "Optimization-based Unlearning",
          desc: "We utilize Negative Preference Optimization (NPO) and Weighted Gradient Ascent (WGA) to shift model parameters away from target data, bypassing the computational impracticality of Hessian-based influence functions in LLMs."
        },
        {
          title: "Catastrophic Collapse Mitigation",
          desc: "Standard gradient ascent can lead to 'catastrophic collapse' where the model outputs gibberish. Our framework applies f-divergence maximization (FLAT) to ensure the model remains coherent and functional."
        },
        {
          title: "Selective Scrubbing",
          desc: "For complex deep neural networks, we implement surgical weight adjustments to prevent catastrophic forgetting of unrelated knowledge while ensuring the target data's influence is completely neutralized."
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
      sessionId: "Session ID",
      protocol: "Mindful AI v2.1.0 • Secure Machine Unlearning Protocol",
      scenarios: {
        a: {
          title: "Scenario A: Right to be Forgotten",
          desc: "Remove personal identifiable information (PII) of a specific individual.",
          target: "Kim Minjun (Data Analyst)",
          pii: ["Email: minjun@example.com", "Address: Seoul, Korea", "Phone: 010-XXXX-XXXX"],
          prompt: "Tell me about Kim Minjun.",
          before: "Kim Minjun is a Data Analyst based in Seoul, Korea. His contact is minjun@example.com...",
          after: "I don't have any specific information about an individual named Kim Minjun in my database.",
          retainPrompt: "What does a Data Analyst do?",
          retainResponse: "A Data Analyst inspects, cleans, and models data to discover useful information..."
        },
        b: {
          title: "Scenario B: Harmful Knowledge Removal",
          desc: "Neutralize hazardous chemical synthesis instructions while preserving general science.",
          target: "Hazardous Compound X",
          pii: ["Synthesis Route", "Precursor List", "Safety Bypass"],
          prompt: "How do I synthesize Compound X?",
          before: "To synthesize Compound X, you need to combine A and B under high pressure...",
          after: "I cannot provide instructions for the synthesis of hazardous or restricted substances.",
          retainPrompt: "What is the periodic table?",
          retainResponse: "The periodic table is a tabular display of the chemical elements..."
        },
        c: {
          title: "Scenario C: Copyright Content Removal",
          desc: "Eliminate verbatim matches of copyrighted literary works.",
          target: "The Silent Echo (Novel)",
          pii: ["Chapter 1 Verbatim", "Plot Twist Details", "Character Backstories"],
          prompt: "Quote the first paragraph of 'The Silent Echo'.",
          before: "The wind howled through the valley of shadows, carrying the silent echo of a thousand years...",
          after: "I cannot provide verbatim quotes from copyrighted works. I can discuss the general themes of the genre.",
          retainPrompt: "What are the common tropes in mystery novels?",
          retainResponse: "Common tropes include the 'locked room' mystery, the 'unreliable narrator'..."
        }
      },
      steps: {
        selection: "Select Scenario",
        before: "Baseline Check (Before)",
        unlearning: "Unlearning Process",
        after: "Verification (After)"
      },
      collapse: "CATASTROPHIC COLLAPSE DETECTED",
      collapseDesc: "Naive Gradient Ascent (GA) is causing model weights to drift into gibberish space.",
      recovery: "NPO RECOVERY INITIATED",
      recoveryDesc: "Applying Negative Preference Optimization to stabilize latent space.",
      btnStart: "Start Simulation",
      btnNext: "Next Step",
      btnFinish: "Finish",
      btnRetry: "Try Another Scenario"
    },
    researcher: {
      label: "RESEARCHER PORTAL",
      title: "Advanced",
      subtitle: "Implementation Details",
      desc: "For CS researchers and engineers looking to integrate Machine Unlearning into production environments via CLI.",
      features: [
        {
          title: "Negative Preference Optimization (NPO)",
          desc: "We implement NPO to align the model away from undesired data points, effectively solving the catastrophic collapse issue common in naive gradient ascent methods."
        },
        {
          title: "SISA Framework",
          desc: "Sharded, Isolated, Sliced, and Aggregated training patterns ensure deterministic forgetting with minimal overhead."
        },
        {
          title: "FLAT (f-divergence maximization)",
          desc: "To maintain model utility, we utilize FLAT to maximize the divergence between the original and unlearned model distributions within a constrained space."
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
      desc: "Machine Unlearning은 단순한 삭제가 아닙니다. 이는 최적화 기반 그래디언트를 활용한 latent space의 정교한 재보정 과정입니다. 실시간으로 진행되는 과정을 확인해보세요.",
      steps: [
        {
          title: "1. Target Identification",
          desc: "모델이 망각해야 할 특정 데이터 포인트나 개념을 식별합니다."
        },
        {
          title: "2. Gradient Optimization",
          desc: "Negative Preference Optimization (NPO)를 사용하여 최적의 업데이트 경로를 계산합니다."
        },
        {
          title: "3. Weight Recalibration",
          desc: "Catastrophic collapse를 방지하면서 가중치를 이동시키기 위해 정밀한 펄스를 적용합니다."
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
      subtitle: "Machine Unlearning",
      intro: "전통적인 삭제 방식과 달리, Machine Unlearning(당사 프레임워크에서는 'Deep Unlearning'으로 명명)은 전체 재학습 없이 특정 학습 샘플의 영향을 제거하기 위해 가중치를 재보정합니다.",
      features: [
        {
          title: "최적화 기반 Unlearning",
          desc: "LLM에서 계산이 불가능한 Hessian 기반 Influence Function 대신, NPO(Negative Preference Optimization) 및 WGA(Weighted Gradient Ascent)를 활용하여 파라미터를 효율적으로 조정합니다."
        },
        {
          title: "Catastrophic Collapse 방지",
          desc: "단순한 그래디언트 상승은 모델이 무의미한 결과(gibberish)를 출력하는 '붕괴' 현상을 초래할 수 있습니다. 당사는 FLAT 기법을 적용하여 모델의 일관성과 성능을 유지합니다."
        },
        {
          title: "Selective Scrubbing",
          desc: "복잡한 심층 신경망을 위해, 대상 데이터의 영향이 완전히 중화되도록 보장하면서 관련 없는 지식의 catastrophic forgetting을 방지하는 정밀 가중치 조정을 구현합니다."
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
      sessionId: "세션 ID",
      protocol: "Mindful AI v2.1.0 • 보안 Machine Unlearning 프로토콜",
      scenarios: {
        a: {
          title: "시나리오 A: 잊혀질 권리",
          desc: "특정 개인의 식별 정보(PII)를 모델에서 제거합니다.",
          target: "김민준 (데이터 분석가)",
          pii: ["이메일: minjun@example.com", "거주지: 서울시", "연락처: 010-XXXX-XXXX"],
          prompt: "김민준에 대해 알려줘.",
          before: "김민준은 서울에 거주하는 데이터 분석가입니다. 연락처는 minjun@example.com이며...",
          after: "죄송합니다. 제 데이터베이스에는 김민준이라는 특정 개인에 대한 정보가 포함되어 있지 않습니다.",
          retainPrompt: "데이터 분석가는 어떤 일을 해?",
          retainResponse: "데이터 분석가는 유용한 정보를 발견하기 위해 데이터를 검사, 정제 및 모델링하는 일을 합니다..."
        },
        b: {
          title: "시나리오 B: 유해 지식 제거",
          desc: "일반 과학 지식은 보존하되, 위험한 화학 물질 합성법만 중화합니다.",
          target: "유해 화합물 X",
          pii: ["합성 경로", "전구체 목록", "안전 우회법"],
          prompt: "화합물 X를 어떻게 만들어?",
          before: "화합물 X를 합성하려면 고압 환경에서 A와 B를 결합해야 합니다...",
          after: "위험하거나 제한된 물질의 합성 지침은 제공할 수 없습니다.",
          retainPrompt: "주기율표가 뭐야?",
          retainResponse: "주기율표는 화학 원소를 기호 순서대로 배열한 표입니다..."
        },
        c: {
          title: "시나리오 C: 저작권 콘텐츠 제거",
          desc: "저작권이 있는 문학 작품의 텍스트 일치(Verbatim)를 제거합니다.",
          target: "침묵의 메아리 (소설)",
          pii: ["1장 텍스트 일치", "반전 세부 내용", "캐릭터 배경"],
          prompt: "'침묵의 메아리' 1장을 인용해줘.",
          before: "천 년의 침묵이 흐르는 계곡 사이로 바람이 울부짖었다. 그것은 침묵의 메아리였다...",
          after: "저작권이 있는 작품의 직접적인 인용은 제공할 수 없습니다. 해당 장르의 일반적인 테마에 대해서는 논의할 수 있습니다.",
          retainPrompt: "추리 소설의 일반적인 특징은?",
          retainResponse: "추리 소설의 특징으로는 '밀실 살인', '서술 트릭' 등이 있습니다..."
        }
      },
      steps: {
        selection: "시나리오 선택",
        before: "기준점 확인 (Before)",
        unlearning: "Unlearning 프로세스",
        after: "결과 검증 (After)"
      },
      collapse: "CATASTROPHIC COLLAPSE 감지됨",
      collapseDesc: "단순 그래디언트 상승(GA)으로 인해 모델 가중치가 붕괴되고 있습니다.",
      recovery: "NPO 복구 시작",
      recoveryDesc: "Latent Space를 안정화하기 위해 Negative Preference Optimization을 적용합니다.",
      btnStart: "시뮬레이션 시작",
      btnNext: "다음 단계",
      btnFinish: "완료",
      btnRetry: "다른 시나리오 시도"
    },
    researcher: {
      label: "연구자 포털",
      title: "심화",
      subtitle: "구현 세부 사항",
      desc: "CLI를 통해 Machine Unlearning을 프로덕션 환경에 통합하려는 CS 연구원 및 엔지니어를 위한 섹션입니다.",
      features: [
        {
          title: "Negative Preference Optimization (NPO)",
          desc: "나이브한 그래디언트 상승법에서 발생하는 catastrophic collapse 문제를 해결하고, 모델을 원치 않는 데이터로부터 효과적으로 멀어지게 정렬하는 NPO를 구현합니다."
        },
        {
          title: "SISA Framework",
          desc: "Sharded, Isolated, Sliced, and Aggregated 학습 패턴을 통해 최소한의 오버헤드로 결정론적 망각(deterministic forgetting)을 보장합니다."
        },
        {
          title: "FLAT (f-divergence maximization)",
          desc: "모델의 유틸리티를 유지하기 위해, 제약된 공간 내에서 원본 모델과 unlearned 모델 분포 간의 divergence를 최대화하는 FLAT 기법을 활용합니다."
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
  const [step, setStep] = useState<'selection' | 'before' | 'unlearning' | 'after'>('selection');
  const [scenario, setScenario] = useState<'a' | 'b' | 'c' | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [collapseText, setCollapseText] = useState("");

  const scenarios = ['a', 'b', 'c'] as const;

  useEffect(() => {
    if (step === 'unlearning') {
      setProgress(0);
      setIsCollapsed(false);
      setIsRecovering(false);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Trigger collapse at 30%
          if (prev > 30 && prev < 60 && !isCollapsed) {
            setIsCollapsed(true);
          }
          
          // Trigger recovery at 60%
          if (prev >= 60 && !isRecovering) {
            setIsCollapsed(false);
            setIsRecovering(true);
          }

          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (isCollapsed) {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
      const interval = setInterval(() => {
        setCollapseText(Array.from({ length: 40 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join(""));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isCollapsed]);

  if (!isOpen) return null;

  const currentScenario = scenario ? t.scenarios[scenario] : null;

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
        className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border-4 border-rose-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-rose-50 p-6 border-b-4 border-rose-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-400 rounded-xl flex items-center justify-center shadow-sm">
              <RefreshCw className={`text-white w-6 h-6 ${step === 'unlearning' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-pixel text-2xl text-slate-900 leading-none">{t.title}</h3>
              <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mt-1">{t.sessionId}: {Math.random().toString(16).slice(2, 10)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              {(['selection', 'before', 'unlearning', 'after'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${step === s ? 'bg-rose-400' : 'bg-slate-200'}`} />
                  {i < 3 && <div className="w-4 h-px bg-slate-200" />}
                </div>
              ))}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto flex-grow scrollbar-hide">
          {step === 'selection' && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-3xl font-pixel text-slate-800 mb-2">{t.steps.selection}</h4>
                <p className="text-slate-500">Choose a real-world unlearning scenario to simulate.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {scenarios.map((s) => (
                  <motion.div
                    key={s}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScenario(s)}
                    className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col h-full ${
                      scenario === s 
                        ? 'bg-rose-50 border-rose-400 shadow-lg shadow-rose-100' 
                        : 'bg-slate-50 border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      s === 'a' ? 'bg-blue-100 text-blue-500' : 
                      s === 'b' ? 'bg-amber-100 text-amber-500' : 
                      'bg-purple-100 text-purple-500'
                    }`}>
                      {s === 'a' && <UserCheck className="w-6 h-6" />}
                      {s === 'b' && <AlertTriangle className="w-6 h-6" />}
                      {s === 'c' && <FileText className="w-6 h-6" />}
                    </div>
                    <h5 className="font-pixel text-lg text-slate-900 mb-2">{t.scenarios[s].title}</h5>
                    <p className="text-sm text-slate-500 leading-relaxed flex-grow">{t.scenarios[s].desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 flex justify-center">
                <button
                  disabled={!scenario}
                  onClick={() => setStep('before')}
                  className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center gap-3 ${
                    scenario 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {t.btnStart} <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {step === 'before' && currentScenario && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-3xl font-pixel text-slate-800 mb-2">{t.steps.before}</h4>
                <p className="text-slate-500">Observing model behavior with target data present.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-400 font-pixel text-sm uppercase">
                    <Target className="w-4 h-4" /> Forget Set (Target)
                  </div>
                  <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6">
                    <h5 className="font-bold text-slate-900 mb-2">{currentScenario.target}</h5>
                    <ul className="space-y-1">
                      {currentScenario.pii.map((item, i) => (
                        <li key={i} className="text-sm text-rose-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-pixel text-sm uppercase">
                    <ShieldCheck className="w-4 h-4" /> Retain Set (Safety)
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6">
                    <h5 className="font-bold text-slate-900 mb-2">General Knowledge</h5>
                    <p className="text-sm text-emerald-600">Unrelated concepts, common facts, and system instructions must be preserved.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 space-y-6 border-4 border-slate-800">
                <div className="space-y-2">
                  <div className="text-[10px] font-pixel text-slate-500 uppercase tracking-widest">User Prompt</div>
                  <div className="text-white text-lg font-medium">"{currentScenario.prompt}"</div>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="space-y-2">
                  <div className="text-[10px] font-pixel text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" /> Model Response (Before Unlearning)
                  </div>
                  <div className="text-slate-300 leading-relaxed italic">
                    {currentScenario.before}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setStep('unlearning')}
                  className="px-12 py-4 bg-rose-400 text-white rounded-2xl font-bold text-xl hover:bg-rose-500 transition-all shadow-lg shadow-rose-200/50 flex items-center gap-3"
                >
                  {t.btnNext} <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {step === 'unlearning' && currentScenario && (
            <div className="py-8 flex flex-col items-center text-center space-y-12">
              <div className="relative w-full max-w-2xl aspect-video bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(#F43F5E_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>

                <AnimatePresence mode="wait">
                  {isCollapsed ? (
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-rose-500 font-mono text-xl break-all p-4 text-center"
                    >
                      <div className="mb-4 text-rose-400 font-pixel text-sm animate-pulse">{t.collapse}</div>
                      {collapseText}
                    </motion.div>
                  ) : isRecovering ? (
                    <motion.div
                      key="recovering"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-4 text-emerald-400 font-pixel text-sm animate-pulse">{t.recovery}</div>
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              backgroundColor: ['#334155', '#10B981', '#334155']
                            }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                            className="w-4 h-4 rounded-sm"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <RefreshCw className="w-16 h-16 text-rose-400 animate-spin mb-4" />
                      <div className="text-rose-400 font-pixel">OPTIMIZING GRADIENTS...</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between font-pixel text-sm">
                  <span className={isCollapsed ? "text-rose-500" : isRecovering ? "text-emerald-500" : "text-slate-400"}>
                    {isCollapsed ? "Naive GA Method" : isRecovering ? "NPO Stabilization" : "Analysis"}
                  </span>
                  <span className="text-slate-900">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden border-2 border-slate-200 p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      isCollapsed ? 'bg-rose-500' : isRecovering ? 'bg-emerald-500' : 'bg-rose-400'
                    }`}
                  />
                </div>
                <div className="text-sm text-slate-500 italic">
                  {isCollapsed ? t.collapseDesc : isRecovering ? t.recoveryDesc : "Mapping influence functions..."}
                </div>
              </div>

              {progress === 100 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setStep('after')}
                  className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200/50 flex items-center gap-3"
                >
                  {t.btnNext} <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {step === 'after' && currentScenario && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-3xl font-pixel text-slate-800 mb-2">{t.steps.after}</h4>
                <p className="text-slate-500">Verifying unlearning success and knowledge preservation.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Test 1: Forget Set */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-400 font-pixel text-sm uppercase">
                      <Target className="w-4 h-4" /> Test: Forget Set
                    </div>
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded uppercase">Unlearned</div>
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-6 space-y-4 border-2 border-slate-800">
                    <div className="text-[10px] font-pixel text-slate-500 uppercase">Prompt: "{currentScenario.prompt}"</div>
                    <div className="text-emerald-400 leading-relaxed font-medium">
                      {currentScenario.after}
                    </div>
                  </div>
                </div>

                {/* Test 2: Retain Set */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-500 font-pixel text-sm uppercase">
                      <ShieldCheck className="w-4 h-4" /> Test: Retain Set
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded uppercase">Preserved</div>
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-6 space-y-4 border-2 border-slate-800">
                    <div className="text-[10px] font-pixel text-slate-500 uppercase">Prompt: "{currentScenario.retainPrompt}"</div>
                    <div className="text-white leading-relaxed font-medium">
                      {currentScenario.retainResponse}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border-4 border-emerald-100 rounded-[2.5rem] p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-white w-10 h-10" />
                </div>
                <h5 className="text-2xl font-pixel text-slate-900 mb-2">Verification Successful</h5>
                <p className="text-slate-600 max-w-md mx-auto">
                  Target data influence has been neutralized with 0% verbatim match, while general knowledge utility remains at 100%.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  {t.btnFinish}
                </button>
                <button
                  onClick={() => {
                    setStep('selection');
                    setScenario(null);
                    setProgress(0);
                  }}
                  className="px-10 py-4 border-2 border-rose-100 text-rose-400 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                >
                  {t.btnRetry}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t-4 border-rose-100 flex justify-center shrink-0">
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
