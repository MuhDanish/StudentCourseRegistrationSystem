using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace StudentCourseRegistrationSystem.Common
{
    public class AdoHelper : IDisposable
    {
        // Internal members
        protected string _connString = null;
        protected SqlConnection _conn = null;
        protected SqlTransaction _trans = null;
        protected bool _disposed = false;

        /// <summary>
        /// Sets or returns the connection string use by all instances of this class.
        /// </summary>
        public static string ConnectionString { get; set; }

        /// <summary>
        /// Returns the current SqlTransaction object or null if no transaction
        /// is in effect.
        /// </summary>
        public SqlTransaction Transaction { get { return _trans; } }

        /// <summary>
        /// Constructor using global connection string.
        /// </summary>
        public AdoHelper()
        {
            ConnectionString = DBConnection.GetConnectionString();
            _connString = ConnectionString;
            Connect();
        }

        /// <summary>
        /// Constructure using connection string override
        /// </summary>
        /// <param name="connString">Connection string for this instance</param>
        public AdoHelper(string connString)
        {
            _connString = connString;
            Connect();
        }

        // Creates a SqlConnection using the current connection string
        protected void Connect()
        {
            _conn = new SqlConnection(_connString);

            _conn.Open();
        }

        /// <summary>
        /// Constructs a SqlCommand with the given parameters. This method is normally called
        /// from the other methods and not called directly. But here it is if you need access
        /// to it.
        /// </summary>
        /// <param name="qry">SQL query or stored procedure name</param>
        /// <param name="type">Type of SQL command</param>
        /// <param name="args">Query arguments. Arguments should be in pairs where one is the
        /// name of the parameter and the second is the value. The very last argument can
        /// optionally be a SqlParameter object for specifying a custom argument type</param>
        /// <returns></returns>
        public SqlCommand CreateCommand(string qry, CommandType type, params object[] args)
        {
            SqlCommand cmd = new SqlCommand(qry, _conn);

            // Associate with current transaction, if any
            if (_trans != null)
                cmd.Transaction = _trans;

            // Set command type
            cmd.CommandType = type;
            cmd.CommandTimeout = 60;

            // Construct SQL parameters
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] is string && i < (args.Length - 1))
                {
                    SqlParameter parm = new SqlParameter();
                    parm.ParameterName = (string)args[i];
                    parm.Value = args[++i];
                    cmd.Parameters.Add(parm);
                }
                else if (args[i] is SqlParameter)
                {
                    cmd.Parameters.Add((SqlParameter)args[i]);
                }
                else throw new ArgumentException("Invalid number or type of arguments supplied");
            }
            return cmd;
        }

        /// <summary>
        /// Constructs a SqlCommand with the given parameters. This method is normally called
        /// from the outside methods and executed outside. But here it is if you need access
        /// to it.
        /// </summary>
        /// <param name="qry">SQL query or stored procedure name</param>
        /// <param name="type">Type of SQL command</param>
        /// <returns></returns>
        public SqlCommand CreateCommand(string qry, CommandType type)
        {
            SqlCommand cmd = new SqlCommand(qry, _conn);

            // Associate with current transaction, if any
            if (_trans != null)
                cmd.Transaction = _trans;

            // Set command type
            cmd.CommandType = type;
            cmd.CommandTimeout = 60;
            return cmd;
        }

        #region Exec Members

        /// <summary>
        /// Executes a query that returns no results
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>The number of rows affected</returns>
        public int ExecNonQuery(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                int Result = cmd.ExecuteNonQuery();
                CloseConnectionExplicity();
                return Result;
            }
        }

        /// <summary>
        /// Executes a stored procedure that returns no results
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>The number of rows affected</returns>
        public int ExecNonQueryProc(string proc, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(proc, CommandType.StoredProcedure, args))
            {

                int Result = cmd.ExecuteNonQuery();
                CloseConnectionExplicity();
                return Result;


            }
        }

        /// <summary>
        /// Executes a query that returns a single value
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Value of first column and first row of the results</returns>
        public object ExecScalar(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                object Result = cmd.ExecuteScalar();
                CloseConnectionExplicity();
                return Result;


            }
        }

        /// <summary>
        /// Executes a query that returns a single value
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Value of first column and first row of the results</returns>
        public object ExecScalarProc(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                object Result = cmd.ExecuteScalar();
                CloseConnectionExplicity();
                return Result;
            }

        }

        /// <summary>
        /// Executes a query and returns the results as a SqlDataReader
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a SqlDataReader</returns>
        public SqlDataReader ExecDataReader(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {

                SqlDataReader Result = cmd.ExecuteReader();
                CloseConnectionExplicity();
                return Result;


            }
        }

        /// <summary>
        /// Executes a stored procedure and returns the results as a SqlDataReader
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a SqlDataReader</returns>
        public SqlDataReader ExecDataReaderProc(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                SqlDataReader Result = cmd.ExecuteReader();
                CloseConnectionExplicity();
                return Result;
            }
        }

        /// <summary>
        /// Executes a query and returns the results as a DataSet
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataSet ExecDataSet(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                adapt.Fill(ds);
                CloseConnectionExplicity();
                return ds;
            }
        }

        /// <summary>
        /// Executes a query and returns the results as a DataTable
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataTable ExecDataTable(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapt.Fill(dt);
                CloseConnectionExplicity();
                return dt;
            }
        }

        /// <summary>
        /// Executes a stored procedure and returns the results as a Data Set
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataSet ExecDataSetProc(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                adapt.Fill(ds);
                CloseConnectionExplicity();
                return ds;
            }

        }

        ////<summary>
        //// To Explicity Close a connection By Irfan 
        private void CloseConnectionExplicity()
        {
            if (this._conn != null && this._conn.State == ConnectionState.Open)
                this._conn.Close();

        }


        /// <summary>
        /// Executes a stored procedure and returns the results as a Data Set
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataTable ExecDataTableProc(string qry, params object[] args)
        {
            using (SqlCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                cmd.CommandTimeout = 1200;
                SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapt.Fill(dt);
                CloseConnectionExplicity();
                return dt;
            }
        }

        /// <summary>
        /// Get all records in list using query
        /// </summary>
        /// <returns>List<T></returns>
        public List<T> FindAll<T>(string query)
        {
            DataTable dt = new DataTable();
            dt = ExecDataTable(query, new SqlParameter[0]);
            return ConvertDataTable<T>(dt);
        }

        /// <summary>
        /// Get all records in list using StoreProcedure
        /// </summary>
        /// <returns>List<T></returns>
        public List<T> FindAll<T>(string query, params object[] args)
        {
            DataTable dt = new DataTable();
            dt = ExecDataTableProc(query, args);
            return ConvertDataTable<T>(dt);
        }

        /// <summary>
        /// Get record by id using query
        /// </summary>
        /// <param name="storeProcedure">string</param>
        /// <param name="args"> params object[]</param>
        /// <returns>T</returns>
        public T FindById<T>(string query, params object[] args)
        {
            DataTable dt = new DataTable();
            dt = ExecDataTable(query, new SqlParameter[0]);
            List<T> list = ConvertDataTable<T>(dt);
            return list.FirstOrDefault();
        }
        /// <summary>
        /// Get record by id using storeProcedure
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="storeProcedure">string</param>
        /// <param name="args">params object[]</param>
        /// <returns>T</returns>
        public T FindByIdProc<T>(string storeProcedure, params object[] args)
        {
            DataTable dt = new DataTable();
            dt = ExecDataTableProc(storeProcedure, args);
            List<T> list = ConvertDataTable<T>(dt);
            return list.FirstOrDefault();
        }
        public List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        private T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName && dr[column.ColumnName] != DBNull.Value)
                        pro.SetValue(obj, dr[column.ColumnName], null);
                    else
                        continue;
                }
            }
            return obj;
        }
        #endregion

        #region Transaction Members

        /// <summary>
        /// Begins a transaction
        /// </summary>
        /// <returns>The new SqlTransaction object</returns>
        public SqlTransaction BeginTransaction()
        {
            Rollback();
            _trans = _conn.BeginTransaction();
            return Transaction;
        }

        /// <summary>
        /// Commits any transaction in effect.
        /// </summary>
        public void Commit()
        {
            if (_trans != null)
            {
                _trans.Commit();
                _trans = null;
            }
        }

        /// <summary>
        /// Rolls back any transaction in effect.
        /// </summary>
        public void Rollback()
        {
            if (_trans != null)
            {
                _trans.Rollback();
                _trans = null;
            }
        }

        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                // Need to dispose managed resources if being called manually
                if (disposing)
                {
                    if (_conn != null)
                    {
                        Rollback();
                        _conn.Dispose();
                        _conn = null;
                    }
                }
                _disposed = true;
            }
        }

        #endregion

        public static void AttachedParams(SqlCommand objCommad, SqlParameter[] paramList)
        {
            objCommad.Parameters.Clear();
            foreach (SqlParameter param in paramList)
                objCommad.Parameters.Add(param);
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
    }
}