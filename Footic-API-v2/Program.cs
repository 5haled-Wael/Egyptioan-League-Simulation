using footic.EData;
using footic.Services;
using footic.Models; // أضف هذا
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace footic
{
    public class Program
    {
        public static async Task Main(string[] args)  // غير إلى async Task
        {
            var builder = WebApplication.CreateBuilder(args);
            
            //DataBase
            builder.Services.AddDbContext<PlSimulationDbContext>(options => 
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            
            // Add services to the container.
            builder.Services.AddScoped<LeagueStandingService>();
            builder.Services.AddScoped<TeamService>();
            builder.Services.AddScoped<IplayerService, PlayerService>();
            builder.Services.AddScoped<MatchService>();
            builder.Services.AddScoped<CreateMatchesService>();
            builder.Services.AddScoped<StadiumService>();
            builder.Services.AddScoped<MatchSquadService>();
            builder.Services.AddScoped<MatchSimulationService>();
            
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuerSigningKey = true,
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                       .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
                       ValidateIssuer = false,
                       ValidateAudience = false
                   };
               });
            
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // ========== أضف هذا الجزء ==========
            // إنشاء التشكيلات عند بدء التشغيل (مرة واحدة فقط)
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PlSimulationDbContext>();
                await EnsureSquadsExist(context);
            }
            // ===================================

            app.Run();
        }

        // أضف هذه الدالة في نفس الـ class
        private static async Task EnsureSquadsExist(PlSimulationDbContext context)
        {
            try
            {
                var matches = await context.Matches
                    .Where(m => m.Status != (int)MatchState.Finished)
                    .ToListAsync();

                if (!matches.Any())
                {
                    Console.WriteLine("⚠️ No matches found. Skipping squad creation.");
                    return;
                }

                var allNewSquads = new List<MatchSquad>();
                var allNewSquadPlayers = new List<MatchSquadPlayer>();

                foreach (var match in matches)
                {
                    // شوف لو فيه تشكيلات موجودة
                    var existingSquads = await context.MatchSquads
                        .AnyAsync(s => s.MatchId == match.MatchId);

                    if (existingSquads) continue;

                    // جلب لاعبي الفريقين
                    var homeTeamPlayers = await context.Players
                        .Where(p => p.TeamId == match.HomeTeamId)
                        .ToListAsync();

                    var awayTeamPlayers = await context.Players
                        .Where(p => p.TeamId == match.AwayTeamId)
                        .ToListAsync();

                    // إنشاء تشكيلات
                    CreateSquadForTeamInMemory(match.MatchId, match.HomeTeamId, homeTeamPlayers, allNewSquads, allNewSquadPlayers);
                    CreateSquadForTeamInMemory(match.MatchId, match.AwayTeamId, awayTeamPlayers, allNewSquads, allNewSquadPlayers);
                }

                // حفظ كل التشكيلات دفعة واحدة
                if (allNewSquads.Any())
                {
                    await context.MatchSquads.AddRangeAsync(allNewSquads);
                    await context.SaveChangesAsync();
                    
                    await context.MatchSquadPlayers.AddRangeAsync(allNewSquadPlayers);
                    await context.SaveChangesAsync();
                    
                    Console.WriteLine($"✅ Created {allNewSquads.Count} squads and {allNewSquadPlayers.Count} squad players");
                }
                else
                {
                    Console.WriteLine("✅ Squads already exist. No new squads created.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating squads: {ex.Message}");
            }
        }

        private static void CreateSquadForTeamInMemory(int matchId, int teamId, List<Player> players,
            List<MatchSquad> squads, List<MatchSquadPlayer> squadPlayers)
        {
            var squad = new MatchSquad
            {
                MatchId = matchId,
                TeamId = teamId,
                Substitutions = 0
            };
            squads.Add(squad);

            // اختيار 11 لاعب أساسي (أعلى 11 في الـ Power)
            var starters = players
                .OrderByDescending(p => p.Poweer ?? 0)
                .Take(11)
                .ToList();

            foreach (var player in players)
            {
                squadPlayers.Add(new MatchSquadPlayer
                {
                    MatchSquad = squad,
                    PlayerId = player.PlayerId,
                    IsStarter = starters.Contains(player),
                    IsCaptain = player.PlayerId == starters.FirstOrDefault()?.PlayerId
                });
            }
        }
    }
}