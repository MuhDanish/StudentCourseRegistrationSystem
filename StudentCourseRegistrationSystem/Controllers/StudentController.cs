using Newtonsoft.Json;
using StudentCourseRegistrationSystem.Models.Student;
using StudentCourseRegistrationSystem.Repository.Student;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentCourseRegistrationSystem.Controllers
{
    public class StudentController : Controller
    {
        StudentRepository studentRepository = new StudentRepository();
        // GET: Student
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetAll()
        {
                return View();
        }
        [HttpPost]
        public ActionResult GetAllIssuedSimsData()
        {
                var data = studentRepository.GetAllSimRecoedData();
                return Content(JsonConvert.SerializeObject(data, Formatting.None), "application/json");
        }

        [HttpGet]
        public ActionResult ManageStudent()
        {
            var data = studentRepository.GetAllStudentsList();
            return View(data);
        }

        [HttpGet]
        public ActionResult SaveUpdateStudent()
        {
            StudentDto student = new StudentDto();
            return View(student);
        }

        [HttpPost]
        public ActionResult SaveUpdateStudent(StudentDto model)
        {
            var data=studentRepository.AddUpdateStudent(model);
            return Content(JsonConvert.SerializeObject(data, Formatting.None), "application/json");
        }

        [HttpGet]
        public ActionResult GetStudentById(int StudentId)
        {
            DataTable dt = new DataTable();
            dt = studentRepository.GetStudentByStudentId(StudentId);
            return Content(JsonConvert.SerializeObject(dt, Formatting.None), "application/json");
        }
        [HttpGet]
        public ActionResult DeleteStudent(int StudentId)
        {
           var data= studentRepository.DeleteStudent(StudentId);
           return Content(JsonConvert.SerializeObject(data, Formatting.None), "application/json");
        }

    }
}