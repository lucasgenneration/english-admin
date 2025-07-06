'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';
import { ArrowLeft, Save, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const userData = await userService.getUser(id);
      if (!userData) {
        alert('Usuário não encontrado');
        router.push('/users');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      alert('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await userService.updateUser(user.uid, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        goal: user.goal,
        level: user.level,
        frequency: user.frequency,
        dailyGoal: user.dailyGoal,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        totalLessons: user.totalLessons,
        totalWords: user.totalWords,
        totalHours: user.totalHours,
        isPremium: user.isPremium,
        subscriptionType: user.subscriptionType,
      });
      
      alert('Usuário atualizado com sucesso!');
      router.push(`/users/${user.uid}`);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário');
    } finally {
      setSaving(false);
    }
  };

  const handleAddXP = async (amount: number) => {
    if (!user) return;
    try {
      await userService.addXP(user.uid, amount);
      await loadUser();
    } catch (error) {
      console.error('Erro ao adicionar XP:', error);
      alert('Erro ao adicionar XP');
    }
  };

  const handleAddCoins = async (amount: number) => {
    if (!user) return;
    try {
      await userService.addCoins(user.uid, amount);
      await loadUser();
    } catch (error) {
      console.error('Erro ao adicionar moedas:', error);
      alert('Erro ao adicionar moedas');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!user) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              href={`/users/${user.uid}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Usuário</h1>
              <p className="text-gray-600">{user.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={user.phone || ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Diária (minutos)
                  </label>
                  <select
                    value={user.dailyGoal}
                    onChange={(e) => setUser({ ...user, dailyGoal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 minutos</option>
                    <option value={10}>10 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gamification */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gamificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    XP Total
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={user.xp}
                      onChange={(e) => setUser({ ...user, xp: Number(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddXP(10)}
                        className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Adicionar 10 XP"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddXP(-10)}
                        className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Remover 10 XP"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={user.coins}
                      onChange={(e) => setUser({ ...user, coins: Number(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddCoins(10)}
                        className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors"
                        title="Adicionar 10 moedas"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCoins(-10)}
                        className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Remover 10 moedas"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível (calculado automaticamente)
                  </label>
                  <input
                    type="number"
                    value={Math.floor(user.xp / 100) + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dias de Streak
                  </label>
                  <input
                    type="number"
                    value={user.streak}
                    onChange={(e) => setUser({ ...user, streak: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Study Statistics */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas de Estudo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lições Completadas
                  </label>
                  <input
                    type="number"
                    value={user.totalLessons}
                    onChange={(e) => setUser({ ...user, totalLessons: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palavras Aprendidas
                  </label>
                  <input
                    type="number"
                    value={user.totalWords}
                    onChange={(e) => setUser({ ...user, totalWords: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas de Estudo
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={user.totalHours}
                    onChange={(e) => setUser({ ...user, totalHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Premium Status */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={user.isPremium}
                    onChange={(e) => setUser({ ...user, isPremium: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                    Usuário Premium
                  </label>
                </div>
                {user.isPremium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Assinatura
                    </label>
                    <select
                      value={user.subscriptionType || 'individual'}
                      onChange={(e) => setUser({ ...user, subscriptionType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="individual">Individual</option>
                      <option value="family">Familiar</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/users/${user.uid}`}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}