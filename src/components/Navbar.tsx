import React from 'react';
import { Volume2, VolumeX, Maximize, Home, Shield, Trophy, HelpCircle, BookOpen } from 'lucide-react';

interface NavbarProps {
  musicOn: boolean;
  onToggleMusic: () => void;
  onGoHome: () => void;
  onOpenAdmin: () => void;
  onOpenRanking: () => void;
  onOpenHowTo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  musicOn,
  onToggleMusic,
  onGoHome,
  onOpenAdmin,
  onOpenRanking,
  onOpenHowTo
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="w-full bg-[#0a1442]/90 backdrop-blur-md border-b border-blue-500/30 px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-extrabold w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 text-lg">
            U
          </div>
          <div>
            <div className="text-amber-400 font-bold tracking-wide text-lg sm:text-xl drop-shadow-[0_0_12px_rgba(255,200,61,0.4)]">
              UNIBRA • Arena Da Nutrição
            </div>
            <div className="text-xs text-blue-200/80 font-sans">
              Professora Áurea Costa • Saúde & Conhecimento
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-sm hover:bg-blue-900/60 transition shadow-sm"
            title="Início"
          >
            <Home size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-sm hover:bg-blue-900/60 transition shadow-sm"
            title="Painel Administrativo"
          >
            <Shield size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={onOpenRanking}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-sm hover:bg-blue-900/60 transition shadow-sm"
            title="Ranking"
          >
            <Trophy size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          <button
            onClick={onOpenHowTo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-sm hover:bg-blue-900/60 transition shadow-sm"
            title="Como Jogar"
          >
            <HelpCircle size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Ajuda</span>
          </button>

          <div className="h-6 w-[1px] bg-blue-500/30 mx-1 hidden sm:block"></div>

          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition shadow-sm ${
              musicOn 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-blue-950/60 border-blue-500/40 text-gray-400'
            }`}
            title="Música de Fundo"
          >
            {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden md:inline">Música {musicOn ? 'Ligada' : 'Desligada'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-sm hover:bg-blue-900/60 transition shadow-sm"
            title="Tela Cheia (Ideal para Telão)"
          >
            <Maximize size={16} className="text-amber-400" />
            <span className="hidden md:inline">Tela Cheia</span>
          </button>
        </div>
      </div>
    </header>
  );
};
