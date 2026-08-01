import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function useRoute() {
    const { ziggy } = usePage<SharedData>().props;
    return (name: string, params?: Record<string, string | number | undefined>, absolute?: boolean) =>
        route(name, params, absolute, ziggy);
}
