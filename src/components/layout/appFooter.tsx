export function AppFooter() {
  return (
    <footer className="border-low border-t">
      <div className="text-tertiary mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 px-[clamp(16px,4vw,32px)] py-5 text-xs">
        <span className="text-secondary font-semibold">trace</span>
        <span>
          Lab results vary between runs. Compare several runs before drawing conclusions.
        </span>
      </div>
    </footer>
  )
}
