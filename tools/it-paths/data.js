// IT Paths Explorer — data, quiz, glossary, and translations
// Data for IT paths. Wide breadth. Beginner-friendly descriptions.
// Images are Unsplash URLs (stable photo IDs). If any break, they fall back.
const PATHS = [
{
id: "frontend",
name: "Frontend Developer",
tagline: "Builds the parts of websites and apps you can actually see and click.",
emoji: "🖼️",
category: "Building things",
vibes: ["creative", "visual", "people-facing"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=900&q=80",
whatYouDo: "You take a designer's picture of what a website should look like and turn it into a real, working page in the browser. Buttons, menus, animations — that's you.",
tools: ["HTML", "CSS", "JavaScript", "React", "Figma"],
salary: "$55k – $140k",
dayInLife: [
"Morning standup — 15 min chat with your team about what everyone's doing.",
"Turn a new design into code (e.g. a signup page).",
"Fix a bug where a button looks weird on phones.",
"Code review — read a teammate's work and suggest improvements."
],
roadmap: [
{ step: "HTML & CSS basics", weeks: "2-4 weeks", what: "The skeleton and skin of every webpage." },
{ step: "JavaScript fundamentals", weeks: "2-3 months", what: "The programming language of the web." },
{ step: "A framework (React)", weeks: "2-3 months", what: "A toolkit that makes building big apps easier." },
{ step: "Build 3 portfolio projects", weeks: "2 months", what: "Real things you can show employers." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "backend",
name: "Backend Developer",
tagline: "Builds the invisible engine — the part that saves your data, logs you in, handles payments.",
emoji: "⚙️",
category: "Building things",
vibes: ["logical", "problem-solver", "behind-the-scenes"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
whatYouDo: "When you click 'log in', something somewhere checks your password, grabs your profile, and sends it back. You build that something.",
tools: ["Python", "Node.js", "PostgreSQL", "APIs", "Docker"],
salary: "$70k – $170k",
dayInLife: [
"Design how a new feature will store data.",
"Write code that handles 10,000 logins a minute without crashing.",
"Debug why payments are failing for some users.",
"Review a teammate's pull request."
],
roadmap: [
{ step: "Pick a language (Python)", weeks: "1-2 months", what: "Python is friendly and widely used." },
{ step: "Databases (SQL)", weeks: "1 month", what: "How apps remember things." },
{ step: "APIs & web servers", weeks: "2 months", what: "How frontend and backend talk to each other." },
{ step: "Deploy a real project", weeks: "1 month", what: "Put something live on the internet." }
],
earningStyles: ["job", "freelance"]
},
{
id: "fullstack",
name: "Full-Stack Developer",
tagline: "Does both frontend and backend. The generalist.",
emoji: "🥞",
category: "Building things",
vibes: ["versatile", "creative", "logical"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
whatYouDo: "You can build a whole website or app by yourself — the pretty part people see AND the engine underneath. Great for small teams and freelancing.",
tools: ["JavaScript", "React", "Node.js", "PostgreSQL", "Git"],
salary: "$70k – $160k",
dayInLife: [
"Build a new feature end-to-end — the button AND what happens when you click it.",
"Jump between design tweaks and database queries.",
"Talk to a client about what they actually need.",
"Deploy an update at the end of the day."
],
roadmap: [
{ step: "Frontend basics (HTML/CSS/JS)", weeks: "2-3 months", what: "Learn the visible half first." },
{ step: "Backend basics (Node/Python)", weeks: "2-3 months", what: "Then the invisible half." },
{ step: "Connect them", weeks: "1 month", what: "Learn how the two sides talk." },
{ step: "Build a full project", weeks: "2 months", what: "Like a mini Twitter or a to-do app." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "mobile",
name: "Mobile App Developer",
tagline: "Builds the apps on your phone.",
emoji: "📱",
category: "Building things",
vibes: ["creative", "visual", "product-minded"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80",
whatYouDo: "You make apps for iPhones or Android phones. From the design, to how it feels to swipe, to how it talks to servers.",
tools: ["Swift (iPhone)", "Kotlin (Android)", "React Native", "Flutter"],
salary: "$65k – $160k",
dayInLife: [
"Implement a new screen — e.g. a profile page.",
"Test on 3 different phones to make sure it works everywhere.",
"Submit an update to the App Store.",
"Read user reviews to find bugs."
],
roadmap: [
{ step: "Pick a platform", weeks: "1 week", what: "iPhone (Swift) or Android (Kotlin) or both (Flutter/React Native)." },
{ step: "Language basics", weeks: "2 months", what: "Learn the syntax and rules." },
{ step: "Build a small app", weeks: "1 month", what: "A weather app or a timer." },
{ step: "Publish to the store", weeks: "2 weeks", what: "The scariest and best part." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "game",
name: "Game Developer",
tagline: "Builds video games.",
emoji: "🎮",
category: "Building things",
vibes: ["creative", "visual", "problem-solver"],
difficulty: 4,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&q=80",
whatYouDo: "From tiny indie games to massive 3D worlds — you make the code that makes characters jump, enemies chase, and levels work.",
tools: ["Unity", "Unreal Engine", "C#", "C++", "Godot"],
salary: "$50k – $150k",
dayInLife: [
"Make the player character jump a little better.",
"Fix a glitch where enemies walk through walls.",
"Test new level designs.",
"Playtest — yes, playing games IS work."
],
roadmap: [
{ step: "Pick an engine (Unity or Godot)", weeks: "1 week", what: "Unity is industry standard, Godot is free & beginner-friendly." },
{ step: "Make a Pong clone", weeks: "1 month", what: "Tiny, but teaches you the basics." },
{ step: "Make a small original game", weeks: "3-6 months", what: "Something you'd actually play." },
{ step: "Release on itch.io", weeks: "1 week", what: "A free platform for indie devs." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "gamedesign",
name: "Game Designer",
tagline: "Decides what's fun. Designs rules, levels, and player experience — not always code-heavy.",
emoji: "🎲",
category: "Creative & design",
vibes: ["creative", "people-facing", "product-minded"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&q=80",
whatYouDo: "You decide why a game is fun. What the rules are, how levels are built, how rewards feel. Less coding, more thinking about players.",
tools: ["Unity", "Miro", "Figma", "Excel", "Paper prototypes"],
salary: "$50k – $120k",
dayInLife: [
"Sketch a new level on paper.",
"Watch players test your game, note where they get confused.",
"Tune numbers — how much damage does a sword do?",
"Write design docs for the rest of the team."
],
roadmap: [
{ step: "Play games critically", weeks: "ongoing", what: "Take notes on why things feel good or bad." },
{ step: "Board game prototypes", weeks: "1 month", what: "Paper teaches you design faster than code." },
{ step: "Learn Unity or Godot basics", weeks: "2 months", what: "Enough to build prototypes." },
{ step: "Ship a tiny game on itch.io", weeks: "3 months", what: "Finishing teaches more than planning." }
],
earningStyles: ["job", "hobby", "freelance"]
},
{
id: "data",
name: "Data Analyst",
tagline: "Turns messy spreadsheets into stories and decisions.",
emoji: "📊",
category: "Data & AI",
vibes: ["logical", "curious", "detective"],
difficulty: 2,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
whatYouDo: "A company has a huge pile of numbers (sales, users, clicks). You dig through it and find the story: 'Sales dropped because Tuesday emails aren't landing.'",
tools: ["Excel", "SQL", "Tableau", "Python", "Power BI"],
salary: "$55k – $120k",
dayInLife: [
"Answer a question from a manager: 'Why did signups drop last week?'",
"Pull data from the database with SQL.",
"Make a chart that makes the answer obvious.",
"Present findings in a meeting."
],
roadmap: [
{ step: "Excel + spreadsheets", weeks: "2 weeks", what: "Starts way simpler than you'd think." },
{ step: "SQL", weeks: "1-2 months", what: "The language of asking databases questions." },
{ step: "A visualization tool", weeks: "1 month", what: "Tableau or Power BI — makes your charts look pro." },
{ step: "Python for data (pandas)", weeks: "2 months", what: "For bigger or messier datasets." }
],
earningStyles: ["job", "freelance"]
},
{
id: "datascience",
name: "Data Scientist",
tagline: "Data analyst + machine learning. Predicts the future from data.",
emoji: "🔮",
category: "Data & AI",
vibes: ["logical", "curious", "researcher"],
difficulty: 4,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
whatYouDo: "Like a data analyst, but you also build models that predict things — who's likely to cancel, what a customer will buy next, when a machine will break.",
tools: ["Python", "pandas", "scikit-learn", "Jupyter", "SQL"],
salary: "$90k – $200k",
dayInLife: [
"Clean a messy dataset (takes longer than expected, always).",
"Train a model to predict something.",
"Check whether the model is actually useful or just guessing.",
"Explain results to non-technical teammates."
],
roadmap: [
{ step: "Python + statistics", weeks: "3-4 months", what: "The foundations." },
{ step: "Machine learning basics", weeks: "3-6 months", what: "Start with Andrew Ng's free course." },
{ step: "Kaggle competitions", weeks: "ongoing", what: "Real datasets, real practice." },
{ step: "A portfolio project", weeks: "1-2 months", what: "Something you can explain in a job interview." }
],
earningStyles: ["job", "freelance"]
},
{
id: "ml",
name: "Machine Learning Engineer",
tagline: "Ships AI models to real users. The engineer side of AI.",
emoji: "🤖",
category: "Data & AI",
vibes: ["logical", "researcher", "problem-solver"],
difficulty: 5,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
whatYouDo: "Data scientists build models in notebooks. You make those models run fast and reliably for millions of users. Think: the spam filter in your email.",
tools: ["Python", "PyTorch", "TensorFlow", "Docker", "AWS"],
salary: "$120k – $300k+",
dayInLife: [
"Optimize a model so it runs 10x faster.",
"Set up a system that retrains the model every night.",
"Debug why predictions got weird after a new update.",
"Read a research paper over coffee."
],
roadmap: [
{ step: "Strong programming + math", weeks: "6+ months", what: "Linear algebra, stats, Python." },
{ step: "Deep learning foundations", weeks: "6 months", what: "fast.ai or Andrew Ng's Deep Learning course." },
{ step: "Production ML (MLOps)", weeks: "3 months", what: "How to actually ship models." },
{ step: "Contribute to open source", weeks: "ongoing", what: "Builds your reputation." }
],
earningStyles: ["job"]
},
{
id: "promptai",
name: "AI / Prompt Engineer",
tagline: "Gets the best out of AI models like ChatGPT. A very new, fast-growing role.",
emoji: "💬",
category: "Data & AI",
vibes: ["creative", "curious", "writer"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=900&q=80",
whatYouDo: "You design how a company uses AI — writing the prompts, building the workflow, making sure the AI gives good answers for their customers.",
tools: ["ChatGPT", "Claude", "LangChain", "Python", "Notion"],
salary: "$80k – $200k",
dayInLife: [
"Iterate on a prompt until the AI stops saying something dumb.",
"Build a chatbot for customer support.",
"Test edge cases — what if a user asks weird things?",
"Write docs for your team on how to use AI safely."
],
roadmap: [
{ step: "Heavy ChatGPT/Claude use", weeks: "1 month", what: "Learn by doing." },
{ step: "Basic Python", weeks: "1-2 months", what: "To chain prompts together." },
{ step: "Build an AI-powered tool", weeks: "1-2 months", what: "Anything useful: a tutor, a recipe bot." },
{ step: "Share & iterate", weeks: "ongoing", what: "Ship projects publicly." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "cybersec",
name: "Cybersecurity Analyst",
tagline: "Protects companies from hackers. The digital bodyguard.",
emoji: "🛡️",
category: "Security & infrastructure",
vibes: ["logical", "detective", "problem-solver"],
difficulty: 4,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&q=80",
whatYouDo: "You're the defender. You check for weak spots, watch for attacks, and respond when something bad happens.",
tools: ["Wireshark", "Kali Linux", "SIEM", "Burp Suite", "Nmap"],
salary: "$70k – $180k",
dayInLife: [
"Review security alerts from overnight.",
"Investigate a suspicious login from another country.",
"Run a phishing test on your own coworkers (with permission).",
"Patch a known vulnerability across servers."
],
roadmap: [
{ step: "Networking basics", weeks: "2 months", what: "How the internet actually works under the hood." },
{ step: "Linux + command line", weeks: "1 month", what: "Most security tools live here." },
{ step: "CompTIA Security+ cert", weeks: "2-3 months", what: "The standard entry cert." },
{ step: "Hack The Box / TryHackMe", weeks: "ongoing", what: "Legal practice targets." }
],
earningStyles: ["job", "freelance"]
},
{
id: "pentest",
name: "Ethical Hacker / Pentester",
tagline: "Gets paid to break in — legally. Finds holes before real hackers do.",
emoji: "🕵️",
category: "Security & infrastructure",
vibes: ["curious", "detective", "problem-solver"],
difficulty: 5,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&q=80",
whatYouDo: "Companies hire you to try to hack them. You report what you found, they fix it. Basically a digital locksmith who specializes in breaking in.",
tools: ["Kali Linux", "Metasploit", "Burp Suite", "Python", "Nmap"],
salary: "$80k – $200k",
dayInLife: [
"Map out a target company's digital footprint.",
"Try common attacks to see what sticks.",
"Write a report for the client explaining what you found.",
"Study the latest vulnerabilities over lunch."
],
roadmap: [
{ step: "Cybersecurity basics first", weeks: "6 months", what: "You need to understand defense before offense." },
{ step: "Learn hacking on TryHackMe", weeks: "6 months", what: "Guided practice." },
{ step: "Get OSCP certification", weeks: "6-12 months", what: "The respected pentest cert." },
{ step: "Bug bounties", weeks: "ongoing", what: "Get paid per vulnerability you find." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "cloud",
name: "Cloud Engineer",
tagline: "Runs apps on giant computer warehouses (AWS, Google Cloud, Azure).",
emoji: "☁️",
category: "Security & infrastructure",
vibes: ["logical", "problem-solver", "behind-the-scenes"],
difficulty: 4,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&q=80",
whatYouDo: "When you use Netflix, it doesn't run on one computer — it runs on thousands of servers in warehouses. You design and manage that setup.",
tools: ["AWS", "Terraform", "Kubernetes", "Docker", "Linux"],
salary: "$90k – $200k",
dayInLife: [
"Set up a new server environment for a team.",
"Investigate why something got slow overnight.",
"Reduce the cloud bill — companies hate waste.",
"Practice disaster recovery: what if a region goes down?"
],
roadmap: [
{ step: "Linux + networking", weeks: "2 months", what: "The foundations." },
{ step: "AWS Cloud Practitioner cert", weeks: "1 month", what: "The easiest entry cert." },
{ step: "Infrastructure as Code (Terraform)", weeks: "2 months", what: "Define servers with code." },
{ step: "AWS Solutions Architect cert", weeks: "3 months", what: "The big career booster." }
],
earningStyles: ["job", "freelance"]
},
{
id: "devops",
name: "DevOps Engineer",
tagline: "Makes sure code goes from developer's laptop to real users smoothly and automatically.",
emoji: "🔧",
category: "Security & infrastructure",
vibes: ["logical", "problem-solver", "behind-the-scenes"],
difficulty: 4,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=900&q=80",
whatYouDo: "You build the assembly line that takes a developer's code and ships it to millions of users — automatically, safely, every day.",
tools: ["Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Ansible"],
salary: "$90k – $200k",
dayInLife: [
"Fix the deploy pipeline that broke overnight.",
"Automate a manual process the team has been complaining about.",
"Monitor alerts and dashboards.",
"Pair with developers to speed up their workflows."
],
roadmap: [
{ step: "Linux + shell scripting", weeks: "2 months", what: "You'll live in the terminal." },
{ step: "Docker + containers", weeks: "1 month", what: "How modern apps are packaged." },
{ step: "CI/CD pipelines", weeks: "2 months", what: "The automation assembly line." },
{ step: "Kubernetes", weeks: "3 months", what: "For running big fleets of apps." }
],
earningStyles: ["job"]
},
{
id: "network",
name: "Network Engineer",
tagline: "Designs and maintains the wires, routers, and Wi-Fi that make the internet work.",
emoji: "🌐",
category: "Security & infrastructure",
vibes: ["logical", "problem-solver", "hands-on"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
whatYouDo: "Wi-Fi not working? Office can't reach the cloud? You're the person who figures out why the invisible highways between computers are jammed.",
tools: ["Cisco IOS", "Wireshark", "Packet Tracer", "routers", "switches"],
salary: "$60k – $140k",
dayInLife: [
"Troubleshoot a slow office VPN.",
"Configure a new router for a branch office.",
"Upgrade network gear on a maintenance window at 2am (sometimes).",
"Document the network so your teammates can understand it."
],
roadmap: [
{ step: "CompTIA Network+ cert", weeks: "2 months", what: "Covers the fundamentals." },
{ step: "Cisco CCNA cert", weeks: "4-6 months", what: "The respected starter cert." },
{ step: "Home lab with old routers", weeks: "ongoing", what: "Practice is everything." },
{ step: "Specialize (security? cloud networking?)", weeks: "1+ year", what: "Pick a direction after a few years." }
],
earningStyles: ["job"]
},
{
id: "helpdesk",
name: "IT Support / Help Desk",
tagline: "The friendly person who fixes your computer. A common first IT job.",
emoji: "🛠️",
category: "Security & infrastructure",
vibes: ["people-facing", "problem-solver", "hands-on"],
difficulty: 1,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=900&q=80",
whatYouDo: "Someone's laptop won't turn on, their email's acting weird, or they forgot their password. You help them — in person, over chat, or phone.",
tools: ["Windows", "macOS", "Active Directory", "Ticketing systems", "Remote desktop"],
salary: "$35k – $70k",
dayInLife: [
"Reset 4 forgotten passwords before coffee.",
"Set up a new employee's laptop.",
"Walk someone through connecting to Wi-Fi over the phone.",
"Escalate a weird problem to the networking team."
],
roadmap: [
{ step: "CompTIA A+ cert", weeks: "2-3 months", what: "The classic entry-level IT cert." },
{ step: "Get a help desk job", weeks: "variable", what: "Many people start here with no degree." },
{ step: "Learn scripting (PowerShell)", weeks: "2 months", what: "Automate the boring parts." },
{ step: "Move to sysadmin or networking", weeks: "1-2 years in", what: "Help desk is a launchpad." }
],
earningStyles: ["job"]
},
{
id: "sysadmin",
name: "System Administrator",
tagline: "Keeps the servers running. The backbone of any tech company.",
emoji: "🖥️",
category: "Security & infrastructure",
vibes: ["logical", "problem-solver", "behind-the-scenes"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80",
whatYouDo: "Email server down? File share broken? You make sure the company's computers and servers keep running.",
tools: ["Windows Server", "Linux", "Active Directory", "PowerShell", "Bash"],
salary: "$60k – $130k",
dayInLife: [
"Apply security updates without breaking anything.",
"Fix a failed backup.",
"Automate a tedious task with a script.",
"Plan out next year's server upgrades."
],
roadmap: [
{ step: "Help desk experience", weeks: "6-12 months", what: "Builds the foundation." },
{ step: "Learn Linux or Windows Server deeply", weeks: "6 months", what: "Pick your specialty." },
{ step: "Scripting (Bash or PowerShell)", weeks: "2 months", what: "Automation is your superpower." },
{ step: "Move toward cloud or DevOps", weeks: "2+ years in", what: "Modern sysadmins go cloud." }
],
earningStyles: ["job"]
},
{
id: "dba",
name: "Database Administrator",
tagline: "Looks after the company's most valuable thing: its data.",
emoji: "🗄️",
category: "Data & AI",
vibes: ["logical", "detective", "behind-the-scenes"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=900&q=80",
whatYouDo: "Every app has a database. You make sure it's fast, safe, backed up, and never loses data — because losing data can kill a company.",
tools: ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "SQL Server"],
salary: "$80k – $160k",
dayInLife: [
"Tune a slow query that's costing money.",
"Test a backup by restoring it.",
"Review a new feature's database design.",
"Migrate data from an old system without losing a row."
],
roadmap: [
{ step: "SQL fluency", weeks: "2-3 months", what: "Not just reading — writing complex queries." },
{ step: "Learn one database deeply", weeks: "6 months", what: "PostgreSQL or MySQL are great starts." },
{ step: "Backup & recovery practice", weeks: "1 month", what: "This is most of the job." },
{ step: "Certification", weeks: "varies", what: "Oracle or Microsoft DB certs help." }
],
earningStyles: ["job"]
},
{
id: "uxui",
name: "UX / UI Designer",
tagline: "Decides how apps look and feel. Less code, more empathy.",
emoji: "🎨",
category: "Creative & design",
vibes: ["creative", "visual", "people-facing"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=900&q=80",
whatYouDo: "UX = how it works. UI = how it looks. You figure out what users need, draw it, test it, and hand the design to developers to build.",
tools: ["Figma", "Sketch", "Adobe XD", "Pen & paper", "Notion"],
salary: "$60k – $140k",
dayInLife: [
"Interview a user to understand their frustrations.",
"Sketch 5 ways a new screen could work.",
"Build a clickable prototype in Figma.",
"Hand off designs to developers and answer their questions."
],
roadmap: [
{ step: "Learn Figma", weeks: "1 month", what: "The industry standard tool." },
{ step: "Study design fundamentals", weeks: "2-3 months", what: "Typography, color, layout, accessibility." },
{ step: "Redesign 3 existing apps", weeks: "2 months", what: "Builds your portfolio fast." },
{ step: "Real project or internship", weeks: "3+ months", what: "The portfolio maker." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "pm",
name: "Product Manager",
tagline: "Decides WHAT to build and WHY. The bridge between business, design, and engineering.",
emoji: "🧭",
category: "Creative & design",
vibes: ["people-facing", "strategic", "product-minded"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80",
whatYouDo: "You don't code. You talk to users, talk to the business, and tell engineers/designers what's worth building next — and why.",
tools: ["Jira", "Figma", "Notion", "SQL", "Spreadsheets"],
salary: "$90k – $220k",
dayInLife: [
"Meet with users to learn what hurts.",
"Write a spec for a new feature.",
"Say NO to 10 good ideas so the team can ship one great one.",
"Check data to see if last month's feature actually worked."
],
roadmap: [
{ step: "Learn the basics of each field", weeks: "3 months", what: "A bit of design, a bit of code, a bit of business." },
{ step: "Ship a side project", weeks: "3-6 months", what: "Proves you can finish things." },
{ step: "Apply for associate PM roles", weeks: "varies", what: "Entry paths exist — don't wait to be 'ready'." },
{ step: "Learn SQL & analytics", weeks: "2 months", what: "Data is how you prove your ideas." }
],
earningStyles: ["job"]
},
{
id: "qa",
name: "QA Engineer / Tester",
tagline: "Breaks software on purpose — so users don't have to.",
emoji: "🧪",
category: "Building things",
vibes: ["detective", "logical", "detail-oriented"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
whatYouDo: "Before software ships, you try to break it. You click weird things, try invalid inputs, and write automated tests so bugs don't slip through again.",
tools: ["Selenium", "Cypress", "Playwright", "Postman", "JIRA"],
salary: "$55k – $130k",
dayInLife: [
"Test a new feature and find 3 bugs.",
"Write automated tests so they never happen again.",
"File clear bug reports so developers can fix them.",
"Pair with developers on tricky cases."
],
roadmap: [
{ step: "Manual testing basics", weeks: "1 month", what: "Learn to think like a user." },
{ step: "ISTQB Foundation cert", weeks: "2 months", what: "A respected QA starting cert." },
{ step: "Learn test automation", weeks: "3 months", what: "Selenium or Cypress." },
{ step: "Basic programming (Python/JS)", weeks: "2 months", what: "Automation needs a little code." }
],
earningStyles: ["job", "freelance"]
},
{
id: "embedded",
name: "Embedded / Firmware Developer",
tagline: "Programs the tiny computers inside physical things — cars, drones, microwaves.",
emoji: "🔌",
category: "Building things",
vibes: ["hands-on", "logical", "hardware-curious"],
difficulty: 4,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
whatYouDo: "There's code inside your microwave, your car, your smart bulb. You write that code — small, fast, reliable, on very limited hardware.",
tools: ["C", "C++", "Rust", "Arduino", "Oscilloscope"],
salary: "$70k – $160k",
dayInLife: [
"Program a tiny chip to read from a sensor.",
"Debug with an oscilloscope — yes, actual wires.",
"Optimize code to run in 4KB of memory.",
"Work closely with hardware engineers."
],
roadmap: [
{ step: "Learn C", weeks: "2-3 months", what: "The language of the metal." },
{ step: "Arduino projects", weeks: "2 months", what: "Affordable, fun, hands-on." },
{ step: "Move to Raspberry Pi / STM32", weeks: "3 months", what: "More real-world boards." },
{ step: "Build a device from scratch", weeks: "3+ months", what: "Portfolio gold." }
],
earningStyles: ["job", "hobby", "freelance"]
},
{
id: "robotics",
name: "Robotics Engineer",
tagline: "Teaches robots to move, see, and decide.",
emoji: "🤖",
category: "Building things",
vibes: ["hands-on", "researcher", "hardware-curious"],
difficulty: 5,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80",
whatYouDo: "From self-driving cars to factory arms to tiny drones — you write the code that lets machines sense the world and act in it.",
tools: ["Python", "C++", "ROS", "OpenCV", "Gazebo"],
salary: "$90k – $200k",
dayInLife: [
"Tune a robot arm so it doesn't knock things over.",
"Debug why vision sometimes fails in bright light.",
"Simulate scenarios before running on real hardware.",
"Collaborate with mechanical and electrical engineers."
],
roadmap: [
{ step: "Python + strong math", weeks: "6 months", what: "Linear algebra will show up a lot." },
{ step: "ROS (Robot Operating System)", weeks: "3-6 months", what: "Industry standard framework." },
{ step: "Computer vision basics", weeks: "3 months", what: "How robots see." },
{ step: "Build a physical robot", weeks: "6+ months", what: "Even a small one teaches everything." }
],
earningStyles: ["job", "hobby"]
},
{
id: "blockchain",
name: "Blockchain / Web3 Developer",
tagline: "Builds apps on crypto networks. Controversial, still hiring.",
emoji: "⛓️",
category: "Building things",
vibes: ["curious", "logical", "contrarian"],
difficulty: 4,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&q=80",
whatYouDo: "You build apps that run on blockchains like Ethereum. Think of it as a weird programmable internet where money, ownership, and rules are baked in.",
tools: ["Solidity", "Ethereum", "Hardhat", "ethers.js", "Rust"],
salary: "$100k – $250k",
dayInLife: [
"Write a smart contract (code that runs on the blockchain).",
"Audit code for expensive bugs — they're real money.",
"Test on a test network before deploying for real.",
"Read security reports of other projects that got hacked."
],
roadmap: [
{ step: "JavaScript basics", weeks: "2 months", what: "Most tooling is JS." },
{ step: "How blockchains work", weeks: "1 month", what: "Conceptually, not mystically." },
{ step: "Solidity (smart contracts)", weeks: "3 months", what: "The main language on Ethereum." },
{ step: "Ship a test dApp", weeks: "2 months", what: "A basic voting app or token." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "musicprog",
name: "Music Programmer / Audio Developer",
tagline: "Codes music tools, plugins, synthesizers, or game audio.",
emoji: "🎵",
category: "Creative & design",
vibes: ["creative", "hobby-friendly", "niche"],
difficulty: 4,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80",
whatYouDo: "You're half musician, half coder. You build the plugins artists use, the synthesizers that make sound from math, or the audio systems in games.",
tools: ["C++", "JUCE", "Max/MSP", "SuperCollider", "Pure Data"],
salary: "$60k – $160k",
dayInLife: [
"Implement a new audio effect for a plugin.",
"Tune it — literally, by ear.",
"Fix a bug where notes click on playback.",
"Write a quick test song to demo your work."
],
roadmap: [
{ step: "Music theory + some coding", weeks: "varies", what: "You need both sides." },
{ step: "Learn C++", weeks: "4-6 months", what: "Most audio code is C++." },
{ step: "JUCE framework", weeks: "2-3 months", what: "Industry standard for plugins." },
{ step: "Build a simple plugin", weeks: "2 months", what: "A reverb or a delay." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "creativecoder",
name: "Creative Coder / Generative Artist",
tagline: "Makes art, visuals, and experiences with code.",
emoji: "✨",
category: "Creative & design",
vibes: ["creative", "visual", "hobby-friendly"],
difficulty: 2,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=900&q=80",
whatYouDo: "Interactive installations in galleries. Music videos made of moving math. Generative NFT art. You use code like a paintbrush.",
tools: ["p5.js", "Processing", "TouchDesigner", "Three.js", "Shaders"],
salary: "$40k – $120k (very variable)",
dayInLife: [
"Sketch a visual idea in p5.js.",
"Tune the math until it feels right.",
"Install a piece at a festival or gallery.",
"Teach a workshop or post your process online."
],
roadmap: [
{ step: "p5.js tutorials", weeks: "1 month", what: "The friendliest starting point." },
{ step: "Study generative art on Instagram/X", weeks: "ongoing", what: "Free inspiration and techniques." },
{ step: "Daily sketches", weeks: "100 days", what: "The classic way to level up." },
{ step: "Ship a real piece", weeks: "varies", what: "NFT, installation, print — doesn't matter." }
],
earningStyles: ["freelance", "hobby", "job"]
},
{
id: "tech_writer",
name: "Technical Writer",
tagline: "Writes docs, tutorials, and guides that make tech understandable.",
emoji: "📝",
category: "Creative & design",
vibes: ["writer", "people-facing", "detail-oriented"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",
whatYouDo: "Every good tool has clear docs. You write them — turning tangled code into clear explanations that real humans can follow.",
tools: ["Markdown", "Git", "Notion", "Screenshots", "Static site generators"],
salary: "$60k – $130k",
dayInLife: [
"Interview an engineer about a new API.",
"Write a tutorial, including code samples you actually ran.",
"Edit docs based on user feedback.",
"Review teammates' writing."
],
roadmap: [
{ step: "Learn to write clearly", weeks: "ongoing", what: "This is the real skill." },
{ step: "Learn Markdown + Git", weeks: "2 weeks", what: "The writer's toolkit." },
{ step: "Write 5 tutorials on free stuff", weeks: "2 months", what: "Portfolio in public." },
{ step: "Contribute to open source docs", weeks: "ongoing", what: "Fastest way to get noticed." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "devrel",
name: "Developer Advocate",
tagline: "A programmer who talks to other programmers — teaches, demos, and builds community.",
emoji: "📣",
category: "Creative & design",
vibes: ["people-facing", "writer", "creative"],
difficulty: 3,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
whatYouDo: "You're a coder AND a teacher. You give talks, write tutorials, tweet, make videos — helping other developers use your company's tools.",
tools: ["Twitter", "YouTube", "Notion", "code", "microphones"],
salary: "$100k – $200k",
dayInLife: [
"Record a YouTube tutorial.",
"Answer questions on the community Discord.",
"Prep a talk for a conference.",
"Build a fun demo to show off a new feature."
],
roadmap: [
{ step: "Be a developer first", weeks: "1+ year", what: "You need real shipping experience." },
{ step: "Build an audience", weeks: "1+ year", what: "Tweet, blog, YouTube — pick one." },
{ step: "Give small talks", weeks: "ongoing", what: "Meetups are the practice ground." },
{ step: "Apply to DevRel roles", weeks: "varies", what: "Many junior DevRel roles exist now." }
],
earningStyles: ["job", "freelance"]
},
{
id: "noCode",
name: "No-Code / Automation Builder",
tagline: "Builds apps and automations without traditional code. Fast, beginner-friendly.",
emoji: "🧩",
category: "Building things",
vibes: ["creative", "problem-solver", "product-minded"],
difficulty: 1,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
whatYouDo: "You drag-and-drop to build real tools: customer portals, internal dashboards, automations that save companies 20 hours a week. Great entry path.",
tools: ["Zapier", "Airtable", "Webflow", "Bubble", "n8n"],
salary: "$40k – $120k",
dayInLife: [
"Automate a process that was someone's full-time job.",
"Build an internal tool for a non-technical team.",
"Train clients to use what you built.",
"Stitch 5 apps together so they share data."
],
roadmap: [
{ step: "Pick one tool (Zapier or Airtable)", weeks: "2 weeks", what: "Start narrow." },
{ step: "Automate things in your own life", weeks: "1 month", what: "Practice with personal projects." },
{ step: "Do 3 free automations for friends", weeks: "1 month", what: "Portfolio + testimonials." },
{ step: "Freelance on Upwork / Fiverr", weeks: "ongoing", what: "Common first paid gig." }
],
earningStyles: ["freelance", "job", "hobby"]
},
{
id: "ar_vr",
name: "AR / VR Developer",
tagline: "Builds experiences for headsets like Vision Pro and Quest.",
emoji: "🥽",
category: "Building things",
vibes: ["creative", "visual", "researcher"],
difficulty: 4,
mathHeavy: true,
image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=900&q=80",
whatYouDo: "You build things people can step inside — training simulators, games, virtual meetings, design tools. Still a young, exciting field.",
tools: ["Unity", "Unreal", "C#", "Blender", "Vision Pro SDK"],
salary: "$80k – $180k",
dayInLife: [
"Build a new interaction for a VR app.",
"Test by actually putting the headset on (a lot).",
"Optimize — VR needs 90+ frames per second or people feel sick.",
"Collaborate with 3D artists."
],
roadmap: [
{ step: "Unity + C#", weeks: "3 months", what: "The main engine for VR/AR." },
{ step: "3D math basics", weeks: "1-2 months", what: "Vectors and matrices matter here." },
{ step: "Build a small VR demo", weeks: "2 months", what: "Even on a cheap Quest." },
{ step: "Specialize (WebXR? Vision Pro? Unreal?)", weeks: "6+ months", what: "Pick a platform." }
],
earningStyles: ["job", "freelance", "hobby"]
},
{
id: "bi",
name: "Business Intelligence Analyst",
tagline: "Builds dashboards and reports that run a whole business.",
emoji: "📈",
category: "Data & AI",
vibes: ["logical", "people-facing", "strategic"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
whatYouDo: "Every executive checks dashboards to decide things. You build those dashboards. Less math-heavy than data science, more business-y.",
tools: ["Power BI", "Tableau", "SQL", "Excel", "Looker"],
salary: "$60k – $130k",
dayInLife: [
"Build a dashboard the CEO will check daily.",
"Investigate a number that looks off.",
"Train managers to read their own dashboards.",
"Clean up a messy data source."
],
roadmap: [
{ step: "Excel mastery", weeks: "1 month", what: "Still the world's most-used data tool." },
{ step: "SQL", weeks: "1-2 months", what: "Non-negotiable for this role." },
{ step: "Pick one BI tool", weeks: "2 months", what: "Power BI or Tableau." },
{ step: "Build 3 dashboards from public datasets", weeks: "1 month", what: "Portfolio." }
],
earningStyles: ["job", "freelance"]
},
{
id: "seo",
name: "Technical SEO Specialist",
tagline: "Makes websites show up first on Google. Half marketing, half engineering.",
emoji: "🔍",
category: "Creative & design",
vibes: ["strategic", "detective", "curious"],
difficulty: 2,
mathHeavy: false,
image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=900&q=80",
whatYouDo: "You help websites rank higher on Google — fixing slow pages, broken links, tags, and content structure. A surprising amount of tech + psychology.",
tools: ["Google Search Console", "Ahrefs", "Screaming Frog", "HTML", "JavaScript"],
salary: "$50k – $130k",
dayInLife: [
"Audit a client's site and find 20 broken links.",
"Check what's ranking for your target keywords.",
"Write a report for the marketing team.",
"Fix technical issues with the dev team."
],
roadmap: [
{ step: "Basic HTML + how Google works", weeks: "1 month", what: "Foundation." },
{ step: "SEO free courses (Ahrefs, Moz)", weeks: "2 months", what: "Plenty of free material." },
{ step: "Work on your own blog/site", weeks: "3+ months", what: "Rank your own thing first." },
{ step: "Freelance for a small business", weeks: "varies", what: "Quick way to real experience." }
],
earningStyles: ["freelance", "job", "hobby"]
}
];
// Quiz questions — answers map to vibes/categories
const QUIZ = [
{
q: "Pick a weekend activity:",
options: [
{ label: "Making something people can use", vibes: ["creative", "product-minded", "people-facing"] },
{ label: "Solving a tough puzzle", vibes: ["logical", "problem-solver", "detective"] },
{ label: "Designing or drawing", vibes: ["creative", "visual"] },
{ label: "Taking apart and reassembling something physical", vibes: ["hands-on", "hardware-curious"] },
{ label: "Writing or teaching", vibes: ["writer", "people-facing"] }
]
},
{
q: "How do you feel about math?",
options: [
{ label: "Love it — more equations please", mathPref: 1 },
{ label: "Can handle it", mathPref: 0.5 },
{ label: "Would prefer to avoid it", mathPref: -1 },
{ label: "Indifferent", mathPref: 0 }
]
},
{
q: "How visible do you want your work to be?",
options: [
{ label: "I want to SEE my work — buttons, screens, visuals", vibes: ["visual", "creative"] },
{ label: "Behind the scenes is fine — the engine, not the car paint", vibes: ["behind-the-scenes", "logical"] },
{ label: "In front of people — talking, presenting, teaching", vibes: ["people-facing", "writer"] },
{ label: "Mix of all", vibes: ["creative", "logical", "people-facing"] }
]
},
{
q: "How fast do you need to be earning money?",
options: [
{ label: "Soon — I need a job in 6 months", difficultyMax: 2 },
{ label: "Within a year", difficultyMax: 3 },
{ label: "I'm patient — great career over fast entry", difficultyMax: 5 }
]
},
{
q: "Which of these sounds most fun?",
options: [
{ label: "Building a game or app", categories: ["Building things"] },
{ label: "Finding patterns in giant piles of data", categories: ["Data & AI"] },
{ label: "Catching hackers / protecting things", categories: ["Security & infrastructure"] },
{ label: "Designing how things look and feel", categories: ["Creative & design"] }
]
},
{
q: "How do you want to work?",
options: [
{ label: "A steady job at a company", earning: "job" },
{ label: "Freelancing — my own clients", earning: "freelance" },
{ label: "As a hobby / side project", earning: "hobby" },
{ label: "Any of these", earning: null }
]
},
{
q: "Pick a superpower:",
options: [
{ label: "Creativity — make beautiful things", vibes: ["creative", "visual"] },
{ label: "Logic — solve anything step-by-step", vibes: ["logical", "problem-solver"] },
{ label: "Curiosity — figure out how things work", vibes: ["curious", "detective", "researcher"] },
{ label: "Communication — explain hard things simply", vibes: ["writer", "people-facing"] }
]
}
];
// Glossary — for hover tooltips
const GLOSSARY = {
"API": "A way for two programs to talk to each other. Like a waiter between you and the kitchen.",
"framework": "A pre-built toolkit that does the boring setup for you so you can focus on your idea.",
"SQL": "A language for asking databases questions. Pronounced 'sequel'.",
"database": "A giant, organized spreadsheet where apps save data.",
"Git": "A time machine for code. Lets you save versions and work with a team.",
"Linux": "A free operating system that runs most servers on the internet.",
"Docker": "A way to pack an app + everything it needs into a portable box.",
"Kubernetes": "A system that runs lots of Docker boxes at once and restarts them if they crash.",
"VPN": "A private tunnel through the internet. Used for security and accessing work networks.",
"pull request": "A way to propose a change to code. Teammates review it before it's accepted.",
"frontend": "The part of a website or app you can see and click.",
"backend": "The invisible engine that runs behind a website or app.",
"standup": "A short daily meeting where everyone says what they're working on.",
"cert": "Short for certification — a test you pass to prove you know something.",
"dApp": "A 'decentralized app' that runs on a blockchain instead of one company's servers.",
"smart contract": "Code that runs on a blockchain. Handles money or rules automatically.",
"MLOps": "The boring-but-critical job of keeping AI models running reliably in production.",
"VPN": "A private tunnel through the internet, for privacy or work access.",
"ROS": "Robot Operating System — the standard framework for programming robots.",
"JUCE": "The most common framework for building audio plugins."
};
window.PATHS = PATHS;
window.QUIZ = QUIZ;
window.GLOSSARY = GLOSSARY;
