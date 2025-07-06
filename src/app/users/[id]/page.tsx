'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Trophy, 
  Coins, 
  Target, 
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Shield,
  Key
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleTogglePremium = async () => {
    if (!user) return;
    
    const action = user.isPremium ? 'remover o status premium' : 'conceder status premium';
    if (confirm(`Tem certeza que deseja ${action} para ${user.name}?`)) {
      try {
        await userService.togglePremiumStatus(user.uid, !user.isPremium);
        await loadUser();
        alert(`Status premium ${user.isPremium ? 'removido' : 'concedido'} com sucesso!`);
      } catch (error) {
        console.error('Erro ao alterar status premium:', error);
        alert('Erro ao alterar status premium');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    
    if (confirm(`Enviar email de redefinição de senha para ${user.email}?`)) {
      try {
        await userService.resetUserPassword(user.email);
        alert('Email de redefinição de senha enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao resetar senha:', error);
        alert('Erro ao enviar email de redefinição');
      }
    }
  };

  const handleResetStreak = async () => {
    if (!user) return;
    
    if (confirm(`Tem certeza que deseja resetar o streak de ${user.name}?`)) {
      try {
        await userService.resetStreak(user.uid);
        await loadUser();
        alert('Streak resetado com sucesso!');
      } catch (error) {
        console.error('Erro ao resetar streak:', error);
        alert('Erro ao resetar streak');
      }
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/users"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <Link
              href={`/users/${user.uid}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Nome</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Telefone</span>
                  <span className="font-medium text-gray-900">{user.phone || 'Não informado'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isPremium 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Gamification Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gamificação</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.xp}</div>
                  <div className="text-sm text-gray-500">XP Total</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <Coins className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.coins}</div>
                  <div className="text-sm text-gray-500">Moedas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.userLevel}</div>
                  <div className="text-sm text-gray-500">Nível</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.streak}</div>
                  <div className="text-sm text-gray-500">Dias de Streak</div>
                </div>
              </div>
            </div>

            {/* Study Stats Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas de Estudo</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Lições Completadas</span>
                  <span className="font-medium text-gray-900">{user.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Palavras Aprendidas</span>
                  <span className="font-medium text-gray-900">{user.totalWords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Horas de Estudo</span>
                  <span className="font-medium text-gray-900">{user.totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Meta Diária</span>
                  <span className="font-medium text-gray-900">{user.dailyGoal} min</span>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Datas Importantes</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Cadastro</span>
                  <span className="font-medium text-gray-900">
                    {user.createdAt.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Último Login</span>
                  <span className="font-medium text-gray-900">
                    {user.lastLoginAt?.toLocaleDateString('pt-BR') || 'Nunca'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Último Check-in</span>
                  <span className="font-medium text-gray-900">
                    {user.lastCheckInDate?.toLocaleDateString('pt-BR') || 'Nunca'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Administrativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleTogglePremium}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  user.isPremium
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <Shield className="h-5 w-5" />
                {user.isPremium ? 'Remover Premium' : 'Conceder Premium'}
              </button>
              
              <button
                onClick={handleResetPassword}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                <Key className="h-5 w-5" />
                Resetar Senha
              </button>
              
              <button
                onClick={handleResetStreak}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Resetar Streak
              </button>
            </div>
          </div>

          {/* Achievements */}
          {user.achievements.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Conquistas ({user.achievements.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <Award className="h-4 w-4" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}