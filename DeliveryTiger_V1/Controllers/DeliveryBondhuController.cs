using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class DeliveryBondhuController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult LocationAssign()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult OrderStatusHistory()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult AssignDeliveryZoneLocation()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RiderWiseOrderCollectionDetails()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult ZoneEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RiderPaymentAdjustment()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RiderCommissionEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult GetZoneWiseOrdersCount()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult BondhuEntryPanel()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult CustomComment()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RiderPaymentReport()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RiderCountWithDetails()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult SameDayCollectedPendingOrdersCount()
        {
            return View();
        }
    }
}