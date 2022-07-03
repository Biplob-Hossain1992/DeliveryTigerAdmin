using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class GeneralSettingsController : Controller
    {
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult RegisterTermsConditions()
        {
            return View();
        }

        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult TermsAndConditionsEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult MailAndSmsEntry()
        {
            return View();
        }
        [HttpGet, OutputCache(NoStore = true, Duration = 1)]
        public ActionResult SendSms()
        {
            return View();
        }

        [HttpGet]
        public ActionResult DeliveryBonduNotification()
        {
            return View();
        }

        public ActionResult VoucherTermsConditions()
        {
            return View();
        }
    }
}