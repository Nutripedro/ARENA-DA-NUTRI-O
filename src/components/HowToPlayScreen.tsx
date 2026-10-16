import React from 'react';
import { BookOpen, Home, Award, Sparkles, Users, Presentation } from 'lucide-react';

interface HowToPlayScreenProps {
  onGoHome: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onGoHome }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-blue-950/80 border border-blue-500/40 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-amber-400 font-serif">Como Jogar • Regras</h2>
            <p className="text-xs text-blue-200">Guia completo da Arena Da Nutrição - Unibra — Prof. Áurea Costa</p>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg hover:scale-105 transition flex items-center gap-2"
        >
          <Home size={16} />
          <span>Início</span>
        </button>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-amber-300 font-serif mb-4 flex items-center gap-2">
            <Award size={22} className="text-amber-400" />
            <span>Dinâmica do Jogo</span>
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed mb-4">
            O participante responde a uma sequência de perguntas de múltipla escolha (A, B, C, D). Cada acerto faz o jogador subir na escada de prêmios (de R$ 100 até R$ 1.000.000 em pontos fictícios).
          </p>
          <p className="text-sm text-blue-100 leading-relaxed">
            Caso erre no modo individual, o jogador retorna ao último marco de segurança garantido (R$ 1.000 na 5ª questão ou R$ 20.000 na 10ª questão). O jogador também pode optar por <b>Parar</b> a qualquer momento antes de responder e levar o prêmio acumulado.
          </p>
        </div>

        <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-amber-300 font-serif mb-4 flex items-center gap-2">
            <Sparkles size={22} className="text-amber-400" />
            <span>As 4 Ajudas Disponíveis (1 uso cada)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-100">
            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30">
              <strong className="block text-amber-400 mb-1">🃏 Cartas da Profª Áurea</strong>
              Apresenta 4 cartas secretas. Ao virar uma carta, 2 opções incorretas são descartadas do tabuleiro e a dica clínica da questão é revelada!
            </div>
            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30">
              <strong className="block text-amber-400 mb-1">📊 Opinião da Turma</strong>
              Simula a votação dos alunos da UNIBRA apontando a alternativa mais provável.
            </div>
            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30">
              <strong className="block text-amber-400 mb-1">💡 Dica da Profª Áurea</strong>
              Exibe uma dica pedagógica valiosa para orientar o raciocínio clínico/científico.
            </div>
            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30">
              <strong className="block text-amber-400 mb-1">🔄 Pular Questão</strong>
              Desarta a pergunta atual e sorteia uma nova questão do mesmo nível de dificuldade.
            </div>
          </div>
        </div>

        <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-amber-300 font-serif mb-4 flex items-center gap-2">
            <Presentation size={22} className="text-amber-400" />
            <span>Modo Professor / Auditório (Telão)</span>
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed mb-4">
            Desenvolvido especialmente para aulas magnas e auditórios da UNIBRA projetados em telão.
          </p>
          <ul className="list-disc list-inside text-sm text-blue-200 space-y-2 font-mono">
            <li>Pressione as teclas <b>1, 2, 3, 4</b> ou <b>A, B, C, D</b> para selecionar instantaneamente a alternativa.</li>
            <li>Pressione <b>Enter</b> para confirmar a resposta ou avançar para a próxima pergunta.</li>
            <li>Use o botão de tela cheia no topo para expandir perfeitamente no projetor.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
