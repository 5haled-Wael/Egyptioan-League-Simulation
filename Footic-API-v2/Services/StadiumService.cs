using footic.DTOs.Stadium;
using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;
namespace footic.Services
{
    public class StadiumService
    {
        private readonly PlSimulationDbContext _context;

        public StadiumService(PlSimulationDbContext context)
        {
            _context = context;
        }
        public async Task<stadiumnameDTO> GetStadiumNameById(int id)
        {
            return await _context.Stadium
                .AsNoTracking()
                .Where(s => s.StadiumId == id)
                .Select(s => new stadiumnameDTO
                {
        
                    StadiumName = s.Sname // تأكد من اسم الحقل في الموديل الأساسي
                })
                .FirstOrDefaultAsync();
        }
        public async Task<StadiumDetailsDTO> GetStadiumDetailsById(int id)
        {
            return await _context.Stadium
                .AsNoTracking()
                .Where(s => s.StadiumId == id)
                .Select(s => new StadiumDetailsDTO
                {
                    StadiumID = s.StadiumId,
                    StadiumName = s.Sname,
                    Capacity = s.Capacity,
                    location = s.Slocation,
                    ImageUrl = s.LogoUrl // أو s.ImageUrl حسب مسمى الحقل عندك
                })
                .FirstOrDefaultAsync();
        }

    }
}
