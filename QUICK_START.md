# 🚀 Quick Start Guide - HRMS Lite

## Run Locally in 3 Steps

### Step 1: Start Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed  # Optional: Add sample data
npm run dev
```
Backend will run at: `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at: `http://localhost:5173`

### Step 3: Open Browser
Navigate to `http://localhost:5173` to use the application!

## Quick Test

1. View existing employees (seeded data)
2. Click "Add Employee" to create a new one
3. Switch to "Attendance" tab
4. Click "Mark Attendance" to record attendance
5. Use filters to view specific records
6. Check stats per employee in the bottom section

## Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with sample data

### Frontend
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is in use, change it in `.env` files.

### Database Issues
Reset the database:
```bash
cd backend
rm -rf prisma/dev.db prisma/migrations
npx prisma migrate dev --name init
npm run prisma:seed
```

### Frontend Not Connecting
Make sure:
1. Backend is running on port 5000
2. `VITE_API_URL` in frontend/.env points to backend
3. CORS is enabled (it is by default)

## Production Deployment

See the main [README.md](./README.md) for detailed deployment instructions for:
- Frontend: Vercel
- Backend: Render

---

**Need Help?** Check the full [README.md](./README.md) for detailed documentation.
