interface Prompts {
  userPrompt: string;
  systemPrompt: string;
}

function pick<T>(arr: T[], override?: T | undefined) {
  return override ?? arr[Math.floor(Math.random() * arr.length)];
}

export function makePrompts(
  topic?: string,
  opts?: { format?: string; tone?: string; pov?: string }
): Prompts {
  const blogTopic = topic || "a random general topic";

  const FORMATS = [
    "How-to / Tutorial",
    "Deep-dive / Explainer",
    "Case study",
    "Opinion / Contrarian take",
    "Pros & Cons / Balanced comparison",
  ];
  const TONES = [
    "friendly conversational",
    "professional & authoritative",
    "curious / reflective",
    "empathetic & supportive",
    "neutral / objective (journalistic)",
    "academic / citation-ready",
  ];
  const POVS = [
    "beginner-friendly (step-by-step)",
    "expert-level (technical depth)",
    "busy professional (concise, actionable)",
    "student (teaching-first)",
    "skeptic (addresses objections)",
    "enthusiast (passionate, example-rich)",
  ];

  const chosenFormat = pick(FORMATS, opts?.format);
  console.log("Chosen format:", chosenFormat);
  const chosenTone = pick(TONES, opts?.tone);
  console.log("Chosen tone:", chosenTone);
  const chosenPov = pick(POVS, opts?.pov);
  console.log("Chosen POV:", chosenPov);

  const userPrompt = `Write a detailed blog post about "${blogTopic}" **using proper Markdown syntax**.

Requirements and variability rules (follow exactly):
- Output format: **A single-line title at the top**, then a single blank line, then the article content (Markdown). Do NOT repeat the title inside the article body.
- Title: create an engaging title that accurately reflects the article content.
- Article type / format: ${chosenFormat}.
- Tone / voice: ${chosenTone}.
- POV / audience: ${chosenPov}.
- Structure: use Markdown headings/subheadings (##, ###...) to create a clear structure. Vary heading wording and depth between runs.
- Originality: do not reuse sentences, paragraphs, or cliches from other articles on the same topic. Use fresh metaphors, fresh examples, or a different angle each time.
- Examples & specifics: include at least one concrete example, analogy, tiny case, or actionable step that is *unique to this article* (not a generic sentence).
- Length: aim for approximately 350-500 words.
- Style rules: vary sentence openings and paragraph length to change rhythm; avoid repeating stock phrases and common intros.
- Output-only rule: return **only** the Markdown article (title line, blank line, then content). No explanations, no meta-comments, no JSON, no backticks.`;

  const systemPrompt = `You are an expert blog writer. Produce high-quality, original blog posts in Markdown. Important: when asked repeatedly about the same topic, intentionally vary format, tone, POV, opening hook, structure, and examples so the outputs are not repetitive. Follow the user's constraints (title line, blank line, then content) exactly and return only the Markdown article (no extra commentary).`;

  return { userPrompt, systemPrompt };
}
