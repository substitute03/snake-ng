# SnakeNg
SnakeNg is a take on the classic Snake game built in Angular 13.

## Overview

The aim of the game is to score as many points as possible by guiding the Snake to consume pellets. Each time a pellet is consumed, the Snake will become one block longer.
You will get a game over if the Snake either goes out of bounds or collides with itself.

## Game Modes

- **Classic**
  - A recreation of the classic Snake game. Consume as many pellets as you can without going out of bounds or allowing the Snake to collide with itself.
- **Blitz**
  - The same rules as Classic but, now, consuming pellets will fill up the Blazing meter. When the Blazing meter is full, the Snake will start blazing for 5 seconds. During this time, all pellets are worth double points and collecting pellets will extend the Blazing status for an extra 1 second. Score as many points as you can in 1 minute.

## High Scores

- Your high scores for each game mode will be stored in your browser's local storage. See how high you can score!

## Controls

The Snake is controlled using the WASD or the arrow keys.

- W or Up Arrow - move the Snake up.
- A or Left Arrow- move the Snake left.
- S or Down Arrow - move the Snake down.
- D or Right Arrow - move the Snake right.

In Classic mode, press SPACE to pause the game.