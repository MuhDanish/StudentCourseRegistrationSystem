using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace StudentCourseRegistrationSystem.Common
{
    public static class DBConnection
    {

        public static string _DataSource = ".";
        public static string _InitialCatalog = "CourseManagement";
        public static string _UserID = "DESKTOP-953MN58";
        public static string GetConnectionString()
        {
            SqlConnectionStringBuilder sqlString = new SqlConnectionStringBuilder()
            {
                DataSource = _DataSource,
                InitialCatalog = _InitialCatalog,
                IntegratedSecurity = true
            };
            return sqlString.ToString();
        }
    }
}