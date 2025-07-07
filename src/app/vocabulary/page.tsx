'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { vocabularyService } from '@/services/vocabularyService';
import { VocabularyCategory } from '@/types/vocabulary';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Eye,
  Star,
  Loader2,
  Search 
} from 'lucide-react';
import { getIconEmoji } from '@/lib/icons';

export default function VocabularyPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<VocabularyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      const data = await vocabularyService.getCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(category => 
      category.titlePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${title}"? Todas as perguntas serão excluídas também.`)) {
      return;
    }

    setDeleting(id);
    try {
      await vocabularyService.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      alert('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erro ao excluir categoria');
    } finally {
      setDeleting(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newCategories[index], newCategories[newIndex]] = 
    [newCategories[newIndex], newCategories[index]];
    
    // Update order values
    const updates = newCategories.map((cat, idx) => ({
      id: cat.id,
      order: idx
    }));
    
    setReordering(true);
    try {
      await vocabularyService.reorderCategories(updates);
      setCategories(newCategories);
    } catch (error) {
      console.error('Error reordering categories:', error);
      alert('Erro ao reordenar categorias');
      loadCategories(); // Reload on error
    } finally {
      setReordering(false);
    }
  };

  const getGradientStyle = (colors: string[]) => {
    if (colors.length < 2) return { backgroundColor: colors[0] || '#ccc' };
    return {
      background: `linear-gradient(135deg, ${colors.join(', ')})`
    };
  };


  if (loading) {
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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vocabulary Challenge</h1>
              <p className="text-gray-600 mt-1">Gerencie as categorias e perguntas do desafio de vocabulário</p>
            </div>
            <Link
              href="/vocabulary/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {filteredCategories.map((category, index) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon with Gradient Background */}
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={getGradientStyle(category.gradientColors)}
                  >
                    <span className="text-2xl">
                      {getIconEmoji(category.iconName)}
                    </span>
                  </div>

                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900">{category.titleEn}</h3>
                      {category.isPremium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          <Star className="h-3 w-3 fill-current" />
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{category.titlePt}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span>{category.totalLevels} níveis</span>
                      <span>•</span>
                      <span>Ordem: {category.order + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0 || reordering}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para cima"
                    >
                      <MoveUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === filteredCategories.length - 1 || reordering}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para baixo"
                    >
                      <MoveDown className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    href={`/vocabulary/${category.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver perguntas"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/vocabulary/${category.id}/edit`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar categoria"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.titlePt)}
                    disabled={deleting === category.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Excluir categoria"
                  >
                    {deleting === category.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada ainda.</p>
            <Link
              href="/vocabulary/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Criar Primeira Categoria
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}