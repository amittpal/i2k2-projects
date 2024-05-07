using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class ConfigSetting : IConfigSettings
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
