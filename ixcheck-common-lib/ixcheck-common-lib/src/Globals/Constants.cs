namespace IXCheckCommonLib.Globals
{
    public static class Constants
    {
        public static class HttpStatusCodes
        {
            public const string ContinueRequest = "100";
            public const string SwitchingProtocols = "101";
            public const string Processing = "102";
            public const string OK = "200";
            public const string Created = "201";
            public const string Accepted = "202";
            public const string NonAuthoritativeInformation = "203";
            public const string NoContent = "204";
            public const string ResetContent = "205";
            public const string PartialContent = "206";
            public const string MultiStatus = "207";
            public const string AlreadyReported = "208";
            public const string IMUsed = "226";
            public const string MultipleChoices = "300";
            public const string MovedPermanently = "301";
            public const string Found = "302";
            public const string SeeOther = "303";
            public const string NotModified = "304";
            public const string UseProxy = "305";
            public const string TemporaryRedirect = "307";
            public const string PermanentRedirect = "308";
            public const string BadRequest = "400";
            public const string Unauthorized = "401";
            public const string PaymentRequired = "402";
            public const string Forbidden = "403";
            public const string NotFound = "404";
            public const string MethodNotAllowed = "405";
            public const string NotAcceptable = "406";
            public const string ProxyAuthenticationRequired = "407";
            public const string RequestTimeout = "408";
            public const string Conflict = "409";
            public const string Gone = "410";
            public const string LengthRequired = "411";
            public const string PreconditionFailed = "412";
            public const string PayloadTooLarge = "413";
            public const string UriTooLong = "414";
            public const string UnsupportedMediaType = "415";
            public const string RangeNotSatisfiable = "416";
            public const string ExpectationFailed = "417";
            public const string MisdirectedRequest = "421";
            public const string UnprocessableEntity = "422";
            public const string Locked = "423";
            public const string FailedDependency = "424";
            public const string Unassigned = "425";
            public const string UpgradeRequired = "426";
            public const string PreconditionRequired = "428";
            public const string TooManyRequests = "429";
            public const string RequestHeaderFieldsTooLarge = "431";
            public const string UnavailableForLegalReasons = "451";
            public const string InternalServerError = "500";
            public const string NotImplemented = "501";
            public const string BadGateway = "502";
            public const string ServiceUnavailable = "503";
            public const string GatewayTimeout = "504";
            public const string HttpVersionNotSupported = "505";
            public const string VariantAlsoNegotiates = "506";
            public const string InsufficientStorage = "507";
            public const string LoopDetected = "508";
            public const string NotExtended = "510";
            public const string NetworkAuthenticationRequired = "511";

        }

        public static class Api
        {
            public const string Version = "v1";
            public const string ApiDetails = "ApiDetails";
            public const string AppSettingsJSON = "appsettings.json";
            public const string CorsPolicy = "CorsPolicy";
            public const string ContentType = "application/json";
        }

        public static class TokenValues
        {
            public const string ApplicationId = "application_id";
            public const string AID = "aid";
            public const string OrgID = "org_id";
            public const string OID = "oid";
            public const string WID = "wid";
            public const string CID = "cid";
            public const string GSH = "gsh";
            public const string UID = "uid";
            public const string DID = "did";
            public const string CUT = "cut";
            public const string CMT = "cmt";
            public const string CTT = "ctt";
            public const string CUID = "cuid";
            public const string CustomerUserPrefix = "cust-";
            public const string UserType = "UserType";
            public const string UTID = "utid";
            public const string UserOrg = "UserOrg";
            public const string UserWorker = "UserWorker";
            public const string OgdSuperAgencyAdmin = "OgdSuperAgencyAdmin";
            public const string OgdSaasAgencyAdmin = "OgdSaasAgencyAdmin";
            public const string OgdAgencyAdmin = "OgdAgencyAdmin";
            public const string OgdOrgAdmin = "OgdOrgAdmin";
            public const string OgdOrgUser = "OgdOrgUser";
            public const string OgdAppUser = "OgdAppUser";
            public const string CompanyName = "comp";
            public const string CustomerName = "cust";
            public const string Cuid = "cuid";
            public const string UUID = "uuid";
            public const string PER = "per";
            public const string INID = "inid";
            public const string ANID = "anid";
            public const string ExamId = "exam_id";
            public const string EID = "eid";
            public const string ETID = "etid";
        }

        public static class UserMessages
        {
            public const string UsernameRequired = "Username is required";
            public const string UserPasswordRequired = "Password is required";
            public const string UsernamePasswordBothRequired = "Username and Password are required";
            public const string UserDataRequired = "All required fields are needed";
            public const string UserSaved = "New user created successfully";
            public const string UserAuthorized = "User authorized, username and password matches";
            public const string UserNotFound = "User not found";
            public const string UserExist = "User already exists";
            public const string UserPasswordHashFail = "Password does not match";
            public const string UserPasswordMissing = "System error while matching password";
            public const string NoPermissionToAddUser = "No permission to add new user";
            public const string FileDownloadedSuccessfully = "File downloaded successfully";
            public const string AppGuidRequired = "App guid is required";
            public const string ApplicationAccessDenied = "Application access denied";
        }

        public static class PermissionsMessages
        {
            public const string NoAuthorized = "Not authorized";
            public const string PermissionMissing = "Required authorization permission missing";
        }

        public static class TokenMessages
        {
            public const string ClaimsIdentityMissing = "Required user claims identity missing from the token";
            public const string ClaimsUserOrRoleMissing = "Required user claims role or userid missing from the token";
            public const string InvalidToken = "Invalid Token";
            public const string UnAuthorizedAccess = "Un-Authorized Access";
            public const string ApplicationAccessNotAllowed = "Application access not allowed";
            public const string Authorization = "Authorization";
            public const string Bearer = "Bearer";
        }

        public static class ReturnMessageTypes
        {
            public const string TokeReturn = "TOKEN";
            public const string GoodReturn = "VALID_RETURN";
            public const string AppError = "APP_ERROR";
            public const string SystemError = "SYSTEM_ERROR";
            public const string AccessDenied = "ACCESS_DENIED";
            public const string SuccessMessage = "SUCCESS_MESSAGE";
            public const string UnhandeledException = "UNHANDELED_EXCEPTION";
            public const string InvalidToken = "INVALID_TOKEN";
            public const string JwtInvalidUnauthrized = "JWT_INVALID_UNAUTHRIZED";
            public const string TokenError = "TOKEN_ERROR";
            public const string JwtUnauthrized = "JWT_UNAUTHRIZED";
        }

        public static class LogLevel
        {
            public const string VERBOSE = "verbose";
            public const string TRACE = "trace";
            public const string INFORMATION = "information";
            public const string DEBUG = "debug";
            public const string WARNING = "warning";
            public const string ERROR = "error";
            public const string CRITICAL = "critical";
            public const string FATAL = "fatal";
            public const string NONE = "none";
        }

        public static class SeriLog
        {
            public const string FilePath = "FilePath";
            public const string FileName = "FileName";
            public const string ConfigSectionName = "Serilog";

            public static class MinimumLevel
            {
                public const string Default = "Default";
                public const string Microsoft = "Microsoft";
                public const string System = "System";
                public const string MicrosoftAspNetCoreMvc = "Microsoft.AspNetCore.Mvc";
                public const string MicrosoftAspNetCoreAuthentication = "Microsoft.AspNetCore.Authentication";
                public const string MicrosoftAspNetCoreMvcInternal = "Microsoft.AspNetCore.Mvc.Internal";
                public const string MicrosoftAspNetCoreHostingInternalWebHost = "Microsoft.AspNetCore.Hosting.Internal.WebHost";
                public const string MinimumLevelDefault = "MinimumLevel:Default";
                public const string MinimumLevelOverrideMicrosoft = "MinimumLevel:Override:Microsoft";
                public const string MinimumLevelOverrideSystem = "MinimumLevel:Override:System";
                public const string MinimumLevelOverrideMicrosoftAspNetCoreMvc = "MinimumLevel:Override:Microsoft.AspNetCore.Mvc";
                public const string MinimumLevelOverrideMicrosoftAspNetCoreAuthentication = "MinimumLevel:Override:Microsoft.AspNetCore.Authentication";
                public const string MinimumLevelOverrideMicrosoftAspNetCoreMvcInternal = "MinimumLevel:Override:Microsoft.AspNetCore.Mvc.Internal";
                public const string MinimumLevelOverrideMicrosoftAspNetCoreHostingInternalWebHost = "MinimumLevel:Override:Microsoft.AspNetCore.Hosting.Internal.WebHost";
            }
        }

        public static class RedisCacheMessages
        {
            public const string RedisConnectionFailed = "Redis connection failed";
            public const string SettingsMissingInRedis = "Settings missing in Redis";
        }

        public static class GenericMessages
        {

            public const string InvalidObject = "Invalid Object";
            public const string RecordSavedSuccessfully = "Record saved successfully";
            public const string RecordUpdatedSuccessfully = "Record updated successfully";
            public const string RecordDeletedSuccessfully = "Record deleted successfully";
            public const string RecordFetchedSuccessfully = "Record fetched successfully";
            public const string ErrorInSavingRecord = "Error in saving record";
            public const string ErrorInUpdatingRecord = "Error in updating record";
            public const string ErrorInDeletingRecord = "Error in deleting record";
            public const string ErrorInFetchingRecord = "Error in Fetching Record";
            public const string UnExpectedError = "Unexpected Error";
            public const string TracingNumberId = "Tracing Number Id";
            public const string RequiredParametersMissing = "Required parameters missing";
            public const string RequiredPermissionMissing = "Required permission missing";
            public const string PermissionDenied = "Permission denied";
            public const string ColumnNamesNotValid = "Column Names Not Valid";
            public const string RecordAlreadyExists = "Record Already Exists";
            public const string RecordNotFound = "Record Not Found";
            public const string RecordNotFoundToUpdate = "Record Not Found To Update";
            public const string RecordNotFoundToDelete = "Record Not Found To Delete";
            public const string InvalidOrTemperedId = "Invalid Or Tempered Id";
            public const string DataRequired = "Data Required";
            public const string EventTypeComponetNameMismatch = "Component Type Not Matching";
            public const string ErrorInDeserialization = "Error In Deserialization";
            public const string SMSSentSuccessfully = "SMS Sent Successfully";
            public const string ErrorInSendingSMS = "Error In Sending SMS";
            public const string EmailSentSuccessfully = "Email Sent Successfully";
            public const string ErrorInSendingEmail = "Error In Sending Email";
            public const string UserInformationSavedInCache = "User Information Saved In Cache";
            public const string ErrorInSavingUserInformationInCache = "Error In Saving User Information In cache";
            public const string ValidationFailed = "Validation Failed";
            public const string FileDownloadedSuccessfully = "File downloaded successfully";
            public const string FileUploadedSuccessfully = "File uploaded successfully";
            public const string FolderDownloadedSuccessfully = "Folder downloaded successfully";
            public const string FolderUploadedSuccessfully = "Folder uploaded successfully";
            public const string FilterSavedSuccessfully = "Filter saved successfully";
			public const string FilterUpdatedSuccessfully = "Filter updated successfully";
            public const string Result = "Result";
            public const string HTTPResponseFailed = "Http Response is not successful";
            public const string HTTPResponseSuccessful = "Http Response is successful";
            public const string MediaTypeFormUrlEncoded = "application/x-www-form-urlencoded";
            public const string MediaTypeApplicationJson = "application/json";
            public const string HttpRequestException = "HttpRequestException";
            public const string TaskCanceledException = "TaskCanceledException";
            public const string InvalidHttpClientRequestType = "Invalid Http Client Request Type";
            
        }

        public static class MethodNames
        {
            public const string GenerateToken = "GenerateToken";
            public const string InsertConfigSettingsInCache = "InsertConfigSettingsInCache";
        }

        public static class ApplicationNames
        {
            public const string AuthService = "1";
            public const string InstituteService = "2";
            public const string StudentAssignmentService = "3";
            public const string StudentService = "4";
            public const string ExamAuthService = "5";
            public const string ExamCentreService = "6";
            public const string ExamRegDeskService = "7";
            public const string DeskAdminService = "8";
            public const string ExamAdminService = "9";
        }

        public static class ApplicationGlobalSH
        {
            public const string AuthService = "84ce308e-de49-4ee1-a4f4-b13f8f0e2992";
            public const string InstituteService = "92D85D90-45D4-E51B-294D-42D6517C5A13";
            public const string StudentAssignmentService = "FB03F2E6-B217-15DE-10A6-EAD5C6EB4612";
            public const string StudentService = "49E636C0-8748-D90B-80E4-25A1AF83DA27";
            public const string ExamAuthService = "516858bc-f215-41b3-b860-113d6359b9c2";
            public const string ExamCentreService = "512418f6-ab89-4b1f-a196-427dad849d24";
            public const string ExamRegDeskService = "86b81a15-4c44-4788-aa8f-47c3e51e09cf";
            public const string ExamCentreAppService = "512415d9-ab89-4b1f-a196-427dad849d24";
            public const string DeskAdminService = "515418f6-ab89-4b1f-a196-427dad849d25";
            public const string ExamAdminService = "515418f6-ab89-4b1f-a196-427dad849d26";
        }
    }
}
    