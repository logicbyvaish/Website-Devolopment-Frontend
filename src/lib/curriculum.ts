export interface Concept {
  title: string
  body: string
  code: string
}

export interface QuizQ {
  q: string
  options: string[]
  answer: number
}

export interface Layer {
  id: string
  num: string
  name: string
  title: string
  color: string
  glow: string
  tagline: string
  intro: string
  concepts: Concept[]
  caseStudy: { company: string; text: string; stat: string }
  quiz: QuizQ[]
  forge: 'dom' | 'style' | 'js' | 'framework' | 'perf'
}

export const LAYERS: Layer[] = [
  {
    id: 'html',
    num: '01',
    name: 'HTML',
    title: 'The Skeleton',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.35)',
    tagline: 'Every world needs bones. You forge them from tags.',
    intro:
      'HTML is not code you "run" — it is matter you declare. Each tag you write summons a node into the DOM: a living tree the browser holds in memory. Master the tree, and every page on Earth becomes legible to you.',
    forge: 'dom',
    concepts: [
      {
        title: 'Tags Summon Nodes',
        body:
          'An element is an opening tag, contents, and a closing tag. The browser reads it once and builds an object in memory — the DOM node. You are not writing text. You are declaring structure.',
        code: `<article>\n  <h1>First Light</h1>\n  <p>Hello, world under construction.</p>\n</article>`,
      },
      {
        title: 'The Tree Is Everything',
        body:
          'Nodes nest inside nodes. Parent, child, sibling — the whole page is one tree rooted at <html>. CSS selects branches of it. JavaScript mutates it. Learn to see the tree, not the text.',
        code: `html\n├── head\n│   └── title\n└── body\n    ├── header\n    └── main\n        └── section`,
      },
      {
        title: 'Semantics Are Power',
        body:
          '<div> is a crate. <nav>, <main>, <article> are labeled machinery. Semantic tags give search engines, screen readers, and future-you a map of intent — for free.',
        code: `<nav aria-label="Primary">\n  <a href="/forge">Forge</a>\n  <a href="/guild">Guild</a>\n</nav>`,
      },
    ],
    caseStudy: {
      company: 'GOV.UK',
      text:
        'The UK government rebuilt thousands of services on strict semantic HTML first. Result: pages that work on a 2G phone, a screen reader, and a smart fridge — before a single line of JS loads.',
      stat: 'HTML-first pages render in < 1s on 75% of devices worldwide',
    },
    quiz: [
      {
        q: 'What does the browser build when it parses your HTML?',
        options: ['A stylesheet', 'The DOM tree', 'A JavaScript bundle', 'A database'],
        answer: 1,
      },
      {
        q: 'Which tag tells assistive tech "this is the main navigation"?',
        options: ['<div class="nav">', '<span>', '<nav>', '<b>'],
        answer: 2,
      },
      {
        q: 'In the DOM, <li> elements inside the same <ul> are…',
        options: ['Parents', 'Siblings', 'Ancestors', 'Orphans'],
        answer: 1,
      },
    ],
  },
  {
    id: 'css',
    num: '02',
    name: 'CSS',
    title: 'The Skin & Physics',
    color: '#ff2ec4',
    glow: 'rgba(255,46,196,0.35)',
    tagline: 'Structure without style is a wireframe ghost. Give it form.',
    intro:
      'CSS is a physics engine for rectangles. Every element is a box wrapped in four layers — content, padding, border, margin — and layout systems like Flexbox and Grid decide how those boxes negotiate space. Peel the layers below.',
    forge: 'style',
    concepts: [
      {
        title: 'The Box Model',
        body:
          'Content sits at the core. Padding is inner breathing room. Border is armor. Margin is personal space that pushes neighbors away. Every layout bug you will ever have lives in one of these four rings.',
        code: `.card {\n  padding: 24px;   /* inner space */\n  border: 2px solid;\n  margin: 16px;    /* outer push */\n  box-sizing: border-box;\n}`,
      },
      {
        title: 'Flexbox: One-Axis Negotiation',
        body:
          'A flex container lines children up on an axis and hands out leftover space. justify-content positions them; gap separates them; flex-grow lets them expand. It is the diplomacy protocol of layout.',
        code: `.row {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n}`,
      },
      {
        title: 'Grid: The Holographic Floor',
        body:
          'Grid draws a 2D field of tracks first, then snaps elements onto it. Rows AND columns, named areas, fractional units. When a layout is two-dimensional, Grid is the answer.',
        code: `.hall {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2rem;\n}`,
      },
    ],
    caseStudy: {
      company: 'Stripe',
      text:
        'Stripe\u2019s famously polished UI is mostly ruthless box-model discipline: consistent spacing scales, flex for toolbars, grid for dashboards. No layout library — just CSS fundamentals executed perfectly.',
      stat: 'A consistent 4px spacing scale powers their entire design system',
    },
    quiz: [
      {
        q: 'Which layer of the box model pushes OTHER elements away?',
        options: ['Padding', 'Border', 'Margin', 'Content'],
        answer: 2,
      },
      {
        q: 'justify-content: space-between does what?',
        options: [
          'Centers items with equal gaps everywhere',
          'Pins first & last items to the edges, spreads the rest',
          'Stacks items vertically',
          'Shrinks all items equally',
        ],
        answer: 1,
      },
      {
        q: 'You need rows AND columns controlled together. Reach for…',
        options: ['float', 'Flexbox', 'position: absolute', 'CSS Grid'],
        answer: 3,
      },
    ],
  },
  {
    id: 'js',
    num: '03',
    name: 'JAVASCRIPT',
    title: 'The Nervous System',
    color: '#ffd60a',
    glow: 'rgba(255,214,10,0.35)',
    tagline: 'Now the world moves. Data flows through pathways you design.',
    intro:
      'JavaScript is the electricity. Variables are containers for values, functions are machines that transform input into output, and async code is time travel — promising results from a future that hasn\u2019t happened yet. Fire a packet through the neural net below.',
    forge: 'js',
    concepts: [
      {
        title: 'Variables Are Containers',
        body:
          'let declares a container you can refill. const seals the container shut. Strings, numbers, booleans slot in directly; objects and arrays are chests holding many labeled values at once.',
        code: `const guild = {\n  name: 'Stack Divers',\n  members: 128,\n}\nlet rank = 'apprentice'\nrank = 'artisan' // let allows refills`,
      },
      {
        title: 'Functions: Input → Process → Output',
        body:
          'A function is a forge: raw material goes in, transformed material comes out. Pure functions (same input, same output, no side effects) are the most trustworthy machines you can build.',
        code: `const smelt = (ore) => ore.trim().toUpperCase()\n\nsmelt('  iron ')  // 'IRON'\nsmelt('  iron ')  // 'IRON' — always`,
      },
      {
        title: 'Async: Branching Timelines',
        body:
          'fetch() returns a Promise — an IOU from the future. await pauses your timeline until the IOU is paid, without freezing the page. The event loop keeps every other timeline running meanwhile.',
        code: `async function scout() {\n  const res = await fetch('/api/map')\n  const map = await res.json()\n  return map.regions\n}`,
      },
    ],
    caseStudy: {
      company: 'Figma',
      text:
        'Figma\u2019s multiplayer canvas is an event-loop masterclass: every cursor move, edit, and sync is an async message flowing through carefully non-blocking JS pathways — thousands per second, zero frozen frames.',
      stat: 'Real-time sync round-trips in ~33ms while the UI never blocks',
    },
    quiz: [
      {
        q: 'Which declaration can be reassigned later?',
        options: ['const', 'let', 'Neither', 'Both'],
        answer: 1,
      },
      {
        q: 'A pure function is one that…',
        options: [
          'Never takes arguments',
          'Always returns the same output for the same input, no side effects',
          'Only works with numbers',
          'Runs asynchronously',
        ],
        answer: 1,
      },
      {
        q: 'await does what to a Promise?',
        options: [
          'Cancels it',
          'Converts it to a string',
          'Pauses this async function until it resolves',
          'Freezes the whole browser',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'frameworks',
    num: '04',
    name: 'FRAMEWORKS',
    title: 'The Living Architecture',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    tagline: 'Stop building rooms by hand. Grow them from components.',
    intro:
      'React grows your UI as a component tree — each branch a reusable machine with its own state. When state changes, only the affected branches re-render and glow. Behind it, Node.js runs the server: an endless train loop of requests in, responses out.',
    forge: 'framework',
    concepts: [
      {
        title: 'Components: Grown, Not Built',
        body:
          'A component is a function that returns UI. Compose small ones into big ones and your interface becomes a living tree — prune, graft, and replant branches anywhere.',
        code: `function Badge({ rank }) {\n  return <span className="badge">{rank}</span>\n}\n\n<Profile>\n  <Badge rank="artisan" />\n</Profile>`,
      },
      {
        title: 'State Makes Branches Glow',
        body:
          'useState gives a branch memory. Call the setter and React re-renders just that subtree — the glow you see in the visualization is exactly what React\u2019s reconciler does internally.',
        code: `const [count, setCount] = useState(0)\n\n<button onClick={() => setCount(c => c + 1)}>\n  Forged {count} items\n</button>`,
      },
      {
        title: 'Node.js: The Request Train',
        body:
          'A server is a loop: request arrives at the station, your handler loads it with data, the response departs. Node runs this loop on the same JS you already speak — one language, full stack.',
        code: `app.get('/api/guild', (req, res) => {\n  res.json({ members: 128 })\n})\n\napp.listen(3000)`,
      },
    ],
    caseStudy: {
      company: 'Netflix',
      text:
        'Netflix serves its entire UI from a React component tree and moved its edge services to Node.js — one language across browser and server cut their startup time and let UI and API teams share code.',
      stat: '70% faster startup after moving the edge tier to Node.js',
    },
    quiz: [
      {
        q: 'When state changes in React, what re-renders?',
        options: [
          'The whole page, always',
          'Nothing until you refresh',
          'The affected component subtree',
          'Only the <body> tag',
        ],
        answer: 2,
      },
      {
        q: 'A React component is fundamentally…',
        options: [
          'A CSS class',
          'A function that returns UI',
          'A database table',
          'An HTML file',
        ],
        answer: 1,
      },
      {
        q: 'In the request/response cycle, your Node handler sits…',
        options: [
          'In the browser',
          'Between the incoming request and the outgoing response',
          'Inside the CSS engine',
          'After the response is already sent',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'advanced',
    num: '05',
    name: 'ADVANCED',
    title: 'The Optimized Metropolis',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.4)',
    tagline: 'Your city stands. Now make it fast enough to feel alive.',
    intro:
      'Performance is architecture. Every kilobyte you ship is a building your users\u2019 devices must construct. Shrink the skyline: split bundles, lazy-load districts, compress everything. Then face the Gauntlet and claim your place in the guild.',
    forge: 'perf',
    concepts: [
      {
        title: 'The Weight of a Kilobyte',
        body:
          'JS costs triple: download, parse, execute. A 500KB bundle can take 3+ seconds of CPU on a mid-range phone. Code-splitting ships only the district the user is standing in.',
        code: `// Ship the map screen only when needed\nconst MapView = lazy(() =>\n  import('./MapView')\n)`,
      },
      {
        title: 'Measure, Then Cut',
        body:
          'Core Web Vitals are your city inspectors: LCP (how fast the skyline appears), INP (how fast buildings respond), CLS (whether they jump around). Optimize what you measure, never what you guess.',
        code: `// Chrome DevTools → Lighthouse\nLCP  < 2.5s   ✓ skyline visible\nINP  < 200ms  ✓ instant response\nCLS  < 0.1    ✓ stable ground`,
      },
      {
        title: 'WebAssembly: Merged Streams',
        body:
          'When JS hits its speed ceiling, WASM lets compiled languages (Rust, C++) flow into the same runtime — near-native compute for video editing, games, and simulations, right in the tab.',
        code: `const { instance } = await\n  WebAssembly.instantiateStreaming(\n    fetch('physics.wasm')\n  )\ninstance.exports.simulate(60)`,
      },
    ],
    caseStudy: {
      company: 'Shopify',
      text:
        'Shopify treats performance as revenue: every 100ms of load time measurably moves conversion. Their storefronts aggressively code-split, stream HTML, and defer JS — the shrinking-city playbook at planetary scale.',
      stat: 'Each 100ms saved ≈ up to 7% conversion lift on storefronts',
    },
    quiz: [
      {
        q: 'Why is 500KB of JS worse than 500KB of an image?',
        options: [
          'It isn\u2019t — bytes are bytes',
          'JS must also be parsed and executed on the CPU',
          'Images are always cached',
          'JS downloads slower physically',
        ],
        answer: 1,
      },
      {
        q: 'LCP measures…',
        options: [
          'How many libraries you use',
          'How fast the largest content becomes visible',
          'Total lines of code',
          'Server RAM usage',
        ],
        answer: 1,
      },
      {
        q: 'WebAssembly is best suited for…',
        options: [
          'Styling buttons',
          'Writing HTML faster',
          'CPU-heavy compute like games and video processing',
          'Replacing all JavaScript everywhere',
        ],
        answer: 2,
      },
    ],
  },
]

export const GAUNTLET: QuizQ[] = [
  {
    q: 'BUG: A screen reader can\u2019t find your navigation. The fix?',
    options: ['Add more <div>s', 'Use <nav> with a label', 'Add color: blue', 'Use <table>'],
    answer: 1,
  },
  {
    q: 'BUG: An element\u2019s width is 20px bigger than expected. First suspect?',
    options: ['The DNS server', 'Padding/border without box-sizing: border-box', 'A typo in JS', 'The GPU'],
    answer: 1,
  },
  {
    q: 'BUG: "Cannot read properties of undefined" after a fetch. Likely cause?',
    options: [
      'You used data before the Promise resolved',
      'CSS is broken',
      'The HTML is invalid',
      'Node.js is offline',
    ],
    answer: 0,
  },
  {
    q: 'BUG: A React list re-renders chaotically when items reorder. Missing…',
    options: ['A stable key prop on each item', 'More useState', 'An extra <div>', 'jQuery'],
    answer: 0,
  },
  {
    q: 'BUG: API returns 404 on POST /api/users. First thing to check?',
    options: [
      'The user\u2019s wifi',
      'That the server defines a POST route at that exact path',
      'The CSS grid',
      'Browser zoom level',
    ],
    answer: 1,
  },
  {
    q: 'Your app scores LCP 4.8s. Highest-impact first move?',
    options: [
      'Rename your variables',
      'Add more animations',
      'Cut/split the render-blocking JS and compress the hero asset',
      'Switch code editor themes',
    ],
    answer: 2,
  },
]
