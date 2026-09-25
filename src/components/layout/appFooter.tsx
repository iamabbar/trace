export function AppFooter() {
  return (
    <footer className="border-border text-muted-foreground mt-auto flex flex-col gap-2 border-t px-4 py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
      <span>trace</span>
      <span className="text-pretty">
        Lab results vary between runs. Compare several runs before drawing conclusions.
      </span>
    </footer>
  )
}
