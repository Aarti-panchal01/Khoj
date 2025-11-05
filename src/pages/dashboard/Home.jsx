import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, AlertCircle, Package } from 'lucide-react';
import { getAllItems, CATEGORIES } from '../../lib/db';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import ItemDetailModal from '../../components/ui/ItemDetailModal';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allItems = getAllItems();
    setItems(allItems);
  }, []);

  // Memoized filtered items - recalculates whenever dependencies change
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, searchQuery, filterType, filterCategory, filterStatus]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 200); // Clear after animation
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('');
    setFilterCategory('');
    setFilterStatus('');
  };

  const hasActiveFilters = searchQuery || filterType || filterCategory || filterStatus;

  // Format categories for Select component
  const categoryOptions = CATEGORIES.map(cat => ({
    value: cat,
    label: cat
  }));

  const stats = {
    total: items.length,
    found: items.filter(i => i.type === 'found').length,
    lost: items.filter(i => i.type === 'lost').length,
    active: items.filter(i => i.status === 'active').length,
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Khoj - Lost & Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center gap-2">
            <span className="hidden sm:inline">🔍</span>
            Browse and search for items in your campus
          </p>
        </div>
        <Button
          onClick={() => navigate('/post')}
          icon={Package}
          className="w-full sm:w-auto shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300"
        >
          <span className="hidden sm:inline">Post New Item</span>
          <span className="sm:hidden">Post Item</span>
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        {[
          { label: 'Total Items', value: stats.total, icon: Package, color: 'primary', gradient: 'from-primary-50 to-blue-50' },
          { label: 'Found Items', value: stats.found, icon: Search, color: 'success', gradient: 'from-success-50 to-green-50' },
          { label: 'Lost Items', value: stats.lost, icon: AlertCircle, color: 'danger', gradient: 'from-danger-50 to-red-50' },
          { label: 'Active Posts', value: stats.active, icon: Filter, color: 'primary', gradient: 'from-blue-50 to-primary-50' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br ${stat.gradient} border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-xl sm:text-2xl md:text-3xl font-bold text-${stat.color}-600 mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-${stat.color}-100 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 ring-${stat.color}-50`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Search & Filter</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="lg:col-span-2"
            />

            <Select
              placeholder="All Types"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'found', label: 'Found Items' },
                { value: 'lost', label: 'Lost Items' },
              ]}
            />

            <Select
              placeholder="All Categories"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={categoryOptions}
            />
          </div>

          {/* Show active filter count */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-primary-600">{filteredItems.length}</span> of <span className="font-semibold">{items.length}</span> items
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-sm sm:text-base text-gray-600">Try adjusting your filters or search query</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card hover onClick={() => handleItemClick(item)} className="overflow-hidden group cursor-pointer border-2 border-transparent hover:border-primary-300">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white">
                      <Package className="w-16 h-16 text-gray-300 group-hover:text-primary-400 transition-colors" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant={item.type === 'found' ? 'found' : 'lost'}>
                      {item.type === 'found' ? 'Found' : 'Lost'}
                    </Badge>
                  </div>
                  {item.urgent && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="danger">Urgent</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <Badge variant="default">{item.category}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Posted by <span className="font-medium text-gray-700">{item.userName}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ItemDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            item={selectedItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
