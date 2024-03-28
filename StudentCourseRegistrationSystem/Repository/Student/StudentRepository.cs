using StudentCourseRegistrationSystem.Common;
using StudentCourseRegistrationSystem.Models.Student;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace StudentCourseRegistrationSystem.Repository.Student
{
    public class StudentRepository
    {
        private List<T> ConvertDataTable<T>(DataTable dt)
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
        public DataTable GetAllSimRecoedData()
        {
            DataTable data = new AdoHelper().ExecDataTableProc("SIM_Sp_GetAllSimRecordData");
            return data;
        }

        //public DataTable GetAllStudentsList()
        //{
        //    DataTable data = new AdoHelper().ExecDataTableProc("SP_GetAllStudents");
        //    return data;
        //}


        public List<StudentDto> GetAllStudentsList()
        {
            List<StudentDto> records = new List<StudentDto>();
            using (AdoHelper adoHelper = new AdoHelper())
            {
                try
                {
                                        
                    DataTable dt = adoHelper.ExecDataTableProc("SP_GetAllStudents");
                    records = ConvertDataTable<StudentDto>(dt);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return records;
            }

        }
        public int AddUpdateStudent(StudentDto obj)
        {
            int res = 0;
            using (AdoHelper db = new AdoHelper())
            {
                try
                {
                    SqlParameter[] parameters = {
                    new SqlParameter("@StudentId", obj.StudentId),
                    new SqlParameter("@FirstName", obj.FirstName),
                    new SqlParameter("@Surname", obj.Surname),
                    new SqlParameter("@Gender", obj.Gender),
                    new SqlParameter("@DOB", obj.DOB),
                    new SqlParameter("@Address1", obj.Address1),
                    new SqlParameter("@Address2", obj.Address2),
                    new SqlParameter("@Address3", obj.Address3)
                };
                    res = (int)db.ExecScalarProc("SP_SaveOrUpdateStudent", parameters);
                    return res;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int DeleteStudent(int StudentId)
        {
            int res = 0;
            using (AdoHelper db = new AdoHelper())
            {
                try
                {
                    SqlParameter[] parameters = {
                    new SqlParameter("@StudentId", StudentId),};
                    res = (int)db.ExecScalarProc("SP_DeleteStudents", parameters);
                    return res;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public DataTable GetStudentByStudentId(int StudentId)
        {

            DataTable dt = new DataTable();
            using (AdoHelper helper = new AdoHelper())
            {
                SqlParameter[] parameters = { new SqlParameter("@StudentId", StudentId) };
                dt = helper.ExecDataTableProc("SP_GetStudentByID", parameters);
            }
            return dt;
        }
        //SP_GetStudentByID
        //SP_SaveOrUpdateCourse
        //SP_GetCourseByID
        //SP_DeleteCourse
    }
}