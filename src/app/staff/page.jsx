'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit2, Trash2, Calendar, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function StaffPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await api.get('/business/staff');
      setStaff(response.data.staff);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStaff) {
        await api.patch(`/business/staff/${editingStaff.id}`, formData);
      } else {
        await api.post('/business/staff', formData);
      }
      
      setShowModal(false);
      setEditingStaff(null);
      setFormData({ name: '', email: '', phone: '' });
      loadStaff();
    } catch (error) {
      console.error('Failed to save staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email || '',
      phone: staffMember.phone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;

    try {
      await api.delete(`/business/staff/${id}`);
      loadStaff();
    } catch (error) {
      console.error('Failed to delete staff:', error);
    }
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0EA5E9&color=fff&size=200&bold=true`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Team Members
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your staff and their calendar connections
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Staff Grid */}
        {staff.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No team members yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Add your first staff member to start managing calendars
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {staff.map((member, index) => (
              <Card 
                key={member.id} 
                hover 
                className="overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Profile Header */}
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-blue-500/10">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-lg bg-white">
                      <img 
                        src={getAvatarUrl(member.name)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Staff Details */}
                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  
                  {/* Calendar Status */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {member.nylasGrantId ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent">
                          Calendar Connected
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          No Calendar
                        </span>
                      </>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!member.nylasGrantId && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        Connect Calendar
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="w-full max-w-md p-6 animate-slide-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Sarah Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="sarah@salon.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    After adding a staff member, you can connect their calendar for availability checking.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      setEditingStaff(null);
                      setFormData({ name: '', email: '', phone: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" loading={loading}>
                    {editingStaff ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}