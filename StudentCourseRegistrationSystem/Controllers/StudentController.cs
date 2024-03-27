using Newtonsoft.Json;
using StudentCourseRegistrationSystem.Repository.Student;
using System;
using System.Collections.Generic;
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
            return View();
        }
    }
}