using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace StudentCourseRegistrationSystem.Common
{
    public static class DBConnection
    {
        public static string _DataSource = "172.16.23.11";
        public static string _InitialCatalog = "Unique";
        public static string _UserID = "sa";
        public static string _Password = "Dbtest**cas963";
        public static string GetConnectionString()
        {
            SqlConnectionStringBuilder sqlString = new SqlConnectionStringBuilder()
            {
                DataSource = _DataSource,
                InitialCatalog = _InitialCatalog,
                UserID = _UserID,
                Password = _Password,
            };
            return sqlString.ToString();
        }
    }
}