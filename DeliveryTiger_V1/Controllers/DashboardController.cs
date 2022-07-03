using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        [HttpGet]
        public ActionResult DashboardSummary()
        {
            return View();
        }
    }
}