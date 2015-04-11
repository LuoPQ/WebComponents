using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WeekShareTmplBuilder.Controllers {
    public class HomeController : Controller {
        // GET: Home
        public ActionResult Index () {
            return View();
        }

        public ActionResult Guide () {
            return View();
        }
    }
}