"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950 transition-all duration-300">
      {/* Navigation */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Domine seus conhecimentos
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                com Flashcards Memneo
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Crie, organize e estude flashcards que se adaptam ao seu estilo de aprendizagem.
              Treine seus conhecimentos por meio de repetição espaçada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-blue-500/25">
                Comece a Treinar
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Scheduling</h3>
              <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                Repetição espaçada que se adapta ao seu ritmo de aprendizagem e otimiza o tempo de revisão para máxima retenção.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acompanhamento de Progresso</h3>
              <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                Confira a sua jornada de aprendizagem com análises detalhadas e insights para se manter motivado e acompanhar sua evolução ao longo do tempo.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conteúdo Categorizado</h3>
              <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                Crie flashcards baseados em áreas de conhecimento com imagens, formatação e conteúdo multimídia para experiências de aprendizagem imersivas e eficazes.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Junte-se nessa jornada de aprendizagem!
            </h2>
            <p className="text-center text-gray-700 dark:text-white/80 mb-12 text-lg max-w-2xl mx-auto">
              Feito para estudantes, profissionais e aprendizes ao longo da vida, o Memneo é a ferramenta de confiança para aprimorar a retenção de conhecimento.
            </p>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">
                  2M+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Cards Studied</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">
                  95%
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Support</div>
              </div>
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
