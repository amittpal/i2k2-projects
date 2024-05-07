using Google.Protobuf;

namespace IXCheckCandidateApi.Globals
{
    public class ApplicationJsonReturnConstants
    {
        public static class PropertyNames
        {
            public const string TotalRows = "total_rows";
            public const string Id = "id";
            public const string Degree = "degree";
            public const string Code = "code";
            public const string Name = "name";
            public const string Guid = "guid";
            public const string Status = "status";
            public const string Message = "message";
            public const string FacePercent = "face_percent";
            public const string CreateLog = "create_log";
            public const string Isdata = "is_data";
            public const string Image = "image";
            public const string WithData = "with_data";
            public const string ImageWidth = "image_width";
            public const string ColorAnalysis = "color_analysis";
            public const string AiFaces = "ai_faces";
            public const string AiPhotoX = "x";
            public const string AiPhotoY = "y";
            public const string AiPhotoPercent = "Ai_photo_percent";
            public const string HumanFaceDetectedStatusText = "human_face_detected_status_text";
            public const string ColorPercent = "color_percent";
            public const string Color = "color";
            public const string ColorPortionImage = "color_portion_image";
            public const string photoInfo = "info";
            public const string ImageType = "image_type";
            public const string ImageHeight = "image_height";
            public const string AlgoGuid = "algo_guid";
            public const string RegGuid = "reg_guid";
            public const string AlgoURL = "algo_url";
            public const string ValidationURL = "validation_url";
            public const string ColorURL = "color_url";
            public const string RegComponentAiSettingId = "reg_components_ai_setting_id";
            public const string ColorGuid = "color_guid";
            public const string BlueMin = "blue_percent_min";
            public const string BlueMax = "blue_percent_max";
            public const string GreenMin = "green_percent_min";
            public const string GreenMax = "green_percent_max";
            public const string RedMin = "red_percent_min";
            public const string RedMax = "red_percent_max";
            public const string ColorPercentMin = "color_percent_min";
            public const string ColorPercentMax = "color_percent_max";
            public const string FacePercentMin = "face_percent_min";
            public const string FacePercentMax = "face_percent_max";
            public const string IdProof = "id_proof";
            public const string Relation = "relation";
            public const string Religion = "religion";
            public const string Nationality = "nationality";
            public const string StateGuid = "state_guid";
            public const string StateName = "state_name";
            public const string MartialStatus = "martial_status";
            public const string ExamMedium = "exam_medium";
            public const string Board = "board";
            public const string University = "university";
            public const string Stream = "stream";
            public const string Course = "course";

           

            public const string RegTypeListComponent = "reg_type_list_component";
            public const string RegTypeList = "reg_type_list";
            public const string Visible = "visible";
            public const string Visibility = "visibility";
            public const string RegTypeLabel = "reg_type_label";
            public const string Selected = "selected";

            public const string UserPasswordUpdatedSuccessfully = "User password updated successfully";

            public const string QualificationType = "qualification_type";
            public const string RegGridComponentsMain = "reg_grid_components_main";
            public const string RegGridComponentValues = "reg_grid_component_values";
            public const string RegComponentId = "reg_component_id";
            public const string DisplayName = "display_name";
            public const string LabelPosition = "labelposition";
            public const string Input = "input";
            public const string Placeholder = "placeholder";
            public const string DefaultValue = "defaultValue";
            public const string DataParameter = "dataParameter";
            public const string ShowInGrid = "showingrid";
            public const string Isdisabled = "isdisabled";
            public const string Isoutput = "isoutput";
            public const string Label = "label";
            public const string MeasurementType = "MeasurementType";
            public const string Type = "type";
            public const string Height = "height";
            public const string Width = "width";

            public const string MarksType = "marks_type";
            public const string Grade = "grade";
            public const string CandidateGuid2 = "Candidate Guid";
            public const string UniversityBoard2 = "University Board";
            public const string DateofIssuingonFinalyearMarksheet2 = "Date of Issuing on Final Year Marksheet";
            public const string UniversityBoardState2 = "University Board State";
            public const string Stream2 = "Stream";
            public const string QualificationType2 = "Qualification Type";
            public const string DegreeName2 = "Degree Name";
            public const string MarksType2 = "Marks Type";
            public const string Grade2 = "Grade";
            public const string MarksObtained2 = "Marks Obtained";
            public const string MaximumMarks2 = "Maximum Marks";
            public const string PercentageMarksObtained2 = "Percentage Marks Obtained";
            public const string RegComponentId2 = "Reg Component Id";
            public const string RowGuid2 = "Row Guid";

            public const string UniversityBoard3 = "University / Board";
            public const string DateofIssuingonFinalyearMarksheet3 = "Date of issuing of Final year Marksheet";
            public const string UniversityBoardState3 = "University State";
            public const string Stream3 = "Subject";
            public const string DegreeName3 = "Name of Degree";
            public const string MarksObtained3 = "Marks Obtained/CGPA";
            public const string MaximumMarks3 = "Maximum  Marks/CGPA";
            public const string PercentageMarksObtained3 = "Percentage";

            //User
            public const string UserId = "user_id";
            public const string UserTypeId = "user_type_id";
            public const string UserTypeDesc = "user_type_desc";
            public const string ConfirmPassword = "confirm_password";
            public const string OldPassword = "old_password";
            public const string PhoneNumber = "phone_number";
            public const string ParentId = "parent_id";
            public const string OwnerEntityId = "owner_entity_id";
            public const string DefaultOrg = "default_org";
            public const string AppId = "app_id";
            public const string ApplicationGuid = "application_guid";
            public const string AppUsersToOwnerEntitiesId = "app_users_to_owner_entities_id";
            public const string UserGuid = "user_guid";
            public const string GroupId = "group_id";
            public const string GroupName = "group_name";
            public const string GroupDesc = "group_desc";
            public const string Action = "action";

            public const string CertificateIssuingAuthority = "certificate_issuing_authority";
            public const string CertificateIssuingDistrict = "certificate_issuing_district";
            public const string LanguageGuid = "language_guid";
            public const string Qualification = "qualification";
            public const string Post = "post";
            public const string City = "city";
            public const string CityNumber = "city_number";
            public const string CityGuid = "city_guid";
            public const string NoOfCityPriority = "no_of_city_priority";
            public const string TxnId = "txn_id";
            public const string PaytmResponse = "payment_response";
            public const string PayUMoneyResponse = "payumoney_response";
            public const string RazorpayResponse = "razorpay_response";
            public const string RegistrationNumber = "registration_number";
            public const string SpecialCategory = "special_category";
            public const string CheckSumHash = "check_sum_hash";
            public const string MerchantHash = "merchant_hash";
            public const string TxnDate = "txn_date";
            public const string States = "states";
            public const string FromDate = "from_date";
            public const string ToDate = "to_date";
            public const string PaymentResponseFilter = "payment_response_filter";
            public const string TransactionId = "transaction_id";
            public const string TxnAmount = "txn_amount";
            public const string ResponseCode = "response_code";
            public const string ResponseMsg = "response_msg";
            public const string PaymentMode = "payment_mode";
            public const string ModeChequeDD = "mode_cheque_dd";
            public const string Currency = "currency";
            public const string GatewayName = "gateway_name";
            public const string LanguageName = "language_name";
            public const string Description = "description";
            public const string InfoTableName = "info_table_name";
            public const string PaymentGatewayDetails = "payment_gateway_details";
            public const string CheckSum = "check_sum";
            public const string Params = "params";
            public const string Mobile = "mobile";
            public const string IndustryType = "industry_type";
            public const string TaxAmount = "tax_amount";
            public const string CallbackUrl = "callback_url";
            public const string TxnStatus = "txn_status";
            public const string FeeAmount = "fee_amount";
            public const string PaymentGatewayTypes = "payment_gateway_types";
            public const string RegAiAlgos = "reg_ai_algos";
            public const string RegAiLogId = "reg_ai_log_id";
            public const string Colors = "colors";
            public const string BankTxnId = "bank_txn_id";
            public const string Languages = "language";
            public const string Response = "response";
            public const string Registration = "registration";
            public const string RegEligibilityFunctionsMain = "reg_eligibility_functions_main";
            public const string EligibilityFunctionGuid = "eligibility_function_guid";
            public const string EligibilityInputJson = "eligibility_input_json";
            public const string EligibilityStatus = "eligibility_status";
            public const string EligibilityOutputJson = "eligibility_output_json";
            public const string RegistrationToRegTypeStatus = "registration_to_reg_type_status";
            public const string CandidateToRegTypeStatus = "candidate_to_reg_type_status";

            public const string CandidateToRegTypeStatusList = "candidate_to_reg_type_status_list";
            public const string RegistrationMain = "registration_main";
            public const string RegistrationId = "reg_id";
            public const string RegistationFeeTypes = "registation_fee_types";
            public const string RegistrationGuid = "registration_guid";
            public const string LayoutRegistrationGuid = "layout_registration_guid";
            public const string RegistrationCode = "reg_code";
            public const string TemplateFormValue = "template_form_value";
            public const string OTP = "otp";
            public const string EmailId = "email_id";
            public const string ExamLink = "exam_link";

            public const string ExamURL = "exam_url";
            public const string ConfigTypeNAme = "config_type_name";
            public const string ConfigType = "config_type";
            public const string Config_KeyName = "config_key_name";
            public const string ConfigKey = "config_key";
            public const string ResponseTableName = "response_table_name";
            public const string ConfigDetails = "config_details";
            public const string FeeSetupDetails = "fee_setup_details";
            //Email setup
            public const string EmailSetup = "email_setup";
            public const string Smtp = "smtp";
            public const string SmtpPort = "smtp_port";
            public const string SenderEmail = "sender_email";
            public const string SenderName = "sender_name";
            public const string VerifyEmailId = "verify_email_id";
            public const string Password = "password";
            public const string EmailSubject = "email_subject";
            public const string AdmitCardAttach = "admit_card_attach";
            public const string EmailTemplate = "email_template";
            
            public const string SenderGridApiKey = "sendergridapikey";
            public const string AdminServerUrl = "adminserverurl";
            public const string TechServerUrl = "techserverurl";
            public const string OtpExpireMinutes = "otp_expire_minutes";

            public const string DataSave = "data_save";
            public const string DataSaveId = "data_save_id";
            public const string DataSaveRegId = "data_save_reg_id";
            public const string DataSaveFormId = "data_save_form_id";
            public const string DataSavePageId = "data_save_page_id";
            public const string DataSaveSectionId = "data_save_section_id";
            public const string DataSaveComponentId = "data_save_comp_id";
            public const string DataSaveDataValue = "data_save_data_value";
            public const string DataSaveImageValue = "data_save_image_value";
            public const string DataSaveStatus = "data_save_status";
            public const string DataSaveShowinGrid = "data_save_showingrid";
            public const string Title = "title";

            public const string Stats = "stats";
            public const string CachedCheckTime = "checked_check_time";
            public const string MS = "ms";
            public const string SqlConnTime = "sql_conn_time";
            public const string SqlQueryTime = "sql_query_time";
            public const string LoopTime = "loop_time";
            public const string Districts = "districts";
            public const string Cities = "cities";
            public const string Countries = "countries";


            public const string PaymentGatewayTypeId = "payment_gateway_type_id";
            public const string PaymentEnvironmentId = "payment_environment_id";
            public const string PaymentGatewayEnvironmentId = "payment_gateway_environment_id";
            public const string RegistrationToPaymentGateways = "registration_to_payment_gateways";
            public const string ProductionGateway = "production_gateway";
            public const string ProductInfo = "product_info";
            public const string UDF5 = "udf5";
            public const string PrimaryGateway = "primary_gateway";
            public const string StatusGuid = "status_guid";
            public const string GatewayNo = "gateway_no";
            public const string PaymentAmount = "payment_amount";
            public const string OnlinePayment = "online_payment";
            public const string CustomerId = "customer_id";
            public const string CustomerName = "customer_name";
            public const string OrderId = "order_id";
            public const string Mid = "mid";
            public const string MerchantKey = "merchant_key";
            public const string MerchantSalt = "merchant_salt";
            public const string AuthHeader = "auth_header";
            public const string ChannelId = "channel_id";
            public const string BankName = "bank_name";
            public const string ReturnUrl = "return_url";
            public const string PaymentUrl = "payment_url";
            public const string PaytmUrl = "paytm_url";
            public const string PaymentGatewayPaytm = "payment_gateway_paytm";
            public const string PaymentGatewayPayUMoney = "payment_gateway_payumoney";
            public const string PaymentGatewayRazorpay = "payment_gateway_razorpay";
            public const string RegistrationPayGatewayId = "registration_pay_gateway_id";
            public const string KeyId = "key_id";
            public const string KeySecret = "key_secret";           
            public const string AppUrl = "app_url";
            public const string WebSite = "website";
            public const string ExamCode = "exam_code";
            public const string ExamName = "exam_name";
            public const string ExamNumber = "exam_number";
            public const string ExamSetupMain = "exam_setup_main";
            public const string ExamNumberOfShifts = "exam_no_of_shifts";
            public const string ExamDuration = "exam_duration";
            public const string PlanningStatusGuid = "planning_status_guid";
            public const string PlanStatusGuid = "plan_status_guid";
            public const string DurationUOMGuid = "duration_uom_guid";

            public const string ExamElgibilityStatus = "exam_elgibility_status";

            public const string ExamType = "exam_type";
            public const string ExamTypeGuid = "exam_type_guid";
            public const string ExamId = "exam_id";
            public const string RegistrationToLayout = "registration_to_layout";
            public const string RegistrationToCities = "registration_to_cities";
            public const string ExamToRegType = "exam_to_reg_type";
            public const string RegTypeGuid = "reg_type_guid";
            public const string RegTypes = "reg_types";

            public const string Form = "form";
            public const string Components = "comps";
            public const string ComponentId = "comp_id";
            public const string ComponentGuid = "comp_guid";
            public const string ComponentName = "comp_name";
            public const string ComponentValue = "comp_value";
            public const string ComponentCols = "cols";
            public const string ComponentRows = "rows";
            public const string ComponentX = "x";
            public const string ComponentY = "y";
            public const string ComponentStatus = "comp_status";
            public const string Data = "data";
            public const string ExamGuid = "exam_guid";
            public const string Exams= "exams";
            public const string EligibilityCriteria = "eligibiltiy_criteria";

            public const string Validations = "validations";
            public const string ValidationId = "valid_id";
            public const string ValidationRequired = "valid_required";
            public const string ValidationMaxLength = "valid_maxlength";
            public const string ValidationMinLength = "valid_minlength";
            public const string ValidationRegex = "valid_regex";
            public const string ValidationErrorMessage = "valid_errormessage";
            public const string ValidationMinDate = "valid_minDate";
            public const string ValidationMaxDate = "valid_maxDate";
            public const string ValidationStatus = "valid_status";
            public const string ValidationUnique = "valid_unique";

            public const string ValidationOTP = "otp_varification";

            public const string ValidationUniqueURL = "valid_uniqueURL";
            public const string ValidationAllowedExtentions = "valid_allowedExtentions";
            public const string ValidationAllowedSize = "valid_allowedSize";
            public const string ValidationMinHeight = "valid_minHeight";
            public const string ValidationMinWidth = "valid_minWidth";
            public const string ValidationMaxWidth = "valid_maxHeight";
            public const string ValidationMaxHeight = "valid_maxWidth";
            public const string ValidationAllowedFileCount = "valid_allowedFileCount";

            public const string AiParameters = "ai_parameters";

            public const string Conditions = "conditional";
            public const string ConditionId = "condition_id";
            public const string ConditionComponentId = "condition_componentid";
            public const string ConditionComponentGuid = "condition_componentguid";
            public const string ConditionConditional = "condition_conditional";
            public const string ConditionStatus = "condition_status";
            public const string ConditionEventType = "eventType";
            public const string ConditionChangeType = "changeType";
            public const string ConditionComponentToChange = "componentToChange";
            public const string ConditionsectionToShowHide = "sectionToShowHide";

            public const string DataObjects = "data_object";
            public const string DataObjectId = "dataobject_id";
            public const string DataObjectEndPoint = "dataobject_endpoint";
            public const string DataObjectTextField = "dataobject_textfield";
            public const string DataObjectValueField = "dataobject_valuefield";
            public const string DataObjectStatus = "dataobject_status";

            public const string EndPoint = "endpoint";
            public const string LogDate = "log_date";

            public const string DataId = "data_id";
            public const string DataValue = "data_value";
            public const string ConfigValue = "config_value";
            public const string ImageValue = "image_value";
            public const string DataStatus = "data_status";
            public const string DataShowInGrid = "data_showingrid";
           

            public const string Level1 = "level1";
            public const string Level2 = "level2";
            public const string Level3 = "level3";
            public const string Amount = "amount";
            public const string Priority = "priority";
            
            public const string Layout = "layout";
            public const string LayoutId = "layout_id";
            public const string InitialLayoutId = "initial_layout_id";
            public const string LayoutGuid = "layout_guid";
            public const string LayoutName = "name";
            public const string LayoutDescription = "layout_description";
            public const string LayoutStatus = "layout_status";
            public const string LayoutTypeCode = "layout_type_code";
            public const string LayoutJson = "layout_json";
            public const string InitialLayoutJson = "initial_layout_json";
            public const string LayoutCode = "layout_code";
            public const string PaymentGatewayId = "payment_gateway_id";
            public const string PaymentGatewayType = "payment_gateway_type";
            public const string PaymentGatewayStatus = "payment_gateway_status";
            public const string LayoutExamType = "layout_exam_type";
            public const string LayoutExamTypeGuid = "layout_exam_type_guid";
            public const string LayoutPageName = "layout_page_name";
            public const string LayoutClientName = "layout_client_name";
            public const string ExampaymentStatusCssText = "exam_payment_status_css_tag";
            public const string LayoutNumber = "number";

            public const string Pages = "pages";
            public const string PageId = "page_id";
            public const string PageGuid = "page_guid";
            public const string PageName = "page_name";
            public const string PageDescription = "page_description";
            public const string PageStatus = "page_status";
            public const string LayoutType = "layout_type";

            public const string LayoutTypeGuid = "layout_type_guid";
            
            public const string LayoutTypeName = "name";
            public const string LayoutTypeDescription = "description";
            public const string LayoutTypeStatus = "status";

            public const string RegCode = "reg_code";
            public const string RegListGuid = "reg_list_guid";
            public const string FatherName = "father_name";
            public const string Dob = "dob";
            public const string MobileNumber = "mobile_number";
            public const string Photo = "photo";
            public const string Signature = "signature";
            public const string Gender = "gender";
            public const string GenderGuid = "gender_guid";
            public const string CategoryGuid = "category_guid";

            public const string Pc1Guid = "pc1_guid";
            public const string Pc2Guid = "pc2_guid";
            public const string Pc3Guid = "pc3_guid";
            public const string Category = "category";
            public const string AdmitCardId = "admit_card_id";
            public const string Ph = "ph";
            public const string SC = "sc";
            public const string ST = "st";
            public const string Obc = "obc";
            public const string General = "general";
            public const string Pc1 = "pc1";
            public const string Pc2 = "pc2";
            public const string Pc3 = "pc3";
            public const string CategoryName = "category_name";
            public const string Education = "education";

            public const string SaveAnswerKey = "save_answer_key";
            public const string StatusName = "status_name";
            public const string StatusType = "status_type";
            public const string StatusCssTag = "status_css_tag";
            public const string NoOfQuestions = "no_of_questions";
            public const string SectionQuestionsStatus = "section_questions_status";
            public const string QuestionGuid = "question_guid";
            public const string QuestionNumber = "question_number";
            public const string PrimaryQuestionGuid = "primary_question_guid";
            public const string QuestionSummary = "question_summary";
            public const string Question = "question";
            public const string QuestionDescription = "question_description";
            public const string NumberOfOptions = "number_of_options";
            public const string AnswerTypeCode = "answer_type_code";
            public const string Subject = "subject";
            public const string SubjectGuid = "subject_guid";
            public const string QuestionStatusType = "question_status_type";
            public const string PositiveMarks = "positive_marks";
            public const string NegativeMarks = "negative_marks";
            public const string Option = "option";
            public const string OptionGuid = "option_Guid";
            public const string MatchGuid = "match_guid";
            public const string OptionNumber = "option_number";
            public const string MatchDescription = "match_description";
            public const string Answers = "answers";
            public const string ExamInfo = "exam_info";
            public const string AllowedDurationInSeconds = "allowed_duration_in_seconds";

            public const string Sections = "sections";
            public const string SectionId = "section_id";
            public const string SectionGuid = "section_guid";
            public const string SectionName = "section_name";
            public const string SectionDescription = "section_description";
            public const string SectionStatus = "section_status";
            public const string SectionVisibility = "section_visibility";
            public const string SectionCssClass = "section_css_class";

            public const string Settings = "settings";
            public const string SettingId = "setting_id";
            public const string SettingMeasurementType = "setting_measurementType";
            public const string SettingHeight = "setting_height";
            public const string SettingWidth = "setting_width";
            public const string SettingLabelposition = "setting_labelposition";
            public const string SettingType = "setting_type";
            public const string SettingLabel = "setting_label";
            public const string SettingDescription = "setting_description";
            public const string SettingInput = "setting_input";
            public const string SettingDefaultValue = "setting_defaultValue";
            public const string SettingPlaceholder = "setting_placeholder";
            public const string SettingStatus = "setting_status";
            public const string SettingEndPoint = "setting_dataEndpoint";
            public const string SettingDataGetEndpoint = "setting_dataGetEndpoint";
            public const string SettingDataDeleteEndpoint = "setting_dataDeleteEndpoint";
            public const string SettingDataParameter = "setting_dataParameter";
            public const string SettingShowInGrid = "setting_showingrid";
            public const string SettingIsDisabled = "setting_isdisabled";
            public const string SettingIsOutput = "setting_isoutput";
            public const string SettingAllowTextUppercase = "setting_allowTextUppercase";

            public const string CandidateGuid = "candidate_guid";
            public const string CandidateId = "candidate_id";
            public const string RowGuid = "row_guid";
            public const string GridComponentId = "grid_component_id";
            public const string Value = "value";
            public const string FirstName = "first_name";
            public const string LastName = "last_name";
            public const string MiddleName = "middle_name";
            public const string Email = "email";
            public const string AddressLine1 = "address_line1";
            public const string AddressLine2 = "address_line2";
            public const string PhoneNo = "phone_no";
            public const string UserName = "userName";
            public const string EmailVerified = "email_verified";
            public const string PaymentStatus = "payment_status";
            public const string PaymentStatusCSSTag = "payment_status_css_tag";
            public const string PaymentStatusGuid = "payment_status_guid";
            public const string RegistrationStatusGuid = "registration_status_guid";
            public const string RegistrationStatus = "registration_status";
            public const string RegistrationStatusCSSTag = "registration_status_css_tag";
            public const string RegistrationsToExam = "registration_to_exam";

            public const string Address = "address";
            public const string Pincode = "pincode";

            public const string RegistrationData = "registration_data";

            //Captcha
            public const string CaptchaDetails = "captcha_details";
            public const string CaptchaImage = "captcha_image";
            public const string CaptchaId = "captcha_id";
            public const string CaptchaCode = "captcha_code";

            public const string SyncRegistration = "sync_registration";
            public const string SyncServerGuid = "sync_server_guid";
            public const string SyncDate = "sync_date_time";
            public const string FirstSync = "first_sync";

            public const string DestinationPath = "dest_path";
            public const string FileName = "file_name";
            public const string RecordCount = "record_count";
            public const string CandidatesMain = "candidates_main";

  
            public const string CandidateCode = "candidate_code";

            public const string PaymentDate = "payment_date";
            public const string RegistrationDate = "registration_date";
            public const string ModifyDate = "modify_date";

            public const string RequestDateTime = "request_datetime";
            public const string RequestTableName = "request_table_name";
            public const string PayDetail = "pay_detail";

            public const string PaymentGatewayRequest = "payment_gateway_request";
            public const string PaytmRequestDetail = "paytm_request_detail";
            public const string PayUMoneyRequestDetail = "payumoney_request_detail";
            public const string RazorpayRequestDetail = "razorpay_request_detail";
            public const string SBICollectDetail = "sbi_collect_detail";
            public const string PaymentChallanDetail = "payment_challan_detail";
            public const string PaymentChequeDetail = "payment_cheque_detail";
            public const string PayUMoneyId = "payumoney_id";
            public const string PaymentGatewayResponse = "payment_gateway_response";
            public const string PaymentGatewayName = "gateway_name";

            public const string JsonFile = "json_file";
            public const string FileSize = "file_size";
            public const string FilePath = "file_path";
            public const string LastRecordDateTime = "last_record_date_time";
           
            public const string RegAiLogsMain = "reg_ai_logs_main";
            public const string RegAiLogsColor = "reg_ai_logs_color";
            public const string RegAiLogsFaces = "reg_ai_logs_faces";


            public const string RegActivityLogList = "reg_activity_log_list";
            public const string ActivityTypeId = "activity_type_id";
            public const string LogDescription = "log_description";
            public const string TimeStamp = "timestamp";


            public const string Info = "info";
            public const string X = "x";
            public const string Y = "y";

            public const string SubComponents = "subComponents";
            public const string SubComponentId = "subComponentId";
            public const string SubComponentGuid = "subComponentGuid";
            public const string SubComponentName = "subComponentName";
            public const string SubComponentCode = "subComponentcode";
            public const string SubComponentValue = "subComponentvalue";
            public const string SubComponentGroupName = "subComponentgroupName";
            public const string SubComponentSettings = "subComponentsettings";
            public const string SettingVisibility = "setting_visibility";
            public const string SubComponentValidations = "subComponentValidations";
            public const string ChallanNumber = "challan_number";
            public const string ChallanDate = "challan_date";
            public const string ChallanAmount = "challan_amount";

            public const string ChequeNumber = "cheque_dd_number";
            public const string ChequeDate = "cheque_dd_date";
            public const string ChequeAmount = "cheque_dd_amount";

            public const string RazorPayOrderId = "razorpay_order_id";
            public const string RazorPayPaymentId = "razorpay_payment_id";
            public const string RazorPaySignature = "razorpay_signature";

            public const string QualificationTypeName = "qualification_type_name";
            public const string QualificationTypeGuid = "qualification_type_guid";
            public const string DegreeName = "degree_name";
            public const string DegreeGuid = "degree_guid";
            public const string Percentage = "percentage";
            public const string ExamEligibiltiy = "exam_eligibiltiy";
            public const string UniversityBoardState = "university_board_state";
            public const string UniversityBoard = "university_board";
            public const string DateofIssuingonFinalyearMarksheet = "date_of_issuing_on_final_year_marksheet";
            public const string MarksObtained = "marks_obtained";
            public const string MaximumMarks = "maximum_marks";
            public const string PercentageMarksObtained = "percentage";
           

        }
    }
}