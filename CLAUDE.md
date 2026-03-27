# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MUJTABA SQUASH** — a retro Breakout/Pong arcade game built with vanilla JavaScript and HTML5 Canvas. No framework, no build system, no dependencies. The entire game lives in `index.html` (single file).

## Running the Game

Open `index.html` directly in a browser. No build step, no server required (though a local HTTP server works too).

## Architecture

Everything is in `index.html`. The code is organized into logical sections:

### State Machine
`state` drives the game flow: `'opening'` → `'countdown'` → `'playing'` → `'lost'` → `'gameover'`

Each state has a paired update + draw function:
- `updateOpening` / `drawOpening`
- `updateCountdown` / `drawCountdown`
- `updatePlaying` / `drawPlaying`
- `updateLost` / `drawLost`
- `drawGameover`

### Game Loop
`loop()` runs via `requestAnimationFrame`, dispatches to the current state's update/draw pair.

### Physics
Ball (`ball`) and paddle (`pad`) are plain objects with position and velocity. Collision detection is manual — wall bounces, paddle hits with angle-based response, speed increases every 5 paddle hits (capped at 15).

### Audio
Web Audio API, lazily initialized on first user interaction. `sfx` object holds named sound functions: `wall()`, `paddle()`, `lost()`, `gameover()`, `cd()`.

### Rendering
Canvas 2D at 480×640 internal resolution, scaled to fit the window. Ball renders as `mujtaba.png` sprite (with rotation). Scanline overlay for retro aesthetic.

### Input
Keyboard (arrows/WASD, Space/Enter), mouse position, and touch events all control the paddle. Input is unified through shared `targetX` / `keyLeft` / `keyRight` variables.

### Persistence
High score stored in `localStorage` under key `"hscore"`.
