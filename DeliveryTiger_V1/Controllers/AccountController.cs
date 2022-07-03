using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryTiger_V1.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Registration()
        {
            return View();
        }

        //[HttpPost]
        //public ActionResult Login(Account account)
        //{
        //    Repository repository = new Repository();
        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            int checkAccess = 0;
        //            Account acc = repository.Login(account);
        //            SessionPersister.Id = acc.Id;
        //            SessionPersister.Name = acc.Name;
        //            SessionPersister.AccountType = acc.AccountType.ToString();
        //            SessionPersister.UserName = acc.UserName;
        //            checkAccess = new AccountGateway().CheckAccountAccess(acc.UserName);

        //            string userip = Request.ServerVariables["REMOTE_ADDR"].ToString();
        //            if ((userip == "163.53.151.106") || (userip == "163.53.150.123") || (userip == "103.36.100.154") || (userip == "163.53.150.122") || (userip == "203.188.248.90") || (checkAccess == 1))
        //            {
        //                return RedirectToAction("Index", "Admin");
        //            }

        //            else
        //            {
        //                ViewBag.Error = "Server not available now.";
        //                return View();
        //            }


        //        }
        //        catch (Exception ex)
        //        {
        //            ViewBag.Error = "Server not available now.";
        //            return View();
        //        }
        //    }

        //    else
        //    {
        //        ViewBag.Error = "Account's Invalid";
        //        return View();
        //    }
        //}
        [HttpGet]
        public ActionResult Logout()
        {
            //SessionPersister.Id = string.Empty;
            //SessionPersister.Name = string.Empty;
            //SessionPersister.AccountType = string.Empty;
            //SessionPersister.UserName = string.Empty;
            Session.Clear();
            return RedirectToAction("Login");
        }

        [HttpGet]
        public ActionResult UserProfile()
        {
            return View();
        }
    }
}