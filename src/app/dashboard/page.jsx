'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import { 
  MessageSquare, Calendar, Users, TrendingUp, 
  Clock, CheckCircle, XCircle, Sparkles 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    conversationsThisMonth: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [businessRes, bookingsRes] = await Promise.all([
        api.get('/business'),
        api.get('/bookings/filter/upcoming')
      ]);

      setBusiness(businessRes.data.business);
      setStats({
        totalBookings: businessRes.data.business.services?.length || 0,
        upcomingBookings: bookingsRes.data.bookings?.length || 0,
        conversationsThisMonth: businessRes.data.business.monthlyConversations || 0,
        conversionRate: 0
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your business today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          {/* Total Conversations */}
          <Card hover className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.conversationsThisMonth}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              WhatsApp Conversations
            </p>
          </Card>

          {/* Upcoming Bookings */}
          <Card hover className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.upcomingBookings}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Upcoming Appointments
            </p>
          </Card>

          {/* Total Services */}
          <Card hover className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {business?.services?.length || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Active Services
            </p>
          </Card>

          {/* WhatsApp Status */}
          <Card hover className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                {business?.whatsappConnected ? (
                  <CheckCircle className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {business?.whatsappConnected ? 'Connected' : 'Not Connected'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              WhatsApp Status
            </p>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Business Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Business Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Business Name</span>
                <span className="font-medium text-slate-900 dark:text-white">{business?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Type</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">{business?.businessType}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Plan</span>
                <span className="font-medium text-primary capitalize">{business?.plan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Staff Members</span>
                <span className="font-medium text-slate-900 dark:text-white">{business?.staff?.length || 0}</span>
              </div>
            </div>
          </Card>

          {/* Usage Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Usage This Month
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Conversations</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {business?.monthlyConversations || 0} / {business?.conversationLimit || 50}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(((business?.monthlyConversations || 0) / (business?.conversationLimit || 50)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
              
              {business?.plan === 'free' && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    Upgrade to Pro for unlimited conversations and advanced features!
                  </p>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Upgrade Now →
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}