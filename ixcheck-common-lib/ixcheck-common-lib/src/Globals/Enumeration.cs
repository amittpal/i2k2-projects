namespace IXCheckCommonLib.Globals
{
    public class Enumeration
    {
        public enum LogLevel
        {
            Trace = 0,
            Debug = 1,
            Information = 2,
            Warning = 3,
            Error = 4,
            Critical = 5
        }
        public enum LogTarget
        {
            File,
            Database,
            EventLog
        }

        public enum DataType
        {
            String,
            DateTime,
            Int,
            UInt64,
            Boolean
        }

        public enum ObjectType
        {
            Test,
            Customer,
            SubCustomer,
            Location,
            LocationWithJoin,
            DepartmentWithJoin,
            Invoice,
            InvoiceWithJoin,
            Quote,
            PO,
            Product,
            ProductType,
            ProductTypeWithJoin,
            Products,
            ProductsWithJoin,
            ProductsInfoWithJoin,
            User,
            Permission,
            ProductCategoriesWithJoin,
            ProductSubCategoriesWithJoin,
            PositionWithJoin,
            WorkerTypeWithJoin,
            WorkerWithJoin,
            OrgsType,
            OrgazinationWithJoin,
            UserType,
            UserWithJoin,
            OrderWithJoin,
            PaymentWithJoin,
            TdsWithJoin,
            CreditNoteWithJoin,
            UserGroupWithJoin,
            CustomerUserWithJoin,
            BadDebtsWithJoin,
            BankWithJoin,
            ApplicationFilter,
            ServiceGroupWithJoin,
			AccountMasterWithJoin,
			BranchesWithJoin,
        }

        public enum InvoiceStatus
        {
            Unassigned = 1,
            Assigned = 2,
            Unapproved = 3,
            Approved = 4,
            ApprovedInvoiceBalance = 5,
            ApprovedInvoicePaid = 6,
        }

        public enum PaymentTypeEnum
        {
            CC = 1,
            ECHEQUE = 2,
            CHEQUE = 3,
            CASH = 4,
            ONLINE = 5
        }

        public enum PaymentMessageTypeEnum
        {
            Ok = 0,
            Error = 1
        }

        public enum RequestType
        {
            GET,
            POST,
            PUT,
            DELETE,
            HEAD,
            PATCH,
            OPTIONS,
            FORM,
            QUERYSTRING
        }

        public enum MailJobTypeEnum
        {
            None = 0,
            Email = 2,
            WelcomeEmail = 7,
            NewUserEmail = 8,
            ResetPasswordEmail = 9,
            EmailEndcustomerOrder = 10,
            DaasWelcomeEmail = 11,
            DaasResetPasswordEmail = 12
        }
    }
}
