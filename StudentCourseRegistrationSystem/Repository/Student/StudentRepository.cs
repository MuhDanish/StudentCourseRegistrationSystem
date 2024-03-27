using StudentCourseRegistrationSystem.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace StudentCourseRegistrationSystem.Repository.Student
{
    public class StudentRepository
    {
        public DataTable GetAllSimRecoedData()
        {
            DataTable data = new AdoHelper().ExecDataTableProc("SIM_Sp_GetAllSimRecordData");
            return data;
        }
    }
}