import type { RouteKey } from '../i18n/routes';

export const PROJECT_CATEGORIES = ['rivning', 'sanering', 'håltagning', 'nybyggnad', 'ombyggnad'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const SERVICE_IDS = ['rivning', 'sanering', 'haltagning', 'nybyggnation', 'ombyggnad', 'avfall'] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/** Service → route, image and which project categories to show on its page. */
export const SERVICES: Record<ServiceId, { route: RouteKey; image: string; categories: ProjectCategory[] }> = {
  rivning: { route: 'service.rivning', image: 'placeholders/service-rivning.jpg', categories: ['rivning'] },
  sanering: { route: 'service.sanering', image: 'placeholders/service-sanering.jpg', categories: ['sanering'] },
  haltagning: { route: 'service.haltagning', image: 'placeholders/service-haltagning.jpg', categories: ['håltagning'] },
  nybyggnation: { route: 'service.nybyggnation', image: 'placeholders/service-nybyggnation.jpg', categories: ['nybyggnad'] },
  ombyggnad: { route: 'service.ombyggnad', image: 'placeholders/service-ombyggnad.jpg', categories: ['ombyggnad'] },
  avfall: { route: 'service.avfall', image: 'placeholders/service-avfall.jpg', categories: ['rivning'] },
};
