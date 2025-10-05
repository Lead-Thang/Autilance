# Autilance

Autilance is a revolutionary platform that transforms how companies list work requirements and how users verify, follow, and meet those expectations before applying or getting hired.

## Core Concept

Autilance is a reverse job board where companies list the skills, knowledge, behaviors, and rules required to work with them. Users can view these requirements, submit proof, get verified, and even train others based on the same standards.

## Features

### For Companies

- Create public "Job Descriptions" (JDs) with:
  - Required Skills (e.g., JavaScript, prompt engineering)
  - Required Behaviors (e.g., communication expectations, meeting etiquette)
  - Required Certifications or Knowledge
  - File/document uploads (e.g., internal guides, PDFs)
  - External links (e.g., Notion docs, GitHub repo, LMS courses)
  - Ability to set rules & culture expectations
- Accept or reject applicants who submit their progress
- Create and sell or share custom courses to help candidates qualify

### For Users

- Discover companies and view their requirements
- Follow a checklist or learning path
- Upload proof of work (certificates, project links, etc.)
- Get approved/verified by companies
- Once verified:
  - Gain badges (visible to other companies)
  - Teach others using verified experience
  - Earn rewards or access job opportunities

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase
- **File Storage**: UploadThing
- **UI Components**: Shadcn UI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (recommended) or npm

### Environment Variables

This project uses environment variables for configuration. All sensitive information should be stored in environment variables and never committed to the repository.

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
2. Update `.env.local` with your actual values:
   - Supabase credentials
   - UploadThing keys
   - IP Geolocation API key (for location services)
   - Email service configuration
   - NextAuth configuration (if used)
   - Any other service keys you might need

**Important**: The `.env*` files are included in `.gitignore` and will not be committed to the repository for security reasons.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/autilance.git
   cd autilance
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values with your actual configuration

4. Set up the database:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Deployment

### Environment Variables

Before deploying, make sure to set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
NEXT_PUBLIC_IPGEOLOCATION_API_KEY=your_ipgeolocation_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_domain_url
DATABASE_URL=your_database_url
```

### Vercel Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the required environment variables in the Vercel project settings
4. Set the build command to: `npx prisma generate && pnpm run build`
5. Set the output directory to: `.next`
6. Deploy!

### Local Development

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in your values
4. Run `pnpm dev` to start the development server

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).