export const defaultResumeData = {
  title: "Software Developer",
  summary:
    "Passionate and detail-oriented software developer with experience in building scalable web applications using React, Node.js, and Java. Focused on delivering high-quality code and great user experiences.",

  contactInfo: {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@domain.com",
    phoneNumber: "9876543210",
    address: "42 Sample Street",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560001"
  },

  experienceList: [
    {
      jobTitle: "Frontend Developer",
      companyName: "ExampleTech Pvt Ltd",
      startDate: "2022-01-01",
      endDate: "2024-03-01",
      currentlyWorking: false,
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      description: [
        "Implemented reusable UI components using React and Material-UI.",
        "Collaborated with backend teams to integrate RESTful APIs.",
        "Participated in Agile sprints and improved sprint velocity by 20%."
      ],
      jobType: "FULL_TIME",
      totalYears: 2,
      totalMonths: 2
    }
  ],

  educationList: [
    {
      level: "BACHELORS",
      degree: "B.E.",
      stream: "Information Technology",
      institute: "Sample Institute of Technology",
      university: "Sample State University",
      startYear: 2018,
      endYear: 2022,
      percentage: "8.2",
      currentlyStudying: false
    }
  ],

  achievementList: [
    {
      title: "1st Place in State-Level Hackathon",
      description: "Built an AI-powered customer support tool in 24 hours.",
      date: "2022-08-12"
    },
    {
      title: "Best Intern Award",
      description: "Recognized for contributions to internal tool automation.",
      date: "2021-06-30"
    }
  ],

  certificationList: [
    {
      title: "Certified React Developer",
      issuer: "TechCerts",
      issueDate: "2023-01-10",
      expiryDate: "2026-01-10",
      proficiencyLevel: "ADVANCED"
    },
    {
      title: "Full Stack Web Development",
      issuer: "CodeAcademy",
      issueDate: "2022-07-01",
      expiryDate: "",
      proficiencyLevel: "INTERMEDIATE"
    }
  ],

  languageList: [
    { name: "English", proficiency: "FLUENT", isNative: false },
    { name: "Marathi", proficiency: "NATIVE", isNative: true }
  ],

  projectList: [
    {
      title: "Job Portal Platform",
      techStack: "React, Redux, Node.js, MongoDB",
      githubLink: "https://github.com/sampledev/job-portal",
      liveLink: "https://jobportal.dev",
      description:
        "Built a job portal platform with role-based access, job posting, and candidate search functionality. Implemented JWT authentication and admin dashboard."
    },
    {
      title: "Portfolio Website",
      techStack: "React, CSS, Netlify",
      githubLink: "https://github.com/sampledev/portfolio",
      liveLink: "https://sampleportfolio.dev",
      description:
        "Designed a personal portfolio with smooth animations, contact form integration, and dark/light themes."
    }
  ],

  personalLinkList: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/sampledev" },
    { platform: "GitHub", url: "https://github.com/sampledev" },
    { platform: "Portfolio", url: "https://sampleportfolio.dev" }
  ],

  skillList: [
    { skillName: "JavaScript", category: "TECHNICAL" },
    { skillName: "React.js", category: "TECHNICAL" },
    { skillName: "Node.js", category: "TECHNICAL" },
    { skillName: "MongoDB", category: "TECHNICAL" },
    { skillName: "Git", category: "TOOL" }
  ],

  visibility: "PRIVATE",
  templateName: "DefaultTemplate",
  themeColor: "#0A66FF"
};
