using System;
using System.Collections.Generic;

namespace footic.Models;

public partial class MatchSquadPlayer
{
    public int Id { get; set; }

    public int MatchSquadId { get; set; }

    public int PlayerId { get; set; }

    public bool? IsStarter { get; set; }

    public bool? IsCaptain { get; set; }

    public virtual MatchSquad MatchSquad { get; set; } = null!;

    public virtual Player Player { get; set; } = null!;
}
