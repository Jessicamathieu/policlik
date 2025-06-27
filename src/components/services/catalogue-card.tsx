
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit3, Trash2, Briefcase, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CatalogueItem } from '@/app/(app)/services/page';
import { Skeleton } from '../ui/skeleton';

interface CatalogueCardProps {
  item: CatalogueItem;
}

export function CatalogueCard({ item }: CatalogueCardProps) {
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {item.name}
          </CardTitle>
          <CardDescription>
            {item.category} {item.subCategory && `> ${item.subCategory}`}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:bg-muted/50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions pour {item.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Edit3 className="mr-2 h-4 w-4 text-primary" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-2">
        <div className="flex justify-between items-center">
            <Badge variant="outline" className={cn('font-medium', item.itemType === 'Service' ? 'border-sky-300 text-sky-800 bg-sky-50' : 'border-lime-300 text-lime-800 bg-lime-50')}>
                {item.itemType === 'Service' ? <Briefcase className="mr-1 h-3 w-3" /> : <Package className="mr-1 h-3 w-3" />}
                {item.itemType}
            </Badge>
            {item.price && <span className="font-semibold text-lg">CAD${item.price.toFixed(2)}</span>}
        </div>
        <p className="text-xs text-muted-foreground">
            Code: {'code' in item && item.code ? item.code : 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
}

export function CatalogueCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-muted" />
                    <Skeleton className="h-4 w-24 bg-muted" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                    <Skeleton className="h-7 w-20 bg-muted" />
                </div>
                 <Skeleton className="h-4 w-20 bg-muted" />
            </CardContent>
        </Card>
    );
}
