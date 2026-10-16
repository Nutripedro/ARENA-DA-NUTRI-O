import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, GameSettings, Question, Team, GameLogEntry } from '../types';
import { playSound, startLoopingAudio, stopLoopingAudio } from '../utils/audio';
import { Timer, Award, CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight, RotateCcw, Volume2, Users, Swords } from 'lucide-react';

interface GameScreenProps {
  mode: GameMode;
  settings: GameSettings;
  playerName: string;
  initialTeams?: string[];
  allQuestions: Question[];
  onFinishGame: (result: {
    score: number;
    correctCount: number;
    incorrectCount: number;
    log: GameLogEntry[];
    teams?: Team[];
  }) => void;
  onBackToMenu: () => void;
}

const PRIZE_LADDER = [
  100, 200, 300, 500, 1000, 
  2000, 3000, 5000, 10000, 20000, 
  30000, 50000, 100000, 250000, 1000000
];

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  settings,
  playerName,
  initialTeams = ['Equipe 1', 'Equipe 2'],
  allQuestions,
  onFinishGame,
  onBackToMenu
}) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  
  // Teams or Duel players state
  const [teams, setTeams] = useState<Team[]>(() => {
    if (mode === 'duel') {
      const split = playerName.split(',').map(s => s.trim()).filter(Boolean);
      const p1 = split[0] || 'Jogador 1';
      const p2 = split[1] || 'Jogador 2';
      return [
        { id: 'p1', name: p1, score: 0 },
        { id: 'p2', name: p2, score: 0 }
      ];
    }
    return initialTeams.map((name, i) => ({ id: `t-${i}`, name, score: 0 }));
  });
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  // Duel specific states
  const [duelWinner, setDuelWinner] = useState<string | null>(null);
  const [p1Selected, setP1Selected] = useState<number | null>(null);
  const [p2Selected, setP2Selected] = useState<number | null>(null);

  // Current question state
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [showTip, setShowTip] = useState(false);
  const [universityVote, setUniversityVote] = useState<number[] | null>(null);
  const [usedHelps, setUsedHelps] = useState({ eliminate: false, vote: false, tip: false, skip: false });
  
  // Result state after confirmation
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine required difficulty for round
  const getDifficultyForRound = useCallback((idx: number): 1 | 2 | 3 => {
    if (settings.difficultyMode !== 'progressive') {
      return Number(settings.difficultyMode) as 1 | 2 | 3;
    }
    if (idx < 5) return 1;
    if (idx < 10) return 2;
    return 3;
  }, [settings.difficultyMode]);

  // Pick question function
  const selectQuestion = useCallback((usedIds: string[]) => {
    const targetDiff = getDifficultyForRound(roundIndex);
    let available = allQuestions.filter(q => !usedIds.includes(q.id));
    let matching = available.filter(q => q.difficulty === targetDiff);
    if (matching.length === 0) matching = available;
    if (matching.length === 0) matching = allQuestions;

    const randomIndex = Math.floor(Math.random() * matching.length);
    return matching[randomIndex];
  }, [allQuestions, getDifficultyForRound, roundIndex]);

  // Initialize first question
  useEffect(() => {
    const q = selectQuestion([]);
    setActiveQuestion(q);
    startTimeRef.current = Date.now();
    startLoopingAudio('suspense', 0.8);
  }, [selectQuestion]);

  // Timer effect
  useEffect(() => {
    if (settings.timeLimit === 0 || isLocked || gameOver) return;
    setTimeLeft(settings.timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          stopLoopingAudio('suspense');
          if (mode === 'duel') {
            setIsLocked(true);
            setIsTimedOut(true);
          } else {
            handleConfirmAnswer(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roundIndex, isLocked, gameOver, settings.timeLimit, mode]);

  const currentPrize = PRIZE_LADDER[roundIndex + (15 - settings.totalRounds)];

  // Select option for regular modes
  const handleSelectOption = (index: number) => {
    if (isLocked || hiddenOptions.includes(index)) return;
    setSelectedOption(index);
    playSound('sel');
  };

  // Duel player buzz-in & answer selection (First to click wins the buzz!)
  const handleDuelSelect = (playerIndex: number, optionIndex: number) => {
    if (isLocked || !activeQuestion) return;

    if (playerIndex === 0 && p1Selected === null) {
      setP1Selected(optionIndex);
    } else if (playerIndex === 1 && p2Selected === null) {
      setP2Selected(optionIndex);
    } else {
      return; // already selected
    }

    playSound('sel');

    // The first player to answer locks the round buzz!
    if (timerRef.current) clearInterval(timerRef.current);
    stopLoopingAudio('suspense');
    setIsLocked(true);

    const isCorrect = optionIndex === activeQuestion.correctAnswer;
    const winningPlayer = teams[playerIndex].name;
    setLastResult(isCorrect);
    setDuelWinner(winningPlayer);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const newLogEntry: GameLogEntry = {
      questionId: activeQuestion.id,
      selectedOption: optionIndex,
      isCorrect,
      timeSpent
    };
    setGameLog(prev => [...prev, newLogEntry]);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      playSound('ok');
      setTeams(prev => prev.map((t, idx) => idx === playerIndex ? { ...t, score: t.score + currentPrize } : t));
    } else {
      setIncorrectCount(prev => prev + 1);
      playSound('bad');
      // Penalize or give points to opponent
      const opponentIndex = playerIndex === 0 ? 1 : 0;
      setTeams(prev => prev.map((t, idx) => idx === opponentIndex ? { ...t, score: t.score + Math.round(currentPrize / 2) } : t));
    }

    if (roundIndex + 1 >= settings.totalRounds) {
      setGameOver(true);
    }
  };

  // Confirm answer for standard modes
  const handleConfirmAnswer = (timedOut = false) => {
    if (isLocked || !activeQuestion) return;
    if (selectedOption === null && !timedOut) return;

    if (timerRef.current) clearInterval(timerRef.current);
    stopLoopingAudio('suspense');
    setIsLocked(true);
    setIsTimedOut(timedOut);

    const isCorrect = !timedOut && selectedOption === activeQuestion.correctAnswer;
    setLastResult(isCorrect);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const newLogEntry: GameLogEntry = {
      questionId: activeQuestion.id,
      selectedOption,
      isCorrect,
      timeSpent
    };
    setGameLog(prev => [...prev, newLogEntry]);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      playSound('ok');
      if (mode === 'team') {
        setTeams(prev => prev.map((t, idx) => idx === currentTeamIndex ? { ...t, score: t.score + currentPrize } : t));
      } else {
        setScore(currentPrize);
      }
    } else {
      setIncorrectCount(prev => prev + 1);
      playSound('bad');
      if (mode !== 'team') {
        const safeScore = roundIndex >= 10 ? 20000 : roundIndex >= 5 ? 1000 : 0;
        setScore(safeScore);
        setGameOver(true);
      }
    }

    if (roundIndex + 1 >= settings.totalRounds) {
      setGameOver(true);
    }
  };

  // Advance to next round or finish
  const handleNextRound = () => {
    if (gameOver) {
      onFinishGame({
        score: mode === 'team' || mode === 'duel' ? Math.max(...teams.map(t => t.score)) : score,
        correctCount,
        incorrectCount,
        log: gameLog,
        teams: mode === 'team' || mode === 'duel' ? teams : undefined
      });
      return;
    }

    setRoundIndex(prev => prev + 1);
    if (mode === 'team') {
      setCurrentTeamIndex(prev => (prev + 1) % teams.length);
    }
    setSelectedOption(null);
    setP1Selected(null);
    setP2Selected(null);
    setDuelWinner(null);
    setIsLocked(false);
    setHiddenOptions([]);
    setIsTimedOut(false);
    setShowTip(false);
    setUniversityVote(null);
    setLastResult(null);

    const usedIds = gameLog.map(l => l.questionId);
    const q = selectQuestion(usedIds);
    setActiveQuestion(q);
    startTimeRef.current = Date.now();
    startLoopingAudio('suspense', 0.8);
  };

  // Stop game and take prize
  const handleStopGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopLoopingAudio('suspense');
    playSound('win');
    onFinishGame({
      score,
      correctCount,
      incorrectCount,
      log: gameLog
    });
  };

  // Helps
  const handleHelpEliminate = () => {
    if (usedHelps.eliminate || isLocked || !activeQuestion) return;
    setUsedHelps(prev => ({ ...prev, eliminate: true }));
    playSound('help');

    const wrongIndices = [0, 1, 2, 3].filter(i => i !== activeQuestion.correctAnswer);
    wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
    if (selectedOption !== null && toHide.includes(selectedOption)) {
      setSelectedOption(null);
    }
  };

  const handleHelpUniversityVote = () => {
    if (usedHelps.vote || isLocked || !activeQuestion) return;
    setUsedHelps(prev => ({ ...prev, vote: true }));
    playSound('help');

    const correctIdx = activeQuestion.correctAnswer;
    const remaining = [0, 1, 2, 3].filter(i => !hiddenOptions.includes(i));
    const correctPercent = 50 + Math.floor(Math.random() * 31);
    let remPercent = 100 - correctPercent;

    const votes = [0, 0, 0, 0];
    votes[correctIdx] = correctPercent;

    remaining.forEach((idx, i) => {
      if (idx !== correctIdx) {
        if (i === remaining.length - 1) {
          votes[idx] = remPercent;
        } else {
          const part = Math.floor(Math.random() * remPercent * 0.7);
          votes[idx] = part;
          remPercent -= part;
        }
      }
    });

    setUniversityVote(votes);
  };

  const handleHelpTip = () => {
    if (usedHelps.tip || isLocked) return;
    setUsedHelps(prev => ({ ...prev, tip: true }));
    playSound('help');
    setShowTip(true);
  };

  const handleHelpSkip = () => {
    if (usedHelps.skip || isLocked) return;
    setUsedHelps(prev => ({ ...prev, skip: true }));
    playSound('help');

    const usedIds = gameLog.map(l => l.questionId);
    const q = selectQuestion(usedIds);
    setActiveQuestion(q);
    setSelectedOption(null);
    setP1Selected(null);
    setP2Selected(null);
    setHiddenOptions([]);
    setShowTip(false);
    setUniversityVote(null);
    startTimeRef.current = Date.now();
    startLoopingAudio('suspense', 0.8);
  };

  if (!activeQuestion) return null;

  const isAuditorium = mode === 'auditorium';
  const isDuel = mode === 'duel';

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-6 grid gap-6 ${isAuditorium ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[1fr_260px]'}`}>
      {/* Main Game Area */}
      <div className="flex flex-col gap-6">
        {/* Header Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4 shadow-lg text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-200">
              Rodada <b>{roundIndex + 1}</b> de {settings.totalRounds}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              {activeQuestion.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200">
              Dificuldade: {activeQuestion.difficulty === 1 ? 'Fácil' : activeQuestion.difficulty === 2 ? 'Intermediária' : 'Difícil'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {settings.timeLimit > 0 && !isLocked && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold animate-pulse">
                <Timer size={16} />
                <span>{timeLeft}s</span>
              </div>
            )}
            <div className="text-right">
              <div className="text-xs text-blue-300">Prêmio da Questão</div>
              <div className="text-amber-400 font-extrabold text-lg">
                R$ {currentPrize.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Duel Mode Scores Header */}
        {isDuel && (
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border text-center transition ${p1Selected !== null ? 'bg-blue-900/80 border-amber-400' : 'bg-blue-950/50 border-blue-500/30'}`}>
              <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Jogador 1</div>
              <div className="text-xl font-bold text-white font-serif">{teams[0].name}</div>
              <div className="text-amber-400 font-extrabold text-lg mt-1">R$ {teams[0].score.toLocaleString('pt-BR')}</div>
            </div>

            <div className={`p-4 rounded-2xl border text-center transition ${p2Selected !== null ? 'bg-purple-900/80 border-amber-400' : 'bg-blue-950/50 border-blue-500/30'}`}>
              <div className="text-xs text-purple-300 uppercase tracking-wider mb-1">Jogador 2</div>
              <div className="text-xl font-bold text-white font-serif">{teams[1].name}</div>
              <div className="text-amber-400 font-extrabold text-lg mt-1">R$ {teams[1].score.toLocaleString('pt-BR')}</div>
            </div>
          </div>
        )}

        {/* Team Turn Indicator */}
        {mode === 'team' && (
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {teams.map((t, idx) => (
              <div
                key={t.id}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm whitespace-nowrap transition ${
                  idx === currentTeamIndex
                    ? 'bg-amber-500 text-black font-extrabold border-amber-300 shadow-lg scale-105'
                    : 'bg-blue-950/40 border-blue-500/30 text-blue-200'
                }`}
              >
                <span>{t.name}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">
                  R$ {t.score.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Question Card & Split Screen for Duel */}
        <div className={`bg-gradient-to-br from-blue-900/90 via-blue-950 to-[#070e27] border-2 border-blue-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-900/40 relative overflow-hidden ${isAuditorium ? 'py-12' : ''}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className={`font-serif font-bold text-white text-center leading-snug drop-shadow-md mb-8 ${isAuditorium ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
            {activeQuestion.question}
          </h2>

          {/* Duel Mode Split Screen */}
          {isDuel ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-blue-500/30">
              {/* Player 1 Side */}
              <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-amber-300 font-serif">⚡ {teams[0].name} (Esquerda)</span>
                  {p1Selected !== null && (
                    <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold">
                      Respondeu!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {activeQuestion.options.map((optText, idx) => {
                    const letter = ['A', 'B', 'C', 'D'][idx];
                    const isHidden = hiddenOptions.includes(idx);
                    const isChosen = p1Selected === idx;
                    const isCorrectAnswer = idx === activeQuestion.correctAnswer;

                    let btnStyle = 'bg-blue-900/50 border-blue-500/40 text-white hover:border-amber-400';
                    if (isHidden) btnStyle = 'opacity-0 pointer-events-none';
                    else if (isChosen) btnStyle = 'bg-amber-500 text-black font-extrabold border-amber-200';
                    else if (isLocked && isCorrectAnswer) btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDuelSelect(0, idx)}
                        disabled={isLocked || isHidden || p1Selected !== null}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-black/30 flex items-center justify-center font-bold text-amber-400">{letter}</span>
                        <span className="flex-1">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Player 2 Side */}
              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-purple-300 font-serif">⚡ {teams[1].name} (Direita)</span>
                  {p2Selected !== null && (
                    <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold">
                      Respondeu!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {activeQuestion.options.map((optText, idx) => {
                    const letter = ['A', 'B', 'C', 'D'][idx];
                    const isHidden = hiddenOptions.includes(idx);
                    const isChosen = p2Selected === idx;
                    const isCorrectAnswer = idx === activeQuestion.correctAnswer;

                    let btnStyle = 'bg-purple-900/50 border-purple-500/40 text-white hover:border-amber-400';
                    if (isHidden) btnStyle = 'opacity-0 pointer-events-none';
                    else if (isChosen) btnStyle = 'bg-amber-500 text-black font-extrabold border-amber-200';
                    else if (isLocked && isCorrectAnswer) btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDuelSelect(1, idx)}
                        disabled={isLocked || isHidden || p2Selected !== null}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-black/30 flex items-center justify-center font-bold text-amber-400">{letter}</span>
                        <span className="flex-1">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Standard Options Grid
            <div className={`grid gap-4 ${isAuditorium ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {activeQuestion.options.map((optText, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isHidden = hiddenOptions.includes(idx);
                const isSelected = selectedOption === idx;
                const isCorrectAnswer = idx === activeQuestion.correctAnswer;

                let btnStyle = 'bg-gradient-to-r from-blue-950 to-blue-900 border-blue-500/60 text-white hover:border-amber-400 hover:shadow-lg hover:shadow-blue-500/20';

                if (isHidden) {
                  btnStyle = 'opacity-0 pointer-events-none';
                } else if (isSelected && !isLocked) {
                  btnStyle = 'bg-gradient-to-r from-amber-500 to-amber-400 text-black border-amber-200 font-extrabold shadow-xl scale-[1.01]';
                } else if (isLocked) {
                  if (isCorrectAnswer) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-600/40 animate-pulse';
                  } else if (isSelected && !isCorrectAnswer) {
                    btnStyle = 'bg-red-600 border-red-400 text-white font-bold shadow-lg shadow-red-600/40';
                  } else {
                    btnStyle = 'bg-blue-950/40 border-blue-900/50 text-blue-300/50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isLocked || isHidden}
                    className={`relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 ${btnStyle} ${isAuditorium ? 'min-h-[90px] text-lg sm:text-xl' : 'min-h-[70px] text-base'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${isSelected && !isLocked ? 'bg-black text-amber-400' : 'bg-blue-900/80 text-amber-400 border border-blue-400/30'}`}>
                      {letter}
                    </div>
                    <span className="flex-1 font-medium">{optText}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* University Vote Simulation Panel */}
          {universityVote && (
            <div className="mt-6 p-4 rounded-2xl bg-purple-950/70 border border-purple-500/50 animate-fadeIn">
              <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                <Users size={16} />
                <span>Opinião da Turma UNIBRA (Simulação)</span>
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {universityVote.map((pct, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-900/60 h-24 rounded-lg flex items-end justify-center p-1 border border-purple-500/30">
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-md transition-all duration-500"
                        style={{ height: `${Math.max(pct, 8)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">{['A','B','C','D'][idx]} ({pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professor Tip Box */}
          {showTip && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-sm animate-fadeIn flex items-start gap-3">
              <HelpCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-400 mb-1 font-serif">Dica da Professora Áurea Costa:</strong>
                <p>{activeQuestion.tip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Helps Bar */}
        {!isDuel && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={handleHelpEliminate}
              disabled={usedHelps.eliminate || isLocked}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/40 text-purple-200 font-semibold text-sm hover:border-purple-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span>✨ Eliminar 2</span>
            </button>

            <button
              onClick={handleHelpUniversityVote}
              disabled={usedHelps.vote || isLocked}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/40 text-purple-200 font-semibold text-sm hover:border-purple-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span>📊 Opinião da Turma</span>
            </button>

            <button
              onClick={handleHelpTip}
              disabled={usedHelps.tip || isLocked}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/40 text-purple-200 font-semibold text-sm hover:border-purple-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span>💡 Dica da Profª Áurea</span>
            </button>

            <button
              onClick={handleHelpSkip}
              disabled={usedHelps.skip || isLocked}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/40 text-purple-200 font-semibold text-sm hover:border-purple-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span>🔄 Pular Questão</span>
            </button>
          </div>
        )}

        {/* Action Controls & Result Modal */}
        {!isDuel ? (
          !isLocked ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              {mode !== 'team' && roundIndex > 0 && (
                <button
                  onClick={handleStopGame}
                  className="px-6 py-3.5 rounded-xl bg-blue-900/60 border border-blue-500/40 text-blue-200 font-bold hover:bg-blue-800/60 transition shadow-lg flex items-center gap-2"
                >
                  <span>Parar e Levar R$ {score.toLocaleString('pt-BR')}</span>
                </button>
              )}

              <button
                onClick={() => handleConfirmAnswer(false)}
                disabled={selectedOption === null}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-lg shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>CONFIRMAR RESPOSTA</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border-2 shadow-2xl animate-fadeIn ${lastResult ? 'bg-emerald-950/80 border-emerald-500' : 'bg-red-950/80 border-red-500'}`}>
              <div className="flex items-start gap-4">
                {lastResult ? (
                  <CheckCircle2 size={36} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle size={36} className="text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold font-serif mb-1 ${lastResult ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isTimedOut ? 'TEMPO ESGOTADO!' : lastResult ? 'RESPOSTA CORRETA!' : 'RESPOSTA INCORRETA!'}
                  </h3>
                  <p className="text-sm text-blue-100 mb-3">
                    {activeQuestion.explanation}
                  </p>
                  <div className="text-xs text-blue-300/80 italic">
                    Referência: Conteúdo acadêmico de Nutrição e Bioquímica • UNIBRA.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold shadow-lg hover:scale-105 transition flex items-center gap-2"
                >
                  <span>{gameOver ? 'Ver Resultado Final' : 'Próxima Pergunta'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )
        ) : (
          isLocked && (
            <div className={`p-6 rounded-2xl border-2 shadow-2xl animate-fadeIn ${lastResult ? 'bg-emerald-950/80 border-emerald-500' : 'bg-red-950/80 border-red-500'}`}>
              <div className="flex items-start gap-4">
                {lastResult ? (
                  <CheckCircle2 size={36} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle size={36} className="text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold font-serif mb-1 ${lastResult ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isTimedOut ? 'TEMPO ESGOTADO!' : `DUELO: ${duelWinner} ${lastResult ? 'ACERTOU PRIMEIRO!' : 'ERROU!'}`}
                  </h3>
                  <p className="text-sm text-blue-100 mb-3">
                    {activeQuestion.explanation}
                  </p>
                  <div className="text-xs text-blue-300/80 italic">
                    Referência: Conteúdo acadêmico de Nutrição e Bioquímica • UNIBRA.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold shadow-lg hover:scale-105 transition flex items-center gap-2"
                >
                  <span>{gameOver ? 'Ver Resultado Final' : 'Próxima Rodada'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Prize Ladder Sidebar */}
      {!isAuditorium && !isDuel && (
        <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4 flex flex-col-reverse gap-1.5 shadow-xl max-h-[600px] overflow-y-auto">
          {PRIZE_LADDER.slice(15 - settings.totalRounds).map((prize, idx) => {
            const actualRound = idx;
            const isCurrent = actualRound === roundIndex;
            const isCompleted = actualRound < roundIndex;
            const isMilestone = [4, 9, 14].includes(idx);

            let style = 'bg-blue-900/30 text-blue-300';
            if (isCurrent) {
              style = 'bg-amber-500 text-black font-extrabold shadow-lg scale-105 border border-amber-300';
            } else if (isCompleted) {
              style = 'bg-blue-950/40 text-blue-400/50 line-through';
            } else if (isMilestone) {
              style = 'bg-purple-900/40 text-amber-300 font-bold border border-purple-500/40';
            }

            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition ${style}`}
              >
                <span>#{idx + 1}</span>
                <span>R$ {prize.toLocaleString('pt-BR')}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
