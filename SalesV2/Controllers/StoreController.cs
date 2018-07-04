using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SalesV2.Models;

namespace SalesV2.Controllers
{
    interface Stores
    {
        ActionResult Index();
        ActionResult GetStore();
        ActionResult Edit(int Id);
        ActionResult Edit(StoreViewModel model);
        ActionResult Delete(int Id);

    }

    public class StoreController : Controller, Stores
    {
        ShoppingEntities db = new ShoppingEntities();
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetStore()
        {
            var storeslist = db.Stores.Select(x => new Models.StoreViewModel
            {
                Id = x.Id,
                StoreName = x.StoreName,
                StoreAddress = x.StoreAddress
            }).ToList();

            var result = new { Success = "true", AllStores = storeslist };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(int Id)
        {
            var store = db.Stores.Find(Id);
            if (store == null)
            {
                return HttpNotFound();
            }
                var storeview = new Store
                {
                    Id = store.Id,
                    StoreName = store.StoreName,
                    StoreAddress = store.StoreAddress
                };
            var result = new {Success = "true", Store = storeview};
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Edit(StoreViewModel model)
        {
            string msg = "";
            int id = model.Id;
            string name = model.StoreName;
            string address = model.StoreAddress;

            if (id == 0)
            { // new record
                try
                {
                    var store = db.Set<Store>();
                    store.Add(new Store { Id = id, StoreName = name, StoreAddress = address });
                    db.SaveChanges();
                    msg = "New record has been created.";
                } catch (Exception)
                {
                    msg = String.Format("Unable to save changes to record {0}. Contact the administrator", id);
                }
            }
            else
            { // existing record
                var editstore = db.Stores.Find(id);
                if (editstore == null)
                {
                    return HttpNotFound();
                }
                try
                {
                    editstore.StoreName = name;
                    editstore.StoreAddress = address;
                    db.SaveChanges();
                    msg = string.Format("Changes to record {0} has been saved", id);
                } catch (Exception)
                {
                    msg = String.Format("Unable to save changes to record {0}. Contact the administrator.", id);
                } 
            }
            var result = new { Success = "true", Message = msg };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Delete(int Id)
        {
            string msg = "";
            var store = db.Stores.Find(Id);
            if(store == null)
            {
                return HttpNotFound();
            }
            if (store.Sales.Any())
            {
                msg = "Unable to delete record. Check this Store is not used by a Sale record.";
            }
            else
            {
                db.Stores.Remove(store);
                db.SaveChanges();
                msg = string.Format("Record {0} has been deleted.", Id);
            }
            var result = new {Success = "true" , Message = msg };
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