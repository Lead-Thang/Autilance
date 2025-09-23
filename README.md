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
   - Update the database connection string and other required variables

4. Set up the database:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Make sure you have the following environment variables set in your Vercel project:
   - `DATABASE_URL` - PostgreSQL database connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
   - `UPLOADTHING_SECRET` - UploadThing secret
   - `UPLOADTHING_APP_ID` - UploadThing app ID

2. The project is configured with:
   - `postinstall` script that generates the Prisma client
   - Custom `build` script that ensures Prisma client is generated before building
   - `vercel.json` configuration that includes necessary files

3. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Make sure to set the environment variables in the Vercel dashboard
   - The build should automatically run `npx prisma generate` before building the Next.js app

### Troubleshooting Deployment

If you encounter issues with Prisma client during deployment:
1. Make sure the `postinstall` script is present in package.json
2. Check that `vercel.json` includes the build command with `npx prisma generate`
3. Ensure the database connection string is correctly set in `DATABASE_URL`

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).