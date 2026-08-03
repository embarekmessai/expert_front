import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
// import { DynamicIcon } from 'lucide-react/dynamic';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';


export function NavMain({ items = [] }: { items: NavItem[] }) {
    // const page = { url: window.location.href };
    const { direction } = { direction: 'ltr' };
    const { isCurrentUrl } = useCurrentUrl();

    // const activeAccordion = (slug: string) => {
    //     return routeSecondSegment(page.url) === slug;
    // };

    // const activeRoute = (slug: string) => {
    //     return routeLastSegment(page.url) === slug;
    // };

    return (
        <SidebarGroup className="px-2 py-0">
            <Accordion type="single" collapsible >
                <SidebarGroupLabel>MENU</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.children && item.children.length > 0 ? (
                                <AccordionItem value={item.title} className="border-0">
                                    <AccordionTrigger
                                        className={cn(
                                            'flex items-center pe-2 cursor-pointer hover:no-underline h-9 py-0 hover:bg-sidebar-accent',
                                            item.isActive && 'bg-sidebar-accent',
                                            direction === 'rtl' && 'pr-0',
                                        )}
                                    >
                                        {/* <SidebarMenuButton
                                            isActive={item.isAct}
                                            tooltip={{ children: item.title }}
                                        >

                                            <Link href={item.href} prefetch>
                                                {item.icon &&
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton> */}
                                        <SidebarMenuButton
                                            asChild
                                            className="h-9"
                                        >
                                             <Link to={item.href} className="flex gap-2 items-center">
                                                {/* {item.icon &&
                                                <DynamicIcon name="camera" size="16" />} */}
                                                <span className="text-sm font-normal capitalize">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </AccordionTrigger>
                                    <AccordionContent className={cn('space-y-1 py-2', direction === 'rtl' && 'pr-0')}>
                                        {item.children.map((child, index) => {
                                            const { title: name, href: path } = child;
                                            return (
                                                <SidebarMenuButton asChild key={index} isActive={isCurrentUrl(path)} className="h-9 px-3">
                                                    <Link to={path}>
                                                        <Dot className="w-12" />
                                                        <span className="text-sm font-normal capitalize">{name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>

                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    className="h-9"
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >

                                    <Link to={item.href} className="flex gap-2 items-center">
                                        {/* {item.icon &&
                                        <DynamicIcon name="camera" size="16" />} */}
                                        <span className="text-sm font-normal capitalize">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </Accordion>
        </SidebarGroup>
    );
}
