import React, { useState } from 'react';
import { GameLogEntry, Question, Team } from '../types';
import { Trophy, Award, RotateCcw, Home, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  correctCount: number;
  incorrectCount: number;
  log: GameLogEntry[];
  teams?: Team[];
  allQuestions: Question[];
  onRestart: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  correctCount,
  incorrectCount,
  log,
  teams,
  allQuestions,
  onRestart,
  onGoHome
}) => {
  const [showReview, setShowReview] = useState(false);
  const totalAnswered = correctCount + incorrectCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const sortedTeams = teams ? [...teams].sort((a, b) => b.score - a.score) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-3xl mx-auto flex items-center justify-center text-black shadow-2xl shadow-amber-500/30 mb-4">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-serif mb-2">
          Fim de Jogo!
        </h1>
        <p className="text-blue-200">Parabéns por participar do Show do Milhão da UNIBRA — Prof. Áurea Costa</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-blue-950/70 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 backdrop-blur-md">
        {sortedTeams ? (
          <div>
            <h3 className="text-xl font-bold text-amber-300 font-serif mb-4 text-center">Classificação das Equipes</h3>
            <div className="space-y-3">
              {sortedTeams.map((team, idx) => (
                <div
                  key={team.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    idx === 0
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-blue-900/40 border-blue-500/30 text-blue-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-sm font-mono">
                      {idx + 1}º
                    </span>
                    <span>{team.name}</span>
                  </div>
                  <span className="font-extrabold text-lg">R$ {team.score.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-xs text-blue-300 uppercase tracking-widest mb-1">Prêmio Acumulado</div>
            <div className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-serif mb-6">
              R$ {score.toLocaleString('pt-BR')}
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-blue-500/30 pt-6">
              <div>
                <div className="text-xs text-blue-300">Acertos</div>
                <div className="text-2xl font-bold text-emerald-400">{correctCount}</div>
              </div>
              <div>
                <div className="text-xs text-blue-300">Erros</div>
                <div className="text-2xl font-bold text-red-400">{incorrectCount}</div>
              </div>
              <div>
                <div className="text-xs text-blue-300">Aproveitamento</div>
                <div className="text-2xl font-bold text-amber-300">{accuracy}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full py-3 px-4 rounded-xl bg-blue-900/40 border border-blue-500/40 text-blue-200 font-semibold flex items-center justify-center gap-2 hover:bg-blue-800/40 transition shadow-md"
        >
          <BookOpen size={18} className="text-amber-400" />
          <span>{showReview ? 'Ocultar Revisão Detalhada' : 'Revisar Questões e Respostas'}</span>
        </button>

        {showReview && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            {log.map((entry, idx) => {
              const q = allQuestions.find(item => item.id === entry.questionId);
              if (!q) return null;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    entry.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-red-950/40 border-red-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {entry.isCorrect ? (
                      <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle size={20} className="text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="text-xs text-blue-300 mb-1 font-semibold">{q.category}</div>
                      <h4 className="font-bold text-white mb-2">{q.question}</h4>
                      <div className="text-xs space-y-1 text-blue-200">
                        <div>
                          Sua resposta: <span className={entry.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {entry.selectedOption !== null ? `${['A','B','C','D'][entry.selectedOption]}) ${q.options[entry.selectedOption]}` : 'Tempo Esgotado'}
                          </span>
                        </div>
                        {!entry.isCorrect && (
                          <div>
                            Resposta correta: <span className="text-emerald-400 font-bold">
                              {['A','B','C','D'][q.correctAnswer]}) {q.options[q.correctAnswer]}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 text-blue-300/80 italic">{q.explanation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold shadow-xl hover:scale-[1.01] transition flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Jogar Novamente</span>
        </button>

        <button
          onClick={onGoHome}
          className="flex-1 py-4 rounded-xl bg-blue-900/60 border border-blue-500/40 text-blue-200 font-bold hover:bg-blue-800/60 transition shadow-lg flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Voltar ao Menu Principal</span>
        </button>
      </div>
    </div>
  );
};
