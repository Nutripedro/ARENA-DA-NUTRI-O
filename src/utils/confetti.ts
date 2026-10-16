import confetti from 'canvas-confetti';

/**
 * Dispara confetes e partículas comemorativas quando o participante acerta a resposta
 * Cores institucionais UNIBRA (Dourado, Verde Acerto, Azul Royal e Branco)
 */
export function triggerCorrectAnswerConfetti() {
  try {
    const unibraColors = ['#f59e0b', '#fbbf24', '#10b981', '#34d399', '#3b82f6', '#ffffff'];

    // 1. Explosão Central Imediata
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.65 },
      colors: unibraColors,
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // 2. Canhões Laterais (Esquerda e Direita) com leve atraso
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.8 },
        colors: unibraColors,
        disableForReducedMotion: true,
        zIndex: 9999,
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.8 },
        colors: unibraColors,
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 150);

    // 3. Chuva fina dourada de estrelas / brilhos
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['circle', 'square'],
        colors: ['#ffd700', '#f59e0b', '#ffffff'],
        scalar: 1.2,
        gravity: 0.8,
        ticks: 200,
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 300);
  } catch (err) {
    console.warn('Efeito de confetes não pôde ser executado:', err);
  }
}
