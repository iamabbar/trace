export function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-tertiary hairline-faint border-t py-6 text-sm md:border-t-0">
      {message}
    </p>
  )
}
