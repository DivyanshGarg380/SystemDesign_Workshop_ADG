<img src="./assets/adg-logo.png" width="96" alt="ADG logo" />

# HLD Workshop
*What Actually Happens When You Tap a Button?*

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

An interactive, keyboard-driven, non-scrolling slide deck for the MIT Manipal High-Level
System Design workshop. Built with React + TypeScript + Framer Motion + Tailwind CSS v4.

No slides in the PowerPoint sense — every "slide" is a live scene where request packets,
servers, caches, and queues visually animate to explain the concept, not decorate it.

## Controls

| Key | Action |
|---|---|
| `→` / `Space` | Advance to the next animation state / scene |
| `←` | Go back one state / scene |
| `Home` | Jump to the very first scene |
| `End` | Jump to the closing scene |
| `S` | Skip the rest of the current section (handy for the flex sections if short on time) |
| `N` | Toggle the presenter note for the current scene (small, bottom-right, not visible to the audience unless you say so) |
| `F` | Toggle fullscreen |

The top bar shows section progress (13 sections total) and which scene you're on within
the section. Flex sections are labelled in the top bar so you know at a glance what's
safe to skip.

## Project structure

```
src/
  components/
    stage/          the reusable visual vocabulary: Node, Packet, Edge, Prompt,
                     SceneTitle, MiniUser, Stage (the scaled 16:9 canvas)
    scenes/          one file per workshop section (s0-basics.tsx … s12-closing.tsx),
                     each exporting an array of SceneDef (id, title, steps, Component)
    ProgressBar.tsx, Footer.tsx   chrome around the stage
  data/scenes.tsx    assembles all sections into the flat, ordered scene list
  lib/types.ts       shared types + the 1600x900 stage coordinate system
  lib/helpers.ts     small layout helpers (grid positions, staggered delays)
  App.tsx            the state machine: current scene + current animation step,
                     keyboard handling
```

Every scene component receives a single `step: number` prop and switches its rendered
content/animation based on it — that's the "state machine" model: pressing next
sometimes advances the diagram in place, sometimes moves to a new scene entirely.

The **request packet** (the small pill that travels between nodes) is the one
recurring visual motif — it's introduced in Part 1 and reused, relabeled, all the
way through observability in Part 12.

## Sections / scenes

1. **Web Basics** — title, click-a-button, client & server, request/response,
   the database, APIs & static vs. dynamic content
2. **What Is System Design?** — one server/one database is enough, the core
   principle (start simple, add complexity when a real problem demands it),
   transition into the LabXam story
3. **Exam-Night Traffic** — intro, one server floods, vertical scaling, horizontal
   scaling, the load balancer
4. **Caching** — repeated requests, cache miss (full walk-through), cache hit
   (shorter path, contrasted against the miss)
5. **Large Files & CDN** — the app server strains under file downloads, object
   storage, a distant origin is slow, CDN edge caching is fast
6. **Async Work & Queues** — synchronous work blocks the request, the queue,
   workers draining the queue, publish-subscribe (brief)
7. **AI Requests & Rate Limiting** — one user hammers an expensive AI feature,
   rate limiting, and the full picture: queue + worker + cache working together
8. **Growing Beyond Manipal** *(flex)* — latency and distance, regional
   points of presence
9. **Database Under Strain** *(flex)* — one database strains, read replicas,
   sharding (high-level only)
10. **Something Fails** *(flex)* — health checks, failover ("Server 2 just
    died — what now?"), redundancy & backups
11. **Large-Scale Search** *(flex)* — why a plain query doesn't scale,
    the search index
12. **Knowing What's Broken** *(flex)* — one request leaves a trace, then
    logs vs. metrics vs. tracing
13. **Closing** — recap of every takeaway, closing message

## What's flexible / skippable

Sections 8-12 (geographic distribution, DB scaling/sharding, failover, search,
observability) are flagged as flex in the data model, shown as such in the top
progress bar, and can be jumped past instantly with `S`. The core path
(sections 1-7) is built to comfortably fill 60-90 minutes on its own, matching
the workshop plan's guidance that the first six topics get the most time.

## Audience pause moments

Scenes that are meant to stop and wait for audience guesses (e.g. "What do you
think breaks first?", "Server 2 just died. What now?") render as a distinct
pill prompt at the bottom of the stage and do **not** auto-reveal the answer —
you control the reveal with the next keypress.