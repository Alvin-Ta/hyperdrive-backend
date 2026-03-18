# hyperdrive-backend

Node.js REST API that powers the [Hyperdrive iOS app](https://github.com/Alvin-Ta/hyperdrive-front). Processes the unofficial NHL API and exposes clean, structured endpoints for the client to consume.

---

## Architecture

Built with a clean MVC structure — routes define the interface, controllers handle request/response logic, and services contain the NHL API integration and data transformation.

```
hyperdrive-backend/
├── routes/         # Endpoint definitions
├── controllers/    # Request handling & response shaping
├── services/       # NHL API calls & data transformation
└── server.js       # Entry point
```

---

## API Endpoints

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/schedule/now` | Today's NHL schedule |
| GET | `/schedule/:date` | Schedule for a specific date (e.g. `2026-03-17`) |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/games/:game_id` | Game details and preview info |
| GET | `/games/:game_id/boxscore` | Full boxscore for a completed game |
| GET | `/games/:game_id/play-by-play` | Period-by-period play-by-play breakdown |

### Players
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/players/all` | Full list of NHL players |
| GET | `/players/:id/info` | Player profile and metadata |
| GET | `/players/:id/games/:season/:gameType` | Player game log for a given season |

### Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/queries/:team/now` | Team's most recent results |
| GET | `/queries/:team/vs/:opponent/:season` | Head-to-head record between two teams |
| GET | `/queries/:team/players` | Roster for a given team |
| GET | `/queries/:player/vs/:team` | A player's historical stats against a specific team |

---

## Tech Stack

| | |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Data Source | [Unofficial NHL REST API](https://github.com/Zmalski/NHL-API-Reference) |
| Deployment | Render |

---

## Running Locally

```bash
git clone https://github.com/Alvin-Ta/hyperdrive-backend.git
cd hyperdrive-backend
npm install
node server.js
```

Server runs on `http://localhost:3000` by default.

---

## Related

- [Hyperdrive iOS Client](https://github.com/Alvin-Ta/hyperdrive) — Swift/SwiftUI app that consumes this API
