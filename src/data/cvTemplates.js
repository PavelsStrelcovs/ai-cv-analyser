import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Code2,
  GraduationCap,
  HeartPulse,
  PanelTop
} from "lucide-react";

export const cvTemplates = [
  {
    industry: "IT & Software",
    role: "Junior Software Developer",
    icon: Code2,
    accent: "from-blue-500 to-teal-500",
    sections: ["Profile", "Technical Skills", "Projects", "Experience", "Education", "Certifications"],
    keywords: ["JavaScript", "React", "Node.js", "Git", "APIs", "Testing", "SQL"],
    profile:
      "Junior software developer with hands-on experience building responsive web applications using React, Node.js and REST APIs. Strong problem solver with a portfolio of projects, clean Git habits and a focus on accessible, maintainable code.",
    bullets: [
      "Built a full-stack web app using React, Express and a REST API, improving confidence with component design and backend routing.",
      "Used Git and GitHub for version control, feature branches and deployment-ready project documentation.",
      "Implemented form validation, loading states and error handling to improve reliability and user experience."
    ]
  },
  {
    industry: "Data & Analytics",
    role: "Graduate Data Analyst",
    icon: BarChart3,
    accent: "from-teal-500 to-emerald-500",
    sections: ["Profile", "Analytical Skills", "Projects", "Experience", "Education", "Tools"],
    keywords: ["SQL", "Excel", "Power BI", "Python", "Dashboards", "Data cleaning", "Insights"],
    profile:
      "Graduate data analyst with experience cleaning, analysing and visualising datasets to support better decisions. Comfortable with SQL, Excel, dashboarding and presenting clear insights to non-technical audiences.",
    bullets: [
      "Cleaned and analysed large datasets using SQL and Excel to identify trends, anomalies and improvement opportunities.",
      "Created interactive dashboards to communicate KPIs and make performance data easier to monitor.",
      "Presented findings with clear recommendations, linking analysis to business impact."
    ]
  },
  {
    industry: "Business & Finance",
    role: "Finance Assistant",
    icon: BriefcaseBusiness,
    accent: "from-amber-500 to-rose-500",
    sections: ["Profile", "Key Skills", "Experience", "Education", "Achievements", "Systems"],
    keywords: ["Excel", "Reporting", "Reconciliation", "Budgeting", "Accuracy", "Stakeholders"],
    profile:
      "Detail-oriented finance graduate with strong Excel, reporting and numerical analysis skills. Able to work accurately under deadlines, support reconciliations and communicate financial information clearly.",
    bullets: [
      "Prepared accurate spreadsheet reports, checking figures and resolving inconsistencies before submission.",
      "Supported invoice tracking and reconciliation tasks while maintaining clear records.",
      "Worked with stakeholders to gather missing information and keep reporting deadlines on track."
    ]
  },
  {
    industry: "Marketing",
    role: "Digital Marketing Assistant",
    icon: PanelTop,
    accent: "from-pink-500 to-orange-500",
    sections: ["Profile", "Marketing Skills", "Campaigns", "Experience", "Education", "Tools"],
    keywords: ["SEO", "Analytics", "Content", "Social media", "Campaigns", "Canva", "Email"],
    profile:
      "Creative digital marketing graduate with experience supporting content, social media and campaign reporting. Confident using analytics to understand performance and improve engagement.",
    bullets: [
      "Created social content calendars and campaign assets aligned with brand tone and audience needs.",
      "Tracked campaign performance using analytics tools and summarised results for stakeholders.",
      "Improved content quality by applying SEO basics, clear calls to action and consistent formatting."
    ]
  },
  {
    industry: "Healthcare",
    role: "Healthcare Assistant",
    icon: HeartPulse,
    accent: "from-emerald-500 to-cyan-500",
    sections: ["Profile", "Care Skills", "Experience", "Training", "Education", "Safeguarding"],
    keywords: ["Patient care", "Communication", "Safeguarding", "Confidentiality", "Teamwork", "Records"],
    profile:
      "Compassionate healthcare candidate with strong communication, teamwork and patient care awareness. Committed to confidentiality, safeguarding and providing reliable support in busy care environments.",
    bullets: [
      "Supported service users with dignity, patience and clear communication.",
      "Maintained accurate records and followed confidentiality procedures.",
      "Worked calmly with colleagues to prioritise care tasks in a fast-paced setting."
    ]
  },
  {
    industry: "Education",
    role: "Teaching Assistant",
    icon: GraduationCap,
    accent: "from-indigo-500 to-blue-500",
    sections: ["Profile", "Classroom Skills", "Experience", "Education", "Training", "Achievements"],
    keywords: ["Lesson support", "Safeguarding", "SEN", "Behaviour", "Communication", "Planning"],
    profile:
      "Supportive education candidate with experience helping learners stay engaged, organised and confident. Strong communicator with awareness of safeguarding, inclusion and classroom routines.",
    bullets: [
      "Supported small groups and individual learners with class activities and confidence building.",
      "Helped maintain a positive classroom environment through calm communication and consistency.",
      "Prepared learning materials and supported teachers with lesson organisation."
    ]
  },
  {
    industry: "Retail & Customer Service",
    role: "Customer Service Advisor",
    icon: Building2,
    accent: "from-coral to-gold",
    sections: ["Profile", "Customer Skills", "Experience", "Achievements", "Education", "Systems"],
    keywords: ["Customer service", "Sales", "Complaints", "Communication", "Targets", "POS"],
    profile:
      "Reliable customer service candidate with strong communication, problem solving and sales awareness. Experienced in helping customers, resolving issues and contributing to team targets.",
    bullets: [
      "Handled customer queries professionally, resolving issues and escalating complex cases when needed.",
      "Maintained product knowledge to support confident recommendations and improved customer experience.",
      "Worked flexibly with team members to meet service standards during busy periods."
    ]
  }
];
