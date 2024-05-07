namespace IXCheckCandidateApi.Globals
{
    public class ApplicationConstants
    {
        public static class SeriLog
        {
            public static class MinimumLevel
            {
                public const string IXCheckCandidateApi = "IXCheckCandidateApi";
                public const string MinimumLevelOverrideIXCheckCandidateApi = "MinimumLevel:Override:IXCheckCandidateApi";
            }
        }
        public static class MethodNames
        {
            // TOKEN
            public const string GenerateToken = "GenerateToken";
        }
        public static class ValidationMessages
        {
            public const string RegistrationSetUpsNotInsertedSuccessfully = "Registration SetUps Not Inserted Successfully";
            public const string InvalidGuid = "Guid is invalid";
            public const string RegistrationIDRequired = "Registration ID Required";
            public const string RegistrationGUIDRequired = "Registration guid Required";

            public const string ChangePasswordDataIsRequired = "Change password data is Required";
            public const string UserIdIsRequired = "User id is required";
            public const string CustomerIdIsRequired = "customer id is required";
            public const string NewPasswordIsRequired = "New Password is required";
            public const string CandidateIdRequired = "Candidate id is required";
            public const string CandidateGuidRequired = "Candidate guid is required";
            public const string ActivityTypeRequired = "Activity type is required";
            public const string ConfirmPasswordIsRequired = "Confirm Password is required";
            public const string OldPasswordIsRequired = "Old Password is required";

            public const string NewPasswordAndConfirmPasswordDoesNotMatch = "New password and confirm password does not match";
            public const string PasswordShouldMeetThePasswordPolicy = "Password should meet the password policy";

            public const string RegInfoNotMatched = "Registration Information not matched.";
            public const string ExamGuidRequired = "Exam guid is required";
            public const string ShiftGuidRequired = "Shift guid is required";
            public const string ShiftDataRequired = "Shift data is required";
            public const string EmailAlreadyExist = "Email id already exist.";
            public const string ErrorInFetchingRecords = "Error in fetching records.";
            public const string CentreGuidRequired = "Centre guid is required";
            public const string AccessTokenRequired = "Access token is required";
            public const string DataRequired = "Data is required";
            public const string ExamDataRequired = "Exam data is required";
            public const string SetIdRequired = "Set id is Required";
            public const string SectionDataIsRequired = "Section Data is Required";
            public const string SectionGuidRequired = "Section Guid is required";
            public const string ComponentGuidRequired = "Component Guid is required";
            public const string GuidRequired = "Guid is required";
            public const string FormDataRequired = "Layout Data is required";
            public const string RowGuidRequired = "Row guid is required";
            public const string FormDataExist = "Layout Data is not exist in our system.";
            public const string ExamTypeGuidRequired = "Exam Type Guid is required";
            public const string PageGuidRequired = "Page Guid is required";
            public const string LayoutIdRequired = "Layout Id is required";
            public const string LayoutGuidRequired = "Layout Guid is required";
            public const string LayoutNameRequired = "Layout Name is required";
            public const string InitialLayoutNameRequired = "Initial Layout Name is required";
            public const string LayoutDescriptionRequired = "Layout Description is required";
            public const string LayoutTypeRequired = "Layout Type is required";
            public const string LayoutTypeGuidRequired = "Layout Type Guid is required";
            public const string PageNameRequired = "Page Name is required";
            public const string ComponentDataExist = "Component Data is not exist in our system.";
            public const string ComponentRequired = " is required.";
            public const string MinMaxLengthInvalid = "'s length should be between ";
            public const string ComponentIdRequired = "Component Id is required";
            public const string ComponentDataRequired = "Component Data is required";
            public const string ComponentNameRequired = "Component Name is required";
            public const string ComponentColsRequired = "Component Column is required";
            public const string ComponentRowsRequired = "Component Row is required";
            public const string ComponentXRequired = "Component X Cordinate is required";
            public const string ComponentYRequired = "Component Y Cordinate is required";
            public const string TitleRequired = "Title is required.";
            public const string FirstNameRequired = "First Name is required.";
            public const string FatherNameRequired = "Father Name is required.";
            public const string DateOfBirthRequired = "Date Of Birth is required.";
            public const string MobileNumberRequired = "Mobile Number is required.";
            public const string EmailRequired = "Email is required.";
            public const string PhotoRequired = "Photo Upload is required.";
            public const string SignatureRequired = "Signature Upload is required.";
            public const string GenderRequired = "Gender is requried.";
            public const string PhysicalDisabilityRequired = "Physical Disability is requried.";
            public const string CityPriority1Required = "City Priority1 is requried.";
            public const string PriorityRequired = "Priority is requried.";
            public const string DuplicatePriority = "Duplicate Priority";
            public const string SectionNameRequired = "Section Name is required";
            public const string OTPDataRequired = "OTP data is required";
            public const string OTPRequired = "OTP is required";
            public const string InvaliidEmailId = "Email is not valid.";
            public const string CaptchaCodeRequired = "Captcha code is required.";
            public const string CaptchaIdRequired = "Captcha id is required.";

            public const string LayoutTypeCodeRequired = "Layout type code is required";
            public const string SyncDataRequired = "Sync data is required";
            public const string SyncServerGuidRequired = "Sync server guid is required";
            public const string SyncDateRequired = "Sync date is required";
            public const string FirstSyncRequired = "First sync  is required";
            public const string RecordCountRequired = "Record count is required";
            public const string FileNameRequired = "File name is required";

            public const string ImageIsRequired = "image is required.";
            public const string ImageDataRequired = "image data is required.";
            public const string WithDataRequired = "with data is required.";

            public const string AlgoGuidRequired = "Algo guid is required.";
            public const string AlgoURLRequired = "Algo URL is required.";
            public const string ColorURLRequired = "Color URL is required";
            public const string ValidationURLRequired = "Validation URL is required";
            public const string ColorPercentMinRequired = "Color percent min value is required";
            public const string ColorPercentManRequired = "Color percent man value is required";
            public const string FacePercentMinRequired = "Face percent min value is required";
            public const string ColorPercentMaxRequired = "Color percent max value is required";
            public const string MultipleFacesDetected = "Multiple faces detected";
            public const string NoHumanFacesDetected = "No human faces detected";
        }

        public static class ConfigSettingNames
        {
            public const string DatabaseSettings = "DatabaseSettings";
            public const string ApiSettings = "ApiSettings";
            public const string LoggerSettings = "LoggerSettings";
            public const string PaymentSettings = "PaymentSettings";
        }
        public class PaymentActivityTypes
        {
            public const int Initiated = 1;
            public const int Login = 2;
            public const int EmailChangeRequested = 3;
            public const int EmailChanged = 4;
            public const int OtpResend = 5;
            public const int OtpVerificationFailed = 6;
            public const int OtpVerified = 7;
            public const int EditRegistration = 8;
            public const int PaymentRequested = 9;
            public const int PaymentFailed = 10;
            public const int PaymentSuccess = 11;
            public const int CaptchaValidate = 12;
            public const int RegistrationSubmit = 13;
            public const int PasswordChange = 14;
        }
        public static class GenericMessages
        {
            public const string RecordFetchedSuccessfully = "Record Fetched Successfully";
            public const string RecordDeletedSuccessfully = "Record Deleted Successfully";
            public const string EmailScheduledToSend = "Mail has been scheduled to send";
            public const string RecordAlreadyExists = "Record Already Exists";
            public const string CityPriorityAlreadySelected = "City priority already selected.";
            public const string EmailUpdatedSuccessfully = "Email updated successfully.";
            public const string ErrorInSavingRecord = "Error in saving record.";
            public const string ErrorInFetchingRecord = "Error in fetching record.";
            public const string PaymentResponseAddedSuccessfully = "Payment response added successfully";
            public const string CandidateLogin = "Candidate Logged in successfully";
            public const string PaymentGatewayNotFound = "Payment gateway not found.";
            public const string RecordNotFound = "Record Not Found";
            public const string MultipleRecordCanNotBeInserted = "Multiple record can not be inserted";
            public const string RegDeskDataImportedSuccessfully = "Reg desk data imported successfully";
            public const string DatabaseCreated = "Database created";
            public const string RegSchemaCreated = "Reg schema created";

            public const string FormSubmittedSuccessfully = "Form Submitted successfully.";
            public const string InvalidFeeAmount = "Fee amount can not be zero.";
            public const string CandidateActivityLogSubmitted = "Candidate Activity Log Submitted.";

            public const string OldPasswordIsIncorrect = "Old Password is incorrect";
            
            public const string DateDifference = "date_difference";
            public const string Years = "years";
            public const string Months = "months";
            public const string Days = "days";


            public const string ExamSchemaCreated = "Exam schema created";
            public const string RegDataInserted = "Reg data inserted";
            public const string ExamDataInserted = "Exam data inserted";
            public const string ShiftToNetworkGroupDataInserted = "Shift to network Group data inserted";
            public const string NetworkGroupDataDeleted = "Network Group data deleted";
            public const string ImageSignatureUpdated = "Image and signature succcessfully updated";
            public const string RegistrationDataImported = "Registration data successfully imported";
            public const string CentreDataImported = "Centre data successfully imported";
            public const string ShiftToNetworkDataImported = "Shift to network data successfully inserted";
            public const string ShiftToQuestionsDataImported = "Shift to questions data successfully imported";
            public const string ShiftToQuestionsDataImportedPartially = "Shift to questions data partially imported";
            public const string ShiftToQuestionsDataImportFailed = "Shift to questions data import failed";
            public const string QuestionsDataImportedSuccessfully = "Questions data imported successfully";
            public const string QuestionsDataImportFailed = "Questions data import failed";
            public const string QuestionsSetsSavedSuccessfully = "Questions sets saved successfully";
            public const string RecordSavedSuccessfully = "Registration saved successfully";
            public const string OTPWrongExpired = "Entered OTP either wrong or expired.";
            public const string OTPValidateSuccessfully = "OTP validate successfully.";
            public const string EmailSettingNotExist = "Email setting does not exist in database";
            public const string OTPSendSuccessfully = "OTP sent successfully.";

            public const string RegistrationExportSuccessfully = "Registration data exported successfully";
            public const string RegistrationHasCompleted = "Registration has completed.";
            public const string CaptchaValidateSuccessfully = "Captcha validate successfully.";
            public const string InvalidCaptchaCode = "Invalid captcha code.";
            public const string RegistrationInfoSaved = "Registration Info Saved successfully";
            public const string JsonCreatedSuccesFully = "Json file created successfully.";
            public const string AiLogsSavedSuccessfully = "Ai Logs saved successfully.";
            public const string PaymentDetailSavedSuccessfully = "Payment detail saved successfully";
        }
    }
}