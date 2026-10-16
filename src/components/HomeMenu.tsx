import React, { useState } from 'react';
import { GameMode, GameSettings } from '../types';
import { Play, Users, Presentation, Settings, Trophy, BookOpen, Sparkles, Award, Swords } from 'lucide-react';

interface HomeMenuProps {
  onStartGame: (mode: GameMode, settings: GameSettings, playerName: string) => void;
  onOpenAdmin: () => void;
  onOpenRanking: () => void;
  onOpenHowTo: () => void;
  questionCount: number;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  onStartGame,
  onOpenAdmin,
  onOpenRanking,
  onOpenHowTo,
  questionCount
}) => {
  const [mode, setMode] = useState<GameMode>('individual');
  const [playerName, setPlayerName] = useState('Detetive UNIBRA');
  const [teamNames, setTeamNames] = useState('Equipe Alfa, Equipe Beta, Equipe Ômega');
  const [duelNames, setDuelNames] = useState('Jogador 1 (Nutri), Jogador 2 (Bio)');
  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 30,
    difficultyMode: 'progressive',
    totalRounds: 10
  });
  const [showConfig, setShowConfig] = useState(false);

  const handleStart = () => {
    const finalName = mode === 'team' ? teamNames : mode === 'duel' ? duelNames : playerName;
    onStartGame(mode, settings, finalName);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-amber-500/10">
        <Sparkles size={16} className="text-amber-400" />
        <span>Centro Universitário UNIBRA • Disciplina Prof. Áurea Costa</span>
      </div>

      {/* Main Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_35px_rgba(255,200,61,0.5)] font-serif mb-4">
          Arena Da Nutrição
        </h1>
        <p className="text-lg sm:text-xl text-blue-100/90 font-serif italic max-w-2xl mx-auto">
          "O conhecimento é o seu maior prêmio!" Desafie sua mente com bioquímica clínica, nutrição e ciência.
        </p>
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-8">
        <button
          onClick={() => setMode('individual')}
          className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
            mode === 'individual'
              ? 'bg-gradient-to-br from-blue-900/80 to-blue-950 border-amber-400 shadow-xl shadow-blue-600/30 scale-[1.02]'
              : 'bg-blue-950/40 border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-900/30'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <Play size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 font-serif">Individual</h3>
            <p className="text-xs text-blue-200/75">
              Modo clássico. Suba a escada de prêmios e use ajudas estratégicas.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>Jogar sozinho</span> →
          </div>
        </button>

        <button
          onClick={() => setMode('duel')}
          className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
            mode === 'duel'
              ? 'bg-gradient-to-br from-blue-900/80 to-blue-950 border-amber-400 shadow-xl shadow-blue-600/30 scale-[1.02]'
              : 'bg-blue-950/40 border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-900/30'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <Swords size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 font-serif">Modo Duelo (1v1)</h3>
            <p className="text-xs text-blue-200/75">
              Dois jogadores em tela dividida respondem simultaneamente. Quem responde primeiro pontua!
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>Batalha 1v1</span> →
          </div>
        </button>

        <button
          onClick={() => setMode('team')}
          className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
            mode === 'team'
              ? 'bg-gradient-to-br from-blue-900/80 to-blue-950 border-amber-400 shadow-xl shadow-blue-600/30 scale-[1.02]'
              : 'bg-blue-950/40 border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-900/30'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 font-serif">Equipes</h3>
            <p className="text-xs text-blue-200/75">
              Disputa por turnos entre grupos de alunos na sala de aula.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>Modo equipes</span> →
          </div>
        </button>

        <button
          onClick={() => setMode('auditorium')}
          className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
            mode === 'auditorium'
              ? 'bg-gradient-to-br from-blue-900/80 to-blue-950 border-amber-400 shadow-xl shadow-blue-600/30 scale-[1.02]'
              : 'bg-blue-950/40 border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-900/30'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <Presentation size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 font-serif">Professor • Telão</h3>
            <p className="text-xs text-blue-200/75">
              Otimizado para projetor e auditório com atalhos de teclado.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>Modo auditório</span> →
          </div>
        </button>
      </div>

      {/* Configuration & Input Panel */}
      <div className="w-full max-w-4xl bg-blue-950/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-amber-400 font-serif">Configurações da Partida</h3>
            <p className="text-xs text-blue-200/70">Personalize o tempo, rodadas e nome dos participantes</p>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/60 border border-blue-500/40 hover:bg-blue-800/60 transition"
          >
            {showConfig ? 'Ocultar Detalhes' : 'Ajustar Regras'}
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'team' ? (
            <div>
              <label className="block text-xs font-medium text-blue-200 mb-1">
                Nomes das Equipes (separadas por vírgula)
              </label>
              <input
                type="text"
                value={teamNames}
                onChange={(e) => setTeamNames(e.target.value)}
                className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ex: Equipe Alfa, Equipe Beta"
              />
            </div>
          ) : mode === 'duel' ? (
            <div>
              <label className="block text-xs font-medium text-blue-200 mb-1">
                Nomes dos Duelistas (separados por vírgula: Jogador 1, Jogador 2)
              </label>
              <input
                type="text"
                value={duelNames}
                onChange={(e) => setDuelNames(e.target.value)}
                className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ex: Aluno 1, Aluno 2"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-blue-200 mb-1">
                Nome do Participante / Aluno
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Seu Nome ou Apelido"
              />
            </div>
          )}

          {showConfig && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-500/20">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Tempo por Pergunta</label>
                <select
                  value={settings.timeLimit}
                  onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) })}
                  className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value={0}>Sem limite de tempo</option>
                  <option value={15}>15 segundos (Rápido)</option>
                  <option value={30}>30 segundos (Padrão)</option>
                  <option value={45}>45 segundos (Estendido)</option>
                  <option value={60}>60 segundos (Auditório)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Dificuldade</label>
                <select
                  value={settings.difficultyMode}
                  onChange={(e) => setSettings({ ...settings, difficultyMode: e.target.value as any })}
                  className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value="progressive">Progressiva (Fácil → Difícil)</option>
                  <option value="1">Somente Fácil</option>
                  <option value="2">Somente Intermediária</option>
                  <option value="3">Somente Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Número de Rodadas</label>
                <select
                  value={settings.totalRounds}
                  onChange={(e) => setSettings({ ...settings, totalRounds: Number(e.target.value) })}
                  className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value={5}>5 Rodadas (Rápido)</option>
                  <option value={10}>10 Rodadas (Médio)</option>
                  <option value={15}>15 Rodadas (Completo)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="mt-6">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-lg shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <Award size={22} />
            <span>INICIAR ARENA DA NUTRIÇÃO — UNIBRA</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200/80">
        <button onClick={onOpenAdmin} className="flex items-center gap-1.5 hover:text-amber-400 transition">
          <Settings size={16} />
          <span>Banco de Perguntas ({questionCount})</span>
        </button>
        <span>•</span>
        <button onClick={onOpenRanking} className="flex items-center gap-1.5 hover:text-amber-400 transition">
          <Trophy size={16} />
          <span>Ranking Geral</span>
        </button>
        <span>•</span>
        <button onClick={onOpenHowTo} className="flex items-center gap-1.5 hover:text-amber-400 transition">
          <BookOpen size={16} />
          <span>Regras e Teclas</span>
        </button>
      </div>
    </div>
  );
};
