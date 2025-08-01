export const learningPaths = [
  {
    id: 'path-webdev',
    title: 'Web Developer',
    desc: 'HTML → CSS → JavaScript → React → Backend → Deploy',
    tag: 'Beginner',
  },
  {
    id: 'path-aiml',
    title: 'AI/ML Specialist',
    desc: 'Python → Statistics → ML → Deep Learning → Deployment',
    tag: 'Intermediate',
  },
  {
    id: 'path-cyber',
    title: 'Cybersecurity Analyst',
    desc: 'Networking → Linux → Pentesting → Tools → Real-world Labs',
    tag: 'Advanced',
  },
  {
    id: 'path-devops',
    title: 'DevOps Engineer',
    desc: 'Linux → CI/CD → Containers → Cloud Infrastructure → Monitoring',
    tag: 'Intermediate',
  },
  {
    id: 'path-datasci',
    title: 'Data Science',
    desc: 'Python → Pandas → Statistics → Visualization → Modeling',
    tag: 'Beginner',
  },
  {
    id: 'path-mobile',
    title: 'Mobile App Developer',
    desc: 'React Native / Flutter → API Integration → Deployment → Performance',
    tag: 'Beginner',
  },
];

export const featuredCourses = [
  {
    id: 'course-python-intro',
    title: 'Introduction to Python',
    type: 'Free',
    description: 'Start programming with Python fundamentals.',
    duration: '6 hrs',
    img: 'https://picsum.photos/seed/course1/300/200',
  },
  {
    id: 'course-react-scratch',
    title: 'Full React From Scratch',
    type: 'Paid',
    description: 'Build dynamic UIs with hooks and state.',
    duration: '25 hrs',
    img: 'https://picsum.photos/seed/course2/300/200',
  },
  {
    id: 'course-dsa',
    title: 'Data Structures & Algorithms',
    type: 'Free',
    description: 'Core CS concepts for interviews.',
    duration: '20 hrs',
    img: 'https://picsum.photos/seed/course3/300/200',
  },
  {
    id: 'course-fullstack',
    title: 'Fullstack Project Builder',
    type: 'Paid',
    description: 'Go from idea to deployed app.',
    duration: '45 hrs',
    img: 'https://picsum.photos/seed/course4/300/200',
  },
];

export const instructors = [
  {
    id: 'inst-ayesha',
    name: 'Ayesha Khan',
    role: 'Fullstack Instructor',
    avatar: 'https://picsum.photos/seed/inst1/80/80',
    bio: '10+ years building scalable apps.',
  },
  {
    id: 'inst-rohan',
    name: 'Rohan Mehta',
    role: 'AI Specialist',
    avatar: 'https://picsum.photos/seed/inst2/80/80',
    bio: 'Published researcher in ML.',
  },
  {
    id: 'inst-priya',
    name: 'Priya Singh',
    role: 'Cybersecurity Expert',
    avatar: 'https://picsum.photos/seed/inst3/80/80',
    bio: 'Former security engineer at major firms.',
  },
];

export const testimonials = [
  {
    id: 'test-arjun',
    name: 'Arjun Rao',
    quote: 'Free content was deep, and the Pro mentorship doubled my salary.',
    role: 'Software Engineer',
    avatar: 'https://picsum.photos/seed/test1/80/80',
  },
  {
    id: 'test-neha',
    name: 'Neha Gupta',
    quote: 'Live workshops made complex topics simple.',
    role: 'Data Analyst',
    avatar: 'https://picsum.photos/seed/test2/80/80',
  },
  {
    id: 'test-karan',
    name: 'Karan Singh',
    quote: 'Instructor feedback was the difference maker.',
    role: 'Backend Engineer',
    avatar: 'https://picsum.photos/seed/test3/80/80',
  },
];

export const articles = [
  {
    id: 'art-interview-tips',
    title: '5 Secret Tips to Ace Your Coding Interviews',
    author: 'Sahej',
    date: 'Jul 20, 2025',
    img: 'https://picsum.photos/seed/art1/300/200',
  },
  {
    id: 'art-fullstack-app',
    title: 'Building and Deploying Your First Fullstack App',
    author: 'Team',
    date: 'Jul 10, 2025',
    img: 'https://picsum.photos/seed/art2/300/200',
  },
  {
    id: 'art-learning-paths',
    title: 'Why Learning Paths Beat Random Tutorials',
    author: 'Content Team',
    date: 'Jun 30, 2025',
    img: 'https://picsum.photos/seed/art3/300/200',
  },
];

export const partners = [
  {
    id: 'partner-techcorp',
    name: 'TechCorp',
    logo: 'https://picsum.photos/seed/partner1/120/60',
  },
  {
    id: 'partner-innovatex',
    name: 'InnovateX',
    logo: 'https://picsum.photos/seed/partner2/120/60',
  },
  {
    id: 'partner-devworks',
    name: 'DevWorks',
    logo: 'https://picsum.photos/seed/partner3/120/60',
  },
  {
    id: 'partner-codeleap',
    name: 'CodeLeap',
    logo: 'https://picsum.photos/seed/partner4/120/60',
  },
];

export const plans = [
  {
    id: 'plan-free',
    name: 'Free',
    price: '$0',
    features: ['Core courses', 'Community access', 'Basic learning guides'],
    highlight: false,
  },
  {
    id: 'plan-student',
    name: 'Student',
    price: '$19/mo',
    features: [
      'Access to all beginner courses',
      'Project feedback',
      'Priority community support',
      'Exclusive student discounts',
    ],
    highlight: false,
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    price: '$39/mo',
    features: [
      'All courses',
      'Certificates',
      '1-on-1 mentoring',
      'Live workshop access',
      'Skill assessments',
      'Resume review',
    ],
    highlight: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: '$59/mo',
    features: [
      'Team access',
      'Custom learning paths',
      'Dedicated support',
      'Analytics dashboard',
    ],
    highlight: false,
  },
];

export const faqs = [
  {
    question: 'What is LearnHub?',
    answer:
      'LearnHub is a curated learning platform offering structured paths, expert instructors, and both free and paid courses to help you skill up for tech careers.',
  },
  {
    question: 'Are the courses free?',
    answer:
      'Many courses are free. For advanced features like certificates and 1-on-1 mentoring, we offer paid plans.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time from your dashboard.',
  },
  {
    question: 'Do I get a certificate?',
    answer:
      'Pro plan users get certificates for completed courses, which you can share on LinkedIn.',
  },
];

export const whyChooseUs = [
  {
    id: 'wc-experts',
    title: 'Industry Experts',
    description:
      'Our instructors are real professionals with years of experience.',
    icon: '🎓',
  },
  {
    id: 'wc-job-focused',
    title: 'Job-Focused Learning',
    description: 'Courses and paths are designed to help you land real jobs.',
    icon: '💼',
  },
  {
    id: 'wc-flexible',
    title: 'Flexible Plans',
    description:
      'Learn at your own pace with free or affordable monthly subscriptions.',
    icon: '⏱️',
  },
  {
    id: 'wc-support',
    title: 'Live Mentorship',
    description: 'Pro members get access to live mentoring and resume reviews.',
    icon: '🤝',
  },
];
