using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class OperationController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult Operation()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult ReturnProcess()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult SendToCourier()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult BulkOrderProcess()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult MerchantBulkOrderProcess()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult MerchantBulkOrderProcessNew()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult SingleOrderProcess()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult BulkUpdate()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult BulkUpdateForCourier()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult OperationNew()
        {
            return View();
        }
        public ActionResult QuickOfficeRecieve()
        {
            return View();
        }
        public ActionResult QuickUpdateStatus()
        {
            return View();
        }

        public ActionResult BulkStatusUpdate()
        {
            return View();
        }

        public ActionResult PoHOperation()
        {
            return View();
        }
    }
}