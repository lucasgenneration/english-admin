'use client';

export const runtime = 'edge';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { vocabularyService } from '@/services/vocabularyService';
import { VocabularyCategory, VocabularyQuestion } from '@/types/vocabulary';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  FileUp,
  Loader2 
} from 'lucide-react';

interface CategoryQuestionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryQuestionsPage({ params }: CategoryQuestionsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<VocabularyCategory | null>(null);
  const [questions, setQuestions] = useState<VocabularyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, questionsData] = await Promise.all([
        vocabularyService.getCategoryById(id),
        vocabularyService.getQuestionsByCategory(id)
      ]);
      
      if (categoryData) {
        setCategory(categoryData);
        setQuestions(questionsData);
      } else {
        alert('Categoria não encontrada');
        router.push('/vocabulary');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) {
      return;
    }

    setDeleting(id);
    try {
      await vocabularyService.deleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
      alert('Pergunta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Erro ao excluir pergunta');
    } finally {
      setDeleting(null);
    }
  };

  const getDifficultyBadge = (difficulty: number) => {
    const configs = {
      1: { label: 'Fácil', color: 'bg-green-100 text-green-800' },
      2: { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Difícil', color: 'bg-red-100 text-red-800' }
    };
    const config = configs[difficulty as keyof typeof configs] || configs[1];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getLevelQuestions = () => {
    return questions.filter(q => q.level === selectedLevel);
  };

  if (loading || !category) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/vocabulary"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Categorias
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.titlePt}</h1>
              <p className="text-gray-600 mt-1">{category.titleEn}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{category.totalLevels} níveis</span>
                <span>•</span>
                <span>{questions.length} perguntas no total</span>
                {category.isPremium && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-600 font-medium">Premium</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60"
                title="Em breve"
              >
                <FileUp className="h-4 w-4" />
                Importar Perguntas
              </button>
              <Link
                href={`/vocabulary/${id}/questions/new`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nova Pergunta
              </Link>
            </div>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {Array.from({ length: category.totalLevels }, (_, i) => i + 1).map(level => {
                const levelQuestions = questions.filter(q => q.level === level);
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${selectedLevel === level
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Nível {level}
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {levelQuestions.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {getLevelQuestions().map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{question.emoji}</span>
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    {getDifficultyBadge(question.difficulty)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`
                          px-3 py-2 rounded-lg text-sm
                          ${optionIndex === question.correctIndex
                            ? 'bg-green-50 text-green-700 border border-green-200 font-medium'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }
                        `}
                      >
                        {option}
                        {optionIndex === question.correctIndex && (
                          <span className="ml-2 text-xs">(Correta)</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {(question.explanationEn || question.explanationPt) && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      {question.explanationEn && (
                        <p className="text-sm text-blue-800">
                          <strong>EN:</strong> {question.explanationEn}
                        </p>
                      )}
                      {question.explanationPt && (
                        <p className="text-sm text-blue-800 mt-1">
                          <strong>PT:</strong> {question.explanationPt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/vocabulary/${id}/questions/${question.id}/edit`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar pergunta"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deleting === question.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Excluir pergunta"
                  >
                    {deleting === question.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {getLevelQuestions().length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">
                Nenhuma pergunta cadastrada para o Nível {selectedLevel}.
              </p>
              <Link
                href={`/vocabulary/${id}/questions/new?level=${selectedLevel}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeira Pergunta
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}