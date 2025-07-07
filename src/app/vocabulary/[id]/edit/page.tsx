'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { vocabularyService } from '@/services/vocabularyService';
import { VocabularyCategory } from '@/types/vocabulary';
import { ArrowLeft, Save, Loader2, ChevronRight } from 'lucide-react';
import { iconOptions, getIconEmoji, getIconsByCategory } from '@/lib/icons';

const gradientPresets = [
  { colors: ['#667eea', '#764ba2'], name: 'Purple' },
  { colors: ['#f093fb', '#f5576c'], name: 'Pink' },
  { colors: ['#4facfe', '#00f2fe'], name: 'Blue' },
  { colors: ['#43e97b', '#38f9d7'], name: 'Green' },
  { colors: ['#fa709a', '#fee140'], name: 'Sunset' },
  { colors: ['#30cfd0', '#330867'], name: 'Ocean' },
  { colors: ['#a8edea', '#fed6e3'], name: 'Pastel' },
  { colors: ['#ff9a9e', '#fecfef'], name: 'Rose' },
  { colors: ['#fbc2eb', '#a6c1ee'], name: 'Lavender' },
  { colors: ['#fddb92', '#d1fdff'], name: 'Sunny' }
];

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Home');
  const [formData, setFormData] = useState<VocabularyCategory | null>(null);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    try {
      const category = await vocabularyService.getCategoryById(id);
      if (category) {
        setFormData(category);
      } else {
        alert('Categoria não encontrada');
        router.push('/vocabulary');
      }
    } catch (error) {
      console.error('Error loading category:', error);
      alert('Erro ao carregar categoria');
      router.push('/vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !formData.titleEn || !formData.titlePt) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const { id: categoryId, createdAt, updatedAt, ...updateData } = formData;
      await vocabularyService.updateCategory(id, updateData);
      alert('Categoria atualizada com sucesso!');
      router.push('/vocabulary');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Erro ao atualizar categoria');
    } finally {
      setSaving(false);
    }
  };

  const getGradientPreview = () => {
    if (!formData) return {};
    return {
      background: `linear-gradient(135deg, ${formData.gradientColors.join(', ')})`
    };
  };

  if (loading || !formData) {
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
            href="/vocabulary"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Categorias
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar Categoria</h1>
          <p className="text-gray-600 mt-1">Atualize as informações da categoria</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Preview</h2>
            </div>
            <div className="p-6">
              <div className="max-w-sm mx-auto">
                <div 
                  className="h-32 rounded-lg flex items-center justify-center text-white relative"
                  style={getGradientPreview()}
                >
                  <div className="text-4xl">
                    {getIconEmoji(formData.iconName)}
                  </div>
                  {formData.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                      PREMIUM
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-lg">{formData.titleEn || 'English Title'}</h3>
                  <p className="text-sm text-gray-600">{formData.titlePt || 'Título em Português'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Informações Básicas</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título em Inglês *
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Home & Family"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título em Português *
                  </label>
                  <input
                    type="text"
                    value={formData.titlePt}
                    onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Casa e Família"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ícone
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                    {Object.entries(getIconsByCategory()).map(([category, icons]) => (
                      <div key={category} className="border-b border-gray-200 last:border-0">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                          className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                          <ChevronRight 
                            className={`h-4 w-4 text-gray-400 transition-transform ${
                              expandedCategory === category ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        {expandedCategory === category && (
                          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50">
                            {icons.map(icon => (
                              <button
                                key={icon.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, iconName: icon.value })}
                                className={`
                                  p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-white transition-colors
                                  ${formData.iconName === icon.value 
                                    ? 'bg-blue-100 border-2 border-blue-500' 
                                    : 'bg-white border border-gray-200'
                                  }
                                `}
                                title={icon.label}
                              >
                                <span className="text-2xl">{icon.label.split(' ')[0]}</span>
                                <span className="text-xs text-gray-600 truncate w-full text-center">
                                  {icon.label.split(' ')[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Níveis
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.totalLevels}
                    onChange={(e) => setFormData({ ...formData, totalLevels: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Categoria Premium
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1 ml-6">
                  Categorias premium só podem ser acessadas por usuários com assinatura ativa
                </p>
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Configurações Visuais</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gradiente
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {gradientPresets.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, gradientColors: preset.colors })}
                      className={`
                        h-16 rounded-lg relative overflow-hidden transition-all
                        ${JSON.stringify(formData.gradientColors) === JSON.stringify(preset.colors)
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'hover:scale-105'
                        }
                      `}
                      style={{ background: `linear-gradient(135deg, ${preset.colors.join(', ')})` }}
                    >
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium drop-shadow">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cores Customizadas
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="color"
                      value={formData.gradientColors[0]}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        gradientColors: [e.target.value, formData.gradientColors[1]]
                      })}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cor inicial</p>
                  </div>
                  <div>
                    <input
                      type="color"
                      value={formData.gradientColors[1]}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        gradientColors: [formData.gradientColors[0], e.target.value]
                      })}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cor final</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
              href="/vocabulary"
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