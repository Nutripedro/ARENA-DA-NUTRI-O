// Custom audio player with localStorage persistence and global mute control

const customAudioElements: { [key: string]: HTMLAudioElement } = {};

// Initialize stored audios from localStorage on startup
try {
  ['suspense', 'ok', 'bad', 'bg'].forEach((key) => {
    const stored = localStorage.getItem(`unibra_audio_${key}`);
    if (stored) {
      const audio = new Audio(stored);
      audio.preload = 'auto';
      customAudioElements[key] = audio;
    }
  });
} catch (e) {
  console.warn('Failed to load stored audios:', e);
}

export function setCustomAudio(key: 'suspense' | 'ok' | 'bad' | 'bg', dataUrl: string) {
  try {
    const audio = new Audio(dataUrl);
    audio.preload = 'auto';
    customAudioElements[key] = audio;
    localStorage.setItem(`unibra_audio_${key}`, dataUrl);
  } catch (e) {
    console.warn('Failed to save custom audio to localStorage:', e);
  }
}

export function setGlobalMute(muted: boolean) {
  try {
    Object.values(customAudioElements).forEach(audio => {
      audio.muted = muted;
      if (muted) {
        audio.pause();
      }
    });
  } catch (e) {
    console.warn('Failed to set global mute:', e);
  }
}

export function startLoopingAudio(key: 'suspense' | 'ok' | 'bad' | 'bg', volume = 0.7) {
  try {
    const audio = customAudioElements[key];
    if (audio) {
      audio.loop = true;
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    }
  } catch (e) {
    console.warn('Failed to start looping audio:', e);
  }
}

export function stopLoopingAudio(key: 'suspense' | 'ok' | 'bad' | 'bg') {
  try {
    const audio = customAudioElements[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }
  } catch (e) {
    console.warn('Failed to stop looping audio:', e);
  }
}

export function playTone(_freq: number, _start: number, _dur: number, _type?: OscillatorType, _gain?: number, _vol?: number) {
  // Internal synthetic tone disabled by user preference (only custom uploaded audio is used)
}

export function playSound(effect: 'ok' | 'bad' | 'in' | 'sel' | 'help' | 'win' | 'tick' | 'suspense', volume = 0.7) {
  try {
    let key: 'suspense' | 'ok' | 'bad' | undefined;
    if (effect === 'suspense' || effect === 'tick') {
      key = 'suspense';
    } else if (effect === 'ok' || effect === 'win') {
      key = 'ok';
    } else if (effect === 'bad') {
      key = 'bad';
    }

    if (key && customAudioElements[key]) {
      const audio = customAudioElements[key];
      if (!audio.loop) {
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => {});
      }
    }
  } catch (e) {
    console.warn('Custom audio playback failed:', e);
  }
}
