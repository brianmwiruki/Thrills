import { Card, CardContent } from '@/components/ui/card';

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse overflow-hidden">
          <div className="aspect-square bg-muted/30" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-muted/40 rounded w-3/4" />
            <div className="h-3 bg-muted/30 rounded w-1/2" />
            <div className="h-5 bg-muted/20 rounded w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 