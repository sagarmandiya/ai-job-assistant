# CareerCraft.ai Frontend

A professional React-based frontend for the AI-powered job application platform. Built with modern technologies and designed for optimal user experience.

## 🚀 Features

### Professional Navigation
- **Responsive Navbar**: Mobile-friendly navigation with authentication-aware buttons
- **Breadcrumb Navigation**: Clear navigation path on all pages
- **Professional Footer**: Comprehensive footer with links and company information

### Account Management
- **Comprehensive Settings**: 5-tab settings interface (Account, Profile, Notifications, Security, Preferences)
- **Profile Management**: Personal and professional information management
- **Security Settings**: Password management and privacy controls
- **Data Management**: Export and account deletion options

### Core Functionality
- **Resume Management**: Upload, analyze, and manage resumes with AI-powered insights
- **Job Tracking**: Save and organize job descriptions for targeted applications
- **Content Generation**: AI-powered cover letters and outreach emails
- **AI Assistant**: Interactive chat for career advice and job search guidance
- **Content Library**: Organize and manage generated content

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Text Containment**: Prevents text overflow issues across all components
- **Professional UI**: Modern, polished interface with consistent design system
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **UI Components**: shadcn/ui component library

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏃‍♂️ Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (Note: May have Node.js version warnings)

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   ├── pages/          # Page-specific components
│   └── auth/           # Authentication components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS
```

### Key Components

#### Navigation
- `HomepageNavbar` - Professional homepage navigation
- `AppSidebar` - Main application sidebar
- `Header` - Application header with user menu
- `AppFooter` - Comprehensive footer
- `Breadcrumb` - Navigation breadcrumbs

#### Pages
- `Dashboard` - Main dashboard with stats and quick actions
- `ResumesPage` - Resume upload and management
- `JobsPage` - Job description management
- `GeneratePage` - Content generation interface
- `ChatPage` - AI assistant interface
- `LibraryPage` - Content library management
- `SettingsPage` - Account and preferences management

#### Settings
- `AccountSettings` - Comprehensive account management
- Profile, Security, Notifications, and Preferences tabs

## 🎨 Design System

### Colors
- **Primary**: Professional navy blue (#1e3a8a)
- **Secondary**: Subtle grays for UI elements
- **Success**: Green for positive actions
- **Destructive**: Red for dangerous actions

### Typography
- **Font**: System fonts with fallbacks
- **Sizes**: Responsive text sizing
- **Weights**: Consistent font weight hierarchy

### Components
- **Cards**: Elevated cards with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent form styling with validation
- **Navigation**: Professional navigation patterns

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=CareerCraft.ai
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Professional color palette
- Custom component classes
- Responsive design utilities
- Animation utilities

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- **Vercel**: Optimized for React applications
- **Netlify**: Easy deployment with Git integration
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for open source projects

## 🧪 Testing

### TypeScript
```bash
npx tsc --noEmit
```

### Build Testing
```bash
npm run build
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the CareerCraft.ai platform. See the main repository for license information.

## 🆘 Support

For support and questions:
- Check the main project README
- Review the backend documentation
- Open an issue in the repository
