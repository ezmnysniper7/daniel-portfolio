# Daniel Chen - Developer Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first design that looks great on all devices
- **Optimized Mobile Performance**: GPU-friendly rendering with intelligent animation pausing and reduced effects on mobile devices
- **Internationalization (i18n)**: Multi-language support (English & Chinese) with next-intl
- **Dark Mode**: Built-in dark mode support with next-themes
- **SEO Optimized**: Proper meta tags, semantic HTML, structured data, and multilingual support
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Fast Performance**: Server Components, optimized images, and intelligent client-side hydration
- **Smooth Animations**: Framer Motion animations with Intersection Observer optimization
- **Easy Content Management**: Simple TypeScript data files for projects and experience

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ezmnysniper7/daniel-portfolio.git
cd daniel-portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Update your personal information:
   - Edit `data/metadata.ts` with your contact info and social links
   - Replace email addresses, GitHub/LinkedIn URLs
   - Add your resume PDF to `public/resume.pdf`

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
daniel-portfolio/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes (en, zh-CN)
│   │   ├── layout.tsx    # Locale-specific layout
│   │   ├── page.tsx      # Homepage
│   │   ├── projects/     # Projects listing and detail pages (Server Components)
│   │   ├── about/        # About page with experience timeline
│   │   └── contact/      # Contact page with form
│   ├── api/              # API routes (contact form)
│   └── globals.css       # Global styles with mobile optimizations
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer, MobileNav)
│   ├── ui/               # UI components (Button, Badge, Card)
│   ├── home/             # Homepage sections (Hero with Intersection Observer)
│   ├── projects/         # Project components (optimized ProjectCard)
│   ├── experience/       # Experience timeline components
│   ├── contact/          # Contact form component
│   ├── effects/          # Visual effects (MeshGradient, CustomCursor)
│   └── transitions/      # Page transitions
├── contexts/              # React contexts
│   └── MobileContext.tsx # Shared mobile detection context
├── data/                  # Content data files
│   ├── metadata.ts       # Site metadata and personal info
│   ├── projects.ts       # Project entries (bilingual)
│   ├── experience.ts     # Work experience (bilingual)
│   └── skills.ts         # Skills and technologies
├── i18n/                  # Internationalization
│   ├── config.ts         # i18n configuration
│   └── messages/         # Translation files (en.json, zh-CN.json)
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions (date formatting, etc.)
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types
├── public/                # Static assets
│   └── resume.pdf        # Your resume (add this!)
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Customization

### Update Personal Information

Edit `data/metadata.ts`:
```typescript
export const siteMetadata: SiteMetadata = {
  name: 'Your Name',
  title: 'Your Title',
  email: 'your@email.com',
  // ... update social links
};
```

### Add/Edit Projects

Edit `data/projects.ts`:
```typescript
export const projects: Project[] = [
  {
    slug: 'your-project',
    title: 'Your Project Title',
    description: 'Short description',
    techStack: ['React', 'Node.js'],
    featured: true,
    // ... more fields
  },
];
```

### Add/Edit Experience

Edit `data/experience.ts`:
```typescript
export const experiences: Experience[] = [
  {
    id: 'your-company-2024',
    company: 'Your Company',
    position: 'Your Role',
    // ... more fields
  },
];
```

### Customize Colors

Edit `tailwind.config.ts` to change the color scheme:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6', // Change this
      },
    },
  },
},
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Custom Domain

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain (e.g., danielchen.dev)
4. Follow DNS configuration instructions

## Contact Form Integration

The contact form uses [Resend](https://resend.com) to send emails. To set it up:

1. Sign up for a free account at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Resend API key to `.env.local`:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   CONTACT_EMAIL=chendaniel150701@gmail.com
   ```
5. The form will now send emails to your configured email address
6. For production (Vercel), add these environment variables in your project settings

**Note**: Resend's free tier includes 100 emails/day, which is perfect for a portfolio site.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion with Intersection Observer optimization
- **Internationalization**: next-intl
- **Fonts**: Google Fonts (Inter)
- **Theme**: next-themes for dark mode
- **Email**: Resend API for contact form
- **Deployment**: Vercel

## Performance Optimizations

This portfolio includes several mobile-specific optimizations for smooth 60fps scrolling:

- **Shared Mobile Context**: Single resize listener across all components instead of per-component detection
- **Optimized Scroll Handling**: MobileNav uses refs to avoid re-renders on every scroll event
- **GPU-Friendly Effects**:
  - Disabled heavy visual effects on mobile (< 768px)
  - Removed `background-attachment: fixed` for mobile
  - Replaced `backdrop-blur` glassmorphism with solid backgrounds on mobile
- **Intelligent Animation Pausing**: Intersection Observer pauses infinite animations when components are off-screen
- **Smart Event Listeners**: CustomCursor only mounts on pointer devices and uses stable dependencies
- **Server Components**: Projects pages use Server Components to reduce client-side JavaScript
- **Optimized Images**: Lazy loading with reduced quality (75) on mobile devices

Desktop retains all visual effects, animations, and glassmorphism for the full experience.

## License

MIT License - feel free to use this template for your own portfolio!

## TODO

- [ ] Update email address in `data/metadata.ts`
- [ ] Update GitHub and LinkedIn URLs
- [ ] Add your resume PDF to `public/` folder
- [ ] Add project screenshots to `public/images/projects/`
- [ ] Configure contact form email service (optional)
- [ ] Add Google Analytics or Vercel Analytics (optional)
- [ ] Update favicon and og:image (optional)

## Support

For questions or issues, please open an issue on GitHub or contact me via the contact form.
