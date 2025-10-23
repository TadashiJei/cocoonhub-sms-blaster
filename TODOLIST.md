# SMS Blaster - Implementation Todolist

## Phase 1: Setup & Configuration ✅
- [x] Update package.json with dependencies (Prisma, bcryptjs, JWT, CSV parser)
- [x] Create Prisma schema (users & recipients tables)
- [ ] Run `npm install` to install all dependencies
- [ ] Create `.env.local` file with the following variables:
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/sms_blaster"
  JWT_SECRET="your-super-secret-jwt-key-change-this"
  SEMAPHORE_API_KEY="your-semaphore-api-key"
  NEXT_PUBLIC_API_URL="http://localhost:3000"
  ```
- [ ] Run `npx prisma migrate dev --name init` to create database tables
- [ ] Run `npx prisma generate` to generate Prisma client

## Phase 2: Authentication System
- [ ] Create authentication utilities (`lib/auth.ts`)
  - JWT token generation and verification
  - Password hashing functions
  - Auth middleware
- [ ] Build `/api/auth/signup` route
  - Validate input (username, email, password strength)
  - Hash password with bcryptjs
  - Create user in database
  - Return JWT token
- [ ] Build `/api/auth/login` route
  - Validate credentials
  - Compare password hash
  - Return JWT token on success
- [ ] Build `/api/auth/logout` route
- [ ] Create auth context/hook for client-side state management

## Phase 3: Core API Routes
- [ ] Build `/api/upload` route (CSV Import)
  - Validate authorization (JWT token check)
  - Parse CSV file
  - Validate phone numbers (+63 format)
  - Generate unique batch_id
  - Bulk insert into recipients table
  - Return count of records added
- [ ] Build `/api/blast-send` route (SMS Sending)
  - Validate authorization
  - Fetch PENDING recipients (batch processing)
  - Generate personalized messages
  - Call Semaphore API for each recipient
  - Update status (SENT/FAILED) in database
  - Log api_response for debugging
- [ ] Build `/api/recipients` route (GET)
  - Fetch recipients with filtering (status, batch_id)
  - Support pagination
  - Return recipient data for dashboard
- [ ] Build `/api/batches` route (GET)
  - Fetch all batches with summary stats
  - Count PENDING, SENT, FAILED per batch

## Phase 4: Frontend - Authentication Pages
- [ ] Create `/login` page
  - Email/password form
  - Error handling
  - Redirect to dashboard on success
  - Link to signup page
- [ ] Create `/signup` page
  - Username, email, password form
  - Password strength validation
  - Error handling
  - Redirect to login on success
- [ ] Create auth context provider for global state

## Phase 5: Frontend - Admin Dashboard
- [ ] Create `/dashboard` page (protected route)
  - Display list of batches with stats
  - Show recipients table with columns:
    - Name
    - Phone Number
    - Item Type
    - Price
    - Status (PENDING/SENT/FAILED)
    - Sent At
  - Filtering by status
  - Pagination support
- [ ] Create batch upload component
  - CSV file input
  - File validation
  - Upload progress indicator
  - Success/error messages
- [ ] Create blast control component
  - Select batch to blast
  - Start SMS blast button
  - Real-time progress tracking
  - Success/error notifications
- [ ] Create recipient detail modal
  - Show full recipient info
  - Display API response for debugging

## Phase 6: UI Components & Styling
- [ ] Create reusable components:
  - Button component
  - Input component
  - Modal component
  - Table component
  - Loading spinner
  - Toast/notification component
- [ ] Apply Notion-like theme:
  - Clean, minimal design
  - Proper spacing and typography
  - Dark mode support (optional)
  - Responsive layout

## Phase 7: Error Handling & Validation
- [ ] Input validation on all forms
- [ ] API error handling with proper HTTP status codes
- [ ] User-friendly error messages
- [ ] Logging for debugging
- [ ] Rate limiting on API routes

## Phase 8: Security Implementation
- [ ] JWT token verification on all protected routes
- [ ] Role-based access control (ADMIN/OPERATOR)
- [ ] Password hashing with bcryptjs
- [ ] CORS configuration
- [ ] Input sanitization
- [ ] SQL injection prevention (via Prisma)

## Phase 9: Testing & Deployment
- [ ] Test authentication flow (signup/login/logout)
- [ ] Test CSV upload with valid/invalid data
- [ ] Test SMS blast sending
- [ ] Test dashboard filtering and pagination
- [ ] Test error scenarios
- [ ] Environment variable setup for production
- [ ] Database backup strategy

## Environment Variables Required
```
# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/sms_blaster

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Semaphore SMS Gateway
SEMAPHORE_API_KEY=your-semaphore-api-key-here

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Database Schema Summary

### users table
- id (SERIAL PRIMARY KEY)
- username (VARCHAR 50, UNIQUE, NOT NULL)
- email (VARCHAR 100, UNIQUE, NOT NULL)
- passwordHash (VARCHAR 255, NOT NULL)
- role (VARCHAR 20, NOT NULL, DEFAULT: OPERATOR)
- createdAt (TIMESTAMP, DEFAULT: NOW())

### recipients table
- id (SERIAL PRIMARY KEY)
- phoneNumber (VARCHAR 20, NOT NULL)
- name (VARCHAR 100, NOT NULL)
- price (NUMERIC 10,2, NOT NULL)
- itemType (VARCHAR 20, NOT NULL)
- status (VARCHAR 10, NOT NULL, DEFAULT: PENDING)
- sentAt (TIMESTAMP, NULLABLE)
- batchId (VARCHAR 50, NOT NULL)
- apiResponse (TEXT, NULLABLE)
- createdAt (TIMESTAMP, DEFAULT: NOW())
- updatedAt (TIMESTAMP, AUTO UPDATE)

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

## Semaphore API Integration
- Endpoint: `https://api.semaphore.co/api/v4/messages`
- Rate Limit: 120 requests per minute
- Required params: apikey, number, message
- Optional: sendername (defaults to "SEMAPHORE")
- Response includes: message_id, status, recipient, created_at, updated_at

## Notes
- All sensitive data stored in environment variables
- JWT tokens stored in httpOnly cookies (secure)
- Batch processing to avoid rate limiting
- Comprehensive error logging for debugging
- Role-based access control enforced on all routes
