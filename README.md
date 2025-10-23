# 🚀 SMS Blaster - SMS Communication System

An automated SMS delivery system for personalized payment and logistics notifications. Built with Next.js, PostgreSQL, and Semaphore SMS Gateway.

## Features

✅ **User Authentication** - Secure login/signup with JWT tokens and bcrypt password hashing
✅ **CSV Import** - Bulk upload recipient data from spreadsheets
✅ **SMS Blast** - Send personalized SMS messages to multiple recipients
✅ **Real-time Tracking** - Monitor message status (PENDING, SENT, FAILED)
✅ **Admin Dashboard** - Intuitive interface with batch management and filtering
✅ **Role-Based Access** - ADMIN and OPERATOR roles with different permissions
✅ **Error Logging** - Detailed API responses for debugging
✅ **Batch Processing** - Efficient handling of large recipient lists

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|----------|
| Frontend & Backend | Next.js 16 (App Router) | Full-stack framework |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma | Type-safe database queries |
| Authentication | JWT + bcryptjs | Secure user sessions |
| SMS Gateway | Semaphore API | SMS delivery provider |
| Styling | Tailwind CSS | Responsive UI design |
| CSV Parsing | csv-parser | File import handling |

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Semaphore API key

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database
npx prisma migrate dev --name init

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sms_blaster"
JWT_SECRET="your-secret-key-min-32-chars"
SEMAPHORE_API_KEY="your-semaphore-api-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'OPERATOR',
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Recipients Table
```sql
CREATE TABLE recipients (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  itemType VARCHAR(20) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'PENDING',
  sentAt TIMESTAMP,
  batchId VARCHAR(50) NOT NULL,
  apiResponse TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### Data Management
- `POST /api/upload` - Upload CSV file (requires auth)
- `GET /api/recipients` - Fetch recipients with filters (requires auth)
- `GET /api/batches` - Fetch all batches (requires auth)

### SMS Operations
- `POST /api/blast-send` - Send SMS to pending recipients (requires auth)

## CSV Format

Your CSV file should contain:

```csv
number,name,price,item_type
09998887777,Juan A. Dela Cruz,110.00,certificate/s
09998887778,Maria B. Santos,150.00,card/s
```

**Columns:**
- `number` or `phone_number`: Philippine phone number
- `name`: Recipient's full name
- `price`: Delivery fee amount
- `item_type` or `itemType`: Item being delivered

## Message Template

```
Hello, {Name}! Good day. This is the Bangko Maharlika Logistics Department.
The delivery fee of your {ItemType} via J&T is ₱{Price} pesos.
Please send payment to this bank account. Thank you very much!

*THIS BPI ACCOUNT IS STRICTLY FOR DELIVERY FEE PAYMENTS ONLY*

Bank: BPI
Account Name: Jose Piero Longa
Account Number: 4489069194
```

## Project Structure

```
sms-blaster/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── batches/           # Batch management
│   │   ├── blast-send/        # SMS sending
│   │   ├── recipients/        # Recipient data
│   │   └── upload/            # CSV upload
│   ├── dashboard/             # Main dashboard page
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirect)
│   └── globals.css            # Global styles
├── components/                # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Toast.tsx
├── lib/                       # Utilities and helpers
│   ├── auth.ts               # Auth functions
│   └── auth-context.tsx      # Auth context provider
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                    # Static assets
│   └── Blaster-Logo.svg
├── SETUP_GUIDE.md            # Detailed setup instructions
├── TODOLIST.md               # Implementation checklist
└── package.json
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create migrations
npx prisma studio           # Open Prisma UI
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
npm start
```

### Other Platforms

- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io

## Security

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control
- ✅ Environment variable protection
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (via Prisma)
- ✅ CORS configuration

## Troubleshooting

**Database connection error?**
```bash
# Ensure PostgreSQL is running
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

**Prisma client not found?**
```bash
npx prisma generate
```

**CSV upload fails?**
- Check CSV format matches requirements
- Verify phone numbers are valid
- Ensure file is not corrupted

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting tips.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Semaphore API Docs](https://semaphore.co/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT License - feel free to use this project for your needs.

## Support

For issues, questions, or suggestions, please open an issue or contact the development team.

---

**Built with ❤️ for efficient SMS communication**
