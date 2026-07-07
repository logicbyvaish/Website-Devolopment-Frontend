export default function CodeBlock({ code, color }: { code: string; color: string }) {
  return (
    <pre
      className="glass rounded-lg p-4 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto whitespace-pre"
      style={{ borderLeft: `3px solid ${color}`, color: '#cfd0e4' }}
    >
      <code>{code}</code>
    </pre>
  )
}
