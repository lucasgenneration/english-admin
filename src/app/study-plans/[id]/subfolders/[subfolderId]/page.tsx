'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder, StudySubfolder, StudyContent } from '@/types/study-content';
import { studyFolderService, studySubfolderService, studyContentService } from '@/services/studyContentService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit, Trash2, File, FileVideo, FileText, Headphones, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { use } from 'react';

export default function SubfolderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string; subfolderId: string }> 
}) {
  const router = useRouter();
  const { id: folderId, subfolderId } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<StudyFolder | null>(null);
  const [subfolder, setSubfolder] = useState<StudySubfolder | null>(null);
  const [contents, setContents] = useState<StudyContent[]>([]);

  useEffect(() => {
    loadData();
  }, [folderId, subfolderId]);

  const loadData = async () => {
    try {
      // Carregar pasta
      const folderData = await studyFolderService.getById(folderId);
      if (!folderData) {
        toast.error('Pasta não encontrada');
        router.push('/study-plans');
        return;
      }
      setFolder(folderData);

      // Carregar subfolder
      const subfolderData = await studySubfolderService.getById(subfolderId);
      if (!subfolderData) {
        toast.error('Subpasta não encontrada');
        router.push(`/study-plans/${folderId}`);
        return;
      }
      setSubfolder(subfolderData);

      // Carregar conteúdos
      const contentsData = await studyContentService.getByParentId(subfolderId);
      setContents(contentsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubfolder = async () => {
    if (!subfolder) return;
    
    if (confirm(`Tem certeza que deseja excluir a subpasta "${subfolder.name}"? Isso também excluirá todos os conteúdos.`)) {
      try {
        await studySubfolderService.delete(subfolderId);
        toast.success('Subpasta excluída com sucesso!');
        router.push(`/study-plans/${folderId}`);
      } catch (error) {
        console.error('Erro ao excluir subpasta:', error);
        toast.error('Erro ao excluir subpasta');
      }
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      try {
        await studyContentService.delete(contentId);
        toast.success('Conteúdo excluído com sucesso!');
        loadData();
      } catch (error) {
        console.error('Erro ao excluir conteúdo:', error);
        toast.error('Erro ao excluir conteúdo');
      }
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <FileVideo className="h-5 w-5 text-red-500" />;
      case 'article':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'podcast':
        return <Headphones className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newContents = [...contents];
    const currentContent = newContents[index];
    const previousContent = newContents[index - 1];
    
    // Trocar ordens
    const tempOrder = currentContent.order;
    currentContent.order = previousContent.order;
    previousContent.order = tempOrder;
    
    // Trocar posições no array
    newContents[index] = previousContent;
    newContents[index - 1] = currentContent;
    
    setContents(newContents);
    
    try {
      await studyContentService.reorder([
        { id: currentContent.id, order: currentContent.order },
        { id: previousContent.id, order: previousContent.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadData();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === contents.length - 1) return;
    
    const newContents = [...contents];
    const currentContent = newContents[index];
    const nextContent = newContents[index + 1];
    
    // Trocar ordens
    const tempOrder = currentContent.order;
    currentContent.order = nextContent.order;
    nextContent.order = tempOrder;
    
    // Trocar posições no array
    newContents[index] = nextContent;
    newContents[index + 1] = currentContent;
    
    setContents(newContents);
    
    try {
      await studyContentService.reorder([
        { id: currentContent.id, order: currentContent.order },
        { id: nextContent.id, order: nextContent.order }
      ]);
      toast.success('Índice atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao atualizar índice');
      loadData();
    }
  };

  if (loading || !folder || !subfolder) {
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/study-plans" className="hover:text-gray-700">
              Study Plans
            </Link>
            <span>/</span>
            <Link href={`/study-plans/${folderId}`} className="hover:text-gray-700">
              {folder.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{subfolder.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href={`/study-plans/${folderId}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{subfolder.name}</h1>
                {subfolder.description && (
                  <p className="text-gray-600 mt-1">{subfolder.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/study-plans/${folderId}/subfolders/${subfolderId}/edit`}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar subpasta"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDeleteSubfolder}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir subpasta"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span>{contents.length} conteúdos</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Atualizado em {subfolder.updatedAt?.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Contents */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Conteúdos</h2>
                <Link
                  href={`/study-plans/${folderId}/subfolders/${subfolderId}/contents/new`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Novo Conteúdo
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {contents.map((content, index) => (
                <div
                  key={content.id}
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getContentIcon(content.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          <h3 className="font-medium text-gray-900">{content.title}</h3>
                        </div>
                        {content.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">{content.subtitle}</p>
                        )}
                        {content.description && (
                          <p className="text-sm text-gray-500 mt-2">{content.description}</p>
                        )}
                        {content.externalLink && (
                          <a
                            href={content.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                          >
                            Ver conteúdo →
                          </a>
                        )}
                      </div>
                    </div>
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
                        disabled={index === contents.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Mover para baixo"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="w-px h-5 bg-gray-200 mx-1" />
                      <Link
                        href={`/study-plans/${folderId}/subfolders/${subfolderId}/contents/${content.id}/edit`}
                        className="p-1 text-gray-600 hover:text-gray-900 rounded transition-colors"
                        title="Editar conteúdo"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-1 text-red-600 hover:text-red-900 rounded transition-colors"
                        title="Excluir conteúdo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {contents.length === 0 && (
                <div className="p-12 text-center">
                  <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Nenhum conteúdo ainda. Adicione o primeiro conteúdo para começar.
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