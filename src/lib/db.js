// Mock database using localStorage
const DB_KEYS = {
  USERS: 'lnf_users',
  ITEMS: 'lnf_items',
  MESSAGES: 'lnf_messages',
  CURRENT_USER: 'lnf_current_user',
};

// Helper functions
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initialize database with sample data
export const initializeDB = () => {
  if (!getFromStorage(DB_KEYS.USERS)) {
    saveToStorage(DB_KEYS.USERS, []);
  }
  if (!getFromStorage(DB_KEYS.ITEMS)) {
    // Add some sample items
    saveToStorage(DB_KEYS.ITEMS, [
      {
        id: '1',
        type: 'found',
        userId: 'sample',
        userName: 'John Doe',
        userEmail: 'john@college.edu',
        title: 'Black iPhone 13 Found',
        description: 'Found near the library entrance. Has a blue case with stickers.',
        category: 'Electronics',
        location: 'Main Library Entrance',
        date: new Date('2024-01-15').toISOString(),
        images: ['https://images.unsplash.com/photo-1592286927505-2fd3960c6696?w=400'],
        status: 'active',
        urgent: false,
        contactPreference: 'both',
        createdAt: new Date('2024-01-15').toISOString(),
        college: 'Sample College',
      },
      {
        id: '2',
        type: 'lost',
        userId: 'sample2',
        userName: 'Jane Smith',
        userEmail: 'jane@college.edu',
        title: 'Lost Student ID Card',
        description: 'Lost my student ID card somewhere between the cafeteria and dorm building.',
        category: 'ID Cards',
        location: 'Between Cafeteria and Dorm A',
        date: new Date('2024-01-16').toISOString(),
        images: [],
        status: 'active',
        urgent: true,
        contactPreference: 'email',
        createdAt: new Date('2024-01-16').toISOString(),
        college: 'Sample College',
      },
    ]);
  }
  if (!getFromStorage(DB_KEYS.MESSAGES)) {
    saveToStorage(DB_KEYS.MESSAGES, []);
  }
};

// User operations
export const createUser = (userData) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];

  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  const newUser = {
    id: generateId(),
    ...userData,
    verified: true, // Auto-verify for MVP
    createdAt: new Date().toISOString(),
    reputation: 0,
    itemsFound: 0,
    itemsReturned: 0,
  };

  users.push(newUser);
  saveToStorage(DB_KEYS.USERS, users);

  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    saveToStorage(DB_KEYS.CURRENT_USER, user);
    return { success: true, user };
  }

  return { success: false, error: 'Invalid credentials' };
};

export const getCurrentUser = () => {
  return getFromStorage(DB_KEYS.CURRENT_USER);
};

export const logoutUser = () => {
  localStorage.removeItem(DB_KEYS.CURRENT_USER);
};

export const updateUser = (userId, updates) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    saveToStorage(DB_KEYS.USERS, users);

    // Update current user if it's the same
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      saveToStorage(DB_KEYS.CURRENT_USER, users[userIndex]);
    }

    return { success: true, user: users[userIndex] };
  }

  return { success: false, error: 'User not found' };
};

// Item operations
export const createItem = (itemData) => {
  const items = getFromStorage(DB_KEYS.ITEMS) || [];
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { success: false, error: 'User not authenticated' };
  }

  const newItem = {
    id: generateId(),
    ...itemData,
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userPhone: currentUser.phone,
    status: 'active',
    createdAt: new Date().toISOString(),
    college: currentUser.college,
  };

  items.unshift(newItem); // Add to beginning
  saveToStorage(DB_KEYS.ITEMS, items);

  return { success: true, item: newItem };
};

export const getAllItems = (filters = {}) => {
  let items = getFromStorage(DB_KEYS.ITEMS) || [];

  // Apply filters
  if (filters.type) {
    items = items.filter(item => item.type === filters.type);
  }

  if (filters.category) {
    items = items.filter(item => item.category === filters.category);
  }

  if (filters.status) {
    items = items.filter(item => item.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower)
    );
  }

  if (filters.urgent !== undefined) {
    items = items.filter(item => item.urgent === filters.urgent);
  }

  return items;
};

export const getItemById = (itemId) => {
  const items = getFromStorage(DB_KEYS.ITEMS) || [];
  return items.find(item => item.id === itemId);
};

export const updateItem = (itemId, updates) => {
  const items = getFromStorage(DB_KEYS.ITEMS) || [];
  const itemIndex = items.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    items[itemIndex] = { ...items[itemIndex], ...updates };
    saveToStorage(DB_KEYS.ITEMS, items);
    return { success: true, item: items[itemIndex] };
  }

  return { success: false, error: 'Item not found' };
};

export const deleteItem = (itemId) => {
  const items = getFromStorage(DB_KEYS.ITEMS) || [];
  const filteredItems = items.filter(item => item.id !== itemId);
  saveToStorage(DB_KEYS.ITEMS, filteredItems);
  return { success: true };
};

export const getUserItems = (userId) => {
  const items = getFromStorage(DB_KEYS.ITEMS) || [];
  return items.filter(item => item.userId === userId);
};

// Message operations
export const createMessage = (conversationId, senderId, text) => {
  const messages = getFromStorage(DB_KEYS.MESSAGES) || [];
  const conversation = messages.find(c => c.id === conversationId);

  const newMessage = {
    id: generateId(),
    senderId,
    text,
    timestamp: new Date().toISOString(),
  };

  if (conversation) {
    conversation.messages.push(newMessage);
    conversation.lastMessage = text;
    conversation.lastMessageAt = newMessage.timestamp;
  } else {
    messages.push({
      id: conversationId,
      participants: [senderId],
      itemId: conversationId.split('_')[1], // Extract itemId from conversationId
      lastMessage: text,
      lastMessageAt: newMessage.timestamp,
      messages: [newMessage],
    });
  }

  saveToStorage(DB_KEYS.MESSAGES, messages);
  return { success: true, message: newMessage };
};

export const getConversation = (conversationId) => {
  const messages = getFromStorage(DB_KEYS.MESSAGES) || [];
  return messages.find(c => c.id === conversationId);
};

export const getUserConversations = (userId) => {
  const messages = getFromStorage(DB_KEYS.MESSAGES) || [];
  return messages.filter(c => c.participants.includes(userId));
};

// Categories
export const CATEGORIES = [
  'Electronics',
  'Books',
  'ID Cards',
  'Keys',
  'Clothing',
  'Accessories',
  'Bags',
  'Wallets',
  'Jewelry',
  'Sports Equipment',
  'Other',
];

// Initialize DB on load
initializeDB();
