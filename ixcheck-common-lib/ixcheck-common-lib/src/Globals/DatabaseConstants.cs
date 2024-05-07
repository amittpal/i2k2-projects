using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Globals
{
    public class DatabaseConstants
    {
        public static class ColumnNames
        {
            public const string DESC = "DESC";
            public const string Id = "id";
            public const string Code = "code";
            public const string Name = "name";
            public const string Description = "description";
            public const string Type = "type";
            public const string TypeId = "type_id";
            public const string Value = "value";
            public const string Status = "status";
            public const string IsTaxable = "is_taxable";
            public const string CanBeGrouped = "can_be_grouped";
            public const string Recurring = "recurring";


            public const string TotalAmount = "total_amount";
            public const string SubTotalAmount = "sub_total_amount";
            public const string IgstTaxAmount = "igst_tax_amount";
            public const string SgstTaxAmount = "sgst_tax_amount";
            public const string CgstTaxAmount = "Cgst_tax_amount";
            public const string Amount = "amount";

            public const string GSTNumber = "gst_number";
            public const string GSTVerified = "gst_verified";

            public const string Units = "units";

            public const string ConfigTypeName = "config_type_name";
            public const string ConfigKeyName = "config_key_name";
            public const string PasswordHash = "password_hash";
            public const string WorkerId = "worker_id";
            public const string OrgId = "org_id";
            public const string Cuid = "cu_id";
            public const string UserId = "user_id";
            public const string UserName = "username";
            public const string UserTypeId = "user_type_id";
            public const string PhoneNumber = "phone_number";
            public const string UserType = "user_type";
            public const string Permission = "permission";
            public const string PermissionID = "permission_id";
            public const string PermissionName = "permission_name";
            public const string TimeZoneId = "timezone_id";
            public const string TimeZoneName = "timezone_name";
            public const string UserTypeDesc = "user_type_desc";

            //customers

            public const string CallerId = "caller_id";
            public const string CustomerId = "customer_id";
            public const string CustomerName = "customer_name";
            public const string Desktops = "desktops";
            public const string CompanyName = "company_name";
            public const string CustomerNumber = "customer_number";
            public const string CustomerTypeId = "customer_type_id";
            public const string SubCustomerTypeId = "sub_customer_type_id";
            public const string CustomerType = "customer_type";
            public const string SubCustomerTypeDesc = "sub_cust_desc";
            public const string PANNumber = "pan_number";
            public const string TANNumber = "tan_number";
            public const string FirstName = "first_name";
            public const string MiddleName = "middle_name";
            public const string LastName = "last_name";
            public const string FullName = "full_name";
            public const string CreateDate = "create_date";
            public const string CreatedDate = "created_date";
            public const string UpdateDate = "update_date";
            public const string UpdatedDate = "updated_date";
            public const string AgentId = "agent_id";
            public const string Company = "company";
            public const string StateId = "state_id";
            public const string StateCode = "state_code";
            public const string StreetNumber = "street_number";
            public const string StreetAddress = "street_address";
            public const string City = "city";
            public const string State = "state";
            public const string PostCode = "post_code";
            public const string Country = "country";
            public const string Address = "address";
            public const string FullAddress = "full_address";
            public const string Phone = "phone";
            public const string Mobile = "mobile";
            public const string Fax = "fax";
            public const string Email = "email";
            public const string PaymentDate = "payment_date";
            public const string Other = "other";
            public const string Website = "website";
            public const string HasChild = "has_child";
            public const string StatusText = "status_text";
            public const string StatusCSSTag = "status_css_tag";

            // Workers

            public const string Suffix = "suffix";
            public const string DisplayName = "display_name";
            public const string AddressLine1 = "address_line_1";
            public const string AddressLine2 = "address_line_2";
            public const string Notes = "notes";
            public const string Title = "title";
			public const string FilterName = "filter_name";
			public const string JsonObject = "json_object";

		}

        public static class DataTypes
        {
            public const string String = "string";
            public const string Int = "int";
            public const string Int64 = "int64";
            public const string UInt32 = "uint32";
            public const string UInt64 = "uint64";
            public const string DateTime = "datateime";
            public const string Boolean = "bool";
            public const string Object = "object";
            public const string Decimal = "decimal";
        }
    }
}
