import React, { useState } from 'react';
import { Question } from '../types';
import { setCustomAudio } from '../utils/audio';
import { Plus, Trash2, Edit, Save, RotateCcw, Download, Upload, Shield, Volume2, Music } from 'lucide-react';

interface AdminPanelProps {
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
  onResetDefault: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  questions,
  onSaveQuestions,
  onResetDefault,
  onClose
}) => {
  const [questionList, setQuestionList] = useState<Question[]>(questions);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for new or editing question
  const [formData, setFormData] = useState<Partial<Question>>({
    category: 'Nutrição Clínica',
    difficulty: 1,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    tip: ''
  });

  const [audioStatuses, setAudioStatuses] = useState<{ [key: string]: string }>(() => {
    const statuses: { [key: string]: string } = {};
    if (localStorage.getItem('unibra_audio_suspense')) statuses['suspense'] = 'Salvo na Memória';
    if (localStorage.getItem('unibra_audio_ok')) statuses['ok'] = 'Salvo na Memória';
    if (localStorage.getItem('unibra_audio_bad')) statuses['bad'] = 'Salvo na Memória';
    return statuses;
  });

  const handleSaveQuestion = () => {
    if (!formData.question || !formData.options || formData.options.some(o => !o)) {
      alert('Preencha o enunciado e todas as 4 alternativas.');
      return;
    }

    if (editingId) {
      const updated = questionList.map(q => q.id === editingId ? ({ ...q, ...formData } as Question) : q);
      setQuestionList(updated);
      onSaveQuestions(updated);
      setEditingId(null);
    } else {
      const newQ: Question = {
        id: `custom-${Date.now()}`,
        category: formData.category || 'Geral',
        difficulty: (formData.difficulty as 1 | 2 | 3) || 1,
        question: formData.question || '',
        options: formData.options || ['', '', '', ''],
        correctAnswer: formData.correctAnswer ?? 0,
        explanation: formData.explanation || '',
        tip: formData.tip || ''
      };
      const updated = [newQ, ...questionList];
      setQuestionList(updated);
      onSaveQuestions(updated);
    }

    setFormData({
      category: 'Nutrição Clínica',
      difficulty: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      tip: ''
    });
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setFormData({ ...q });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      const updated = questionList.filter(q => q.id !== id);
      setQuestionList(updated);
      onSaveQuestions(updated);
    }
  };

  const handleExportFullBackup = () => {
    const backup = {
      questions: questionList,
      audio_suspense: localStorage.getItem('unibra_audio_suspense'),
      audio_ok: localStorage.getItem('unibra_audio_ok'),
      audio_bad: localStorage.getItem('unibra_audio_bad'),
      audio_bg: localStorage.getItem('unibra_audio_bg')
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `unibra_show_milhao_projeto_completo_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleImportFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.questions)) {
            setQuestionList(parsed.questions);
            onSaveQuestions(parsed.questions);
          } else if (Array.isArray(parsed)) {
            setQuestionList(parsed);
            onSaveQuestions(parsed);
          }

          if (parsed.audio_suspense) {
            setCustomAudio('suspense', parsed.audio_suspense);
            setAudioStatuses(prev => ({ ...prev, suspense: 'Salvo na Memória' }));
          }
          if (parsed.audio_ok) {
            setCustomAudio('ok', parsed.audio_ok);
            setAudioStatuses(prev => ({ ...prev, ok: 'Salvo na Memória' }));
          }
          if (parsed.audio_bad) {
            setCustomAudio('bad', parsed.audio_bad);
            setAudioStatuses(prev => ({ ...prev, bad: 'Salvo na Memória' }));
          }
          if (parsed.audio_bg) {
            setCustomAudio('bg', parsed.audio_bg);
          }

          alert('Projeto completo (questões e áudios) importado e salvo na memória local!');
        } catch (err) {
          alert('Erro ao importar arquivo de backup do projeto.');
        }
      };
    }
  };

  const handleAudioUpload = (type: 'suspense' | 'ok' | 'bad', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomAudio(type, result);
          setAudioStatuses(prev => ({ ...prev, [type]: 'Salvo na Memória' }));
          alert(`Áudio salvo na memória interna e localmente com sucesso!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-blue-950/80 border border-blue-500/40 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-amber-400 font-serif">Painel Administrativo & Memória</h2>
            <p className="text-xs text-blue-200">Gerenciamento de perguntas e áudios salvos localmente</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportFullBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/60 border border-blue-500/40 text-sm text-blue-200 hover:bg-blue-800/60 transition"
            title="Salvar projeto completo (áudios e questões) em um arquivo"
          >
            <Download size={16} className="text-amber-400" />
            <span>Salvar Projeto Completo</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/60 border border-blue-500/40 text-sm text-blue-200 hover:bg-blue-800/60 transition cursor-pointer">
            <Upload size={16} className="text-amber-400" />
            <span>Carregar Projeto</span>
            <input type="file" accept=".json" onChange={handleImportFullBackup} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Deseja restaurar as perguntas originais?')) {
                onResetDefault();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-sm text-red-200 hover:bg-red-900/60 transition"
          >
            <RotateCcw size={16} />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg hover:scale-105 transition"
          >
            Concluir
          </button>
        </div>
      </div>

      {/* Audio Upload Section */}
      <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <h3 className="text-lg font-bold text-amber-300 font-serif mb-2 flex items-center gap-2">
          <Music size={20} className="text-amber-400" />
          <span>Áudios Personalizados (Salvos na Memória Interna)</span>
        </h3>
        <p className="text-xs text-blue-200 mb-6">
          Os áudios enviados abaixo são salvos automaticamente na memória local do navegador (localStorage) para persistir entre sessões.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Áudio de Contagem (Suspense)</h4>
              <p className="text-xs text-emerald-400 mb-3">{audioStatuses['suspense'] || 'Nenhum áudio salvo'}</p>
            </div>
            <label className="py-2 px-3 rounded-xl bg-amber-500 text-black text-xs font-bold text-center cursor-pointer hover:bg-amber-400 transition block">
              <span>Enviar Áudio</span>
              <input type="file" accept="audio/*" onChange={e => handleAudioUpload('suspense', e)} className="hidden" />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Áudio de Resposta Correta</h4>
              <p className="text-xs text-emerald-400 mb-3">{audioStatuses['ok'] || 'Nenhum áudio salvo'}</p>
            </div>
            <label className="py-2 px-3 rounded-xl bg-amber-500 text-black text-xs font-bold text-center cursor-pointer hover:bg-amber-400 transition block">
              <span>Enviar Áudio</span>
              <input type="file" accept="audio/*" onChange={e => handleAudioUpload('ok', e)} className="hidden" />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Áudio de Resposta Incorreta</h4>
              <p className="text-xs text-emerald-400 mb-3">{audioStatuses['bad'] || 'Nenhum áudio salvo'}</p>
            </div>
            <label className="py-2 px-3 rounded-xl bg-amber-500 text-black text-xs font-bold text-center cursor-pointer hover:bg-amber-400 transition block">
              <span>Enviar Áudio</span>
              <input type="file" accept="audio/*" onChange={e => handleAudioUpload('bad', e)} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <h3 className="text-lg font-bold text-amber-300 font-serif mb-4">
          {editingId ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Categoria / Tema</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
              placeholder="Ex: Bioquímica Clínica"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Dificuldade</label>
            <select
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: Number(e.target.value) as 1 | 2 | 3 })}
              className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
            >
              <option value={1}>Fácil (Rodadas 1-5)</option>
              <option value={2}>Intermediária (Rodadas 6-10)</option>
              <option value={3}>Difícil (Rodadas 11-15)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-blue-200 mb-1">Enunciado da Pergunta</label>
          <textarea
            rows={2}
            value={formData.question}
            onChange={e => setFormData({ ...formData, question: e.target.value })}
            className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
            placeholder="Digite o enunciado completo..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {formData.options?.map((opt, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-blue-200 mb-1">Alternativa {['A', 'B', 'C', 'D'][i]}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={e => {
                    const newOpts = [...(formData.options || ['', '', '', ''])];
                    newOpts[i] = e.target.value;
                    setFormData({ ...formData, options: newOpts });
                  }}
                  className="flex-1 bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
                  placeholder={`Opção ${['A', 'B', 'C', 'D'][i]}`}
                />
                <input
                  type="radio"
                  name="correctOpt"
                  checked={formData.correctAnswer === i}
                  onChange={() => setFormData({ ...formData, correctAnswer: i })}
                  title="Marcar como correta"
                  className="cursor-pointer accent-amber-400 w-5 h-5 my-auto"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Explicação / Justificativa</label>
            <input
              type="text"
              value={formData.explanation}
              onChange={e => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
              placeholder="Explicação pedagógica da resposta correta"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Dica do Professor</label>
            <input
              type="text"
              value={formData.tip}
              onChange={e => setFormData({ ...formData, tip: e.target.value })}
              className="w-full bg-blue-900/40 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white text-sm"
              placeholder="Dica útil para ajudar o aluno"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveQuestion}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <Save size={18} />
            <span>{editingId ? 'Salvar Alterações' : 'Adicionar Pergunta ao Banco'}</span>
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  category: 'Nutrição Clínica',
                  difficulty: 1,
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                  explanation: '',
                  tip: ''
                });
              }}
              className="py-3 px-6 rounded-xl bg-blue-900/40 border border-blue-500/40 text-blue-200 hover:bg-blue-800/40 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-blue-950/60 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-amber-300 font-serif mb-4">
          Banco Atual ({questionList.length} questões)
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {questionList.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    #{idx + 1} • {q.category}
                  </span>
                  <span className="text-xs font-mono text-purple-300">
                    Dif: {q.difficulty}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">{q.question}</h4>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(q)}
                  className="p-2 rounded-xl bg-blue-900/60 border border-blue-500/40 text-blue-200 hover:bg-blue-800 transition"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 hover:bg-red-900 transition"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
