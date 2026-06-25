// ai-learn i18n — Indonesian source text with English overlay.
(function () {
  'use strict';

  var STORAGE_KEY = 'ai-learn-lang';
  var supported = { en: true, id: true };

  var ui = {
    id: {
      title: 'Belajar AI — dari nol sampai multi-agent',
      progress: function (n, total) { return n + ' / ' + total + ' selesai'; },
      resetConfirm: 'Yakin mau ulang progress dari awal? Semua level akan terkunci lagi.'
    },
    en: {
      title: 'Learn AI — from zero to multi-agent',
      progress: function (n, total) { return n + ' / ' + total + ' complete'; },
      resetConfirm: 'Reset progress from the beginning? All levels will be locked again.'
    }
  };

  var mappings = [
    { selector: '.back-link', en: '&larr; IT Paths' },
    { selector: '.hero-title', en: 'Learn AI from zero.<br>Free. No teacher.' },
    { selector: '.hero-sub', en: 'Seven levels, one page. No signup required, no payment required.' },
    { selector: '#hero-cta', en: 'Start Level 1' },
    { selector: '.hero-img', attr: 'alt', en: 'AI learning path diagram: 7 steps from chat to multi-agent' },

    { selector: '#level-1 .time-pill', en: '~10 min' },
    { selector: '#level-1 .level-title', en: 'Chat with AI' },
    { selector: '#level-1 .level-img', attr: 'alt', en: 'Claude.ai screenshot — chatting about technology and education' },
    { selector: '#level-1 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-1 .outcome ul', en: '<li>Understand what an LLM is and why it is different from Google</li><li>Know three free AI chatbots you can use right away</li><li>Understand how to write prompts that are clear and specific</li>' },
    { selector: '#level-1 .steps .section-label', en: 'Steps:' },
    { selector: '#level-1 .steps ol', en: '<li>Open <a href="https://chat.openai.com" target="_blank" rel="noopener">chat.openai.com</a> — create a free account, then ask "what is artificial intelligence?"</li><li>Open <a href="https://claude.ai" target="_blank" rel="noopener">claude.ai</a> — ask the exact same thing and compare the answer</li><li>Open <a href="https://gemini.google.com" target="_blank" rel="noopener">gemini.google.com</a> — ask again and notice the pattern: which one is clearest? longest? most unreliable?</li><li>Ask again with a more specific prompt: compare "what is AI" with "explain AI in 3 sentences using a kitchen analogy"</li>' },
    { selector: '#level-1 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-1 .warnings ul', en: '<li>AI can <strong>make things up</strong> (hallucinate) — an answer that sounds confident is not always true</li><li>Do not enter personal data, passwords, or company secrets</li>' },
    { selector: '#level-1 .tldr-text', en: 'AI is a very smart text prediction machine. It is not a search engine — it <em>constructs</em> answers, not <em>finds</em> answers. That is why it can be wrong. Try three different chatbots so you can see the variation yourself. Specific prompt = more useful answer.' },

    { selector: '#level-2 .time-pill', en: '~15 min' },
    { selector: '#level-2 .level-title', en: 'Give AI Context' },
    { selector: '#level-2 .level-img', attr: 'alt', en: 'Screenshot of dragging and dropping a PDF file into an AI chat' },
    { selector: '#level-2 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-2 .outcome ul', en: '<li>Upload files (PDFs, images, spreadsheets) so AI understands your context</li><li>Use Projects / Custom GPT so AI remembers instructions</li><li>Write prompts with this structure: [context] &rarr; [task] &rarr; [output format]</li>' },
    { selector: '#level-2 .steps .section-label', en: 'Steps:' },
    { selector: '#level-2 .steps ol', en: '<li>Upload a PDF file to <strong>ChatGPT</strong> or <strong>Claude</strong> — ask it to summarize the content in 5 points</li><li>Paste a long text (article, email, meeting notes) directly into chat — ask for suggestions or analysis</li><li>In ChatGPT: create a "Project" with custom instructions (example: "you are a technology article editor"). In Claude: use Projects</li><li>Experiment with the prompt structure <span class="inline-mono">[context] &rarr; [task] &rarr; [output format]</span>. Example: "I am just learning Python. Explain for loops in 3 Indonesian sentences using bullet points."</li>' },
    { selector: '#level-2 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-2 .warnings ul', en: '<li>Do not upload confidential company documents or customer data to public AI tools</li><li>AI does not replace learning — it is an accelerator, not a shortcut</li>' },
    { selector: '#level-2 .tldr-text', en: 'AI with an empty question = generic answer. AI with files, documents, and context = answers that are <em>relevant to what you need</em>. Good prompt = clear context + specific task + the format you want. Projects/Custom GPT make AI "remember" your instructions every session.' },

    { selector: '#level-3 .time-pill', en: '~20 min' },
    { selector: '#level-3 .level-title', en: 'AI on Your Laptop' },
    { selector: '#level-3 > .level-img', attr: 'alt', en: 'Screenshot of Claude inside VS Code — chat sidebar beside a code file' },
    { selector: '#level-3 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-3 .outcome ul', en: '<li>Use AI as a desktop app — not just a browser tab that is easy to lose</li><li>Install Claude Desktop &amp; ChatGPT Desktop so AI is one click from your taskbar</li><li>Give Claude Desktop access to your folders through the <strong>Filesystem extension</strong> — AI can read &amp; edit files on your computer directly from a normal chat</li><li>(For coders) Use Claude or Codex directly inside your code editor</li>' },
    { selector: '#level-3 .steps .section-label:nth-of-type(1)', en: 'Steps — for everyone:' },
    { selector: '#level-3 .steps ol:nth-of-type(1)', en: '<li>Download <strong>Claude Desktop</strong> from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a> — it is like browser chat, but runs as its own app. It stays in the taskbar, supports Alt+Tab, and does not disappear when you close the browser. Drag-and-drop files also feel better there</li><li>Download <strong>ChatGPT Desktop</strong> from <a href="https://openai.com/chatgpt/download" target="_blank" rel="noopener">openai.com/chatgpt/download</a> — its standout features are <em>voice mode</em> and <em>screenshot sharing</em></li><li>Use both for a full day — feel the difference from browser tabs: no more "where did my AI tab go?"</li>' },
    { selector: '#level-3 .steps .section-label:nth-of-type(2)', en: 'Important step — give Claude access to your files:' },
    { selector: '#level-3 .steps p:nth-of-type(1)', en: 'This is where the real jump happens. Claude Desktop can be given access to folders on your laptop through <strong>Extensions</strong> (also known as MCP — Model Context Protocol). Once enabled, you can ask Claude things like "read laporan.docx in my Documents folder" or "clean up the filenames in Downloads" — and it can actually do the work, not just give advice. This is not just a coding feature; anyone who often works with files can use it.' },
    { selector: '#level-3 .steps ol:nth-of-type(2)', en: '<li>Open Claude Desktop &rarr; <strong>Settings</strong> &rarr; <strong>Extensions</strong> (or <strong>Developer</strong> in older versions). Find the built-in <strong>Filesystem</strong> extension and enable it</li><li>When it asks <em>which folder</em> can be accessed, choose one folder first — for example <code>Documents</code> or a specific project folder. <strong>Do not give access to the whole C:\\ or home folder</strong> — too broad, too risky</li><li>Restart Claude Desktop. Open a new chat and try: "list the files in the folder I gave you access to" — it should show that folder</li><li>Try a real use case: "read <code>notes.txt</code> and summarize it", or "create <code>todo.md</code> with 5 tasks for tomorrow". Every time it wants to write/edit, Claude asks for confirmation — <strong>read before clicking Allow</strong></li>' },
    { selector: '#level-3 .steps p:nth-of-type(2)', en: 'At this point you already have AI that can <em>read and change your files</em> from normal chat — no terminal, no coding required. Level 6 later takes the same idea further: terminal, commands, larger projects.' },
    { selector: '#level-3 .steps .section-label:nth-of-type(3)', en: 'If you code — install Claude Code in VS Code:' },
    { selector: '#l3-wt-intro', en: '<strong>A lot of people want to use Claude Code, not the regular web chat.</strong> Here is the easiest way: install the extension in VS Code. Follow the steps below slowly — each box = one click. No rush.' },
    { selector: '#l3-wt-jargon', en: '<b>What is "MCP"?</b> You will see this acronym a lot. MCP = how Claude connects to your tools and files. For now <b>do not worry about it</b> — install the extension first, MCP is a later concern. Just do not panic when you see the term.' },
    { selector: '#l3-vscode-ext-img', attr: 'alt', en: 'VS Code Extensions panel — search for "Claude Code for VS Code" by Anthropic, click the Install button' },
    { selector: '#l3-vscode-ext-caption', en: 'VS Code Extensions panel — what you want: "Claude Code for VS Code" by Anthropic (orange flower logo)' },
    { selector: '#l3-wt-steps', en: '<li class="wt-step"><span class="wt-head">Install VS Code first</span>Download it from <a href="https://code.visualstudio.com" target="_blank" rel="noopener">code.visualstudio.com</a>. A free code editor from Microsoft. Next-Next-Install, defaults are fine.</li><li class="wt-step"><span class="wt-head">Open the Extensions panel</span>In VS Code, click the squares icon in the left sidebar — or press <span class="click-chip">Ctrl</span> <span class="click-chip">Shift</span> <span class="click-chip">X</span>.</li><li class="wt-step key"><span class="wt-head">Search for the extension</span>In the search box at the top, type <span class="click-chip">Claude Code</span>. The right one is <strong>"Claude Code for VS Code"</strong> by <strong>Anthropic</strong> — orange flower logo (see the photo above).<span class="wt-note">Careful: there are copycat extensions. Make sure the publisher is <strong>Anthropic</strong> with the blue checkmark.</span></li><li class="wt-step key"><span class="wt-head">Click Install</span>Press the blue <span class="click-chip">Install</span> button next to the extension name. Wait a few seconds for it to finish.</li><li class="wt-step"><span class="wt-head">Sign in with your Claude account</span>After it installs, it asks you to sign in. Use your Claude account (Pro/Max) or an API key. Once signed in, Claude appears in the sidebar.</li><li class="wt-step"><span class="wt-head">Try it</span>Open any project folder, open the Claude panel, and type a normal request: "explain what this file does". Claude reads your open file and answers. <strong>Congrats — you just ran Claude Code.</strong></li>' },
    { selector: '#level-3 .steps .section-label:nth-of-type(4)', en: 'Other options (optional — not required):' },
    { selector: '#l3-coder-alts', en: '<li><strong>Codex</strong> — OpenAI desktop coding app: <a href="https://openai.com/codex" target="_blank" rel="noopener">openai.com/codex</a>. Knows your project context, can edit multiple files at once.</li><li><strong>GitHub Copilot</strong> (free for students/open source) or <strong>Cline</strong> (open-source VS Code extension). <strong>Pick just one</strong> — do not install them all at once.</li>' },
    { selector: '#level-3 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-3 .warnings ul', en: '<li>Desktop apps usually ask for file and/or screenshot access — <strong>read permission dialogs</strong> before clicking Allow</li><li>Filesystem extension = AI can read/edit files in the folder you allow. <strong>Start with one small folder</strong>, not the entire disk. Avoid folders containing credentials, .env files, or private keys</li><li>AI in editors (Claude/Codex/Copilot) can read your code — do not use it on projects with secret code or credentials</li><li>Codex &amp; Claude for VS Code need a paid account for full features — free tiers are usually limited by daily message counts</li>' },
    { selector: '#level-3 .tldr-text', en: 'AI is not only in the browser. <strong>For everyone:</strong> install Claude Desktop + ChatGPT Desktop, then enable the <strong>Filesystem extension</strong> in Claude — you can ask it to read/edit files in your folder directly from normal chat, without a terminal. <strong>For coders:</strong> put Claude or Codex inside VS Code — AI understands <em>your whole project</em> and can edit files while you work. This is the biggest jump from "normal chat" to "AI that works with you" — Level 6 later just raises it to the terminal.' },

    { selector: '#level-4 .time-pill', en: '~20 min' },
    { selector: '#level-4 .level-title', en: 'Understand Models &amp; Providers' },
    { selector: '#level-4 .level-img', attr: 'alt', en: 'AI model comparison table: model name, provider, strengths, use case' },
    { selector: '#level-4 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-4 .outcome ul', en: '<li>Tell mainstream AI models apart: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google)</li><li>Know open-source alternatives: Mistral, DeepSeek, Llama — and when they are worth trying</li><li>Understand <strong>OpenRouter</strong>: one API key to access dozens of models</li>' },
    { selector: '#level-4 .steps .section-label', en: 'Steps:' },
    { selector: '#level-4 .steps ol', en: '<li>Make a small note: ChatGPT for general tasks + plugins, Claude for long-text analysis + coding, Gemini for research + Google integration</li><li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a> — look at the available models (free and paid). Create an account, but you do not need to add balance yet</li><li>In OpenRouter, find free models: <strong>Mistral 7B</strong>, <strong>Gemma</strong>, <strong>Llama 3</strong> — try one through OpenRouter Chat</li><li>Rule of thumb: coding &amp; analysis &rarr; Claude/GPT, fast &amp; cheap &rarr; Haiku/Flash, privacy &amp; offline &rarr; Llama/Mistral locally</li>' },
    { selector: '#level-4 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-4 .warnings ul', en: '<li>Do not blindly use a "viral" model — each model has different strengths and weaknesses</li><li>OpenRouter has free options, but strong models are usually paid. Check price per 1M tokens before use</li><li>Local models (Llama, Mistral) need strong hardware — at least 16GB RAM for 7B-parameter models</li>' },
    { selector: '#level-4 .tldr-text', en: 'Do not be loyal to only one AI. Each model has a different "personality": Claude is strong at writing and coding, ChatGPT is versatile, Gemini connects well with the Google ecosystem. OpenRouter is an <em>entry point</em> into the multi-model world — one account, dozens of models, pay per use. Start recognizing them now so Level 7 will make sense later.' },

    { selector: '#level-5 .time-pill', en: '~30 min' },
    { selector: '#level-5 .level-title', en: 'Get Tools from GitHub' },
    { selector: '#level-5 .level-img', attr: 'alt', en: 'Screenshot of a GitHub Releases page — download buttons for .exe and .zip files' },
    { selector: '#level-5 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-5 .outcome ul', en: '<li>Download software from GitHub like a normal app — choose <code>.exe</code> or <code>.zip</code>, click, run</li><li>Get tools that do not have installers through <code>git clone</code> — one command, all files on your laptop</li><li>Read project pages confidently: recognize README, Releases, and what can be used immediately</li>' },
    { selector: '#level-5 .steps .section-label:nth-of-type(1)', en: 'Preparation (once):' },
    { selector: '#level-5 .steps ol:nth-of-type(1)', en: '<li>Create a GitHub account at <a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a> — free, 2 minutes. This account is used to star repos, follow projects, and later log in to some tools</li>' },
    { selector: '#level-5 .steps .section-label:nth-of-type(2)', en: 'Way A — Download Release (easiest):' },
    { selector: '#level-5 .steps p:nth-of-type(1)', en: 'Use this when a project provides a ready installer (<code>.exe</code>, <code>.dmg</code>, <code>.zip</code>). No Git, no build. Good for desktop apps like ShareX, OBS, etc.' },
    { selector: '#level-5 .steps ol:nth-of-type(2)', en: '<li>Open the repo page on GitHub, click the <strong>"Releases"</strong> tab on the right side (or go directly to <code>/releases</code>)</li><li>Scroll to the <strong>"Assets"</strong> section in the newest release — choose the file that matches your OS (<code>.exe</code> for Windows, <code>.dmg</code> for Mac)</li><li>Real example: <a href="https://github.com/ShareX/ShareX/releases" target="_blank" rel="noopener">ShareX Releases</a> — a Windows screenshot tool. Download the <code>.exe</code>, install it, use it immediately</li>' },
    { selector: '#level-5 .steps .section-label:nth-of-type(3)', en: 'Way B — Clone &amp; Build (for projects without installers):' },
    { selector: '#level-5 .steps p:nth-of-type(2)', en: 'Use this when a project does not provide a ready release — usually developer tools, agent CLIs, or small projects. You need Git + the build instructions in the README. This is the same workflow used later in Level 6 to install agent tools.' },
    { selector: '#level-5 .steps ol:nth-of-type(3)', en: '<li>Install <strong>Git for Windows</strong> from <a href="https://git-scm.com/download/win" target="_blank" rel="noopener">git-scm.com</a> — Next Next Finish, the defaults are fine</li><li>Open PowerShell and run: <code>git clone https://github.com/&lt;user&gt;/&lt;repo&gt;</code> — the whole project folder appears on your laptop</li><li><code>cd</code> into the cloned folder and open <strong><code>README.md</code></strong> — this is required. README is every project&apos;s instruction manual: how to build, dependencies, how to run</li><li>Follow the build instructions in the README. Every project is different — some use <code>npm install</code>, some use <code>cargo build</code>, some only need an HTML file opened</li>' },
    { selector: '#level-5 .steps p:nth-of-type(3)', en: 'Want practice? Try cloning my small project: <code>git clone https://github.com/zrovihr/council</code> — follow the README. This is only workflow practice; you do not have to use the project.' },
    { selector: '#level-5 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-5 .warnings ul', en: '<li>Do not download random <code>.exe</code> files from unclear GitHub repos — check stars, read the README, see when it was last updated</li><li>Avoid <code>curl http://... | bash</code> commands from the internet — that runs foreign code directly on your laptop</li><li>You do <em>not</em> need to be good at Git to continue — being able to download releases + clone repos covers 90% of the need</li>' },
    { selector: '#level-5 .tldr-text', en: 'In this level you learn how to <em>get software from the internet</em> — not only from normal download pages. GitHub is where almost all modern tools live, including AI agents you will use in Level 6. There may be no App Store and no clean Download page — just a project page and a Releases button. Two core skills: (1) download a release <code>.exe</code>/<code>.zip</code> like normal, (2) <code>git clone</code> for projects without installers. Without these two, you get stuck at Level 3 — unable to install Claude Code, Aider, or any CLI tool.' },

    { selector: '#level-6 .time-pill', en: '~30 min' },
    { selector: '#level-6 .level-title', en: 'AI Agent in the Terminal' },
    { selector: '#level-6 .level-img:nth-of-type(1)', attr: 'alt', en: 'Screenshot of a newly opened Claude Code CLI — empty prompt waiting for instructions' },
    { selector: '#level-6 .level-img:nth-of-type(2)', attr: 'alt', en: 'Screenshot of Claude Code CLI — AI agent running a task in the terminal' },
    { selector: '#level-6 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-6 .outcome ul', en: '<li>Install and run an AI agent in the terminal — AI can read/write files and execute commands</li><li>Understand the difference between "chat" and "agent" patterns — when to use each one</li><li>Use approval flows safely: read first, then approve</li>' },
    { selector: '#level-6 .steps .section-label', en: 'Steps:' },
    { selector: '#level-6 .steps ol', en: '<li>Make sure <strong>Node.js</strong> is installed — download from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (LTS version). Check in terminal: <code>node -v</code></li><li>Install <strong>Claude Code</strong>: open terminal and run<br><code>npm install -g @anthropic-ai/claude-code</code></li><li>Open any project folder in terminal and type <code>claude</code> — AI can immediately read the folder and help with coding/analysis</li><li>Try <strong>Codex CLI</strong> (from OpenAI) or <strong>Aider</strong> (<code>pip install aider-chat</code>) — compare how each works</li><li>Learn the approval flow: every time an agent wants to run a command, it asks for permission first. <strong>Read first, then approve.</strong></li>' },
    { selector: '#level-6 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-6 .warnings ul', en: '<li>Agent CLIs can <strong>read, write, and delete files</strong> — always approve commands one by one, do not auto-yes</li><li>Initialize Git first (<code>git init</code> + <code>git commit</code>) before experimenting, so you can roll back if the agent messes up</li><li>API tokens cost money — watch provider dashboards so usage does not run away</li>' },
    { selector: '#level-6 .tldr-text', en: 'Big jump: from <em>chat</em> to <em>agent</em>. An AI agent in the terminal can read the whole project folder, edit files, and run commands — more like a coworker than a chat assistant. Still use one agent per session. With great power comes real responsibility: always read commands before approving.' },
    { selector: '#level-6 .concept-box .section-label', en: 'Concept: Chatbot vs Agent' },
    { selector: '#level-6 .chatbot-col .concept-label', en: 'Chatbot' },
    { selector: '#level-6 .chatbot-col p:nth-of-type(1)', en: 'AI that can only <strong>chat</strong>. It waits for you to ask, it answers. Each reply starts from scratch — a chatbot cannot do anything outside the chatbox. It cannot read your files, cannot run commands, cannot edit documents.' },
    { selector: '#level-6 .chatbot-col .concept-hint', en: 'Levels 1–4 are all at the Chatbot level.' },
    { selector: '#level-6 .agent-col .concept-label', en: 'Agent' },
    { selector: '#level-6 .agent-col p:nth-of-type(1)', en: 'AI that can <strong>act</strong>. Beyond chatting, an agent can read folders, edit files, run terminal commands, delete or create new files. An agent doesn\'t just give advice — it actually <em>does</em> the work itself.' },
    { selector: '#level-6 .agent-col .concept-hint', en: 'Starting Level 6, you enter the Agent world.' },
    { selector: '#level-6 .nostalgia-img', attr: 'alt', en: 'Eviebot / Cleverbot — old-school 2010s chatbots that could only reply with text. Pure nostalgia.' },
    { selector: '#level-6 .nostalgia-caption', en: 'Remember Eviebot / Cleverbot? Those 2010s chatbot AIs — text-only, often nonsensical, but fun. ChatGPT today is still technically a chatbot: great at conversation, but it cannot do anything outside the chat box. Same limitation, just more eloquent.' },
    { selector: '#level-6 .agent-caption', en: 'Imagine an assistant that does not just answer questions, but opens your files, edits the code, and commits to Git — all from a single prompt. That is the fundamental difference: a chatbot talks <em>about</em> the work, an agent <em>does</em> the work.' },
    { selector: '#level-6 .chatbot-col .concept-examples', en: '<span class="mono-label">Examples:</span> Eviebot, Cleverbot, ChatGPT (web), Claude (web), Gemini (web).' },
    { selector: '#level-6 .agent-col .concept-examples', en: '<span class="mono-label">Examples:</span> Claude Code, Codex CLI, Aider, Cursor, Claude Desktop + Filesystem.' },
    { selector: '#level-6 .concept-cmp-img', attr: 'alt', en: 'Chatbot vs Agent comparison diagram: a chatbot can only chat, an agent can read files and execute commands' },

    { selector: '#level-7 .time-pill', en: '~45 min' },
    { selector: '#level-7 .level-title', en: 'Multi-Agent Orchestrator <span class="bonus-badge mono-label">Bonus</span>' },
    { selector: '#level-7 .bonus-note', en: 'This level is <strong>optional</strong> — a bonus for anyone curious about how several AI agents can work together in one session. For everyday needs, Levels 1-6 are already more than enough.' },
    { selector: '#level-7 .level-img', attr: 'alt', en: 'Screenshot of Council — several AI agents (Claude, Codex, DeepSeek) chatting together in one session' },
    { selector: '#level-7 .outcome .section-label', en: 'After this you can:' },
    { selector: '#level-7 .outcome ul', en: '<li>Understand the difference between "one agent" and "many agents managed by an orchestrator"</li><li>Run a multi-agent session: several AIs from different providers talking together in one chat</li><li>Know when multi-agent is worth the complexity, and when one agent is enough</li>' },
    { selector: '#level-7 .steps .section-label', en: 'Steps:' },
    { selector: '#level-7 .steps ol', en: '<li>Make sure you are comfortable with Level 6 — one CLI agent first, then multi-agent</li><li>Clone a real example: <code>git clone https://github.com/zrovihr/council</code> — an open-source orchestrator that lets Claude, Codex, and DeepSeek talk together in one session. (This is exactly the Level 5 workflow.)</li><li>Enter the cloned folder, read <code>README.md</code>, and follow the build steps. Prepare API keys for each provider you want to use</li><li>Run one session: give one task and watch how each agent gives a different perspective — Claude may review architecture, Codex may execute quickly, DeepSeek may suggest cheaper alternatives</li><li>Reflect: for which tasks does multi-agent <em>actually</em> produce better results than one agent? For which tasks does it only make things slower and more expensive?</li>' },
    { selector: '#level-7 .warnings .section-label', en: 'Watch out:' },
    { selector: '#level-7 .warnings ul', en: '<li>Multi-agent = <strong>multiplied token cost</strong>. Each agent has its own cost</li><li>Complexity rises sharply: conflicts between agents, race conditions, sessions that do not converge. If one agent is enough, do not force it</li><li>Each agent can still read/write files — Level 6 risk multiplied by the number of agents</li>' },
    { selector: '#level-7 .tldr-text', en: 'The peak of the path. A multi-agent orchestrator = one "manager" arranging several AI agents to talk together in one session. A real example is <a href="https://github.com/zrovihr/council" target="_blank" rel="noopener">Council</a> — Claude, Codex, and DeepSeek can mention each other, like an engineering team group chat. Powerful, but expensive and complex. Worth using only when one agent is <em>really</em> not enough.' },

    { selector: '.complete-btn', all: true, en: 'Mark complete' },
    { selector: '.outro-title', en: 'You are ready.' },
    { selector: '.outro-text', en: 'You have gone through seven levels — from simple chat to multi-agent orchestrator. Now it is practice. The more you use it, the better you get. Once you feel confident, continue exploring more specific IT paths.' },
    { selector: '.outro-cta', en: 'Continue to IT Paths &rarr;' },
    { selector: '#reset-btn', en: 'Reset progress from the beginning' },
    { selector: '.made-by', en: 'Made by <a href="../../" class="made-by-link">Zrov</a>' }
  ];

  var originals = [];

  function safeGet(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function normalizeLang(lang) {
    return supported[lang] ? lang : 'id';
  }

  function forEachTarget(mapping, cb) {
    var nodes = mapping.all
      ? document.querySelectorAll(mapping.selector)
      : [document.querySelector(mapping.selector)];
    Array.prototype.forEach.call(nodes, function (node) {
      if (node) cb(node);
    });
  }

  function captureOriginals() {
    originals = [];
    mappings.forEach(function (mapping) {
      forEachTarget(mapping, function (node) {
        originals.push({
          node: node,
          attr: mapping.attr || null,
          value: mapping.attr ? node.getAttribute(mapping.attr) : node.innerHTML
        });
      });
    });
  }

  function restoreOriginals() {
    originals.forEach(function (item) {
      if (item.attr) item.node.setAttribute(item.attr, item.value);
      else item.node.innerHTML = item.value;
    });
  }

  function applyEnglish() {
    mappings.forEach(function (mapping) {
      forEachTarget(mapping, function (node) {
        if (mapping.attr) node.setAttribute(mapping.attr, mapping.en);
        else node.innerHTML = mapping.en;
      });
    });
  }

  function updateButtons(lang) {
    Array.prototype.forEach.call(document.querySelectorAll('.lang-btn[data-lang]'), function (button) {
      var active = button.getAttribute('data-lang') === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyLang(lang, options) {
    lang = normalizeLang(lang);
    restoreOriginals();
    if (lang === 'en') applyEnglish();
    document.documentElement.lang = lang;
    document.title = ui[lang].title;
    updateButtons(lang);
    safeSet(STORAGE_KEY, lang);
    if (!options || !options.silent) {
      document.dispatchEvent(new CustomEvent('ai-learn-langchange', { detail: { lang: lang } }));
    }
  }

  function init() {
    captureOriginals();
    var initialLang = normalizeLang(safeGet(STORAGE_KEY, document.documentElement.lang || 'id'));
    Array.prototype.forEach.call(document.querySelectorAll('.lang-btn[data-lang]'), function (button) {
      button.addEventListener('click', function () {
        applyLang(button.getAttribute('data-lang'));
      });
    });
    applyLang(initialLang, { silent: true });
  }

  window.AiLearnI18n = {
    getLang: function () { return normalizeLang(safeGet(STORAGE_KEY, 'id')); },
    setLang: applyLang,
    t: function (key) {
      var lang = this.getLang();
      return (ui[lang] && ui[lang][key]) || (ui.id && ui.id[key]) || key;
    },
    formatProgress: function (n, total) {
      var formatter = this.t('progress');
      return typeof formatter === 'function' ? formatter(n, total) : (n + ' / ' + total);
    }
  };

  init();
})();
