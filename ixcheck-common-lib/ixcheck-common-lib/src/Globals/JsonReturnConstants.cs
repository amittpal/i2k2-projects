namespace IXCheckCommonLib.Globals
{
	public class JsonReturnConstants
	{
		public static class PropertyNames
		{
			//objects
			public const string Customers = "customers";
			public const string CustomerUsers = "customer_users";
			public const string Invoices = "invoices";
			public const string UserGroupsFilter = "user_groups_filter";
			public const string CustomersFilter = "customers_filter";
			public const string PaymentsFilter = "payments_filter";
			public const string InvlicesFilter = "invoices_filter";
			public const string OrdersFilter = "orders_filter";
			public const string CustomersFilterObject = "customers_filter_object";
			public const string FilterObject = "filter_object";
			public const string Orders = "orders";
            public const string DaasOrders = "daas_orders";

            public const string Tests = "tests";
			public const string TestsFilter = "tests_filter";
			public const string TestsFilterObject = "tests_filter_object";

			public const string Test = "test";
			public const string Bank = "bank";
            public const string ServiceGroupId = "service_group_id";
            public const string ServiceGroup = "service_group";
            public const string ServiceDesc = "service_desc";
            public const string Customer = "customer";
			public const string BadDebts = "bad_debts";
			public const string Order = "order";
			public const string Invoice = "invoice";
			public const string Filter = "filter";
			public const string Paging = "paging";
			public const string Cols = "cols";
			public const string Stats = "stats";
			public const string HttpPostObjectType = "http_post_object_type";
			public const string HttpPostObject = "http_post_object";
			public const string TestFilterObject = "test_filter_object";
			public const string MinMaxValues = "min_max_values";
			public const string ApplicationFilter = "application_filter";


			//api 
			public const string HttpStatus = "http_status";
			public const string Token = "token";
			public const string AccessToken = "access_token";
			public const string AccessPermissions = "access_permissions";
			public const string AccessGroups = "access_groups";
			public const string Data = "data";
			public const string ErrorType = "error_type";
			public const string ErrorMessage = "error_message";
			public const string Type = "type";
			public const string Attributes = "attributes";
			public const string MessageType = "message_type";
			public const string Message = "message";


			//Paging
			public const string TotalRows = "total_rows";
			public const string LastOffset = "last_offset";
			public const string OffSet = "off_set";
			public const string LastSeenIdMax = "last_seen_id_max";
			public const string LastSeenIdMin = "last_seen_id_min";
			public const string LastSeenId = "last_seen_id";
			public const string PageSize = "page_size";
			public const string SortBy = "sort_by";
			public const string SortOrderDirection = "order_dir";
			public const string Direction = "direction";
			public const string CustomerFirstName = "customer_first_name";
			public const string CustomerName = "customer_name";
            public const string Desktops = "desktops";
            public const string PageNumber = "page_num";
			public const string LocationId = "location_id";
			public const string SortExpression = "sort_exp";
			public const string SortDirection = "sort_dir";
			public const string SortDirectionInner = "sort_dir_inner";
			public const string OrderBy = "order_by";

            public const string Id = "id";
            public const string Number = "number";
			public const string Code = "code";
			public const string Name = "name";
			public const string Description = "description";
			public const string Action = "action";
			public const string Status = "status";
			public const string Units = "units";
			public const string TimezoneId = "timezone_id";
			public const string TimezoneName = "timezone_name";
			public const string StatusText = "status_text";
			public const string StatusCSSTag = "status_css_tag";
			public const string Title = "title";
			public const string Url = "url";
			public const string Version = "version";
			public const string PublishedDate = "published_date";
			public const string CanBeGrouped = "can_be_grouped";
			public const string Recurring = "recurring";
            public const string DesktopId = "desktop_id";
            public const string DesktopName = "desktop_name";
            public const string PermissionId = "permission_id";
			public const string PermissionName = "permission_name";
			public const string PermissionGroupId = "permission_group_id";
			public const string PermissionGroupName = "permission_group_name";
			public const string PermissionGroupDesc = "permission_group_desc";
			public const string GroupDesc = "group_desc";
			public const string RowCount = "rowcount";
			public const string LoopTime = "loop_time";
			public const string SqlConnTime = "sql_conn_time";
			public const string SqlQueryTime = "sql_query_time";
			public const string CacheCheckTime = "cached_check_time";
			public const string ReturnedRows = "returned_rows";
			public const string MS = "ms";
			public const string Revenue = "revenue";
			public const string OrderValue = "order_value";
			public const string HasSchedule = "has_schedule";
			public const string CallerName = "caller_name";
			public const string AgentId = "agent_id";
			public const string AgentName = "agent_name";
			public const string CallerId = "caller_id";
			public const string CustomerId = "customer_id";
			public const string InvoiceTdsId = "invoice_tds_id";
			public const string CreditNotId = "credit_note_id";
			public const string BadDebtsType = "bad_debts_type";
			public const string BadDebtsTypeId = "bad_debts_type_id";
			public const string BadDebtsAccount = "bad_debts_account";
			public const string CustomerNumber = "customer_number";
            public const string SubCustomerNumber = "sub_customer_number";
            public const string AccountNumber = "account_number";
			public const string AccountType = "Account_type";
			public const string CustomerTypeId = "customer_type_id";
			public const string SubCustomerTypeId = "sub_customer_type_id";
			public const string SubCustomerId = "sub_customer_id";
			public const string CustomerParentId = "customer_parent_id";
			public const string CustomerType = "customer_type";
			public const string SubCustomerTypeDesc = "sub_cust_desc";
			public const string PANNumber = "pan_number";
			public const string TANNumber = "tan_number";
			public const string FirstName = "first_name";
			public const string MiddleName = "middle_name";
			public const string LastName = "last_name";
			public const string FullName = "full_name";
			public const string Company = "company";
			public const string Phone = "phone";
			public const string Mobile = "mobile";
			public const string Fax = "fax";
			public const string Email = "email";
			public const string Other = "other";
			public const string Website = "website";
			public const string Notes = "notes";
			public const string StreetNumber = "street_number";
			public const string StreetAddress = "street_address";
			public const string City = "city";
			public const string State = "state";
			public const string StateName = "state_name";
			public const string PostCode = "post_code";
			public const string Zip = "zip";
			public const string Country = "country";
			public const string CountryName = "country_name";
			public const string ProfileId = "profile_id";
			public const string PaymentProfileId = "payment_profile_id";
			public const string HasChild = "has_child";
			public const string HasSubCategory = "has_sub_category";
			public const string HasCategory = "has_category";
			public const string StateId = "state_id";
			public const string StateCode = "state_code";
			public const string GSTNumber = "gst_number";
			public const string TdsPercentage = "tds_percentage";
			public const string TdsLogic = "tds_logic";
			public const string GSTVerified = "gst_verified";

			public const string DateModified = "date_modified";
			public const string Plus = "plus";
			public const string Files = "files";
			public const string DateModifiedUTC = "date_modified_utc";
			public const string Size = "size";
			public const string FilePath = "file_path";
			public const string SourcePath = "source_path";
			public const string DestinationPath = "dest_path";
			public const string FileName = "file_name";
			public const string RootDirectory = "root_directory";
			public const string RootDir = "root_dir";
			public const string RootPath = "root_path";
			public const string LocalDirPath = "local_dir_path";
			public const string RemoteDirPath = "remote_dir_path";
			public const string DirectoryPath = "dirrectory_path";
			public const string DirPath = "dir_path";
			public const string Folders = "folders";
			public const string DirectoryListing = "dir_listing";
			public const string ParentDirectory = "parent_dir";
			public const string CurrentDirectory = "current_dir";
			public const string FolderName = "folder_name";
			public const string IsFolder = "is_folder";

			public const string UserId = "user_id";
			public const string UserName = "user_name";
			public const string UserTypeId = "user_type_id";
			public const string PhoneNumber = "phone_number";
			public const string PasswordHash = "password_hash";
			public const string UserTypeDesc = "user_type_desc";

			// Application Filter
			public const string PageName = "page_name";
			public const string FilterName = "filter_name";
			public const string JsonObject = "json_object";

			//User Group
			public const string UserGroup = "user_group";
			public const string GroupId = "group_id";
			public const string GroupOwnerUserId = "group_owner_user_id";
			public const string GroupName = "group_name";

			public const string Permissions = "permissions";
			public const string Permission = "permission";
			public const string PermissionsFilter = "permissions_filter";
			public const string OrgsTypes = "orgs_types";
			public const string OrgsTypesFilter = "orgs_types_filter";
			public const string Organization = "organization";
			public const string OrganizationsFilter = "organization_filter";
			public const string UserTypesFilter = "user_types_filter";
			public const string UsersFilter = "User_filter";

			//Org
			public const string ShippingAddresses = "shipping_addresses";
			public const string Organizations = "organizations";
			public const string orgAgencyId = "agency_id";
			public const string OrgPostalCode = "org_postal_code";
			public const string OrgBillable = "org_billable";
			public const string OrgStatus = "status";
			public const string CountryId = "country_id";
			public const string ShortAddress = "short_address";
			public const string FullAddress = "full_address";

			//Org Types
			public const string OrgTypes = "org_types";
			public const string OrgTypeName = "org_type_name";
			public const string OrgTypeDescription = "org_type_desc";

			//User Types
			public const string UsersTypes = "user_types";
			public const string UserType = "user_type";
			public const string CoreUserInfo = "core_user_info";

			public const string UserTypes = "user_types";

			public const string User = "user";
			public const string Users = "users";
			public const string Password = "password";

			public const string AssignPermissions = "assign_permissions";
			public const string UnAssignPermissions = "unassign_permissions";

			public const string PermissionList = "permission_list";
			public const string AssignPermissionGroups = "assign_permission_groups";
			public const string UnAssignPermissionGroups = "unassign_permission_groups";

			public const string OldPassword = "old_password";
			public const string NewPassword = "new_password";
			public const string ConfirmPassword = "confirm_password";

			//objects
			public const string Countries = "countries";
			public const string States = "states";
			public const string Locations = "locations";
            public const string ServiceGroups = "service_groups";
            public const string Banks = "banks";
			public const string Departments = "departments";
			public const string Timezones = "timezones";
			public const string ServiceLocations = "service_locations";
			public const string ServiceLocation = "service_location";
			public const string WorkerTypesFilter = "Worker_types_filter";
			public const string CreditNoteFilter = "credit_note_filter";
			public const string LocationsFilter = "locations_filter";
			public const string ProductTypeFilter = "product_type_filter";
			public const string ProductCategoryFilter = "product_category_filter";
			public const string PositionsFilter = "positions_filter";
			public const string TdsFilter = "tds_filter";
			public const string BadDebtsFilter = "bad_debts_filter";
			public const string BanksFilter = "banks_filter";
			public const string BranchesFilter = "branches_filter";


			public const string ProductSubCategoryFilter = "product_Sub_category_filter";
			public const string DepartmentFilter = "department_filter";

			// timezone
			public const string TimeZoneName = "time_zone_name";
			public const string CanDelete = "can_delete";
			public const string TimeZoneCode = "time_zone_code";
			public const string RegularUTCDifference = "regular_utc_difference";

			// location 
			public const string Location = "location";
			public const string Worker = "worker";
			public const string Department = "department";


			public const string MachineName = "machine_name";


			// Worker Type
			public const string WorkerTypes = "worker_types";
			public const string Workers = "workers";

			public const string TransactionId = "trans_id";
			public const string Address = "address";
			public const string InvoiceDate = "invoice_date";
			public const string Age = "age";
			public const string DueDate = "due_date";
			public const string ServiceLocationId = "service_location_id";
			public const string JsonLogText = "json_log";
			public const string FromDate = "from_date";
			public const string ToDate = "to_date";

			public const string TotalCogAmountApplied = "total_cog_amount_applied";

			public const string OrderId = "order_id";
            public const string OrderItemId = "order_item_id";
            public const string ServiceGroupItems = "service_group_items";            
            public const string OrderType = "order_type";
			public const string OrderName = "order_name";

			public const string ViewType = "view_type";
			public const string MinLineItems = "min_line_items";
			public const string ShowTax = "show_tax";
			public const string ShowSubTotal = "show_sub_total";
			public const string SendEmail = "send_email";
			public const string ApprovalStatus = "approval_status";

			

			public const string MimeTypes = "mime_types";
			public const string FileTypes = "file_types";
			public const string FileType = "file_type";
			public const string FileSizeMB = "file_size_mb";
			public const string URL = "url";

			public const string Settings = "settings";
			public const string Width = "width";
			public const string Height = "height";
			public const string Canvas = "canvas";

			public const string FileId = "file_id";
			public const string File = "file";
			public const string RawFile = "rawFile";
			public const string Image = "image";


			// Email Params
			public const string MailFrom = "mail_from";
			public const string MailTo = "mail_to";
			public const string MailCc = "mail_cc";
			public const string MailBcc = "mail_bcc";
			public const string MailSubject = "mail_subject";
			public const string MailBody = "mail_body";
			public const string MailAttachment = "mail_attachment";
			public const string MailAttachmentPath = "mail_attachment_path";
			public const string IsHtml = "is_html";
			public const string Content = "content";
			public const string MailJobType = "mail_job_type";

			public const string ExtraInfo = "extra_info";
			public const string customerInfo = "customer_info";
			public const string PaymentInfo = "payment_info";
			public const string TechInfo = "tech_info";
			public const string OrderInfo = "order_info";

			public const string RecordType = "record_type";
			public const string Config = "config";
			public const string LineItems = "lineitems";
			public const string SubCustomer = "sub_customer";
			public const string InvoiceLineItems = "invoice_lineitems";
			public const string CreditNoteLineItems = "credit_note_lineitems";
			public const string TaxRate = "tax_rate";
			public const string IgstTaxRate = "igst_tax_rate";
			public const string CgstTaxRate = "cgst_tax_rate";
			public const string SgstTaxRate = "sgst_tax_rate";
			public const string TaxRateId = "tax_rate_id";
			public const string TaxRateName = "tax_rate_name";
			public const string TaxId = "tax_id";
			public const string TaxValue = "tax_value";
			public const string TaxResponse = "tax_response";
			public const string AgencyId = "agency_id";
			public const string TaxCode = "tax_code";
			public const string TaxType = "tax_type";
			public const string TaxPaid = "tax_paid";
			public const string TaxAmount = "tax_amount";
			public const string IgstTaxAmount = "igst_tax_amount";
			public const string CgstTaxAmount = "cgst_tax_amount";
			public const string SgstTaxAmount = "sgst_tax_amount";
			public const string IgstTax = "igst";
			public const string CgstTax = "cgst";
			public const string SgstTax = "sgst";
			public const string Discount = "discount";
			public const string DiscountAmount = "discount_amount";
			public const string DiscountTypeId = "discount_type_id";
			public const string DiscountType = "discount_type";
			public const string DiscountTypeUnit = "discount_type_unit";
			public const string DiscountValue = "discount_value";
			public const string COGStatusId = "cog_status_id";
			public const string DueAmount = "due_amount";
			public const string PaidAmount = "paid_amount";
			public const string BalanceAmount = "balance_amount";
			public const string AppliedAmount = "applied_amount";
			public const string TaxableAmount = "taxable_amount";
			public const string NonTaxableAmount = "non_taxable_amount";
			public const string TotalAmountAfterDiscount = "total_amount_after_discount";
			public const string Amount = "amount";
			public const string TotalAmount = "total_amount";
			public const string TotalAmountInWords = "total_amount_in_words";
			public const string SubTotalAmount = "sub_total_amount";
			public const string TechName = "tech_name";
			public const string CreateDate = "create_date";
			public const string JobStatus = "job_status";
			public const string CreatedDate = "created_date";
			public const string ExpireDate = "expire_date";
			public const string Date = "date";
			public const string Group = "group";
			public const string Elements = "elements";
			public const string Label = "label";
			public const string Value = "value";
			public const string Count = "count";
			public const string TypeOf = "typeof";
			public const string Checked = "checked";
			public const string MinLength = "minlength";
			public const string MaxLength = "maxlength";
			public const string Min = "min";
			public const string Max = "max";
			public const string LineNumber = "line_num";
			public const string Balance = "balance";

			// Payment
			
			public const string RoutingNumber = "routing_number";
			public const string RoutingNumber1 = "routing_number_1";
			public const string NameOnAccount = "name_on_account";
			public const string EChequeType = "echeque_type";
			public const string ChequeBankName = "cheque_bank_name";
			public const string ChequeNumber = "cheque_number";
			public const string ChequeDate = "cheque_date";
			public const string CardNumber = "card_number";
			public const string NameOnCard = "name_on_card";
			public const string CVVNumber = "cvv_number";
			public const string CardExpireDate = "expiration_date";
			public const string PaymentRefId = "ref_id";
			public const string CardExpireMonth = "expiration_month";
			public const string CardExpireYear = "expiration_year";
			public const string OrganizationName = "org_name";
			public const string OrganizationAddress = "org_Address";
			public const string PaymentId = "payment_id";

			public const string PayPercent = "pay_percent";
			public const string PaymentDate = "payment_date";
			public const string TdsDate = "tds_date";
			public const string CreditNoteDate = "credit_note_date";
			public const string PaymentcustomerDigits = "payment_customer_digits";
			public const string TransAuthCode = "trans_auth_code";
			public const string TransStatus = "trans_status";
			public const string TransType = "trans_type";
			public const string ProfileEmailId = "profile_email_id";
			public const string Payments = "payments";
			public const string Tds = "tds";
			public const string PaymentDetail = "payment_detail";
			public const string PaymentStatus = "payment_status";
			public const string PaymentStatusText = "payment_status_text";
			public const string CashNotes = "cash_notes";
			public const string PaymentProfileAction = "payment_profile_action";
			public const string PaymentCustomerInfo = "payment_customer_info";


			public const string PaymentToInvoice = "payment_to_invoice";
			public const string TdsToInvoice = "tds_to_invoice";
			public const string BadDebtsToInvoice = "bad_debts_to_invoice";
			public const string CreditNoteToInvoice = "credit_note_to_invoice";

			public const string ClientName = "client_name";
			public const string TransactionNumber = "transaction_number";
			public const string ReceivedDate = "received_date";
			public const string ChequeDepositBank = "cheque_deposit_bank";
			public const string ChequeDepositDate = "cheque_deposit_date";
			public const string CashDepositDate = "cash_deposit_date";
			public const string DepositBank = "deposit_bank";
			public const string ChequeClearanceDate = "cheque_clearance_date";

			// Vendors
			public const string Vendors = "vendors";
			public const string Vendor = "vendor";
			public const string VendorTypeId = "vendor_type_id";
			public const string VendorType = "vendor_type";
			public const string VendorNumber = "vendor_number";
			public const string VendorName = "vendor_name";

			public const string InvoiceStatus = "invoice_status";
			public const string InvoiceStatusText = "invoice_status_text";
			public const string IssuesName = "issues_name";

			public const string DocLast4Digit = "doc_last_4digit";
			public const string ProfileEmail = "profile_email";
			public const string Profiles = "profiles";

			public const string UsersAssignList = "assign_users";
			public const string UsersUnAssignList = "unassign_users";
			public const string UsersAssignCount = "assign_users_count";
			public const string UsersUnAssignCount = "unassign_users_count";

			public const string AssignPermissionsCount = "assign_permissions_count";
			public const string UnAssignPermissionsCount = "unassign_permissions_count";

			public const string Taxes = "taxes";
			public const string ApplicationFilters = "application_filters";
			public const string Tax = "tax";
			public const string TaxItems = "tax_items";
			public const string PublicBank = "public_bank";
			public const string TransactionDate = "transaction_date";

			public const string HscCodeId = "hsc_code_id";
			public const string InfraId = "infra_id";
			public const string FlavourId = "flavour_id";
			public const string HscCodes = "Hsc_codes";			

			// product hsc code			
			public const string InfraStructures = "infra_structures";
			public const string FlavorGuid = "flavor_guid";
			public const string ImageGuid = "image_guid";
			public const string Cpu = "cpu";
			public const string Memory = "memory";
			public const string Disk = "disk";
			public const string OpenstackFlavors = "openstack_flavors";
			public const string OpenstackImages = "openstack_images";		
			public const string HscCode = "hsc_code";
			public const string ProductToInfraOpenStackImages = "product_to_infra_openstack_images";
			public const string CustomerToProduct = "customer_to_product";
			public const string OpenStackFlavorId = "openstack_flavor_id";
			public const string OpenStackImageId = "openstack_image_id";
			public const string ProductToCustomers = "product_to_customers";
			public const string CustomerProductTypeId = "customer_product_type_id";
			public const string ProductToInfraOpenstackFlavors = "product_to_infra_openstack_flavors";
			public const string CityId = "city_id";
			public const string DistrictId = "district_id";
			public const string District = "district";
			public const string Districts = "districts";
			public const string Cities = "cities";
			public const string BranchName = "branch_name";
			public const string IFSC = "ifsc";
			public const string BankToBranches = "bank_to_branches";
			public const string BankBranches = "bank_branches";

			public const string AccountMasterId = "account_master_id";
			public const string AccountMasters = "account_masters";
			public const string AccountMasterFilter = "account_master_filter";
			public const string IndianCurrency = "indian_currency";

            public const string InvoiceAmount = "invoice_amount";
            public const string InvoicePaidAmount = "invoice_paid_amount";
            public const string TotalTdsAmount = "total_tds_amount";
            public const string TotalCreditNoteAmount = "total_credit_note_amount";
            public const string PaymentAmount = "payment_amount";
            public const string PaymentApplied = "payment_applied";
            public const string TdsPaidAmount = "tds_paid_amount";

			public const string CustomerInfo = "customer_info";
			public const string CompanyName = "company_name";

			public const string CustomerUserFullName = "customer_user_full_name";
		}
	}
}



