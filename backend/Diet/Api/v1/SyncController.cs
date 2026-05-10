using System.ComponentModel.DataAnnotations;
using Diet.Business;
using Diet.Model;
using Microsoft.AspNetCore.Mvc;

namespace Diet.Api.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class SyncController(ISyncService syncService) : ControllerBase
{
    private readonly ISyncService syncService = syncService;

    [HttpGet("pull")]
    public async Task<ActionResult<PullResponse>> Pull([FromQuery] [Required] long since)
    {
        var response = await syncService.ListChanges(since);
        return Ok(response);
    }

    [HttpPost("push")]
    public async Task<ActionResult> Push([FromBody] [Required] PushRequest request)
    {
        await syncService.PushChanges(request);
        return Ok();
    }
}