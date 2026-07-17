import type { SampleScenario } from './types';

// Demo-only canned scenarios for the workshop UI.
export const sampleScenarios: SampleScenario[] = [
  {
    id: 'family-media-hub',
    title: 'Family media hub',
    summary: 'Low-maintenance home server for media, backups, and photo access.',
    prompt:
      'I want a self-hosted setup for my family to manage photos, stream media at home, and back up laptops. I have one mini PC, about $600 total budget, and I am comfortable with Docker but not Kubernetes. I prefer low maintenance and only limited remote access.',
    formValues: {
      goal: 'Family media, photo access, and laptop backups on one home server.',
      users: '4 family members',
      budget: '$600 total budget',
      hardware: 'One mini PC with external USB storage',
      existingSetup: 'Basic home network, no current self-hosted stack',
      preferences: 'Docker okay, simple admin, remote access only when necessary',
      constraints: 'No Kubernetes, low maintenance, quiet hardware',
      skillLevel: 'intermediate',
      privacyPosture: 'balanced',
      internetExposure: 'limited',
    },
  },
  {
    id: 'privacy-consultancy',
    title: 'Privacy-first client portal',
    summary: 'Small consultancy wants secure file sharing and client collaboration.',
    prompt:
      'I run a small consultancy and want a privacy-first self-hosted client portal for secure file sharing, shared notes, and lightweight project tracking. We have 8 people, can spend around $250 per month, and we already use a managed VPS. Security matters more than convenience because some data is sensitive.',
    formValues: {
      goal: 'Secure client portal with file sharing, notes, and lightweight project tracking.',
      users: '8 internal users plus clients',
      budget: '$250/month',
      hardware: 'Managed VPS, open to adding object storage backups',
      existingSetup: 'Managed VPS and standard SaaS tools today',
      preferences: 'Privacy-first, auditable access, simple client experience',
      constraints: 'Sensitive data, must avoid brittle ops burden',
      skillLevel: 'intermediate',
      privacyPosture: 'high',
      internetExposure: 'public',
    },
  },
  {
    id: 'lab-builder',
    title: 'Homelab learning track',
    summary: 'Ambitious builder wants room to learn without creating an ops trap.',
    prompt:
      'I am building a homelab to learn containers, reverse proxies, and internal developer tooling. I have a used workstation with plenty of RAM, a NAS, and strong Linux skills, but I do not want to create a fragile mess. Recommend a stack that balances learning value with sane operations.',
    formValues: {
      goal: 'Learn modern self-hosting and internal tooling without making the lab fragile.',
      users: '1 primary admin, occasional collaborators',
      budget: '$0 to $100 incremental spend',
      hardware: 'Used workstation plus NAS',
      existingSetup: 'Strong Linux skills, early homelab setup',
      preferences: 'Room to learn, reusable patterns, internal-first services',
      constraints: 'Avoid unnecessary complexity traps',
      skillLevel: 'advanced',
      privacyPosture: 'balanced',
      internetExposure: 'limited',
    },
  },
  {
    id: 'nonprofit-comms',
    title: 'Nonprofit comms stack',
    summary: 'Budget-conscious team replacing scattered SaaS with a realistic stack.',
    prompt:
      'Our nonprofit wants to replace scattered SaaS tools with a self-hosted setup for internal chat, docs, and shared file storage. We have a part-time IT volunteer, a tight budget, and need something realistic to keep running for a team of 15. We would rather sacrifice customization than end up with a brittle stack.',
    formValues: {
      goal: 'Replace scattered SaaS for internal communication, docs, and file storage.',
      users: '15 staff members',
      budget: 'Tight budget, ideally under $100/month',
      hardware: 'Open to a simple hosted VM or donated hardware',
      existingSetup: 'Part-time IT volunteer, mixed SaaS usage',
      preferences: 'Simple, realistic, easy onboarding',
      constraints: 'Very low maintenance overhead',
      skillLevel: 'beginner',
      privacyPosture: 'balanced',
      internetExposure: 'public',
    },
  },
];
