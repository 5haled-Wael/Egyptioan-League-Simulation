CREATE TABLE "User"(
    "id" BIGINT NOT NULL,
    "full_name" BIGINT NOT NULL,
    "email" BIGINT NOT NULL,
    "password" BIGINT NOT NULL,
    "picture" BIGINT NOT NULL
);
ALTER TABLE
    "User" ADD PRIMARY KEY("id");
CREATE TABLE "Team"(
    "id" BIGINT NOT NULL,
    "name" BIGINT NOT NULL,
    "logo" BIGINT NOT NULL,
    "owner" BIGINT NOT NULL,
    "league" BIGINT NOT NULL
);
ALTER TABLE
    "Team" ADD PRIMARY KEY("id");
CREATE TABLE "League"(
    "id" BIGINT NOT NULL,
    "name" CHAR(255) NOT NULL,
    "logo" CHAR(255) NOT NULL,
    "start_at" DATE NOT NULL,
    "end_at" DATE NOT NULL
);
ALTER TABLE
    "League" ADD PRIMARY KEY("id");
CREATE TABLE "Player"(
    "id" BIGINT NOT NULL,
    "name" BIGINT NOT NULL,
    "number" BIGINT NOT NULL,
    "country" BIGINT NOT NULL,
    "team" BIGINT NOT NULL,
    "positioning" BIGINT NOT NULL,
    "total_power" BIGINT NOT NULL
);
ALTER TABLE
    "Player" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Player"."positioning" IS 'GK, Attacker, Defender, Middle';
CREATE TABLE "PlayerAnalytic"(
    "id" BIGINT NOT NULL,
    "total_scores" BIGINT NOT NULL,
    "total_assists" BIGINT NOT NULL,
    "player" BIGINT NOT NULL,
    "league" BIGINT NOT NULL
);
ALTER TABLE
    "PlayerAnalytic" ADD PRIMARY KEY("id");
CREATE TABLE "TeamMatchAnalytic"(
    "id" BIGINT NOT NULL,
    "winner_scores" INTEGER NOT NULL,
    "loser_scores" INTEGER NOT NULL,
    "team_match" BIGINT NOT NULL
);
ALTER TABLE
    "TeamMatchAnalytic" ADD PRIMARY KEY("id");
CREATE TABLE "TeamMatch"(
    "id" BIGINT NOT NULL,
    "teams" BIGINT NOT NULL,
    "winner" CHAR(255) NOT NULL,
    "league" BIGINT NOT NULL,
    "start_at" DATE NOT NULL
);
ALTER TABLE
    "TeamMatch" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "TeamMatch"."winner" IS 'team_1, team_2';
CREATE TABLE "LeagueAnalytic"(
    "id" BIGINT NOT NULL,
    "best_player" BIGINT NOT NULL,
    "top_scorer" BIGINT NOT NULL,
    "top_playmaker" BIGINT NOT NULL,
    "winner_team" BIGINT NOT NULL
);
ALTER TABLE
    "LeagueAnalytic" ADD PRIMARY KEY("id");
ALTER TABLE
    "TeamMatch" ADD CONSTRAINT "teammatch_winner_foreign" FOREIGN KEY("winner") REFERENCES "Team"("id");
ALTER TABLE
    "Team" ADD CONSTRAINT "team_league_foreign" FOREIGN KEY("league") REFERENCES "League"("id");
ALTER TABLE
    "TeamMatchAnalytic" ADD CONSTRAINT "teammatchanalytic_team_match_foreign" FOREIGN KEY("team_match") REFERENCES "TeamMatch"("id");
ALTER TABLE
    "Player" ADD CONSTRAINT "player_team_foreign" FOREIGN KEY("team") REFERENCES "Team"("id");
ALTER TABLE
    "PlayerAnalytic" ADD CONSTRAINT "playeranalytic_player_foreign" FOREIGN KEY("player") REFERENCES "Player"("id");
ALTER TABLE
    "Team" ADD CONSTRAINT "team_owner_foreign" FOREIGN KEY("owner") REFERENCES "User"("id");
ALTER TABLE
    "LeagueAnalytic" ADD CONSTRAINT "leagueanalytic_winner_team_foreign" FOREIGN KEY("winner_team") REFERENCES "Team"("id");
ALTER TABLE
    "PlayerAnalytic" ADD CONSTRAINT "playeranalytic_league_foreign" FOREIGN KEY("league") REFERENCES "League"("id");
ALTER TABLE
    "TeamMatch" ADD CONSTRAINT "teammatch_league_foreign" FOREIGN KEY("league") REFERENCES "League"("id");
ALTER TABLE
    "LeagueAnalytic" ADD CONSTRAINT "leagueanalytic_top_playmaker_foreign" FOREIGN KEY("top_playmaker") REFERENCES "Player"("id");
ALTER TABLE
    "TeamMatch" ADD CONSTRAINT "teammatch_teams_foreign" FOREIGN KEY("teams") REFERENCES "Team"("id");
ALTER TABLE
    "LeagueAnalytic" ADD CONSTRAINT "leagueanalytic_top_scorer_foreign" FOREIGN KEY("top_scorer") REFERENCES "Player"("id");
ALTER TABLE
    "LeagueAnalytic" ADD CONSTRAINT "leagueanalytic_best_player_foreign" FOREIGN KEY("best_player") REFERENCES "Player"("id");