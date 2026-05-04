using System;
using System.Collections.Generic;

namespace footic.Models;

public partial class Player
{
    public int PlayerId { get; set; }

    public string Pname { get; set; } = null!;

    public int Pnumber { get; set; }

    public string Position { get; set; } = null!;

    public int Age { get; set; }

    public string Nationality { get; set; } = null!;

    public string StrongFoot { get; set; } = null!;

    public DateOnly Joined { get; set; }

    public DateOnly EndContract { get; set; }

    public int Fit { get; set; }

    public int? Poweer { get; set; }

    public decimal? MarketValue { get; set; }

    public string? Pimage { get; set; }

    public int? TeamId { get; set; }

    public decimal? Rate { get; set; }

    public virtual ICollection<MatchSquadPlayer> MatchSquadPlayers { get; set; } = new List<MatchSquadPlayer>();

    public virtual PlayerStat? PlayerStat { get; set; }

    public virtual Team? Team { get; set; }
}
