'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder, StudySubfolder } from '@/types/study-content';
import { studyFolderService, studySubfolderService } from '@/services/studyContentService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit, Trash2, Folder, ChevronRight, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { use } from 'react';

export default function StudyPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<StudyFolder | null>(null);
  const [subfolders, setSubfolders] = useState<StudySubfolder[]>([]);

  useEffect(() => {
    loadFolder();
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
      
      // Carregar subfolders
      const subfoldersData = await studySubfolderService.getByParentId(id);
      setSubfolders(subfoldersData);
    } catch (error) {
      console.error('Erro ao carregar pasta:', error);
      toast.error('Erro ao carregar pasta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folder) return;
    
    if (confirm(`Tem certeza que deseja excluir a pasta "${folder.name}"? Isso também excluirá todas as subpastas e conteúdos.`)) {
      try {
        await studyFolderService.delete(id);
        toast.success('Pasta excluída com sucesso!');
        router.push('/study-plans');
      } catch (error) {
        console.error('Erro ao excluir pasta:', error);
        toast.error('Erro ao excluir pasta');
      }
    }
  };

  const getIconEmoji = (iconName?: string) => {
    const icons: Record<string, string> = {
      'book': '📚',
      'briefcase': '💼',
      'plane': '✈️',
      'tv': '📺',
      'music': '🎵',
      'star': '⭐',
      'heart': '❤️',
      'flag': '🚩',
    };
    return icons[iconName || 'book'] || '📁';
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newSubfolders = [...subfolders];
    const currentSubfolder = newSubfolders[index];
    const previousSubfolder = newSubfolders[index - 1];
    
    // Trocar ordens
    const tempOrder = currentSubfolder.order;
    currentSubfolder.order = previousSubfolder.order;
    previousSubfolder.order = tempOrder;
    
    // Trocar posições no array
    newSubfolders[index] = previousSubfolder;
    newSubfolders[index - 1] = currentSubfolder;
    
    setSubfolders(newSubfolders);
    
    try {
      await studySubfolderService.reorder([
        { id: currentSubfolder.id, order: currentSubfolder.order },
        { id: previousSubfolder.id, order: previousSubfolder.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadFolder();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === subfolders.length - 1) return;
    
    const newSubfolders = [...subfolders];
    const currentSubfolder = newSubfolders[index];
    const nextSubfolder = newSubfolders[index + 1];
    
    // Trocar ordens
    const tempOrder = currentSubfolder.order;
    currentSubfolder.order = nextSubfolder.order;
    nextSubfolder.order = tempOrder;
    
    // Trocar posições no array
    newSubfolders[index] = nextSubfolder;
    newSubfolders[index + 1] = currentSubfolder;
    
    setSubfolders(newSubfolders);
    
    try {
      await studySubfolderService.reorder([
        { id: currentSubfolder.id, order: currentSubfolder.order },
        { id: nextSubfolder.id, order: nextSubfolder.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadFolder();
    }
  };

  if (loading || !folder) {
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
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/study-plans"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getIconEmoji(folder.iconName)}</span>
                  <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
                  {folder.isPremium && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                {folder.description && (
                  <p className="text-gray-600 mt-1">{folder.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/study-plans/${id}/edit`}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar pasta"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDeleteFolder}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir pasta"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Folder className="h-4 w-4" />
                <span>{subfolders.length} subpastas</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Atualizado em {folder.updatedAt?.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Subfolders */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Subpastas</h2>
                <Link
                  href={`/study-plans/${id}/subfolders/new`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nova Subpasta
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {subfolders.map((subfolder, index) => (
                <div
                  key={subfolder.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                >
                  <Link
                    href={`/study-plans/${id}/subfolders/${subfolder.id}`}
                    className="flex-1 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">{subfolder.name}</h3>
                        {subfolder.description && (
                          <p className="text-sm text-gray-500">{subfolder.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {subfolder.totalItems} conteúdos
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mover para cima"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === subfolders.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </div>
              ))}
              
              {subfolders.length === 0 && (
                <div className="p-12 text-center">
                  <Folder className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Nenhuma subpasta ainda. Crie a primeira subpasta para organizar os conteúdos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}