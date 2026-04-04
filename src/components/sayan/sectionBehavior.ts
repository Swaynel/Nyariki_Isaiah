import type { BotGesture, BotState } from './types';

export type StageSectionId = 'hero' | 'about' | 'skills' | 'projects';

interface SectionBotBehavior {
  side: 'left' | 'right';
  state: BotState;
  gesture: BotGesture;
}

export const SECTION_BOT_BEHAVIOR: Record<Exclude<StageSectionId, 'hero'>, SectionBotBehavior> = {
  about: {
    side: 'right',
    state: 'active',
    gesture: 'present',
  },
  skills: {
    side: 'left',
    state: 'thinking',
    gesture: 'analyze',
  },
  projects: {
    side: 'right',
    state: 'active',
    gesture: 'showcase',
  },
};

export const SECTION_STAGE_SIDE: Record<StageSectionId, 'left' | 'right'> = {
  hero: 'left',
  about: SECTION_BOT_BEHAVIOR.about.side,
  skills: SECTION_BOT_BEHAVIOR.skills.side,
  projects: SECTION_BOT_BEHAVIOR.projects.side,
};
