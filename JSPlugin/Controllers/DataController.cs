using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSPlugin.Controllers {
    public class DataController : Controller {
        // GET: Data
        public ActionResult Index () {
            return View();
        }

        public ActionResult GetData (string term) {
            string[] data = new string[] { "ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme" };

            return Json(data.Where(d => d.Contains(term)), JsonRequestBehavior.AllowGet);

        }
    }
}