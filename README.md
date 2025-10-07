## StudyHub (Docu-style study material subscription hub)

### Features
- User registration/login with roles (user, admin)
- Admin creates bundles and publishes them
- Search bundles, bookmark, purchase access
- Personal dashboard tracking bookmarks and purchases
- Notes contribution with upload and admin moderation
- AI chat assistant widget with OpenAI API integration
- EJS server-rendered views, MVC structure

### Getting Started
1. Copy env: `cp .env.sample .env` and fill values
2. Start MongoDB locally (e.g., `mongod`)
3. Install deps: `npm install`
4. Run dev: `npm run dev` (or `npm start`)

Login to admin by updating your user in DB to role `admin`.

### Security Notes
- CSRF protected for non-API routes
- Sessions stored in MongoDB
- Helmet enabled

### Roadmap
- Payments integration (Stripe)
- File storage to S3
- Tests and CI
