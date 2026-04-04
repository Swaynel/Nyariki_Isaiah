export type BotState = 'idle' | 'active' | 'thinking';
export type BotGesture =
  | 'none'
  | 'greeting'
  | 'bow'
  | 'present'
  | 'analyze'
  | 'showcase'
  | 'throw'
  | 'clap';

export interface StageBotBehavior {
  state: BotState;
  gesture: BotGesture;
}

export interface HeroBotSnapshot {
  state: BotState;
  gesture: BotGesture;
  advanceToAbout: boolean;
}
