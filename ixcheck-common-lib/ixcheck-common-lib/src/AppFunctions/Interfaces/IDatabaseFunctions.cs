using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCommonLib.Models.Paging;
using System;
using System.Collections.Generic;
using System.Data;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IDatabaseFunctions
    {
        (IFunctionReturn functionReturn, ulong retValue, ApiSuccessResponse.DataValue dataValue) ExecuteInsert(ReadOnlySpan<char> sqlSpanQuery, string methodName);
        (IFunctionReturn functionReturn, ulong retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndInsert(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanInsertQuery, string methodName, string successMessage);
        (IFunctionReturn functionReturn, ulong retValue, ApiSuccessResponse.DataValue dataValue) ExecuteUpdate(ReadOnlySpan<char> sqlSpanQuery, string methodName, string successMessage);
        (IFunctionReturn functionReturn, ulong retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndUpdate(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanUpdateQuery, string methodName,string successMessage);
        (IFunctionReturn functionReturn, ulong retValue) ExecuteDelete(ReadOnlySpan<char> sqlSpanQuery, string methodName, string successMessage);
        (IFunctionReturn functionReturn, ulong retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndDelete(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanDeleteQuery, string methodName);
        (IFunctionReturn functionReturn, ulong retValue) ExecuteScalar(ReadOnlySpan<char> sqlSpanQuery, string methodName);
        (IFunctionReturn functionReturn, DataTable dataTable, TimeSpan? sqlconnTime, TimeSpan? queryTime) ExecuteSelectDataTable(ReadOnlySpan<char> sqlSpanQuery, string methodName);
        (IFunctionReturn functionReturn, DataSet dataSet, TimeSpan? sqlconnTime, TimeSpan? queryTime) ExecuteSelectDataSet(ReadOnlySpan<char> sqlSpanQuery, string methodName);
        (IFunctionReturn functionReturn, string jsonReturn) ExecuteSelectJSON(ReadOnlySpan<char> sqlSpanQuery, string methodName, string jsonObjectName, Dictionary<string, (string field, string jsonProperty)> jsonDataFields, TimeSpan _cachecheckTime);
        (IFunctionReturn functionReturn, string jsonReturn) ExecuteSelectJSONPaging(ReadOnlySpan<char> sqlSpanQuery, string methodName, string jsonObjectName, Dictionary<string, (string field, string jsonProperty)> jsonDataFields, HttpPaging httpPaging, TimeSpan _cachecheckTime, bool _includeSatatusStyles = false, bool _includeExtraVariables = false);
        
    }
}
