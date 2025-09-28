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