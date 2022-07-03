using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace DeliveryTiger_V1.Controllers
{
    public class AdminController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult Index()
        {
            return View();
        }
    }
}