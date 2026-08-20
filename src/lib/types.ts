import type { FC } from 'react';

export interface SceneProps {
  step: number;
}

export interface SceneDef {
  id: string;
  title: string;
  /** number of internal animation states, 1-indexed for humans, addressed 0..steps-1 */
  steps: number;
  optional?: boolean;
  notes?: string;
  Component: FC<SceneProps>;
}

export interface SectionDef {
  id: string;
  title: string;
  eyebrow: string;
  optional?: boolean;
  scenes: SceneDef[];
}

export interface FlatScene extends SceneDef {
  sectionId: string;
  sectionTitle: string;
  sectionEyebrow: string;
  sectionIndex: number;
}

export const STAGE_W = 1600;
export const STAGE_H = 900;
