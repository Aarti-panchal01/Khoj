import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, Package, Search, Award, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserItems, deleteItem } from '../../lib/db';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadUserItems = () => {
    if (user) {
      const items = getUserItems(user.id);
      setUserItems(items);
    }
  };

  useEffect(() => {
    loadUserItems();
  }, [user]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadUserItems(); // Reload items
    }
  };

  const handleEditClick = (itemId) => {
    navigate(`/post?edit=${itemId}`);
  };

  const stats = {
    total: userItems.length,
    found: userItems.filter(i => i.type === 'found').length,
    lost: userItems.filter(i => i.type === 'lost').length,
    resolved: userItems.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Header */}
        <Card className="p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:flex-row md:items-start md:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center ring-4 ring-primary-50">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left min-w-0 w-full md:w-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                {user?.name}
              </h1>
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-600">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-600">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-600">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.college}</span>
                </div>
              </div>
            </div>

            {/* Reputation Badge */}
            <div className="flex-shrink-0">
              <div className="inline-flex flex-col items-center px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl border border-warning-200">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-warning-600 mb-1" />
                <p className="text-[10px] sm:text-xs font-medium text-warning-700 uppercase tracking-wide">Reputation</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-600">{user?.reputation || 0}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          <Card className="p-3 sm:p-4 md:p-5 text-center hover:shadow-md transition-shadow bg-gradient-to-br from-white to-primary-50/30">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">{stats.total}</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">Total Posts</p>
          </Card>

          <Card className="p-3 sm:p-4 md:p-5 text-center hover:shadow-md transition-shadow bg-gradient-to-br from-white to-success-50/30">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-success-600" />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-success-600 mb-0.5 sm:mb-1">{stats.found}</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">Found</p>
          </Card>

          <Card className="p-3 sm:p-4 md:p-5 text-center hover:shadow-md transition-shadow bg-gradient-to-br from-white to-danger-50/30">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-danger-600" />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-danger-600 mb-0.5 sm:mb-1">{stats.lost}</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">Lost</p>
          </Card>

          <Card className="p-3 sm:p-4 md:p-5 text-center hover:shadow-md transition-shadow bg-gradient-to-br from-white to-warning-50/30">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-warning-600" />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-warning-600 mb-0.5 sm:mb-1">{stats.resolved}</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">Resolved</p>
          </Card>
        </div>

        {/* My Posts */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
              My Posts {userItems.length > 0 && <span className="text-sm sm:text-base text-gray-500 ml-2">({userItems.length})</span>}
            </h2>
          </div>

          {userItems.length === 0 ? (
            <div className="text-center py-10 sm:py-12 md:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">No posts yet</h3>
              <p className="text-xs sm:text-sm text-gray-600">Start by posting your first lost or found item</p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
              {userItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all bg-white">
                  {/* Image */}
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden ring-2 ring-gray-100">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5 sm:gap-2 mb-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                          {item.title}
                        </h3>
                        {/* Action Buttons - Desktop */}
                        <div className="hidden sm:flex gap-1.5">
                          <button
                            onClick={() => handleEditClick(item.id)}
                            className="p-1.5 md:p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all hover:scale-105"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 md:p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-all hover:scale-105"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge variant={item.type === 'found' ? 'found' : 'lost'}>
                          {item.type}
                        </Badge>
                        <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                          {item.status}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-gray-500">•</span>
                        <span className="text-[10px] sm:text-xs text-gray-500 truncate">{item.category}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                      </div>

                      {/* Action Buttons - Mobile */}
                      <div className="flex sm:hidden gap-1">
                        <button
                          onClick={() => handleEditClick(item.id)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors active:scale-95"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Item">
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold">{itemToDelete?.title}</span>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};

export default Profile;
