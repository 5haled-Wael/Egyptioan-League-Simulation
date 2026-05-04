using footic.DTOs.Stadium;
using footic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StadiumController : ControllerBase
    {
        private readonly StadiumService _stadiumService;

        public StadiumController(StadiumService stadiumService)
        {
            _stadiumService = stadiumService;
        }

        // 1. GET: api/Stadium/name/5
        [HttpGet("name/{id}")]
        public async Task<ActionResult<stadiumnameDTO>> GetName(int id)
        {
            var stadium = await _stadiumService.GetStadiumNameById(id);

            if (stadium == null)
            {
                return NotFound(new { Message = $"Stadium with ID {id} not found." });
            }

            return Ok(stadium);
        }

        // 2. GET: api/Stadium/details/5
        [HttpGet("details/{id}")]
        public async Task<ActionResult<StadiumDetailsDTO>> GetDetails(int id)
        {
            var stadium = await _stadiumService.GetStadiumDetailsById(id);

            if (stadium == null)
            {
                return NotFound(new { Message = $"Details for Stadium ID {id} not found." });
            }

            return Ok(stadium);
        }
    }
}
