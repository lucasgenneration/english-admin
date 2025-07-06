'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder } from '@/types/study-content';
import { studyFolderService } from '@/services/studyContentService';
import { Plus, Edit2, Trash2, FolderOpen, Folder, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function StudyPlansPage() {
  const router = useRouter();
  const [studyFolders, setStudyFolders] = useState<StudyFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyFolders();
  }, []);

  const loadStudyFolders = async () => {
    try {
      const folders = await studyFolderService.getAll();
      setStudyFolders(folders);
    } catch (error) {
      console.error('Erro ao carregar study folders:', error);
      toast.error('Erro ao carregar study folders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (folderId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pasta? Isso excluirá todas as subpastas e conteúdos relacionados.')) {
      return;
    }

    try {
      await studyFolderService.delete(folderId);
      toast.success('Pasta excluída com sucesso!');
      loadStudyFolders();
    } catch (error) {
      console.error('Erro ao excluir pasta:', error);
      toast.error('Erro ao excluir pasta');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newFolders = [...studyFolders];
    const currentFolder = newFolders[index];
    const previousFolder = newFolders[index - 1];
    
    // Trocar ordens
    const tempOrder = currentFolder.order;
    currentFolder.order = previousFolder.order;
    previousFolder.order = tempOrder;
    
    // Trocar posições no array
    newFolders[index] = previousFolder;
    newFolders[index - 1] = currentFolder;
    
    setStudyFolders(newFolders);
    
    try {
      await studyFolderService.reorder([
        { id: currentFolder.id, order: currentFolder.order },
        { id: previousFolder.id, order: previousFolder.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadStudyFolders();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === studyFolders.length - 1) return;
    
    const newFolders = [...studyFolders];
    const currentFolder = newFolders[index];
    const nextFolder = newFolders[index + 1];
    
    // Trocar ordens
    const tempOrder = currentFolder.order;
    currentFolder.order = nextFolder.order;
    nextFolder.order = tempOrder;
    
    // Trocar posições no array
    newFolders[index] = nextFolder;
    newFolders[index + 1] = currentFolder;
    
    setStudyFolders(newFolders);
    
    try {
      await studyFolderService.reorder([
        { id: currentFolder.id, order: currentFolder.order },
        { id: nextFolder.id, order: nextFolder.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadStudyFolders();
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Plans</h1>
              <p className="text-gray-600 mt-1">Gerencie as pastas e conteúdos de estudo</p>
            </div>
            <Link
              href="/study-plans/new"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              Nova Pasta
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : studyFolders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pasta ainda</h3>
              <p className="text-gray-500 mb-6">Comece criando sua primeira pasta de estudos</p>
              <Link
                href="/study-plans/new"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                Criar primeira pasta
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subpastas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atualizado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studyFolders.map((folder, index) => (
                    <tr 
                      key={folder.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/study-plans/${folder.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{folder.order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {folder.colorHex && (
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: folder.colorHex + '20' }}
                            >
                              <Folder 
                                className="h-5 w-5" 
                                style={{ color: folder.colorHex }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {folder.name}
                            </div>
                            {folder.description && (
                              <div className="text-sm text-gray-500">
                                {folder.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          folder.isPremium 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {folder.isPremium ? 'Premium' : 'Gratuito'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {folder.subfolders?.length || 0} subpastas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {folder.updatedAt ? folder.updatedAt.toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(index);
                            }}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(index);
                            }}
                            disabled={index === studyFolders.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <div className="w-px h-5 bg-gray-200 mx-1" />
                          <Link
                            href={`/study-plans/${folder.id}/edit`}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            title="Editar pasta"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(folder.id);
                            }}
                            className="p-1 text-red-600 hover:text-red-900"
                            title="Excluir pasta"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}