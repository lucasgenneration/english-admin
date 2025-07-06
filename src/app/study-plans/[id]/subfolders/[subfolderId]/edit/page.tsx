'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { StudyFolder, StudySubfolder } from '@/types/study-content';
import { studyFolderService, studySubfolderService } from '@/services/studyContentService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { use } from 'react';

export default function EditSubfolderPage({ 
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
    
    if (!subfolder?.name?.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      await studySubfolderService.update(subfolderId, {
        name: subfolder.name,
        description: subfolder.description,
        order: subfolder.order,
      });
      
      toast.success('Subpasta atualizada com sucesso!');
      router.push(`/study-plans/${folderId}/subfolders/${subfolderId}`);
    } catch (error) {
      console.error('Erro ao atualizar subpasta:', error);
      toast.error('Erro ao atualizar subpasta');
    } finally {
      setSaving(false);
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
            <span className="text-gray-900">Editar</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/study-plans/${folderId}/subfolders/${subfolderId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Editar Subpasta</h1>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Subpasta *
                </label>
                <input
                  type="text"
                  value={subfolder.name}
                  onChange={(e) => setSubfolder({ ...subfolder, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Lições Básicas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={subfolder.description || ''}
                  onChange={(e) => setSubfolder({ ...subfolder, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ex: Conteúdos introdutórios para iniciantes"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={subfolder.order}
                  onChange={(e) => setSubfolder({ ...subfolder, order: parseInt(e.target.value) || 1 })}
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
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}