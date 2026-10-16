import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameLogEntry, Question, Team } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Trophy,
  Award,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  BookOpen,
  BarChart3,
  Medal,
  Sparkles,
} from 'lucide-react';

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

interface PodiumItem {
  name: string;
  score: number;
  place: number;
  color: string;
  badge: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  correctCount,
  incorrectCount,
  log,
  teams,
  allQuestions,
  onRestart,
  onGoHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const totalAnswered = correctCount + incorrectCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // Obter os top 3 para o Pódio (a partir das equipes/duelistas ou histórico de ranking)
  const podiumData: PodiumItem[] = useMemo(() => {
    if (teams && teams.length > 0) {
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      return sorted.slice(0, 3).map((t, index) => ({
        name: t.name,
        score: t.score,
        place: index + 1,
        color: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#d97706',
        badge: index === 0 ? '🥇 1º Lugar' : index === 1 ? '🥈 2º Lugar' : '🥉 3º Lugar',
      }));
    }

    try {
      const stored = localStorage.getItem('unibra_show_ranking');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = [...parsed].sort((a, b) => b.score - a.score);
          return sorted.slice(0, 3).map((item, index) => ({
            name: item.name || `Participante ${index + 1}`,
            score: item.score,
            place: index + 1,
            color: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#d97706',
            badge: index === 0 ? '🥇 1º Lugar' : index === 1 ? '🥈 2º Lugar' : '🥉 3º Lugar',
          }));
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar ranking para pódio:', e);
    }

    // Fallback individual
    return [
      {
        name: 'Você',
        score: score,
        place: 1,
        color: '#f59e0b',
        badge: '🥇 1º Lugar',
      },
    ];
  }, [teams, score]);

  // Reorganizar para ordem visual de pódio: [2º Lugar (Esquerda), 1º Lugar (Centro), 3º Lugar (Direita)]
  const visualPodium = useMemo(() => {
    const first = podiumData.find((p) => p.place === 1);
    const second = podiumData.find((p) => p.place === 2);
    const third = podiumData.find((p) => p.place === 3);

    const ordered: (PodiumItem | null)[] = [];
    if (second) ordered.push(second);
    if (first) ordered.push(first);
    if (third) ordered.push(third);
    return ordered;
  }, [podiumData]);

  // Custom tooltip para o gráfico do Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PodiumItem;
      return (
        <div className="bg-[#08123b]/95 border border-amber-400/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-1 flex items-center gap-1.5">
            <Medal size={14} className="text-amber-400" />
            <span>{data.name}</span>
          </p>
          <p className="text-amber-300 font-mono font-extrabold text-base">
            R$ {data.score.toLocaleString('pt-BR')}
          </p>
          <p className="text-blue-300 text-[10px] mt-0.5">{data.badge}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-3xl mx-auto flex items-center justify-center text-black shadow-2xl shadow-amber-500/30 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-serif mb-2">
          Pódio dos Campeões
        </h1>
        <p className="text-blue-200">
          Arena Da Nutrição • Centro Universitário UNIBRA • Profª Áurea Costa
        </p>
      </motion.div>

      {/* Pódio 3D Visual (1º, 2º e 3º lugares) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-b from-blue-950/80 to-[#060c28] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 backdrop-blur-md relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 mb-6 border-b border-blue-500/30 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
              {teams ? 'Classificação das Equipes / Duelistas' : 'Destaque no Pódio Acadêmico'}
            </h3>
          </div>
          <span className="text-xs font-mono text-blue-300 bg-blue-900/50 px-2.5 py-1 rounded-full border border-blue-500/30">
            Top 3 Resultados
          </span>
        </div>

        {/* Pilares do Pódio */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6 pb-2 min-h-[220px]">
          {visualPodium.map((item, idx) => {
            if (!item) return null;
            const isFirst = item.place === 1;
            const isSecond = item.place === 2;
            const isThird = item.place === 3;

            const pedestalHeight = isFirst ? 'h-36 sm:h-44' : isSecond ? 'h-28 sm:h-32' : 'h-20 sm:h-24';
            const pedestalColor = isFirst
              ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 text-black border-amber-300 ring-4 ring-amber-400/30'
              : isSecond
              ? 'bg-gradient-to-t from-slate-600 via-slate-500 to-slate-400 text-white border-slate-300'
              : 'bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 text-white border-amber-600';

            return (
              <motion.div
                key={item.name + idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * item.place, type: 'spring' }}
                className="flex-1 max-w-[170px] flex flex-col items-center text-center"
              >
                {/* Nome e Prêmio Acima do Pilar */}
                <div className="mb-2">
                  <span className="text-2xl sm:text-3xl block">
                    {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] block mt-0.5">
                    {item.name}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono block">
                    R$ {item.score.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Pedestal */}
                <div
                  className={`w-full ${pedestalHeight} ${pedestalColor} rounded-t-2xl border-t-2 border-x-2 flex flex-col items-center justify-center shadow-2xl transition-all`}
                >
                  <span className="text-2xl sm:text-4xl font-extrabold font-serif">
                    {item.place}º
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-80 mt-1">
                    Lugar
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Gráfico de Barras com Recharts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-950/70 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300 font-serif">
              Visualização Gráfica das Pontuações
            </h3>
          </div>
          <span className="text-xs text-blue-300 font-sans">Valores em Reais (R$)</span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={podiumData}
              margin={{ top: 20, right: 20, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#93c5fd', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#3b82f6', opacity: 0.3 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#93c5fd', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="score"
                radius={[12, 12, 0, 0]}
                animationDuration={1200}
              >
                {podiumData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.place === 1 ? '#f59e0b' : entry.place === 2 ? '#94a3b8' : '#d97706'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Estatísticas Gerais da Partida */}
      <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 shadow-xl mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Acertos</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {correctCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Erros</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
              {incorrectCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Aproveitamento</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Revisão Detalhada de Respostas */}
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
              const q = allQuestions.find((item) => item.id === entry.questionId);
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
                          Sua resposta:{' '}
                          <span
                            className={
                              entry.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                            }
                          >
                            {entry.selectedOption !== null
                              ? `${['A', 'B', 'C', 'D'][entry.selectedOption]}) ${
                                  q.options[entry.selectedOption]
                                }`
                              : 'Tempo Esgotado'}
                          </span>
                        </div>
                        {!entry.isCorrect && (
                          <div>
                            Resposta correta:{' '}
                            <span className="text-emerald-400 font-bold">
                              {['A', 'B', 'C', 'D'][q.correctAnswer]}){' '}
                              {q.options[q.correctAnswer]}
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

      {/* Botões de Ação */}
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
