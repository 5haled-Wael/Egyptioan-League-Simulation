using System;
using System.Collections.Generic;

namespace footic.Models;

public partial class Match
{
    public int MatchId { get; set; }

    public DateTime MatchDate { get; set; }

    public int HomeTeamId { get; set; }
    public Team HomeTeam { get; set; }

    public int AwayTeamId { get; set; }
    public Team AwayTeam { get; set; }

    public byte HomeTeamScore { get; set; }

    public byte AwayTeamScore { get; set; }

    public int Status { get; set; }

    public int LeagueId { get; set; }

    public int StadiumId { get; set; }
    public Stadium Stadium { get; set; }

    public int Week { get; set; }

    public TimeOnly MatchTime { get; set; }

    public virtual ICollection<MatchSquad> MatchSquads { get; set; } = new List<MatchSquad>();
}
