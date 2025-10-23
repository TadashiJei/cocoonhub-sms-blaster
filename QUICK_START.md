# SMS Blaster - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Setup Environment (2 min)
Create `.env.local` file in project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sms_blaster"
JWT_SECRET="your-secret-key-change-this-to-something-secure-min-32-chars"
SEMAPHORE_API_KEY="your-semaphore-api-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

**Need a database?**
- Local: `createdb sms_blaster`
- Cloud: Use Vercel Postgres, Supabase, or Railway

**Need Semaphore API key?**
- Visit https://semaphore.co
- Sign up → Settings → API Keys → Copy key

### Step 3: Setup Database (1 min)
```bash
npx prisma migrate dev --name init
```

### Step 4: Start Server (1 min)
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 📝 First Time Usage

### 1. Create Account
- Click "Sign up"
- Enter username, email, password
- Password must have: 8+ chars, uppercase, lowercase, number
- Click "Create Account"

### 2. Upload CSV
- Prepare CSV file with columns: `number, name, price, item_type`
- Use `sample-data.csv` as template
- Click "Upload CSV" on dashboard
- Select file → Upload

### 3. Send SMS
- Select batch from left panel
- Click "Send SMS Blast"
- Watch status update in real-time

---

## 🔧 Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

npx prisma studio       # Open database UI
npx prisma migrate dev  # Create new migration
npx prisma generate     # Regenerate Prisma client
```

---

## 📊 CSV Format

```csv
number,name,price,item_type
09998887777,Juan Dela Cruz,110.00,certificate/s
09998887778,Maria Santos,150.00,card/s
```

**Columns:**
- `number`: Phone number (09XX or +639XX)
- `name`: Recipient name
- `price`: Amount (e.g., 110.00)
- `item_type`: Item type (e.g., certificate/s, card/s)

---

## 🔐 Default Roles

| Role | Permissions |
|------|------------|
| OPERATOR | Upload CSV, Send SMS |
| ADMIN | All + Create users |

Your first account is OPERATOR. To make it ADMIN:
```bash
npx prisma studio
# Edit your user → change role to ADMIN
```

---

## 🐛 Troubleshooting

**"Cannot connect to database"**
```bash
# Make sure PostgreSQL is running
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

**"Prisma client not found"**
```bash
npx prisma generate
```

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Port 3000 already in use"**
```bash
npm run dev -- -p 3001
```

---

## 📚 Documentation

- **Full Setup**: See `SETUP_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Project Overview**: See `README.md`
- **Checklist**: See `TODOLIST.md`

---

## 🎯 Next Steps

1. ✅ Install & setup
2. ✅ Create account
3. ✅ Upload sample CSV
4. ✅ Send test SMS
5. ✅ Deploy to production

---

## 📞 API Endpoints

All endpoints except auth require JWT token:
```
Authorization: Bearer <your-token>
```

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/upload` | Upload CSV |
| POST | `/api/blast-send` | Send SMS |
| GET | `/api/recipients` | Fetch recipients |
| GET | `/api/batches` | Fetch batches |

---

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# Push to GitHub
git push

# Connect to Vercel
# Add environment variables
# Deploy!
```

### Other Platforms
- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io

---

**Happy blasting!** 🎉

For detailed help, check the documentation files in the project root.
