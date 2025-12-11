# Jackson Multifacet

A comprehensive **Recruitment and Business Support Services (BSS)** platform built with Django and React. Jackson Multifacet provides end-to-end business solutions including recruitment services, digital solutions, creative design, professional documentation, and business registration & marketing services.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Jackson Multifacet is a full-stack web application designed to provide businesses with comprehensive support services. The platform connects clients with professional services ranging from recruitment to digital marketing, all managed through an intuitive web interface.

### Service Categories

1. **Recruitment Services**
   - Job posting and management
   - Candidate database and profiles
   - Application tracking system (ATS)
   - CV/Resume screening
   - Interview scheduling
   - Candidate-job matching

2. **Digital Solutions & Development**
   - Website creation and management
   - Mobile app development
   - Web app development
   - Website maintenance
   - E-commerce solutions

3. **Creative & Design Services**
   - Graphic design (logos, branding, marketing materials)
   - Video editing and production
   - UI/UX design
   - Social media content creation
   - Brand identity development

4. **Professional Documentation Services**
   - CV/Resume writing and design
   - Cover letter writing
   - Business proposal drafting
   - Business plans
   - Presentation design
   - Professional letters and documents

5. **Business Registration & Marketing**
   - Business registration assistance
   - Digital marketing strategies
   - Social media management
   - SEO services
   - Paid advertising management
   - Email marketing campaigns

---

## ✨ Features

### User Management
- Client and admin account types
- Role-based access control
- User authentication and authorization
- Profile management

### Service Catalog
- Browse services by category
- Detailed service descriptions and pricing
- Custom service requests
- Service booking system

### Project Management
- Order tracking
- Project status updates
- File upload/download functionality
- Client-admin communication

### Recruitment Module
- Job board for employers
- Candidate portal
- Application management system
- Resume database

### Payment System
- Integrated payment gateway
- Invoice generation
- Payment history tracking
- Pricing management

### Dashboard
- Client dashboard (view orders, projects, invoices)
- Admin dashboard (manage orders, clients, revenue analytics)
- Real-time notifications

### Communication System
- In-app messaging between clients and admins
- Email notifications
- Status update alerts

---

## 🛠 Technology Stack

### Backend
- **Django** - Web framework (standard Django, not Django REST Framework)
- **Python 3.x** - Programming language
- **SQLite/PostgreSQL** - Database
- **Pillow** - Image processing
- **django-cors-headers** - CORS handling for React communication
- **python-decouple** - Environment variable management

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client for API calls
- **Tailwind CSS / Material-UI** - Styling (to be configured)

---

## 📁 Project Structure

```
jackson-multifacet/
│
├── backend/                          # Django Backend
│   ├── apps/                         # Django applications
│   │   ├── users/                    # User management and authentication
│   │   ├── services/                 # Service catalog and management
│   │   ├── recruitment/              # Job postings and applications
│   │   ├── projects/                 # Project/order management
│   │   ├── payments/                 # Payment processing and invoicing
│   │   └── communications/           # Messaging and notifications
│   │
│   ├── jackson_multifacet/           # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py               # Project settings and configuration
│   │   ├── urls.py                   # URL routing
│   │   ├── wsgi.py                   # WSGI configuration for deployment
│   │   └── asgi.py                   # ASGI configuration for async support
│   │
│   ├── static/                       # Static files (CSS, JS, images)
│   ├── media/                        # User-uploaded files
│   ├── venv/                         # Python virtual environment
│   ├── manage.py                     # Django management script
│   └── requirements.txt              # Python dependencies
│
└── frontend/                         # React Frontend
    ├── public/                       # Public static files
    ├── src/                          # React source code
    │   ├── components/               # Reusable React components
    │   ├── pages/                    # Page components
    │   ├── services/                 # API service functions
    │   ├── utils/                    # Utility functions
    │   ├── App.js                    # Main App component
    │   └── index.js                  # Entry point
    ├── package.json                  # npm dependencies
    └── package-lock.json             # Locked npm dependencies
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and **npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Verify Installation

```bash
# Check Python version
python3 --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jackson-multifacet.git
cd jackson-multifacet
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create and activate virtual environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Activate virtual environment (Windows)
# venv\Scripts\activate
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### If requirements.txt doesn't exist, install packages manually:
```bash
pip install django pillow django-cors-headers python-decouple
```

#### Create requirements.txt
```bash
pip freeze > requirements.txt
```

### 3. Frontend Setup

#### Navigate to frontend directory (from project root)
```bash
cd ../frontend
```

#### Install npm dependencies
```bash
npm install
```

#### If package.json doesn't exist, create React app:
```bash
npx create-react-app .
npm install axios react-router-dom
```

---

## ⚙️ Configuration

### Backend Configuration

#### 1. Database Setup

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Run migrations to create database tables
python manage.py makemigrations
python manage.py migrate
```

#### 2. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

#### 3. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### 4. Configure CORS

In `jackson_multifacet/settings.py`, ensure CORS is configured:

```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🏃 Running the Application

### Development Mode

#### 1. Start Django Backend

```bash
# Terminal 1 - Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate

# Run Django development server
python manage.py runserver
```

Backend will run at: **http://localhost:8000**

#### 2. Start React Frontend

```bash
# Terminal 2 - Navigate to frontend
cd frontend

# Start React development server
npm start
```

Frontend will run at: **http://localhost:3000**

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend Admin:** http://localhost:8000/admin
- **Backend API:** http://localhost:8000/api/

---

## 📡 API Documentation

### API Endpoints (To be implemented)

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

#### Services
- `GET /api/services/` - List all services
- `GET /api/services/<id>/` - Get service details
- `POST /api/services/` - Create new service (Admin only)

#### Orders/Projects
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/<id>/` - Get order details
- `PUT /api/orders/<id>/` - Update order status

#### Recruitment
- `GET /api/jobs/` - List all job postings
- `POST /api/jobs/` - Create job posting
- `POST /api/jobs/<id>/apply/` - Apply for a job

---

## 👨‍💻 Development Workflow

### Adding a New Feature

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Backend changes:**
   - Create models in respective app's `models.py`
   - Create views in `views.py`
   - Add URL routes in `urls.py`
   - Run migrations: `python manage.py makemigrations && python manage.py migrate`

3. **Frontend changes:**
   - Create components in `src/components/`
   - Create pages in `src/pages/`
   - Add API calls in `src/services/`
   - Update routes in `App.js`

4. **Test your changes**

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **Python:** Follow PEP 8 style guide
- **JavaScript:** Use ES6+ syntax
- **React:** Use functional components with hooks
- **Naming:** Use descriptive variable and function names

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Jackson Multifacet Development Team**

---

## 📞 Support

For support, email support@jacksonmultifacet.com or open an issue in the repository.

---

## 🗺 Roadmap

### Phase 1 - Foundation (Weeks 1-2)
- ✅ Set up Django backend
- ✅ Create database models
- ✅ Set up React frontend
- ✅ Implement basic authentication

### Phase 2 - Core Features (Weeks 3-4)
- [ ] Service catalog implementation
- [ ] Order management system
- [ ] Client and admin dashboards
- [ ] File upload functionality

### Phase 3 - Advanced Features (Weeks 5-6)
- [ ] Recruitment module
- [ ] Payment integration
- [ ] Messaging system
- [ ] Email notifications

### Phase 4 - Testing & Deployment (Weeks 7-8)
- [ ] Unit testing
- [ ] Integration testing
- [ ] Production deployment
- [ ] Performance optimization

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Django server won't start**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Check for migration issues
python manage.py migrate
```

**Issue: React app won't start**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Issue: CORS errors**
- Ensure `django-cors-headers` is installed
- Check CORS configuration in `settings.py`
- Verify frontend is running on http://localhost:3000

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [npm Documentation](https://docs.npmjs.com/)

---

**Built with ❤️ by Jackson Multifacet Team**