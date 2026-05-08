using Diet.Model;

namespace Diet.Business;

public interface ISyncService
{
    public Task<PullResponse> ListChanges(long since);
}