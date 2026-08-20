export default function Footer({ notes, showNotes }: { notes?: string; showNotes: boolean }) {
  return (
    <div className="w-full shrink-0 px-6 flex items-center justify-between" style={{ height: 30, borderTop: '1px solid var(--color-line-soft)' }}>
      <span className="font-mono text-[10.5px]" style={{ color: 'var(--color-ink-600)' }}>
        &larr; / &rarr; navigate &nbsp;&middot;&nbsp; space next &nbsp;&middot;&nbsp; home/end jump &nbsp;&middot;&nbsp; s skip section &nbsp;&middot;&nbsp; n notes &nbsp;&middot;&nbsp; f fullscreen
      </span>
      {showNotes && notes && (
        <span className="font-body text-[12px] italic truncate max-w-[50%]" style={{ color: 'var(--color-amber)' }}>
          {notes}
        </span>
      )}
    </div>
  );
}
