import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Segment {
  type: 'text' | 'math-inline' | 'math-block';
  content: string;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Matches: $$...$$, \[...\], $...$, \(...\)
  const pattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+?\$|\\\([^)]+?\\\))/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: text.slice(last, match.index) });
    }
    const raw = match[1];
    const isBlock = raw.startsWith('$$') || raw.startsWith('\\[');
    const inner = raw
      .replace(/^\$\$|\$\$$/g, '')
      .replace(/^\\\[|\\\]$/g, '')
      .replace(/^\$|\$$/g, '')
      .replace(/^\\\(|\\\)$/g, '')
      .trim();
    segments.push({ type: isBlock ? 'math-block' : 'math-inline', content: inner });
    last = match.index + raw.length;
  }

  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) });
  }
  return segments;
}

function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, { displayMode, throwOnError: false, output: 'html' });
  } catch {
    return `<span class="text-red-400">[LaTeX Error]</span>`;
  }
}

export default function MathRenderer({ text }: { text: string }) {
  const segments = parseSegments(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.content}</span>;
        }
        if (seg.type === 'math-block') {
          return (
            <span
              key={i}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: renderMath(seg.content, true) }}
            />
          );
        }
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: renderMath(seg.content, false) }}
          />
        );
      })}
    </>
  );
}
