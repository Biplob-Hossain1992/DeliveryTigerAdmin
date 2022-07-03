using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class ManageController : Controller
    {
        // GET: Permission
        public ActionResult MerchantMailAndSmsPermission()
        {
            return View();
        }
        public ActionResult CollectorAssign()
        {
            return View();
        }
        public ActionResult MerchantInformation()
        {
            return View();
        }
        public ActionResult DeliveryManAssign()
        {
            return View();
        }
        public ActionResult OrderAssign()
        {
            return View();
        }

        public ActionResult CollectorLocationAssignAngular()
        {
            return View();
        }

        public ActionResult GetAllCollectors()
        {
            return View();
        }
        public ActionResult LocationAssign()
        {
            return View();
        }

        public ActionResult GetAllRiders()
        {
            return View();
        }

        public ActionResult RegistrationForm()
        {
            return View();
        }

        public ActionResult DuplicatesCourierUsers()
        {
            return View();
        }

        public ActionResult AssignCouirerAndService()
        {
            return View();
        }
        public ActionResult MerchantWiseAssignCourier()
        {
            return View();
        }

        public ActionResult UpdateTeleSalesStatus()
        {
            return View();
        }
        
        public ActionResult UpdateUserSalary()
        {
            return View();
        }

        public ActionResult UserLocationAssign()
        {
            return View();
        }
    }
}