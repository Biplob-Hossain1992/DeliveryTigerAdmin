using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class QuickController : Controller
    {
        // GET: Quick
        public ActionResult QuickOrderGenerate()
        {
            return View();
        }

        public ActionResult QuickOrderProcess()
        {
            return View();
        }
        public ActionResult RequestAndCollectedOrderReport()
        {
            return View();
        }
        public ActionResult HubWiseBarCode()
        {
            return View();
        }

        public ActionResult GetCollectionSlotWiseOrders()
        {
            return View();
        }
        public ActionResult InstantOrder()
        {
            return View();
        }
    }
}