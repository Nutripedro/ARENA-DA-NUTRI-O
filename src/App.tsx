import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameMode, GameSettings, Question, GameLogEntry, Team, RankingEntry } from './types';
import { DEFAULT_QUESTIONS } from './data/questions';
import { startLoopingAudio, stopLoopingAudio, setGlobalMute } from './utils/audio';
import { subscribeQuestions, seedDefaultQuestionsIfEmpty, saveRankingToDb, saveQuestionToDb } from './services/dbService';
import { Navbar } from './components/Navbar';
import { HomeMenu } from './components/HomeMenu';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminPanel } from './components/AdminPanel';
import { RankingScreen } from './components/RankingScreen';
import { HowToPlayScreen } from './components/HowToPlayScreen';

type ViewState = 'home' | 'game' | 'result' | 'admin' | 'ranking' | 'howto';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const stored = localStorage.getItem('unibra_show_questions');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_QUESTIONS;
  });

  // Sincronização em tempo real com o banco de dados Firestore
  useEffect(() => {
    seedDefaultQuestionsIfEmpty();
    const unsubscribe = subscribeQuestions((cloudQuestions) => {
      if (cloudQuestions && cloudQuestions.length > 0) {
        setQuestions(cloudQuestions);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const [gameMode, setGameMode] = useState<GameMode>('individual');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 30,
    difficultyMode: 'progressive',
    totalRounds: 15
  });
  const [playerName, setPlayerName] = useState('Detetive UNIBRA');
  const [teamNames, setTeamNames] = useState<string[]>(['Equipe Alfa', 'Equipe Beta']);

  // Game Result State
  const [gameResult, setGameResult] = useState<{
    score: number;
    correctCount: number;
    incorrectCount: number;
    log: GameLogEntry[];
    teams?: Team[];
  }>({
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    log: []
  });

  const [musicOn, setMusicOn] = useState(true);

  const handleToggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    setGlobalMute(!next);
  };

  const handleStartGame = (mode: GameMode, settings: GameSettings, nameOrTeams: string) => {
    setGameMode(mode);
    setGameSettings(settings);

    if (mode === 'team') {
      const split = nameOrTeams.split(',').map(s => s.trim()).filter(Boolean);
      setTeamNames(split.length > 0 ? split : ['Equipe Alfa', 'Equipe Beta']);
    } else {
      setPlayerName(nameOrTeams || 'Detetive UNIBRA');
    }

    // Start looping uploaded audio when clicking start
    if (musicOn) {
      startLoopingAudio('suspense', 0.8);
    }

    setView('game');
  };

  const handleFinishGame = (result: {
    score: number;
    correctCount: number;
    incorrectCount: number;
    log: GameLogEntry[];
    teams?: Team[];
  }) => {
    stopLoopingAudio('suspense');

    setGameResult(result);

    // Save to ranking
    try {
      const rankingEntry: RankingEntry = {
        id: `rank-${Date.now()}`,
        name: gameMode === 'team' && result.teams ? [...result.teams].sort((a,b)=>b.score-a.score)[0]?.name || 'Equipe' : playerName,
        mode: gameMode === 'team' ? 'Equipes' : gameMode === 'duel' ? 'Duelo (1v1)' : gameMode === 'auditorium' ? 'Professor • Telão' : 'Individual',
        score: result.score,
        correctCount: result.correctCount,
        date: new Date().toLocaleDateString('pt-BR')
      };

      const existing: RankingEntry[] = JSON.parse(localStorage.getItem('unibra_show_ranking') || '[]');
      existing.push(rankingEntry);
      localStorage.setItem('unibra_show_ranking', JSON.stringify(existing.slice(-100)));

      // Sincronizar com banco de dados Firestore
      saveRankingToDb(rankingEntry).catch((err) => console.warn('Erro ao salvar ranking no Firestore:', err));
    } catch (e) {
      console.error('Failed to save ranking:', e);
    }

    setView('result');
  };

  const handleSaveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem('unibra_show_questions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    // Sincronizar questões no Firestore
    updated.forEach((q) => {
      saveQuestionToDb(q).catch((err) => console.warn('Erro ao salvar questão no Firestore:', err));
    });
  };

  const handleResetDefaultQuestions = () => {
    setQuestions(DEFAULT_QUESTIONS);
    try {
      localStorage.removeItem('unibra_show_questions');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoHome = () => {
    stopLoopingAudio('suspense');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-[#050b24] text-white flex flex-col font-serif selection:bg-amber-400 selection:text-black">
      <Navbar
        musicOn={musicOn}
        onToggleMusic={handleToggleMusic}
        onGoHome={handleGoHome}
        onOpenAdmin={() => { stopLoopingAudio('suspense'); setView('admin'); }}
        onOpenRanking={() => { stopLoopingAudio('suspense'); setView('ranking'); }}
        onOpenHowTo={() => { stopLoopingAudio('suspense'); setView('howto'); }}
      />

      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="flex-1 flex flex-col w-full"
          >
            {view === 'home' && (
              <HomeMenu
                onStartGame={handleStartGame}
                onOpenAdmin={() => { stopLoopingAudio('suspense'); setView('admin'); }}
                onOpenRanking={() => { stopLoopingAudio('suspense'); setView('ranking'); }}
                onOpenHowTo={() => { stopLoopingAudio('suspense'); setView('howto'); }}
                questionCount={questions.length}
              />
            )}

            {view === 'game' && (
              <GameScreen
                mode={gameMode}
                settings={gameSettings}
                playerName={playerName}
                initialTeams={teamNames}
                allQuestions={questions}
                onFinishGame={handleFinishGame}
                onBackToMenu={handleGoHome}
              />
            )}

            {view === 'result' && (
              <ResultScreen
                score={gameResult.score}
                correctCount={gameResult.correctCount}
                incorrectCount={gameResult.incorrectCount}
                log={gameResult.log}
                teams={gameResult.teams}
                allQuestions={questions}
                onRestart={() => { if (musicOn) startLoopingAudio('suspense', 0.8); setView('game'); }}
                onGoHome={handleGoHome}
              />
            )}

            {view === 'admin' && (
              <AdminPanel
                questions={questions}
                onSaveQuestions={handleSaveQuestions}
                onResetDefault={handleResetDefaultQuestions}
                onClose={handleGoHome}
              />
            )}

            {view === 'ranking' && (
              <RankingScreen onGoHome={handleGoHome} />
            )}

            {view === 'howto' && (
              <HowToPlayScreen onGoHome={handleGoHome} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-4 text-center text-xs text-blue-200/60 border-t border-blue-500/20 font-sans">
        UNIBRA • Centro Universitário • Professora Áurea Costa • Arena Da Nutrição
      </footer>
    </div>
  );
}
