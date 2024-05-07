using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface ICacheFunctions
    {
        Task<IFunctionReturn> InsertInCacheAsync(ICoreUserInfo _coreUserInfo, int _tokenExpire);
        Task<IFunctionReturn> CheckRoleAndPermissionInCacheAsync(
                                                    string _corePermissionToMatch,
                                                    ClaimsIdentity _claimsIdentity
                                                    );
        Task<(bool settingsMissing, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)> InsertConfigSettingsInCacheAsync(string _configTypeName);

        Task<(bool settingsMissingInRedis, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)> GetConfigSettingsFromCacheAsync(string _configTypeName);

        Task<IFunctionReturn> RemoveCacheKeyAsync(string _Name);

        Task<IFunctionReturn> RemoveCacheKeyListAsync(List<string> _Name);
    }
}
