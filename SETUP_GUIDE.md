# SMS Blaster - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Semaphore API key (https://semaphore.co)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Prisma ORM
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- csv-parser (CSV file parsing)
- uuid (batch ID generation)

### 2. Create Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/sms_blaster"

# JWT Configuration (use a strong random string, min 32 characters)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-secure"

# Semaphore SMS Gateway API Key
SEMAPHORE_API_KEY="your-semaphore-api-key-here"

# Application URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 3. Setup PostgreSQL Database

If you don't have PostgreSQL installed locally, you can:

**Option A: Local Installation**
- macOS: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`
- Windows: Download from https://www.postgresql.org/download/windows/

**Option B: Cloud Database**
- Vercel Postgres: https://vercel.com/storage/postgres
- Supabase: https://supabase.com
- Railway: https://railway.app
- Neon: https://neon.tech

Create a new database:
```bash
createdb sms_blaster
```

### 4. Run Prisma Migrations

Initialize Prisma and create the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Get Semaphore API Key

1. Go to https://semaphore.co
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your API key
5. Add it to `.env.local` as `SEMAPHORE_API_KEY`

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## First Time Setup

### Create Your First Admin Account

1. Go to http://localhost:3000 (you'll be redirected to `/login`)
2. Click "Sign up" to create a new account
3. Fill in username, email, and password
4. Click "Create Account"
5. You'll be logged in and redirected to the dashboard

### Update User Role to ADMIN (Optional)

If you want to create new users, update your role to ADMIN:

```bash
npx prisma studio
```

Then:
1. Go to the `User` table
2. Find your user
3. Change `role` from `OPERATOR` to `ADMIN`
4. Refresh the dashboard

## CSV File Format

Your CSV file should have the following columns:

```csv
number,name,price,item_type
09998887777,Juan A. Dela Cruz,110.00,certificate/s
09998887778,Maria B. Santos,150.00,card/s
```

**Column Requirements:**
- `number` or `phone_number`: Philippine phone number (09XX or +639XX format)
- `name`: Recipient's full name
- `price`: Delivery fee (numeric, e.g., 110.00)
- `item_type` or `itemType`: Type of item (e.g., "certificate/s", "card/s")

**Notes:**
- Phone numbers will be automatically converted to +63 format
- Invalid phone numbers will be skipped
- Duplicate entries are allowed (will be inserted separately)

## Application Workflow

### 1. Upload CSV
- Click "Upload CSV" button
- Select a CSV file with recipient data
- System validates and imports records
- Records are marked as "PENDING"

### 2. View Recipients
- Select a batch from the left panel
- View all recipients in the batch
- Filter by status (PENDING, SENT, FAILED)

### 3. Send SMS Blast
- Select a batch
- Click "Send SMS Blast" button
- System sends SMS to all PENDING recipients
- Status updates to SENT or FAILED
- API responses are logged for debugging

### 4. Monitor Progress
- Dashboard shows real-time status
- View sent/failed counts per batch
- Check individual recipient details

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Data Management
- `POST /api/upload` - Upload CSV file
- `GET /api/recipients` - Fetch recipients with filters
- `GET /api/batches` - Fetch all batches with stats

### SMS Operations
- `POST /api/blast-send` - Send SMS to pending recipients

All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Use Services app to start PostgreSQL
```

### Prisma Client Not Found
```bash
npx prisma generate
```

### CSV Upload Fails
- Check CSV format matches requirements
- Ensure phone numbers are valid
- Verify file is not corrupted

### SMS Not Sending
- Verify Semaphore API key is correct
- Check account has sufficient credits
- Review API response in recipient details
- Check rate limits (120 requests/minute)

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Build
npm run build

# Start
npm start
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="use-a-strong-random-string"
SEMAPHORE_API_KEY="your-api-key"
NEXT_PUBLIC_API_URL="https://your-domain.com"
NODE_ENV="production"
```

## Security Best Practices

1. **Change JWT_SECRET** - Use a strong, random string (min 32 characters)
2. **Use HTTPS** - Always use HTTPS in production
3. **Secure Database** - Use strong passwords and restrict access
4. **API Key Protection** - Never commit `.env.local` to version control
5. **Rate Limiting** - Implement rate limiting on API routes
6. **Input Validation** - All inputs are validated server-side
7. **Password Requirements** - Min 8 chars, 1 uppercase, 1 lowercase, 1 number

## Support & Resources

- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
- Semaphore API Docs: https://semaphore.co/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Prisma commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create and run migrations
npx prisma studio           # Open Prisma Studio UI
npx prisma db push          # Sync schema with database
npx prisma db seed          # Seed database with initial data
```

## File Structure

```
sms-blaster/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── batches/route.ts
│   │   ├── blast-send/route.ts
│   │   ├── recipients/route.ts
│   │   └── upload/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Toast.tsx
├── lib/
│   ├── auth.ts
│   └── auth-context.tsx
├── prisma/
│   └── schema.prisma
├── public/
│   └── Blaster-Logo.svg
├── .env.example
├── TODOLIST.md
├── SETUP_GUIDE.md
├── package.json
└── tsconfig.json
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env.local` file
3. ✅ Setup PostgreSQL database
4. ✅ Run Prisma migrations
5. ✅ Get Semaphore API key
6. ✅ Start development server: `npm run dev`
7. ✅ Create your first account
8. ✅ Upload a test CSV file
9. ✅ Send test SMS blast
10. ✅ Deploy to production

Happy blasting! 🚀
