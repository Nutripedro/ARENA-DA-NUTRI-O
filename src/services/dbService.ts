import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Question, RankingEntry } from '../types';
import { DEFAULT_QUESTIONS } from '../data/questions';

const QUESTIONS_COLLECTION = 'questions';
const RANKINGS_COLLECTION = 'rankings';
const SETTINGS_COLLECTION = 'settings';

/**
 * Escuta atualizações nas questões em tempo real
 */
export function subscribeQuestions(onUpdate: (questions: Question[]) => void): () => void {
  try {
    const qCol = collection(db, QUESTIONS_COLLECTION);
    return onSnapshot(
      qCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Question[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Question, 'id'>),
          }));
          onUpdate(list);
        } else {
          // Se banco estiver vazio pela 1a vez, pode usar questões padrão
          onUpdate(DEFAULT_QUESTIONS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, QUESTIONS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, QUESTIONS_COLLECTION);
  }
}

/**
 * Salva ou atualiza uma questão no Firestore
 */
export async function saveQuestionToDb(question: Question): Promise<void> {
  const path = `${QUESTIONS_COLLECTION}/${question.id}`;
  try {
    await setDoc(doc(db, QUESTIONS_COLLECTION, question.id), {
      category: question.category,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      tip: question.tip || '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Remove uma questão do Firestore
 */
export async function deleteQuestionFromDb(questionId: string): Promise<void> {
  const path = `${QUESTIONS_COLLECTION}/${questionId}`;
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, questionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Popula o banco com as questões padrão caso esteja vazio
 */
export async function seedDefaultQuestionsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, QUESTIONS_COLLECTION));
    if (snap.empty) {
      for (const q of DEFAULT_QUESTIONS) {
        await saveQuestionToDb(q);
      }
    }
  } catch (error) {
    console.warn('Seed do banco adiado ou sem permissão temporária:', error);
  }
}

/**
 * Escuta os rankings em tempo real ordenados por pontuação
 */
export function subscribeRankings(onUpdate: (rankings: RankingEntry[]) => void): () => void {
  try {
    const rQuery = query(
      collection(db, RANKINGS_COLLECTION),
      orderBy('score', 'desc'),
      limit(50)
    );
    return onSnapshot(
      rQuery,
      (snapshot) => {
        const list: RankingEntry[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<RankingEntry, 'id'>),
        }));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, RANKINGS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, RANKINGS_COLLECTION);
  }
}

/**
 * Salva uma nova pontuação no ranking na nuvem
 */
export async function saveRankingToDb(entry: RankingEntry): Promise<void> {
  const path = `${RANKINGS_COLLECTION}/${entry.id}`;
  try {
    await setDoc(doc(db, RANKINGS_COLLECTION, entry.id), {
      name: entry.name,
      mode: entry.mode,
      score: entry.score,
      correctCount: entry.correctCount,
      date: entry.date,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Salva áudio personalizado no Firestore para sincronização entre dispositivos
 */
export async function saveCustomAudioToDb(key: string, dataUrl: string, fileName?: string): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/audio_${key}`;
  try {
    // Trunca caso exceda limite de documento se necessário
    if (dataUrl.length > 900000) {
      console.warn('Áudio muito grande para sincronização em nuvem, mantendo local');
      return;
    }
    await setDoc(doc(db, SETTINGS_COLLECTION, `audio_${key}`), {
      key,
      dataUrl,
      fileName: fileName || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Sincronização de áudio em nuvem falhou, mantido local:', error);
  }
}
