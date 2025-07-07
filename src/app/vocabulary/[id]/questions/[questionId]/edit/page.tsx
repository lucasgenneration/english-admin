'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { vocabularyService } from '@/services/vocabularyService';
import { VocabularyCategory, VocabularyQuestion } from '@/types/vocabulary';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';

interface EditQuestionPageProps {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id, questionId } = use(params);
  const router = useRouter();
  
  const [category, setCategory] = useState<VocabularyCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<VocabularyQuestion | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, questionData] = await Promise.all([
        vocabularyService.getCategoryById(id),
        vocabularyService.getQuestionById(questionId)
      ]);
      
      if (categoryData && questionData) {
        setCategory(categoryData);
        setFormData(questionData);
      } else {
        alert('Dados não encontrados');
        router.push('/vocabulary');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erro ao carregar dados');
      router.push('/vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    // Validation
    if (!formData.question.trim()) {
      alert('Por favor, insira a pergunta');
      return;
    }
    
    const filledOptions = formData.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      alert('Por favor, adicione pelo menos 2 opções de resposta');
      return;
    }
    
    if (!formData.emoji || formData.emoji === '❓') {
      alert('Por favor, escolha um emoji para a pergunta');
      return;
    }

    setSaving(true);
    try {
      const { id: qId, createdAt, updatedAt, ...updateData } = formData;
      await vocabularyService.updateQuestion(questionId, {
        ...updateData,
        options: formData.options.filter(opt => opt.trim()) // Remove empty options
      });
      alert('Pergunta atualizada com sucesso!');
      router.push(`/vocabulary/${id}`);
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Erro ao atualizar pergunta');
    } finally {
      setSaving(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!formData) return;
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (!formData) return;
    if (formData.options.length < 6) {
      setFormData({ 
        ...formData, 
        options: [...formData.options, ''] 
      });
    }
  };

  const removeOption = (index: number) => {
    if (!formData) return;
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ 
        ...formData, 
        options: newOptions,
        // Adjust correct index if needed
        correctIndex: formData.correctIndex >= index && formData.correctIndex > 0 
          ? formData.correctIndex - 1 
          : formData.correctIndex
      });
    }
  };

  const commonEmojis = ['🏠', '🛍️', '💼', '🍽️', '⚽', '🏥', '🎓', '✈️', '🎨', '💻', 
                        '📚', '🚗', '🌳', '☀️', '🌙', '💰', '📱', '👥', '🎭', '🏖️'];

  if (loading || !category || !formData) {
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
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/vocabulary/${id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para {category.titlePt}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar Pergunta</h1>
          <p className="text-gray-600 mt-1">Atualize as informações da pergunta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Detalhes da Pergunta</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: category.totalLevels }, (_, i) => i + 1).map(level => (
                      <option key={level} value={level}>
                        Nível {level}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificuldade
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Fácil</option>
                    <option value={2}>Médio</option>
                    <option value={3}>Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emoji *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="w-20 px-3 py-2 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={2}
                    />
                    <div className="flex-1 flex flex-wrap gap-1">
                      {commonEmojis.slice(0, 8).map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, emoji })}
                          className="p-1 text-xl hover:bg-gray-100 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pergunta *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: What is the color of the sky?"
                />
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Opções de Resposta</h2>
              {formData.options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Opção
                </button>
              )}
            </div>
            <div className="p-6 space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctIndex === index}
                    onChange={() => setFormData({ ...formData, correctIndex: index })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Opção ${index + 1}`}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-2">
                * Selecione o radio button da resposta correta
              </p>
            </div>
          </div>

          {/* Explanations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Explicações (Opcional)</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explicação em Inglês
                </label>
                <textarea
                  value={formData.explanationEn || ''}
                  onChange={(e) => setFormData({ ...formData, explanationEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Ex: The sky appears blue due to the scattering of sunlight..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explicação em Português
                </label>
                <textarea
                  value={formData.explanationPt || ''}
                  onChange={(e) => setFormData({ ...formData, explanationPt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Ex: O céu parece azul devido ao espalhamento da luz solar..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
              href={`/vocabulary/${id}`}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}