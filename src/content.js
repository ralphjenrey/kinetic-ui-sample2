// Replace the sample identity and projects with your own details.
// Contact actions appear automatically when real values are provided.
export const profile = {
  name: 'Your name',
  role: 'Software engineer',
  email: '',
  github: '',
  linkedin: '',
  intro: 'I turn complex problems into clear, considered digital experiences. From the interface to the infrastructure, I care about the details that make software feel effortless.',
  about: 'I’m interested in the space where thoughtful design meets solid engineering. I enjoy taking an idea apart, understanding what matters, and putting it back together as something people can actually use.',
};

export const projects = [
  {
    id: 'orbit', name: 'Orbit', type: 'Full stack', category: 'Product engineering',
    subtitle: 'A little less managing. A lot more making.',
    description: 'A focused workspace that brings projects, tasks, and the people behind them into one clear view.',
    stack: ['React', 'Node.js', 'PostgreSQL'], preview: 'workspace',
    overview: 'This sample concept explores a project workspace built around a simple question: what needs your attention today? A compact overview gives way to a detailed project board without losing context.',
    decisions: ['Model projects, tasks, and memberships with explicit ownership.', 'Keep filters and selected views in the URL for shareable context.', 'Use optimistic updates with clear recovery when a request fails.'],
  },
  {
    id: 'pulse', name: 'Pulse', type: 'Frontend', category: 'Data visualization',
    subtitle: 'Making the signal easier to see.',
    description: 'An analytics interface that turns a busy stream of data into a readable story.',
    stack: ['React', 'SVG', 'CSS'], preview: 'analytics',
    overview: 'This sample analytics concept puts the trend before the number. It explores accessible chart styling, a clear time-range control, and a layout that stays readable on small screens.',
    decisions: ['Pair every chart with a plain-text summary.', 'Build responsive charts with SVG rather than large image assets.', 'Keep loading, empty, and error states within the chart region.'],
  },
  {
    id: 'snippet', name: 'Snippet', type: 'Tools', category: 'Developer experience',
    subtitle: 'Good code deserves a second use.',
    description: 'A searchable home for the small pieces of code you reach for again and again.',
    stack: ['JavaScript', 'Search', 'Local storage'], preview: 'code',
    overview: 'This sample developer-tool concept explores quick retrieval, readable code, and a keyboard-friendly interface. The emphasis is on getting back to work with fewer interruptions.',
    decisions: ['Normalize search terms so names and tags are easy to find.', 'Keep snippets local by default and make export explicit.', 'Support copying with visible confirmation and an error fallback.'],
  },
];
