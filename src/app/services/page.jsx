'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit2, Trash2, Scissors, Sparkles } from 'lucide-react';

const serviceImages = {
  salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
  spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
  clinic: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  dental: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
};

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: ''
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
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await api.get('/business/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        await api.patch(`/business/services/${editingService.id}`, formData);
      } else {
        await api.post('/business/services', formData);
      }
      
      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', description: '', duration: '', price: '', category: '' });
      loadServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      category: service.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/business/services/${id}`);
      loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Services
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your service offerings
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No services yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Get started by adding your first service
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                hover 
                className="overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Service Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-blue-500/20 relative overflow-hidden">
                  <img 
                    src={serviceImages[service.category?.toLowerCase()] || serviceImages.salon}
                    alt={service.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {service.name}
                    </h3>
                    {service.category && (
                      <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6">
                  {service.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {service.duration} minutes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Price</p>
                      <p className="text-lg font-bold text-primary">
                        ${parseFloat(service.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(service.id)}
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
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Service Name"
                  placeholder="Haircut"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Professional haircut with style consultation"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
                      bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 
                      text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <Input
                  label="Category"
                  placeholder="Hair, Nails, etc."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />

                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      setFormData({ name: '', description: '', duration: '', price: '', category: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" loading={loading}>
                    {editingService ? 'Update' : 'Create'}
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