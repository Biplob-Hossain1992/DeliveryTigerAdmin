using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class InstaCODController : Controller
    {
        // GET: InstaCOD
        public ActionResult InstantOrder()
        {
            return View();
        }
        public ActionResult InstaCodCourierLocationEntry()
        {
            return View();
        }
    }
}