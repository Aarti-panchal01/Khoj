# Lost & Found - Campus Item Recovery Platform

A modern, professional web application for managing lost and found items on college campuses. Built with React, Vite, TailwindCSS, and localStorage for a quick MVP.

![Lost & Found Platform](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)

## Features

### Core Features
- **User Authentication** - Sign up/login with student email, name, and phone number
- **Post Items** - Create posts for found or lost items with images and detailed descriptions
- **Search & Filter** - Advanced search by keywords, category, type, and location
- **Item Feed** - Browse all posted items with beautiful card-based UI
- **User Profiles** - View your posts, reputation, and stats
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### UI/UX Highlights
- Professional, modern design with smooth animations
- Framer Motion for delightful interactions
- Custom color scheme with primary blues and status colors
- Card-based layouts with hover effects
- Mobile-first responsive navigation
- Clean, accessible form inputs with validation

### Data Features
- Category system (Electronics, Books, ID Cards, Keys, Clothing, etc.)
- Urgent item marking for high-priority posts
- Contact preference settings (email, phone, or both)
- Date tracking for when items were found/lost
- Location tagging with campus landmarks

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 3 + Custom theme
- **Routing**: React Router v6
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: localStorage (for MVP)

## Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- Modern web browser

### Installation

1. Navigate to the project directory:
```bash
cd lost-and-found
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## Usage

### Demo Credentials

**Quick Login:**
- Email: `demo@college.edu`
- Password: `demo123`

### Creating a New Account

1. Click "Create Account" on the login page
2. Fill in your details:
   - Full Name
   - Student Email (should end with .edu)
   - Phone Number
   - College/University Name
   - Password (min 6 characters)
3. Submit to create your account and auto-login

### Posting an Item

1. Click the "Post Item" button in the navigation or home page
2. Select whether it's a **Found** or **Lost** item
3. Fill in the details:
   - **Title**: Brief description (e.g., "Black iPhone 13 with blue case")
   - **Description**: Detailed information about the item
   - **Category**: Select from dropdown (Electronics, Books, ID Cards, etc.)
   - **Location**: Where the item was found/lost
   - **Date**: When it was found/lost
   - **Images**: Upload photos (optional)
4. For lost items, optionally mark as "Urgent" for priority display
5. Choose contact preference (Email, Phone, or Both)
6. Click "Post Item"

### Searching for Items

1. Use the search bar on the home page to search by keywords
2. Apply filters:
   - **Type**: Found Items or Lost Items
   - **Category**: All categories or specific category
3. Results update in real-time
4. Click on any item card to view full details

### Profile Management

1. Click "Profile" in the navigation
2. View your stats:
   - Total posts
   - Found items posted
   - Lost items posted
   - Resolved cases
3. See all your posted items with status
4. Check your reputation score

## Project Structure

```
lost-and-found/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.jsx   # Button with variants and loading states
│   │   │   ├── Input.jsx    # Form input with icons and validation
│   │   │   ├── Card.jsx     # Card container with hover effects
│   │   │   ├── Modal.jsx    # Modal dialog with animations
│   │   │   ├── Badge.jsx    # Status and category badges
│   │   │   └── Select.jsx   # Dropdown select component
│   │   └── layout/          # Layout components
│   │       ├── Navbar.jsx   # Top navigation with mobile menu
│   │       └── Layout.jsx   # Protected route wrapper
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx    # Login form with validation
│   │   │   └── Signup.jsx   # Registration form
│   │   └── dashboard/       # Main app pages
│   │       ├── Home.jsx     # Item feed with search/filters
│   │       ├── PostItem.jsx # Create new post form
│   │       └── Profile.jsx  # User profile and posts
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── lib/
│   │   └── db.js            # localStorage database operations
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles with TailwindCSS
├── tailwind.config.js       # Tailwind custom configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Data Storage

This MVP uses **localStorage** for data persistence. Data is stored in the browser and includes:

- `lnf_users` - User accounts with authentication
- `lnf_items` - Lost and found item posts
- `lnf_messages` - User conversations (for future messaging)
- `lnf_current_user` - Currently logged-in user session

**Important**: Data is stored locally in your browser. Clearing browser data will delete all posts and accounts.

## Features Implemented

✅ User authentication with email/password
✅ Sign up with student email validation (.edu domain)
✅ Post found items with images and details
✅ Post lost items with urgency marking
✅ Browse all items with beautiful card-based UI
✅ Real-time search by keywords (title, description, location)
✅ Filter by type (Found/Lost), category, and status
✅ Statistics dashboard on home page
✅ User profile with reputation and post history
✅ Responsive mobile navigation with bottom tabs
✅ Professional UI with smooth animations
✅ 11 item categories (Electronics, Books, ID Cards, Keys, etc.)
✅ Date and location tracking
✅ Contact preference settings
✅ Sample data on first load

## Sample Data

The app comes pre-loaded with 2 sample items:
1. A found iPhone 13 near the library
2. A lost student ID card between cafeteria and dorm

You can browse these items without creating an account, but you'll need to sign up to post new items.

## Future Enhancements

When moving from MVP to production, consider:

**Backend & Database:**
- REST API with Node.js/Express or NestJS
- PostgreSQL or MongoDB database
- Redis for caching and sessions
- Image upload to cloud storage (AWS S3, Cloudinary)
- Email verification system with SendGrid/Twilio

**Features:**
- Real-time notifications with WebSockets
- In-app messaging between users
- AI-powered matching between lost and found items
- Campus map integration with Google Maps
- QR code generation for found items
- Admin dashboard for campus moderators
- Multi-college support with college verification
- Push notifications (Progressive Web App)
- Social sharing features (Twitter, Instagram)
- Reputation and gamification system
- "Item Reunited" success stories wall

**Security:**
- JWT token-based authentication
- Rate limiting and DDoS protection
- Input sanitization and XSS prevention
- HTTPS enforcement
- CSRF protection

**Analytics:**
- User engagement tracking
- Success rate metrics
- Popular categories analysis
- Campus heat maps for lost items

## Design System

### Colors
- **Primary**: Blue shades (#0ea5e9 - #0c4a6e)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font Family**: Inter (from Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Components Style
- **Rounded Corners**: lg (12px), xl (16px), 2xl (20px)
- **Shadows**: sm, md, lg, 2xl
- **Transitions**: 200ms for colors, 300ms for transforms
- **Hover Effects**: Scale transforms, color changes
- **Focus States**: Ring outlines with primary color

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code with ESLint
npm run lint
```

### Code Structure Guidelines

- Use functional components with hooks
- Keep components under 300 lines
- Extract reusable UI into `/components/ui`
- Use TailwindCSS classes over custom CSS
- Add PropTypes or TypeScript for type safety (future)
- Follow the existing naming conventions

## Performance

- Vite for lightning-fast hot module replacement
- Code splitting with React.lazy (can be added)
- Optimized images with lazy loading
- TailwindCSS purge for minimal CSS bundle
- Framer Motion with reduced motion support

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast ratios meet WCAG AA standards

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Drag and drop the 'dist' folder to Netlify
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/lost-and-found"
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

## Environment Variables

For production deployment, you may want to add:

```env
VITE_API_URL=your-backend-url (when you add backend)
VITE_GOOGLE_MAPS_KEY=your-maps-key (for map features)
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this for your college campus!

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## Support

For issues, questions, or feature requests, please create an issue in the repository.

## Roadmap

**Version 1.1** (Next Release)
- [ ] Item detail page with full information
- [ ] In-app messaging system
- [ ] Email notifications
- [ ] Image compression and optimization

**Version 2.0** (Future)
- [ ] Backend API integration
- [ ] Real-time updates
- [ ] Multi-college support
- [ ] Mobile app (React Native)

---

**Built with ❤️ for college students helping each other find their lost belongings**

**Status**: MVP Complete ✅ | **Version**: 1.0.0 | **Last Updated**: November 2024
