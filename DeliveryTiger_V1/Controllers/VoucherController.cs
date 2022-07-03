using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class VoucherController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult AddVoucher()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult ManageVoucher()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult AppliedVourcherInfo()
        {
            return View();
        }
    }
}