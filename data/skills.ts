import { Skill } from '@/types';

export const skills: Skill[] = [
  {
    category: 'Backend Development',
    skills: [
      { name: 'Java', level: 'proficient', yearsOfExperience: 1 },
      { name: 'Spring Boot', level: 'proficient' },
      { name: 'Spring Security', level: 'proficient' },
      { name: 'PHP', level: 'expert', yearsOfExperience: 2 },
      { name: 'CodeIgniter', level: 'expert' },
      { name: 'Node.js', level: 'familiar' },
      { name: 'Golang', level: 'familiar' },
      { name: 'RESTful APIs', level: 'expert' },
    ],
  },
  {
    category: 'Frontend Development',
    skills: [
      { name: 'TypeScript', level: 'proficient', yearsOfExperience: 2 },
      { name: 'JavaScript', level: 'expert', yearsOfExperience: 2 },
      { name: 'React', level: 'proficient' },
      { name: 'Next.js', level: 'proficient' },
      { name: 'Vue.js', level: 'proficient' },
      { name: 'HTML/CSS', level: 'expert' },
      { name: 'Tailwind CSS', level: 'proficient' },
    ],
  },
  {
    category: 'Database & Data',
    skills: [
      { name: 'MySQL', level: 'expert', yearsOfExperience: 2 },
      { name: 'PostgreSQL', level: 'proficient' },
      { name: 'MariaDB', level: 'proficient' },
      { name: 'Redis', level: 'familiar' },
      { name: 'SQL Optimization', level: 'proficient' },
      { name: 'Database Design', level: 'proficient' },
    ],
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', level: 'proficient' },
      { name: 'Kubernetes', level: 'proficient' },
      { name: 'AWS', level: 'familiar' },
      { name: 'Tencent Cloud', level: 'proficient' },
      { name: 'Nginx', level: 'proficient' },
      { name: 'CI/CD', level: 'familiar' },
    ],
  },
  {
    category: 'Security & Authentication',
    skills: [
      { name: 'JWT', level: 'proficient' },
      { name: 'OAuth2', level: 'proficient' },
      { name: 'HMAC-SHA256', level: 'proficient' },
      { name: 'AES Encryption', level: 'proficient' },
      { name: 'API Security', level: 'proficient' },
    ],
  },
  {
    category: 'Testing & Quality',
    skills: [
      { name: 'JUnit', level: 'proficient' },
      { name: 'Mockito', level: 'proficient' },
      { name: 'Integration Testing', level: 'proficient' },
      { name: 'Postman', level: 'expert' },
      { name: 'Unit Testing', level: 'proficient' },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 'expert' },
      { name: 'Maven', level: 'proficient' },
      { name: 'Grafana', level: 'proficient' },
      { name: 'Sentry', level: 'familiar' },
      { name: 'Firebase', level: 'familiar' },
      { name: 'AWS SDK', level: 'familiar' },
    ],
  },
  {
    category: 'Specialized Skills',
    skills: [
      { name: 'Payment Gateway Integration', level: 'expert' },
      { name: 'Multi-language Systems', level: 'proficient' },
      { name: 'SEO Optimization', level: 'proficient' },
      { name: 'Performance Optimization', level: 'proficient' },
      { name: 'Microservices Architecture', level: 'proficient' },
      { name: 'System Monitoring', level: 'proficient' },
    ],
  },
];
