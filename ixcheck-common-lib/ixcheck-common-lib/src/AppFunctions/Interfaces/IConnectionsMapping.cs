using System.Collections.Generic;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IConnectionsMapping<T>
    {
        int Count { get; }
        void Clear();
        void Add(T key, string connectionId);
        string Get(T key);
        IEnumerable<string> GetConnections(T key);
        void Remove(T key, string connectionId);
    }
}
