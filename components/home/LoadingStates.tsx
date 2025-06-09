"use client"

export function HeroSectionLoading() {
  return (
    <div className="h-[70vh] min-h-[500px] bg-muted animate-pulse relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-green-700/10"></div>
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="space-y-4 max-w-2xl">
          <div className="h-12 bg-muted-foreground/10 rounded-lg w-3/4"></div>
          <div className="h-6 bg-muted-foreground/10 rounded-lg w-1/2"></div>
          <div className="h-12 bg-muted-foreground/10 rounded-lg w-40"></div>
        </div>
      </div>
    </div>
  )
}

export function CategorySectionLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ProductSectionLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-8 bg-muted-foreground/10 rounded-lg w-64 mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted-foreground/10 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted-foreground/10 rounded w-3/4"></div>
              <div className="h-4 bg-muted-foreground/10 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 