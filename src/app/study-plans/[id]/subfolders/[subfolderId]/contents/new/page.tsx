'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder, StudySubfolder, StudyContent } from '@/types/study-content';
import { studyFolderService, studySubfolderService, studyContentService } from '@/services/studyContentService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, FileVideo, FileText, Headphones } from 'lucide-react';
import { use } from 'react';

export const runtime = 'edge';

export default function NewContentPage({ 
  params 
}: { 
  params: Promise<{ id: string; subfolderId: string }> 
}) {
  const router = useRouter();
  const { id: folderId, subfolderId } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [folder, setFolder] = useState<StudyFolder | null>(null);
  const [subfolder, setSubfolder] = useState<StudySubfolder | null>(null);
  const [content, setContent] = useState<Partial<StudyContent>>({
    title: '',
    subtitle: '',
    description: '',
    type: 'video',
    externalLink: '',
    order: 1,
    subfolderId,
  });

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
      
      // Carregar subpasta
      const subfolderData = await studySubfolderService.getById(subfolderId);
      if (!subfolderData) {
        toast.error('Subpasta não encontrada');
        router.push(`/study-plans/${folderId}`);
        return;
      }
      setSubfolder(subfolderData);
      
      // Obter número de conteúdos para definir a ordem
      const contents = await studyContentService.getByParentId(subfolderId);
      setContent(prev => ({ ...prev, order: contents.length + 1 }));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
      router.push('/study-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.title?.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    
    if (!content.externalLink?.trim()) {
      toast.error('O link é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const contentData: Omit<StudyContent, 'id' | 'createdAt' | 'updatedAt'> = {
        title: content.title!,
        subtitle: content.subtitle || '',
        description: content.description || '',
        type: content.type as 'video' | 'article' | 'podcast',
        externalLink: content.externalLink!,
        order: content.order || 1,
        subfolderId,
      };
      
      await studyContentService.create(contentData);
      toast.success('Conteúdo criado com sucesso!');
      router.push(`/study-plans/${folderId}/subfolders/${subfolderId}`);
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
      toast.error('Erro ao criar conteúdo');
    } finally {
      setSaving(false);
    }
  };

  const getContentTypeInfo = (type: string) => {
    switch (type) {
      case 'video':
        return {
          icon: <FileVideo className="h-5 w-5 text-red-500" />,
          label: 'Vídeo',
          placeholder: 'https://youtube.com/watch?v=...',
        };
      case 'article':
        return {
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          label: 'Artigo',
          placeholder: 'https://example.com/article',
        };
      case 'podcast':
        return {
          icon: <Headphones className="h-5 w-5 text-purple-500" />,
          label: 'Podcast',
          placeholder: 'https://spotify.com/episode/...',
        };
      default:
        return {
          icon: null,
          label: '',
          placeholder: '',
        };
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
        <div className="max-w-3xl mx-auto">
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
            <Link href={`/study-plans/${folderId}/subfolders/${subfolderId}`} className="hover:text-gray-700">
              {subfolder.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Novo Conteúdo</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/study-plans/${folderId}/subfolders/${subfolderId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Novo Conteúdo</h1>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="space-y-6">
              {/* Tipo de Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['video', 'article', 'podcast'].map((type) => {
                    const info = getContentTypeInfo(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setContent({ ...content, type: type as any })}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                          content.type === type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {info.icon}
                        <span className="text-sm font-medium">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Introduction to English Grammar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo (opcional)
                </label>
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Learn the basics of English grammar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Externo *
                </label>
                <input
                  type="url"
                  value={content.externalLink}
                  onChange={(e) => setContent({ ...content, externalLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder={getContentTypeInfo(content.type || 'video').placeholder}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL completa do conteúdo externo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Descrição detalhada do conteúdo..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={content.order}
                  onChange={(e) => setContent({ ...content, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  min="1"
                  placeholder="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Menor número aparece primeiro
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Link
                href={`/study-plans/${folderId}/subfolders/${subfolderId}`}
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
                {saving ? 'Criando...' : 'Criar Conteúdo'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}