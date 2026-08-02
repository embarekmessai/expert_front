import type { LucideIcon } from 'lucide-react';

declare module '@tanstack/react-router' {
    interface StaticDataRouteOption {
        breadcrumb?: BreadcrumbItem;
    }
}

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: Omit<NavItem, 'children'|'icon'>[];
};
