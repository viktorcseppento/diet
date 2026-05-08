using System.ComponentModel.DataAnnotations;
using Diet.Business;
using Diet.Model;
using Microsoft.AspNetCore.Mvc;

namespace Diet.Api.v1;

public class SyncController(ISyncService syncService) : ControllerBase
{
    private readonly ISyncService syncService = syncService;

    [HttpGet("pull")]
    public ActionResult<PullResponse> Pull([FromQuery] [Required] long since)
    {
        var response = syncService.ListChanges(since);
        return Ok(response);
    }
}