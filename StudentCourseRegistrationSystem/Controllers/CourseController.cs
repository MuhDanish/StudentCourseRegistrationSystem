using StudentCourseRegistrationSystem.Models.Course;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentCourseRegistrationSystem.Controllers
{
    public class CourseController : Controller
    {
        // GET: Course
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ManageCourse()
		{
            return View();
		}
        [HttpGet]
        public  ActionResult SaveUpdateCourse()
		{
            CourseDto model = new CourseDto();
            return View(model);
		}

        [HttpPost]
        public ActionResult SaveUpdateCourse(CourseDto model)
        {
            return View();
        }
    }
}