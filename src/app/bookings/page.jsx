'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { format } from 'date-fns';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Calendar, Clock, User, CheckCircle, XCircle, 
  AlertCircle, Search 
} from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    confirmed: { 
      icon: CheckCircle, 
      color: 'text-accent',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      label: 'Confirmed'
    },
    pending: { 
      icon: Clock, 
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      label: 'Pending'
    },
    cancelled: { 
      icon: XCircle, 
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      label: 'Cancelled'
    },
    completed: { 
      icon: CheckCircle, 
      color: 'text-primary',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'Completed'
    },
    no_show: { 
      icon: AlertCircle, 
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      label: 'No Show'
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, searchQuery]);

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=100`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
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
            Bookings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all your appointments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 animate-fade-in">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
                bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 
                text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button 
              variant={statusFilter === 'all' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'confirmed' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmed
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} bookings` 
                : 'Bookings will appear here when customers book via WhatsApp'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredBookings.map((booking, index) => {
              const statusInfo = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <Card 
                  key={booking.id} 
                  hover 
                  className={`p-6 border-l-4 ${statusInfo.border}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left: Customer & Service Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Customer Avatar */}
                      <div className="flex-shrink-0">
                        <img 
                          src={getAvatarUrl(booking.customer?.name || 'Customer')}
                          alt={booking.customer?.name}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-700"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {booking.customer?.name || 'Unknown Customer'}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{booking.service?.name || 'Service'}</span>
                          </div>
                          {booking.staff && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>with {booking.staff.name}</span>
                            </div>
                          )}
                          {booking.customer?.whatsappNumber && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {booking.customer.whatsappNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date/Time & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Date & Time */}
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium mb-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          {format(new Date(booking.startTime), 'hh:mm a')} - {format(new Date(booking.endTime), 'hh:mm a')}
                        </div>
                      </div>

                      {/* Actions */}
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}