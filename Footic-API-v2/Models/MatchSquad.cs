using System;
using System.Collections.Generic;

namespace footic.Models;

public partial class MatchSquad
{
    public int Id { get; set; }

    public int TeamId { get; set; }

    public int MatchId { get; set; }

    public byte? Substitutions { get; set; }

    public virtual Match Match { get; set; } = null!;

    public virtual ICollection<MatchSquadPlayer> MatchSquadPlayers { get; set; } = new List<MatchSquadPlayer>();

    public virtual Team Team { get; set; } = null!;
}
