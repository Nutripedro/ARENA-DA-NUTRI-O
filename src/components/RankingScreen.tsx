import React, { useState, useEffect } from 'react';
import { RankingEntry } from '../types';
import { Trophy, Award, RotateCcw, Home } from 'lucide-react';

interface RankingScreenProps {
  onGoHome: () => void;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({ onGoHome }) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unibra_show_ranking');
      if (stored) {
        setRankings(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClear = () => {
    if (confirm('Deseja limpar o ranking deste dispositivo?')) {
      localStorage.removeItem('unibra_show_ranking');
      setRankings([]);
    }
  };

  const sorted = [...rankings].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-blue-950/80 border border-blue-500/40 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-amber-400 font-serif">Ranking & Histórico</h2>
            <p className="text-xs text-blue-200">Melhores pontuações registradas na plataforma UNIBRA</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sorted.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm hover:bg-red-900/60 transition"
            >
              Limpar Ranking
            </button>
          )}
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <Home size={16} />
            <span>Início</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-blue-300">
            <Award size={48} className="mx-auto text-amber-400/50 mb-3" />
            <p className="text-lg font-serif">Nenhuma partida registrada ainda.</p>
            <p className="text-xs text-blue-400 mt-1">Jogue uma partida para aparecer no ranking da UNIBRA!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-blue-500/30 text-xs text-blue-300 uppercase">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Participante / Equipe</th>
                  <th className="py-3 px-4">Modo</th>
                  <th className="py-3 px-4">Acertos</th>
                  <th className="py-3 px-4 text-right">Pontuação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10 text-sm">
                {sorted.map((entry, idx) => (
                  <tr key={entry.id || idx} className="hover:bg-blue-900/30 transition">
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">
                      {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">{entry.name}</td>
                    <td className="py-4 px-4 text-blue-200">
                      <span className="px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-xs">
                        {entry.mode}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-semibold">{entry.correctCount} acertos</td>
                    <td className="py-4 px-4 text-right font-extrabold text-amber-400 font-mono text-base">
                      R$ {entry.score.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
