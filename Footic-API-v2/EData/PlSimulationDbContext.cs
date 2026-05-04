using System;
using System.Collections.Generic;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.EData;

public partial class PlSimulationDbContext : DbContext
{
    public PlSimulationDbContext()
    {
    }

    public PlSimulationDbContext(DbContextOptions<PlSimulationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<League> Leagues { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<MatchSquad> MatchSquads { get; set; }

    public virtual DbSet<MatchSquadPlayer> MatchSquadPlayers { get; set; }

    public virtual DbSet<Player> Players { get; set; }

    public virtual DbSet<PlayerStat> PlayerStats { get; set; }

    public virtual DbSet<Stadium> Stadium { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamStat> TeamStats { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public DbSet<LeagueStandingsHistory> LeagueStandingsHistory { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=PL_simulation_DB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<League>(entity =>
        {
            entity.ToTable("League");

            entity.HasIndex(e => e.Lname, "UQ_League_Name").IsUnique();

            entity.Property(e => e.LeagueId).HasColumnName("LeagueID");
            entity.Property(e => e.Lname)
                .HasMaxLength(100)
                .HasColumnName("LName");
            entity.Property(e => e.Winner).HasMaxLength(100);
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK_Match");

            entity.ToTable("Match_");

            entity.Property(e => e.MatchId).HasColumnName("MatchID");
            entity.Property(e => e.LeagueId).HasColumnName("LeagueID");
            entity.Property(e => e.MatchDate).HasColumnType("datetime");
            entity.Property(e => e.StadiumId).HasColumnName("StadiumID");
        });

        modelBuilder.Entity<MatchSquad>(entity =>
        {
            entity.ToTable("MatchSquad");

            entity.Property(e => e.MatchId).HasColumnName("MatchID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.Match).WithMany(p => p.MatchSquads)
                .HasForeignKey(d => d.MatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchSquad_Match_");

            entity.HasOne(d => d.Team).WithMany(p => p.MatchSquads)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchSquad_Team");
        });

        modelBuilder.Entity<MatchSquadPlayer>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.MatchSquad).WithMany(p => p.MatchSquadPlayers)
                .HasForeignKey(d => d.MatchSquadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchSquadPlayers_MatchSquad");

            entity.HasOne(d => d.Player).WithMany(p => p.MatchSquadPlayers)
                .HasForeignKey(d => d.PlayerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchSquadPlayers_Player");
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.ToTable("Player");

            entity.HasIndex(e => e.TeamId, "IX_Player_TeamID");

            entity.Property(e => e.PlayerId).HasColumnName("PlayerID");
            entity.Property(e => e.Fit).HasDefaultValue(100);
            entity.Property(e => e.MarketValue).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.Nationality).HasMaxLength(100);
            entity.Property(e => e.Pimage)
                .HasMaxLength(250)
                .HasDefaultValueSql("((0))")
                .HasColumnName("PImage");
            entity.Property(e => e.Pname)
                .HasMaxLength(100)
                .HasColumnName("PName");
            entity.Property(e => e.Pnumber).HasColumnName("PNumber");
            entity.Property(e => e.Position).HasMaxLength(50);
            entity.Property(e => e.Poweer).HasDefaultValue(50);
            entity.Property(e => e.Rate).HasColumnType("numeric(3, 0)");
            entity.Property(e => e.StrongFoot).HasMaxLength(10);
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.Team).WithMany(p => p.Players)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_Player_Team");
        });

        modelBuilder.Entity<PlayerStat>(entity =>
        {
            entity.HasKey(e => e.PlayerStatsId);

            entity.Property(e => e.PlayerStatsId)
                .ValueGeneratedNever()
                .HasColumnName("PlayerStatsID");
            entity.Property(e => e.Fouls).HasColumnName("fouls");
            entity.Property(e => e.Goals).HasDefaultValue(0);
            entity.Property(e => e.Height).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Weight)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("Weight_");

            entity.HasOne(d => d.PlayerStats).WithOne(p => p.PlayerStat)
                .HasForeignKey<PlayerStat>(d => d.PlayerStatsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerStats_Player");
        });

        modelBuilder.Entity<Stadium>(entity =>
        {
            entity.ToTable("Stadium");

            entity.HasIndex(e => e.Sname, "UQ_Stadium_Name").IsUnique();

            entity.Property(e => e.StadiumId).HasColumnName("StadiumID");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(255)
                .HasColumnName("Logo_url");
            entity.Property(e => e.Slocation)
                .HasMaxLength(150)
                .HasColumnName("SLocation");
            entity.Property(e => e.Sname)
                .HasMaxLength(100)
                .HasColumnName("SName");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Team");

            entity.HasIndex(e => e.LeagueId, "IX_Team_LeagueID");

            entity.HasIndex(e => e.StadiumId, "IX_Team_StadiumID");

            entity.HasIndex(e => e.Tname, "UQ_Team_Name").IsUnique();

            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.Coach).HasMaxLength(100);
            entity.Property(e => e.LeagueId).HasColumnName("LeagueID");
            entity.Property(e => e.Logo).HasMaxLength(255);
            entity.Property(e => e.StadiumId).HasColumnName("StadiumID");
            entity.Property(e => e.Tname)
                .HasMaxLength(100)
                .HasColumnName("TName");

            entity.HasOne(d => d.League).WithMany(p => p.Teams)
                .HasForeignKey(d => d.LeagueId)
                .HasConstraintName("FK_Team_League");

            entity.HasOne(d => d.Stadium).WithMany(p => p.Teams)
                .HasForeignKey(d => d.StadiumId)
                .HasConstraintName("FK_Team_Stadium");
        });

        modelBuilder.Entity<TeamStat>(entity =>
        {
            entity.HasKey(e => e.TeamStatsId);

            entity.Property(e => e.TeamStatsId)
                .ValueGeneratedNever()
                .HasColumnName("TeamStatsID");

            entity.HasOne(d => d.TeamStats).WithOne(p => p.TeamStat)
                .HasForeignKey<TeamStat>(d => d.TeamStatsId)
                .HasConstraintName("FK_TeamStats_Team");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.TeamId, "IX_Users_TeamID");

            entity.HasIndex(e => e.Email, "UQ_Users_Email").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ_Users_UserName").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.Upassword)
                .HasMaxLength(255)
                .HasColumnName("UPassword");
            entity.Property(e => e.UserName).HasMaxLength(100);
            entity.Property(e => e.UserType)
                .HasMaxLength(50)
                .HasDefaultValue("fan");

            entity.HasOne(d => d.Team).WithMany(p => p.Users)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_Users_Team");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
