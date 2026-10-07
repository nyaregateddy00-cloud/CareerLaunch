import {
  UserProfile,
  JobApplication,
  UserSkill,
  Experience,
  Education,
  Project,
  Certification,
  CareerResource,
  Language,
  PortfolioConfig,
  CVDocument,
  Notification,
  RoleSkillGap,
  Opportunity
} from '../types';

export const INITIAL_USER_TEDDY: UserProfile = {
  id: 'usr-teddy-001',
  email: 'teddy.mwangi@uonbi.ac.ke',
  fullName: 'Teddy Mwangi',
  headline: 'Junior Full-Stack Engineer & CS Graduate | Building with React, Node.js & Python',
  bio: 'Computer Science graduate from the University of Nairobi with passion for scalable web platforms, financial inclusion APIs, and mobile solutions in East Africa. Seeking full-time or high-impact graduate engineering roles.',
  location: 'Nairobi, Kenya',
  phone: '+254 712 345 678',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  role: 'graduate',
  profileStrength: 80,
  githubUrl: 'https://github.com/teddymwangi',
  linkedinUrl: 'https://linkedin.com/in/teddymwangi',
  portfolioUrl: 'https://careerlaunch.co.ke/u/teddymwangi',
  twitterUrl: 'https://x.com/teddymwangi_dev',
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-09-18T14:30:00Z',
};

export const INITIAL_USER_AMINA: UserProfile = {
  id: 'usr-amina-002',
  email: 'amina.wanjiku@studio.design',
  fullName: 'Amina Wanjiku',
  headline: 'Senior UI/UX & Product Designer | Fintech & Mobile Design Specialist',
  bio: 'Product designer with 4+ years creating accessible interfaces for mobile-first African products. Experienced with Figma, user research in informal retail markets, and design systems.',
  location: 'Nairobi, Kenya (Available Remote Pan-Africa)',
  phone: '+254 722 987 654',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  role: 'freelancer',
  profileStrength: 95,
  githubUrl: 'https://github.com/aminadesign',
  linkedinUrl: 'https://linkedin.com/in/aminawanjiku',
  portfolioUrl: 'https://careerlaunch.co.ke/u/aminawanjiku',
  twitterUrl: 'https://x.com/amina_ux',
  createdAt: '2025-11-10T10:00:00Z',
  updatedAt: '2026-09-20T11:15:00Z',
};

export const INITIAL_USER_ADMIN: UserProfile = {
  id: 'usr-admin-003',
    email: 'nyaregat@gmail.com',
  fullName: 'Sarah Kipchoge',
  headline: 'Platform Administrator & Talent Partnerships Director',
  bio: 'Overseeing corporate partnerships with tech hubs, universities, and enterprise recruiters across East and West Africa.',
  location: 'Nairobi, Kenya',
  phone: '+254 700 000 001',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  role: 'admin',
  profileStrength: 100,
  createdAt: '2025-08-01T00:00:00Z',
  updatedAt: '2026-09-21T09:00:00Z',
};

export const INITIAL_SKILLS: UserSkill[] = [
  { id: 'sk-1', userId: 'usr-teddy-001', skillName: 'React & Next.js', category: 'Technical', proficiencyLevel: 'Advanced', yearsOfExperience: 2 },
  { id: 'sk-2', userId: 'usr-teddy-001', skillName: 'TypeScript', category: 'Technical', proficiencyLevel: 'Intermediate', yearsOfExperience: 1.5 },
  { id: 'sk-3', userId: 'usr-teddy-001', skillName: 'Node.js & Express', category: 'Technical', proficiencyLevel: 'Advanced', yearsOfExperience: 2 },
  { id: 'sk-4', userId: 'usr-teddy-001', skillName: 'Python & FastAPI', category: 'Technical', proficiencyLevel: 'Intermediate', yearsOfExperience: 1.5 },
  { id: 'sk-5', userId: 'usr-teddy-001', skillName: 'PostgreSQL / Supabase', category: 'Data & AI', proficiencyLevel: 'Intermediate', yearsOfExperience: 2 },
  { id: 'sk-6', userId: 'usr-teddy-001', skillName: 'Git & GitHub Workflows', category: 'Tools & Frameworks', proficiencyLevel: 'Advanced', yearsOfExperience: 3 },
  { id: 'sk-7', userId: 'usr-teddy-001', skillName: 'RESTful API Design', category: 'Technical', proficiencyLevel: 'Advanced', yearsOfExperience: 2 },
  { id: 'sk-8', userId: 'usr-teddy-001', skillName: 'Agile & Scrum Collaboration', category: 'Soft Skills', proficiencyLevel: 'Intermediate', yearsOfExperience: 1 },
];

export const INITIAL_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    userId: 'usr-teddy-001',
    institution: 'University of Nairobi (Chiromo Campus)',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2022-09-01',
    endDate: '2026-07-30',
    isCurrent: false,
    grade: 'First Class Honours',
    description: 'Specialized in Software Engineering, Distributed Systems, and Data Structures. Led the Google Developer Student Club (GDSC) chapter.',
  },
  {
    id: 'edu-2',
    userId: 'usr-teddy-001',
    institution: 'Moringa School',
    degree: 'Professional Certificate',
    fieldOfStudy: 'Full-Stack Software Development',
    startDate: '2023-01-10',
    endDate: '2023-06-25',
    isCurrent: false,
    grade: 'Distinction',
    description: 'Intensive 24-week immersive bootcamp covering modern web architecture, collaborative pair programming, and CI/CD pipelines.',
  },
];

export const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: 'exp-1',
    userId: 'usr-teddy-001',
    company: 'Twiga Foods Tech Hub',
    position: 'Software Engineering Attachment / Intern',
    employmentType: 'Attachment',
    location: 'Nairobi, Kenya',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    isCurrent: false,
    description: 'Collaborated on vendor logistics dashboard using React and Python microservices. Integrated M-Pesa Daraja API for automated merchant settlements, processing over 12,000 daily transactions.',
  },
  {
    id: 'exp-2',
    userId: 'usr-teddy-001',
    company: 'Upwork Global / Freelance',
    position: 'Junior Web Developer',
    employmentType: 'Freelance',
    location: 'Remote (Kenya)',
    startDate: '2025-09-01',
    endDate: '',
    isCurrent: true,
    description: 'Built responsive client web applications, landing pages, and customized Supabase backends for SME clients across Kenya and UK.',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    userId: 'usr-teddy-001',
    title: 'KilimoConnect - Smallholder Farmer Marketplace',
    description: 'PWA connecting dairy and avocado farmers in Central Kenya directly to urban bulk buyers. Features SMS USSD alerts, real-time pricing feeds, and M-Pesa escrow.',
    link: 'https://kilimoconnect-demo.co.ke',
    githubLink: 'https://github.com/teddymwangi/kilimoconnect',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600',
    tags: ['React', 'TypeScript', 'Node.js', 'USSD', 'M-Pesa API'],
    isFeatured: true,
  },
  {
    id: 'proj-2',
    userId: 'usr-teddy-001',
    title: 'Nairobi Commute - Matatu Fare & Route Tracker',
    description: 'Crowdsourced public transit fare estimator and route optimization engine for commuters across the Nairobi Metropolitan Area.',
    link: 'https://nairobicommute.netlify.app',
    githubLink: 'https://github.com/teddymwangi/nairobi-commute-tracker',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
    tags: ['Next.js', 'Tailwind CSS', 'Mapbox GL', 'Supabase'],
    isFeatured: true,
  },
  {
    id: 'proj-3',
    userId: 'usr-teddy-001',
    title: 'AfriPay Invoice & Receipt Generator',
    description: 'Clean invoicing tool built for African freelancers with automatic KRA eTIMS compliant tax calculation and PDF generation.',
    link: 'https://afripay-invoicing.vercel.app',
    githubLink: 'https://github.com/teddymwangi/afripay-invoice',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600',
    tags: ['Vue 3', 'Tailwind', 'PDFKit'],
    isFeatured: false,
  },
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    userId: 'usr-teddy-001',
    name: 'AWS Certified Cloud Practitioner (CLF-C02)',
    issuer: 'Amazon Web Services',
    issueDate: '2025-08-15',
    expiryDate: '2028-08-15',
    credentialUrl: 'https://aws.amazon.com/verification',
  },
  {
    id: 'cert-2',
    userId: 'usr-teddy-001',
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2024-11-20',
    credentialUrl: 'https://coursera.org/verify/professional-cert',
  },
];

export const INITIAL_PORTFOLIO: PortfolioConfig = {
  id: 'port-1',
  userId: 'usr-teddy-001',
  slug: 'teddymwangi',
  headline: 'Full-Stack Developer crafting reliable digital products for the African continent',
  bio: 'Hi, I am Teddy! I bridge intuitive frontend experiences with robust backend microservices. I am passionate about leveraging software to solve real problems in logistics, financial inclusion, and education in Kenya.',
  theme: 'modern-navy',
  isPublished: true,
  publicSections: { photo: false, headline: true, bio: true, projects: true, experience: true, education: true, skills: true, socialLinks: true, location: true, email: true },
  socialLinks: {
    github: 'https://github.com/teddymwangi',
    linkedin: 'https://linkedin.com/in/teddymwangi',
    twitter: 'https://x.com/teddymwangi_dev',
    website: 'https://careerlaunch.co.ke/u/teddymwangi',
    email: 'teddy.mwangi@uonbi.ac.ke',
  },
  featuredProjectIds: ['proj-1', 'proj-2'],
  viewCount: 342,
  updatedAt: '2026-09-20T10:00:00Z',
};

export const INITIAL_CV: CVDocument = {
  id: 'cv-1',
  userId: 'usr-teddy-001',
  title: 'Teddy Mwangi - Software Engineer CV (2026)',
  templateId: 'modern-navy',
  isDefault: true,
  updatedAt: '2026-09-21T16:00:00Z',
  content: {
    personalInfo: {
      fullName: 'Teddy Mwangi',
      email: 'teddy.mwangi@uonbi.ac.ke',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      headline: 'Junior Software Engineer | Full-Stack Developer',
      website: 'careerlaunch.co.ke/u/teddymwangi',
      linkedin: 'linkedin.com/in/teddymwangi',
      github: 'github.com/teddymwangi',
    },
    summary: 'Results-driven Computer Science graduate from University of Nairobi with hands-on experience developing web applications, REST APIs, and payment integrations. Passionate about solving African logistics and fintech challenges using TypeScript, React, Node.js, and cloud services.',
    experience: INITIAL_EXPERIENCE,
    education: INITIAL_EDUCATION,
    skills: INITIAL_SKILLS,
    projects: INITIAL_PROJECTS,
    certifications: INITIAL_CERTIFICATIONS,
    languages: [
      { id: 'lang-1', userId: 'usr-teddy-001', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-2', userId: 'usr-teddy-001', name: 'Swahili', proficiency: 'Native' },
    ],
  },
};

export const INITIAL_LANGUAGES: Language[] = [
  { id: 'lang-1', userId: 'usr-teddy-001', name: 'English', proficiency: 'Fluent' },
  { id: 'lang-2', userId: 'usr-teddy-001', name: 'Swahili', proficiency: 'Native' },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    userId: 'usr-teddy-001',
    opportunityId: 'opp-4',
    company: 'Microsoft Africa Development Centre (ADC)',
    position: 'Cloud Support & DevOps Associate',
    stage: 'Saved',
    dateApplied: '2026-09-20',
    deadline: '2026-11-01',
    notes: 'Need to review Azure networking architecture concepts and polish my Linux scripting portfolio project before submitting.',
    salary: 'KES 180,000 / mo',
    jobUrl: 'https://careers.microsoft.com/adc-nairobi',
    updatedAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'app-2',
    userId: 'usr-teddy-001',
    opportunityId: 'opp-3',
    company: 'Andela Africa',
    position: 'Junior Frontend Engineer (React/TypeScript)',
    stage: 'Applied',
    dateApplied: '2026-09-19',
    deadline: '2026-10-25',
    notes: 'Submitted customized CV emphasizing KilimoConnect React/TypeScript code and GitHub PR links. Awaiting coding assessment link.',
    salary: '$2,000 / mo',
    jobUrl: 'https://andela.com/careers/junior-frontend',
    updatedAt: '2026-09-19T14:30:00Z',
  },
  {
    id: 'app-3',
    userId: 'usr-teddy-001',
    opportunityId: 'opp-2',
    company: 'Equity Group Holdings',
    position: 'Industrial Attachment: Software Systems & Data',
    stage: 'Shortlisted',
    dateApplied: '2026-09-10',
    deadline: '2026-10-05',
    notes: 'Received HR email confirming NITA attachment paperwork is approved. Invited to virtual assessment next Tuesday.',
    salary: 'KES 35,000 stipend',
    jobUrl: 'https://equitybankgroup.com/careers/internships',
    updatedAt: '2026-09-17T09:15:00Z',
  },
  {
    id: 'app-4',
    userId: 'usr-teddy-001',
    opportunityId: 'opp-1',
    company: 'Safaricom PLC',
    position: 'Graduate Software Engineer (FinTech & Core Banking)',
    stage: 'Interview',
    dateApplied: '2026-09-05',
    deadline: '2026-10-15',
    notes: 'Stage 2 Technical Panel interview scheduled for October 4th, 10:00 AM EAT. Prepare M-Pesa transaction system design and data structures.',
    salary: 'KES 160,000 / mo',
    interviewDate: '2026-10-04T10:00:00Z',
    jobUrl: 'https://safaricom.com/careers/graduate-2026',
    updatedAt: '2026-09-21T10:00:00Z',
  },
  {
    id: 'app-5',
    userId: 'usr-teddy-001',
    opportunityId: 'opp-8',
    company: 'Cellulant',
    position: 'Mobile App Developer (Flutter / Dart)',
    stage: 'Offer',
    dateApplied: '2026-08-25',
    deadline: '2026-09-28',
    notes: 'Received official offer letter! Base KES 145,000 + comprehensive health insurance and remote stipend. Decision due in 5 days.',
    salary: 'KES 145,000 / mo',
    jobUrl: 'https://cellulant.io/careers/flutter-dev',
    updatedAt: '2026-09-21T15:45:00Z',
  },
  {
    id: 'app-6',
    userId: 'usr-teddy-001',
    company: 'Legacy Bank Ltd',
    position: 'Junior IT Support Clerk',
    stage: 'Rejected',
    dateApplied: '2026-07-15',
    notes: 'Role had higher focus on hardware printer maintenance rather than software development. Good decision to redirect to developer positions.',
    salary: 'KES 60,000 / mo',
    updatedAt: '2026-08-01T12:00:00Z',
  },
];

export const INITIAL_SAVED_OPP_IDS: string[] = ['opp-1', 'opp-3', 'opp-6'];

export const INITIAL_RESOURCES: CareerResource[] = [
  {
    id: 'res-1',
    title: 'The Complete Guide to Securing an Industrial Attachment in Kenya (NITA Accredited)',
    slug: 'securing-industrial-attachment-kenya',
    category: 'Industrial Attachment',
    summary: 'Everything Kenyan university and TVET students need to know: NITA clearance, mandatory insurance, finding corporate openings, and converting an attachment into a full-time role.',
    readTime: '6 min read',
    author: 'Teddy Mwangi & CareerLaunch Team',
    tags: ['NITA', 'Attachment', 'University', 'Kenya', 'Internship'],
    isFeatured: true,
    publishedAt: '2026-08-15',
    content: `Securing an industrial attachment in Kenya is a mandatory academic milestone for university students pursuing STEM, business, and humanities disciplines. Beyond fulfilling graduation requirements, it is often your first real foot in the corporate door.

### 1. Understanding NITA Requirements
The National Industrial Training Authority (NITA) regulates industrial attachments.
Ensure you obtain:
- An official letter of recommendation from your Dean or Departmental Attachment Coordinator
- Valid Student Personal Accident Insurance cover (available affordably via university partnerships)
- A certified copy of your National ID and KRA PIN certificate.

### 2. Timeline and When to Apply
Top multinationals like Safaricom, KenGen, KPLC, Equity Bank, and BAT publish their attachment intake calls 3 to 5 months in advance:
- **May - August Intake**: Applications close between January and March.
- **September - December Intake**: Applications close between May and July.

### 3. Making Your Application Stand Out
Don't send generic letters. Research the exact division you want to join. Highlight campus projects, hackathon achievements, and relevant coursework. Keep your CV concise at 1 to 2 pages.`
  },
  {
    id: 'res-2',
    title: 'Acing Technical Interviews at Safaricom, Equity and Top African Tech Hubs',
    slug: 'acing-tech-interviews-africa',
    category: 'Interview Prep',
    summary: 'A deep-dive into coding tests, system design for high-concurrency mobile money applications, and behavioral STAR techniques that African hiring managers look for.',
    readTime: '8 min read',
    author: 'Emmanuel Kiprono, Senior Tech Recruiter',
    tags: ['Interview', 'FinTech', 'Safaricom', 'System Design', 'Algorithms'],
    isFeatured: true,
    publishedAt: '2026-09-02',
    content: `Tech hiring across Nairobi, Lagos, and Kigali has evolved significantly. Top companies no longer just test syntax—they test whether you can design systems that handle unpredictable network latency and millions of daily transactions.

### Key Focus Areas:
1. **Data Structures & Algorithms**: Arrays, Hash Maps, Binary Trees, and Big-O notation.
2. **System Design**: How would you design a rate limiter for M-Pesa Daraja API?
3. **Behavioral Questions**: Using the STAR method (Situation, Task, Action, Result) to explain how you navigated production bugs or campus deadlines.`
  },
  {
    id: 'res-3',
    title: 'How to Build an Irresistible Tech CV as a University Graduate with Zero Experience',
    slug: 'tech-cv-guide-graduates-kenya',
    category: 'CV & Portfolio',
    summary: 'Transform academic projects, capstones, and self-directed learning into high-impact CV bullet points that bypass ATS filters and impress engineering leads.',
    readTime: '5 min read',
    author: 'Amina Wanjiku',
    tags: ['CV Builder', 'Resume', 'Graduates', 'ATS Friendly'],
    isFeatured: true,
    publishedAt: '2026-09-10',
    content: `When you don't have 5 years of corporate experience, your CV currency is **Proof of Work**. 
    
Include:
- Real links to working deployed apps (e.g. Vercel, Netlify, Render)
- GitHub repositories with clear READMEs, architecture diagrams, and commit history
- Quantified accomplishments: "Built an e-commerce prototype that reduced checkout steps from 6 to 3".`
  },
  {
    id: 'res-4',
    title: 'Winning Mastercard Foundation, Chevening & DAAD Scholarships from East Africa',
    slug: 'winning-mastercard-chevening-scholarships',
    category: 'Scholarships',
    summary: 'Step-by-step strategies for writing compelling personal essays, securing credible academic referee letters, and articulating your post-study African development vision.',
    readTime: '10 min read',
    author: 'Dr. Wanjiku Githinji, Global Scholars Mentor',
    tags: ['Scholarships', 'Mastercard Foundation', 'Chevening', 'Postgraduate'],
    isFeatured: false,
    publishedAt: '2026-08-28',
    content: `Prestigious international scholarships prioritize leadership and a demonstrable vision for giving back to your home community.

### 3 Pillars of a Winning Essay:
1. **The Catalyst**: What specific problem in your country or community ignited your passion?
2. **The Academic Vehicle**: Why is this specific degree and institution the exact catalyst you need?
3. **The Ripple Effect**: Exactly how will you implement this knowledge when you return to Africa?`
  },
  {
    id: 'res-5',
    title: 'Freelancing on Upwork & Toptal from Nairobi: Dollar Invoicing, M-Pesa and Taxes',
    slug: 'freelancing-kenya-guide',
    category: 'Freelancing',
    summary: 'Navigating international remote contracts from East Africa: receiving USD funds via Payoneer, Wise, or direct M-Pesa, managing KRA taxes, and pricing your services.',
    readTime: '7 min read',
    author: 'Brian Ochieng, Full-Stack Consultant',
    tags: ['Freelance', 'Remote Work', 'M-Pesa', 'Taxes', 'USD Income'],
    isFeatured: false,
    publishedAt: '2026-09-12',
    content: `Remote freelancing allows African developers and designers to earn competitive international rates while residing locally.
    
Learn how to optimize your client profile, negotiate hourly vs milestone deliverables, and use proper international invoicing.`
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-teddy-001',
    title: 'Interview Upcoming! 🗓️',
    message: 'Your Technical Interview with Safaricom PLC is scheduled for October 4th at 10:00 AM EAT.',
    type: 'application',
    isRead: false,
    actionUrl: '/applications',
    createdAt: '2026-09-21T10:05:00Z',
  },
  {
    id: 'notif-2',
    userId: 'usr-teddy-001',
    title: 'New Matching Opportunity 🚀',
    message: 'A new role matching your React & TypeScript skills was posted: "Junior Frontend Engineer at Andela Africa".',
    type: 'opportunity',
    isRead: false,
    actionUrl: '/opportunities',
    createdAt: '2026-09-19T11:05:00Z',
  },
  {
    id: 'notif-3',
    userId: 'usr-teddy-001',
    title: 'Profile Strength Recommendation',
    message: 'Adding a link to your deployed projects will increase your profile strength to 90% and boost employer views.',
    type: 'info',
    isRead: true,
    actionUrl: '/profile',
    createdAt: '2026-09-18T16:00:00Z',
  },
];

export const INITIAL_SKILL_GAPS: RoleSkillGap[] = [
  {
    targetRole: 'Junior Full-Stack Engineer at Safaricom PLC',
    companyTarget: 'Safaricom PLC',
    matchScore: 78,
    matchedSkills: ['React & Next.js', 'TypeScript', 'Node.js & Express', 'RESTful API Design', 'Git & GitHub'],
    missingSkills: [
      { name: 'Docker & Container Basics', importance: 'High', recommendedResource: 'Docker Fundamentals for African Developers' },
      { name: 'Redis Caching & Queue Processing', importance: 'Medium', recommendedResource: 'Building High-Concurrency Microservices' },
      { name: 'CI/CD Pipelines (GitHub Actions)', importance: 'Medium', recommendedResource: 'Automating Deployments' },
    ],
  },
  {
    targetRole: 'Junior Frontend Engineer at Andela',
    companyTarget: 'Andela',
    matchScore: 88,
    matchedSkills: ['React & Next.js', 'TypeScript', 'Git & GitHub', 'RESTful API Design'],
    missingSkills: [
      { name: 'Unit Testing with Vitest & React Testing Library', importance: 'High', recommendedResource: 'Testing Production React Apps' },
      { name: 'GraphQL & Apollo Client', importance: 'Nice to have', recommendedResource: 'GraphQL Deep Dive' },
    ],
  },
];
