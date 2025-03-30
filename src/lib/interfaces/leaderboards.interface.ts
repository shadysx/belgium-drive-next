import { LeaderboardRow } from "./leaderboard-row.interface";

export interface Leaderboards {
  global: LeaderboardRow[];
  monthly: LeaderboardRow[];
  weekly: LeaderboardRow[];
}
