'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, BookOpen, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalStudyPlans: number;
  completedLessons: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalStudyPlans: 0,
    completedLessons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Carregar estatísticas
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Usuários ativos (logaram nos últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeUsers = usersSnapshot.docs.filter(doc => {
        const lastLogin = doc.data().lastLoginAt?.toDate();
        return lastLogin && lastLogin > sevenDaysAgo;
      }).length;

      // Contar total de conteúdos de estudo (studyContents)
      const studyContentsSnapshot = await getDocs(collection(db, 'studyContents'));
      const totalStudyContents = studyContentsSnapshot.size;

      // Contar lições completadas de todos os usuários
      let completedLessons = 0;
      
      // Usar Promise.all para buscar em paralelo e melhorar performance
      const completedPromises = usersSnapshot.docs.map(async (userDoc) => {
        try {
          const completedContentsSnapshot = await getDocs(
            collection(db, 'users', userDoc.id, 'completedContents')
          );
          return completedContentsSnapshot.size;
        } catch (error) {
          // Se a subcoleção não existir ou houver erro, retorna 0
          return 0;
        }
      });
      
      const completedCounts = await Promise.all(completedPromises);
      completedLessons = completedCounts.reduce((total, count) => total + count, 0);

      setStats({
        totalUsers,
        activeUsers,
        totalStudyPlans: totalStudyContents,
        completedLessons,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Usuários Ativos',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Conteúdos de Estudo',
      value: stats.totalStudyPlans,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Conteúdos de Estudo Completados',
      value: stats.completedLessons,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral do aplicativo Inglês Diário</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Atividade Recente
            </h2>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  As atividades recentes aparecerão aqui
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}