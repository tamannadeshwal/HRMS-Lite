# 🏢 HRMS Lite

A lightweight Human Resource Management System for managing employees and attendance records. Built with modern web technologies for simplicity and ease of deployment.

## 📋 Overview

HRMS Lite is a full-stack web application that helps organizations manage their workforce efficiently. It provides features for employee management, attendance tracking, and statistics visualization.

### Key Features

- **Employee Management**: Add, edit, delete, and view employee details
- **Attendance Tracking**: Mark daily attendance with multiple status options (Present, Absent, Leave, Half-Day)
- **Date Filtering**: Filter attendance records by date range
- **Statistics Dashboard**: View attendance statistics by employee and overall
- **Present Count Per Employee**: Track how many days each employee was present
- **Responsive UI**: Clean and intuitive interface that works on desktop and mobile
- **Real-time Updates**: Live data synchronization with the backend API
- **Error Handling**: Comprehensive error states and loading indicators
- **Data Validation**: Input validation on both frontend and backend

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - ORM for database management
- **SQLite** - Lightweight database
- **express-validator** - Request validation middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **date-fns** - Date utility library
- **CSS3** - Styling with modern features

## 📁 Project Structure

```
hrms-lite/
├── backend/                  # Backend API server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Sample data seeder
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Local Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client and create database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. (Optional) Seed the database with sample data:
```bash
npm run prisma:seed
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `GET /api/employees/:id/stats` - Get employee attendance statistics
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance

- `GET /api/attendance` - Get all attendance records (supports query params: employeeId, startDate, endDate, status)
- `GET /api/attendance/:id` - Get attendance record by ID
- `GET /api/attendance/stats` - Get attendance statistics (supports query params: startDate, endDate)
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

### Health Check

- `GET /api/health` - API health status

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy via Vercel Dashboard**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel
   - Set root directory to `frontend`
   - Framework preset: Vite
   - Add environment variable:
     - `VITE_API_URL` = Your backend URL (e.g., `https://your-app.onrender.com/api`)
   - Deploy

3. **Deploy via CLI**:
```bash
cd frontend
vercel
```

### Backend Deployment (Render)

1. **Create a new Web Service** on [Render](https://render.com):
   - Connect your repository
   - Set root directory to `backend`
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `npm start`

2. **Add Environment Variables**:
   - `DATABASE_URL` = `file:./prod.db`
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave empty to use Render's default)
   - `FRONTEND_URL` = Your frontend URL (e.g., `https://your-app.vercel.app`)

3. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

4. **Seed the database** (optional):
   - Use Render's Shell feature to run: `npm run prisma:seed`

### Alternative: Docker Deployment

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=file:./prod.db
      - NODE_ENV=production
    volumes:
      - ./backend/prisma:/app/prisma

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Deploy with:
```bash
docker-compose up -d
```

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Add Employees**:
   - Click "Add Employee" button
   - Fill in the form with employee details
   - Submit to create the employee

2. **Mark Attendance**:
   - Navigate to "Attendance" tab
   - Click "Mark Attendance"
   - Select employee, date, and status
   - Add optional notes
   - Submit

3. **Filter Attendance**:
   - Use the filter options at the top
   - Filter by employee, date range, or status
   - View statistics per employee

4. **View Employee Details**:
   - Click on an employee name in the list
   - View detailed attendance history and statistics
   - Check attendance rate percentage

## 🔧 Development

### Backend Development

Run Prisma Studio to view/edit database:
```bash
cd backend
npm run prisma:studio
```

Create a new migration:
```bash
npm run prisma:migrate
```

### Frontend Development

Build for production:
```bash
cd frontend
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 UI Components

The application includes reusable components:

- **Button** - Styled buttons with variants (primary, secondary, success, danger)
- **Card** - Container component with title and actions
- **Modal** - Overlay modal for forms
- **LoadingSpinner** - Loading state indicator
- **EmptyState** - Empty data placeholder
- **ErrorMessage** - Error state with retry option

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies for learning and demonstration purposes
- Designed to be simple, scalable, and easy to deploy
- Perfect for small to medium-sized organizations

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Happy Managing! 🎉**
