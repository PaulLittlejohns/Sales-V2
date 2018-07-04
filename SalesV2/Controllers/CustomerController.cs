using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using SalesV2.Models;

namespace SalesV2.Controllers
{
    interface ICustomer
    {
        ActionResult Index();
        ActionResult GetCustomers();
        ActionResult Edit(int Id);
        ActionResult Edit(CustomerViewModel model);
        ActionResult Delete(int Id);
    }

    public class CustomerController : Controller, ICustomer
    {
        ShoppingEntities db = new ShoppingEntities();
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetCustomers()
        {
            var customerlist = db.Customers.Select(x =>  new Models.CustomerViewModel()
            {
                Id = x.Id,
                CustomerName = x.CustomerName,
                CustomerAddress = x.CustomerAddress
            }).ToList();
            var result = new { Success = "True", AllCustomers = customerlist };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(int Id)
        {
            var customer = db.Customers.Find(Id);
            if (customer == null)
            {
                return HttpNotFound();
            } 
            var customerview = new Customer
            {
                Id = customer.Id,
                CustomerName = customer.CustomerName,
                CustomerAddress = customer.CustomerAddress
            };
            var result = new {success = "True", Customer = customerview };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult Edit (CustomerViewModel model)
        {
            int id = model.Id;
            string name = model.CustomerName;
            string address = model.CustomerAddress;
            string msg = "";

            if (id == 0)
            { // New record
                try {
                    var customer = new Customer()
                    {
                        CustomerName = name,
                        CustomerAddress = address
                    };
                    db.Customers.Add(customer);
                    db.SaveChanges();
                    msg = "New record created.";
                } catch (Exception)
                {
                    msg = "Unable to create new record. Contact the adminstrator";
                }
            } else
            { // Existing record
                var customer = db.Customers.Find(id);
                if (customer == null)
                {
                    return HttpNotFound();
                }
                try
                {
                    customer.CustomerName = name;
                    customer.CustomerAddress = address;
                    db.SaveChanges();
                    msg = string.Format("Changes to {0} have been saved.", id);
                }
                catch (Exception)
                {
                    msg = string.Format("Unable to save changes to {0}. Contact the administrator.", id);
                }
            }
            var result = new {success = "True", Message = msg};
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Delete(int Id)
        {
            string msg = "";

            var customer = db.Customers.Find(Id);
            if (customer == null)
            {
                return HttpNotFound();
            }

            if (customer.Sales.Any())
            {
                msg = "Unable to delete record. Check this Customer is not used by a Sale record.";
            }
            else
            {
                db.Customers.Remove(customer);
                db.SaveChanges();
                msg = String.Format("Record {0} has been deleted.", Id);
            }
            var result = new { success = "True", Message = msg };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}