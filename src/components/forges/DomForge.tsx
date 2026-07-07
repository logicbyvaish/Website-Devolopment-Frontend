import { useMemo, useState } from 'react'

/**
 * Pedagogy: learners TYPE real HTML and watch the DOM tree materialize
 * node-by-node — making the invisible parse step visible.
 */
const STARTER = `<main>\n  <h1>My First World</h1>\n  <section>\n    <p>Built from tags.</p>\n    <a href="#">Enter</a>\n  </section>\n</main>`

interface TreeNode {
  tag: string
  children: TreeNode[]
  text?: string
}

function parseTree(html: string): TreeNode[] {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const walk = (el: Element): TreeNode => ({
      tag: el.tagName.toLowerCase(),
      text: Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent?.trim())
        .join(' ')
        .trim()
        .slice(0, 24),
      children: Array.from(el.children).map(walk),
    })
    return Array.from(doc.body.children).map(walk)
  } catch {
    return []
  }
}

function Node({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <div className="node-grow" style={{ animationDelay: `${depth * 80}ms` }}>
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded text-[11px] font-bold"
          style={{
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.45)',
            color: '#22d3ee',
            boxShadow: '0 0 12px rgba(34,211,238,0.25)',
          }}
        >
          &lt;{node.tag}&gt;
        </span>
        {node.text ? <span className="text-[11px] text-dim truncate max-w-[130px]">“{node.text}”</span> : null}
      </div>
      {node.children.length > 0 && (
        <div className="ml-3 mt-1.5 pl-3 space-y-1.5" style={{ borderLeft: '1px dashed rgba(34,211,238,0.35)' }}>
          {node.children.map((c, i) => (
            <Node key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DomForge() {
  const [html, setHtml] = useState(STARTER)
  const tree = useMemo(() => parseTree(html), [html])
  const count = useMemo(() => {
    let n = 0
    const c = (t: TreeNode) => {
      n++
      t.children.forEach(c)
    }
    tree.forEach(c)
    return n
  }, [tree])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-dim">// type html — the tree grows live</span>
        </div>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          spellCheck={false}
          aria-label="HTML editor — type markup to grow the DOM tree"
          className="glass w-full h-56 rounded-lg p-4 text-[13px] leading-relaxed resize-none outline-none focus:ring-1"
          style={{ color: '#a5f3fc', caretColor: '#22d3ee', borderLeft: '3px solid #22d3ee' }}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-dim">// live dom tree</span>
          <span className="text-[11px] font-bold" style={{ color: '#22d3ee' }}>
            {count} node{count === 1 ? '' : 's'} summoned
          </span>
        </div>
        <div className="glass rounded-lg p-4 h-56 overflow-auto space-y-2" role="tree" aria-label="Live DOM tree visualization">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/5 border border-white/15 text-ink">&lt;body&gt;</span>
            <span className="text-[11px] text-dim">root</span>
          </div>
          <div className="ml-3 pl-3 space-y-1.5" style={{ borderLeft: '1px dashed rgba(34,211,238,0.35)' }}>
            {tree.length === 0 ? (
              <p className="text-[12px] text-dim">The void awaits your first tag…</p>
            ) : (
              tree.map((n, i) => <Node key={i} node={n} depth={0} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
