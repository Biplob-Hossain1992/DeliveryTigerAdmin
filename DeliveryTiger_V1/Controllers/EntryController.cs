using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class EntryController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult WeightAndDeliveryTypeEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult DeliveryChargeEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult PackagingChargeEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult StatusEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult StatusGroupEntry()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult TimeSlotEntry()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult HubNameEntry()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]

        public ActionResult CourierEntry()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult DistrictEntry()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult UpdateDistrict()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult AddCategorySubCategoryInfo()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult LeadManagement()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult UpdatePriceWithOrderType()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RedxPickUpStoresEntry()
        {
            return View();
        }
    }
}