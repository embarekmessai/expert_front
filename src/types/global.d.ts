import type { Auth } from '@/types/auth';
import type { Team } from '@/types/teams';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            currentTeam: Team | null;
            teams: Team[];
            menuItems: NavItem[];
            [key: string]: unknown;
        };
    }

}
export interface SharedData {
    auth: Auth;
    appearance: 'light' | 'dark' | 'system';
    ziggy: Config & { location: string };
    system: Settings<SystemFields>;
    notifications: Notification[];
    flash: {
        error: string;
        warning: string;
        success: string;
    };
    langs: Language[];
    locale: string;
    direction: 'ltr' | 'rtl';
    daysToWebinar?: number;
    menuItems: NavItem[];
    [key: string]: unknown;
}

export interface TableCommon {
    id: number | string;
    created_at: string;
    updated_at: string;
}

export interface Pagination<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface Notification extends TableCommon {
   type: string;
   read_at: string | null;
   data: { title: string; body: string; url?: string };
   notifiable_id: number;
   notifiable_type: string;
}
