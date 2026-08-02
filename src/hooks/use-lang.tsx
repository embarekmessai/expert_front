import type { SharedData } from "#/types/global";

export function useLang() {
   const { props } = window as unknown as { props: SharedData };

   return props.translate;
}
