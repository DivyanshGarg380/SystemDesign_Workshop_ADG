import type { FlatScene, SectionDef } from '../lib/types';
import { section0Scenes } from '../components/scenes/s0-basics';
import { section1Scenes } from '../components/scenes/s1-systemdesign';
import { section2Scenes } from '../components/scenes/s2-scaling';
import { section3Scenes } from '../components/scenes/s3-caching';
import { section4Scenes } from '../components/scenes/s4-cdn';
import { section5Scenes } from '../components/scenes/s5-queues';
import { section6Scenes } from '../components/scenes/s6-ratelimit';
import { section7Scenes } from '../components/scenes/s7-geo';
import { section8Scenes } from '../components/scenes/s8-dbscaling';
import { section9Scenes } from '../components/scenes/s9-failover';
import { section10Scenes } from '../components/scenes/s10-search';
import { section11Scenes } from '../components/scenes/s11-observability';
import { section12Scenes } from '../components/scenes/s12-closing';

export const sections: SectionDef[] = [
  { id: 'basics', eyebrow: 'Part 1', title: 'Web Basics', scenes: section0Scenes },
  { id: 'sysdesign', eyebrow: 'Part 2', title: 'What Is System Design?', scenes: section1Scenes },
  { id: 'scaling', eyebrow: 'Part 3', title: 'Exam-Night Traffic', scenes: section2Scenes },
  { id: 'caching', eyebrow: 'Part 4', title: 'Caching', scenes: section3Scenes },
  { id: 'cdn', eyebrow: 'Part 5', title: 'Large Files & CDN', scenes: section4Scenes },
  { id: 'queues', eyebrow: 'Part 6', title: 'Async Work & Queues', scenes: section5Scenes },
  { id: 'ratelimit', eyebrow: 'Part 7', title: 'AI Requests & Rate Limiting', scenes: section6Scenes },
  { id: 'geo', eyebrow: 'Part 8', title: 'Growing Beyond Manipal', optional: true, scenes: section7Scenes },
  { id: 'dbscaling', eyebrow: 'Part 9', title: 'Database Under Strain', optional: true, scenes: section8Scenes },
  { id: 'failover', eyebrow: 'Part 10', title: 'Something Fails', optional: true, scenes: section9Scenes },
  { id: 'search', eyebrow: 'Part 11', title: 'Large-Scale Search', optional: true, scenes: section10Scenes },
  { id: 'observability', eyebrow: 'Part 12', title: 'Knowing What\u2019s Broken', optional: true, scenes: section11Scenes },
  { id: 'closing', eyebrow: 'Part 13', title: 'Closing', scenes: section12Scenes },
];

export const flatScenes: FlatScene[] = sections.flatMap((section, sectionIndex) =>
  section.scenes.map((scene) => ({
    ...scene,
    optional: scene.optional ?? section.optional,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionEyebrow: section.eyebrow,
    sectionIndex,
  })),
);

export const sectionCount = sections.length;
