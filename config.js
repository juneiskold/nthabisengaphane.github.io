const portfolioData = {
    about: `* Hello! I'm a software developer and engineer passionate about creating interactive software.
* I specialize in backend development with focus on cloud and software integration.
* Currently based in Johannesburg, South Africa, I'm always open to new opportunities and collaborations.`,


    skills:[
        { name: "JavaScript", rating:5 },
        { name: "HTML/CSS", rating:5 },
        { name: "React", rating:3 },
        { name: "Typescript", rating:3 },
        { name: "Git/GitHub", rating:5 }
    ],

    interests:[
        "Web Development",
        "Open Source Projects",
        "Football/Soccer",
        "TV & Movie",
        "Reading",
        "Cyber Security"
    ],

    projects: [
        {
            name: "Portfolio Website",
            technologies: ["HTML", "CSS", "JavaScript"],
            link: "https://github.com/yourusername/portfolio"
        },

        {
            name: "E-commerce App",
            technologies: ["TypeScript", "Next.js", "Stripe API"],
            link: "https://github.com/yourusername/ecommerce"
        },

        {
            name: "Chat Application",
            technologies: ["Node.js", "Socket.io", "MongoDB"],
            link: "https://github.com/yourusername/chat-app"
        }
    ],


    blog:[

        {
            title: "Getting Started with React Hooks",
            date: "2025-01-15",
            snippet: "A beginner's guide to understanding and implementing React Hooks in your projects.",
            link: "https://yourblog.com/react-hooks-guide"
        },

        {
            title: "CSS Grid vs Flexbox",
            date: "2024-12-10",
            snippet: "Comparing two powerful CSS layout systems and when to use each one.",
            link: "https://yourblog.com/css-grid-vs-flexbox"
        }
    ],


    contact: {
        email: "bonoloapp28@gmail.com",
        github: "https://github.com/juneiskold",
        linkedin: "https://www.linkedin.com/in/bonolo-aphane-22a5b229a",
        twitter: "https://twitter.com/juneiskold"
    },

    experience:{
        education: [
            {
                degree: "National NQF Level 5 Certificate in Systems Development",
                institution: "WeThinkCode_",
                year: "2023-2025",
                link: "https://wethinkcode.co.za/"
            }
        ],

        certification: [
            {
                name: "Full Stack Web Development",
                provider: "Udemy",
                year: "2022",
                link: "https://www.udemy.com/certificate/UC-123456789"
            },

            {
                name: "AWS Cloud Practitioner",
                provider: "Amazon Web Services",
                year: "2023",
                link: "https://aws.amazon.com/certification/certified-cloud-practitioner"
            }
 
        ]
    }
};

const glitchFrames = ["L0ADING", "LØADING", "L04DING", "L0AD1NG", "L0ADING_"]

const defaultDarkMode = true;

export { portfolioData, glitchFrames, defaultDarkMode }