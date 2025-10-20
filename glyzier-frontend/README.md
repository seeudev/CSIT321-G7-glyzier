# Glyzier Frontend

React frontend application for the Glyzier artist portfolio and store platform.

## Project Overview

This is the frontend component of the Glyzier platform, built with React and Vite. It provides the user interface for browsing artwork, managing user accounts, placing orders, and seller functionality.

**Stack:**
- React 18
- Vite (build tool and dev server)
- React Router DOM (routing)
- Axios (HTTP client)

## Project Structure

```
src/
├── components/     # Reusable React components (Module 6+)
├── pages/          # Page-level components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx
├── services/       # API service modules
│   └── api.js      # Axios instance configuration
├── context/        # React Context providers (Module 6+)
├── App.jsx         # Main app component with routing
├── main.jsx        # Application entry point
└── index.css       # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Backend API running on http://localhost:8080

### Installation

```bash
# Navigate to the frontend directory
cd glyzier-frontend

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173/

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Available Routes (Module 5)

- `/` - Home page with welcome message and features
- `/login` - Login page (functionality in Module 6)
- `/register` - Registration page (functionality in Module 6)
- `/dashboard` - User dashboard (will be protected in Module 6)

## Modules Implementation Status

- [x] **Module 5**: Frontend Setup ✅
  - React app initialized with Vite
  - Dependencies installed (axios, react-router-dom)
  - Project structure created
  - Axios instance configured
  - Basic routing setup
  - Placeholder pages created

- [ ] **Module 6**: Frontend - Auth & Pages (Next)
  - AuthService implementation
  - AuthContext for global state
  - Login/Register functionality
  - Protected routes

- [ ] **Module 7**: Frontend - Product & Seller Views
  - ProductService implementation
  - Product listing page
  - Product detail page
  - Seller profile pages

- [ ] **Module 8**: Frontend - User & Seller Dashboards
  - OrderService implementation
  - Order placement functionality
  - User dashboard with order history
  - Seller registration
  - Seller dashboard with product management

## API Configuration

The frontend is configured to communicate with the backend API at:
- Base URL: `http://localhost:8080`
- Configured in: `src/services/api.js`

The Axios instance automatically:
- Adds JWT tokens to requests (when available)
- Handles common error scenarios
- Provides consistent request/response handling

## Development Notes

### Code Quality
- All components are heavily commented for educational purposes
- Clear separation of concerns (pages, components, services, context)
- Consistent code style and naming conventions

### State Management
- Global state will be managed with React Context (Module 6)
- Local state using React hooks (useState, useEffect)

### Styling Approach
- Global styles in `index.css` with CSS custom properties
- Inline styles for component-specific styling (for simplicity)
- Responsive design considerations

### Authentication Flow (Module 6)
1. User logs in via LoginPage
2. AuthService calls backend API
3. JWT token stored in localStorage
4. AuthContext updated with user data
5. Token automatically added to all API requests
6. Protected routes check authentication status

## Important Notes

⚠️ **Educational Project**: This is a university final project focused on demonstrating full-stack development concepts. It includes:
- Simulated payment processing (no real payments)
- Basic security measures (JWT authentication)
- Simplified inventory management

🔒 **Security**: 
- JWT tokens are stored in localStorage (in production, consider httpOnly cookies)
- All authenticated requests include the token in Authorization header
- Backend validates all tokens before processing requests

## Testing

To test the frontend:

1. Start the backend server (port 8080)
2. Start the frontend dev server (port 5173)
3. Navigate to http://localhost:5173/
4. Test the routes: /, /login, /register, /dashboard

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.)

### Backend Connection Issues
- Ensure the backend is running on port 8080
- Check CORS configuration in the backend (should allow http://localhost:5173)
- Check the browser console for error messages

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

## Authors

Glyzier Team - CSIT321 Group 7

## License

This is an educational project for university coursework.
