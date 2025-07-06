'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder } from '@/types/study-content';
import { studyFolderService } from '@/services/studyContentService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { use } from 'react';

const ICON_OPTIONS = [
  'book', 'briefcase', 'plane', 'tv', 'music', 'star', 'heart', 'flag'
];

const COLOR_PRESETS = [
  '#9C27B0', // Purple
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#FFC107', // Amber
  '#795548', // Brown
];

export default function EditStudyPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [folder, setFolder] = useState<Partial<StudyFolder>>({
    name: '',
    description: '',
    iconName: 'book',
    colorHex: '#9C27B0',
    isPremium: false,
    order: 1,
  });

  useEffect(() => {
    if (!isNew) {
      loadFolder();
    }
  }, [id]);

  const loadFolder = async () => {
    try {
      const folderData = await studyFolderService.getById(id);
      
      if (!folderData) {
        toast.error('Pasta não encontrada');
        router.push('/study-plans');
        return;
      }
      
      setFolder(folderData);
    } catch (error) {
      console.error('Erro ao carregar pasta:', error);
      toast.error('Erro ao carregar pasta');
      router.push('/study-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folder.name?.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const folderId = await studyFolderService.create(folder as Omit<StudyFolder, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Pasta criada com sucesso!');
        router.push(`/study-plans/${folderId}`);
      } else {
        await studyFolderService.update(id, folder);
        toast.success('Pasta atualizada com sucesso!');
        router.push(`/study-plans/${id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar pasta:', error);
      toast.error('Erro ao salvar pasta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={isNew ? '/study-plans' : `/study-plans/${id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Nova Pasta de Estudo' : 'Editar Pasta de Estudo'}
            </h1>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="space-y-6">
              {/* Nome e Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Pasta *
                </label>
                <input
                  type="text"
                  value={folder.name}
                  onChange={(e) => setFolder({ ...folder, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Gospel Study Plan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={folder.description}
                  onChange={(e) => setFolder({ ...folder, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Aprenda inglês com mensagens inspiradoras"
                  rows={3}
                />
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFolder({ ...folder, iconName: icon })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        folder.iconName === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">
                        {icon === 'book' && '📚'}
                        {icon === 'briefcase' && '💼'}
                        {icon === 'plane' && '✈️'}
                        {icon === 'tv' && '📺'}
                        {icon === 'music' && '🎵'}
                        {icon === 'star' && '⭐'}
                        {icon === 'heart' && '❤️'}
                        {icon === 'flag' && '🚩'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do Tema
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFolder({ ...folder, colorHex: color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          folder.colorHex === color
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={folder.colorHex}
                      onChange={(e) => setFolder({ ...folder, colorHex: e.target.value })}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="#000000"
                    />
                    <div 
                      className="w-10 h-10 rounded-lg border border-gray-300"
                      style={{ backgroundColor: folder.colorHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Ordem e Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={folder.order}
                    onChange={(e) => setFolder({ ...folder, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    min="1"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Menor número aparece primeiro
                  </p>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={folder.isPremium}
                      onChange={(e) => setFolder({ ...folder, isPremium: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Conteúdo Premium
                      </span>
                      <p className="text-xs text-gray-500">
                        Apenas usuários premium podem acessar
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Link
                href={isNew ? '/study-plans' : `/study-plans/${id}`}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}