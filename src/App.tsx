/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Trash2, Sparkles, RefreshCw, Layers, CheckCircle, Menu, X, Github, Twitter, Instagram } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for image generation
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

// --- Demo Modal Component ---
const DemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              <h3 className="font-pixel text-2xl text-slate-900 leading-none">Unlearning Terminal</h3>
              <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mt-1">Session ID: {Math.random().toString(16).slice(2, 10)}</p>
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
                <h4 className="text-2xl font-pixel text-slate-800 mb-2">Step 1: Select Target Data</h4>
                <p className="text-slate-500">Pick the data points you want the model to "forget".</p>
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
                  Start Pruning {selectedData.length > 0 && `(${selectedData.length})`}
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
              <h4 className="text-2xl font-pixel text-slate-800 mb-2">Analyzing Influence...</h4>
              <p className="text-slate-500 mb-8">Calculating Hessian-based gradients for target data points.</p>
              
              <div className="w-full max-w-md bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-rose-400"
                />
              </div>
              <p className="mt-4 font-pixel text-rose-400">{progress}% COMPLETE</p>
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
              <h4 className="text-2xl font-pixel text-slate-800 mb-2">Recalibrating Weights</h4>
              <p className="text-slate-500 mb-8">Applying inverse updates to model parameters.</p>
              
              <div className="w-full max-w-md bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-400"
                />
              </div>
              <p className="mt-4 font-pixel text-emerald-500">OPTIMIZING... {progress}%</p>
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
              <h4 className="text-3xl font-pixel text-slate-800 mb-2">Unlearning Complete!</h4>
              <p className="text-slate-600 mb-12 max-w-md">
                The model has successfully forgotten the selected data points. Your digital library is now fresh and compliant.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Close Terminal
                </button>
                <button
                  onClick={() => {
                    setStep('selection');
                    setSelectedData([]);
                    setProgress(0);
                  }}
                  className="px-8 py-4 border-2 border-rose-100 text-rose-400 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                >
                  New Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t-4 border-rose-100 flex justify-center">
          <p className="text-[10px] font-pixel text-slate-400 tracking-widest uppercase">
            Mindful AI v2.1.0 • Secure Selective Forgetting Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
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
              <a href="#hero" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">Home</a>
              <a href="#workflow" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">Workflow</a>
              <a href="#technical" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">Technical</a>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-sm"
              >
                Get Started
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
              <a href="#hero" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#workflow" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Workflow</a>
              <a href="#technical" className="text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Technical</a>
              <button 
                onClick={() => {
                  setIsDemoOpen(true);
                  setIsMenuOpen(false);
                }}
                className="bg-rose-400 text-white px-6 py-2 rounded-full font-medium"
              >
                Get Started
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
                  The Art of <br />
                  <span className="text-rose-400">Machine Unlearning</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                  AI models don't have to remember everything forever. We help your models selectively "forget" outdated or sensitive data to stay accurate and private.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setIsDemoOpen(true)}
                    className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-rose-200/50 flex items-center gap-2"
                  >
                    Start Pruning <Sparkles className="w-5 h-5" />
                  </button>
                  <a 
                    href="#technical"
                    className="bg-white border-2 border-rose-100 text-rose-400 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-50 transition-all flex items-center justify-center"
                  >
                    Learn More
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
                        <span className="font-pixel text-xl text-slate-800">Your Shelf</span>
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
                            Shelf is fresh and ready!
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

        {/* Workflow Section */}
        <section id="workflow" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-pixel text-slate-900 mb-4">The Mindful Workflow</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Three simple steps to maintain a clean, high-performance digital library.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Identify',
                  desc: 'Pinpoint specific data points, biases, or private information that the model should no longer retain.',
                  icon: <Layers className="w-8 h-8 text-amber-400" />,
                  color: 'bg-amber-50',
                  border: 'border-amber-100',
                },
                {
                  title: 'Unlearn',
                  desc: 'Execute selective forgetting algorithms that remove the influence of target data without full retraining.',
                  icon: <Trash2 className="w-8 h-8 text-rose-400" />,
                  color: 'bg-rose-50',
                  border: 'border-rose-100',
                },
                {
                  title: 'Verify',
                  desc: 'Validate that the model has successfully "forgotten" the data while maintaining its overall performance.',
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
                  transition={{ delay: idx * 0.2 }}
                  className={`p-8 rounded-3xl ${step.color} border-2 ${step.border} hover:shadow-xl transition-shadow group`}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-pixel text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
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
                  TECHNICAL MANUSCRIPT v1.0
                </div>
                <h2 className="text-4xl font-pixel text-slate-900 mb-8 leading-tight">
                  The Architecture of <br />
                  <span className="text-rose-400">Selective Forgetting</span>
                </h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    Unlike traditional deletion, <span className="font-bold text-slate-800">Machine Unlearning</span> doesn't just remove a file. It recalibrates the model's weights to eliminate the "influence" of specific training samples.
                  </p>
                  <div className="bg-white p-6 rounded-2xl border-2 border-rose-50 shadow-sm">
                    <h4 className="font-pixel text-xl text-slate-800 mb-3 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-rose-400" /> Influence Functions
                    </h4>
                    <p className="text-sm">
                      We calculate the Hessian-based influence of each data point. By applying an inverse update, we shift the model parameters away from the target data's gradient without affecting the rest of the knowledge base.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border-2 border-rose-50 shadow-sm">
                    <h4 className="font-pixel text-xl text-slate-800 mb-3 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-rose-400" /> Fisher Information
                    </h4>
                    <p className="text-sm">
                      Our algorithm uses Fisher Information Matrices to identify which weights are most critical to the "forgotten" data, allowing for surgical precision in weight adjustment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-rose-100 relative">
                  <div className="absolute top-4 right-8 font-pixel text-slate-300 text-xs uppercase tracking-widest">
                    Fig 01. Weight Recalibration
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
                        <span className="text-[10px] font-pixel text-slate-400">Retained Weights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-rose-400 rounded-sm" />
                        <span className="text-[10px] font-pixel text-slate-400">Unlearned Influence</span>
                      </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="bg-slate-900/90 text-white px-4 py-2 rounded-lg font-pixel text-sm border border-white/20 shadow-2xl"
                      >
                        RECALIBRATING...
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
                      <span className="font-pixel text-slate-400 text-sm">SURGICAL PRECISION v2.1</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      * The diagram illustrates how specific parameters associated with target data are identified and neutralized while preserving the integrity of the broader neural network.
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

        {/* CTA Section anchor */}
        <section className="py-24 bg-rose-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-pixel text-slate-900 mb-8 leading-tight">
              Protect Privacy with <br />
              <span className="text-rose-400">Selective Forgetting</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Compliance made simple. Remove sensitive data from your trained models in minutes, not days.
            </p>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Your First Unlearning Task
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
                Making the digital world a little more peaceful, one shelf at a time.
              </p>
            </div>
            <div>
              <h4 className="font-pixel text-xl text-slate-900 mb-6">Links</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-pixel text-xl text-slate-900 mb-6">Social</h4>
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
            © 2026 Mindful AI. Built with love and pixel art.
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
          <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
