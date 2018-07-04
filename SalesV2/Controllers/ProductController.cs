using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using SalesV2.Models;

namespace SalesV2.Controllers
{
    interface IProduct
    {
        ActionResult Index();
        ActionResult GetProduct();
        ActionResult Edit(int Id);
        ActionResult Edit(ProductViewModel model);
        ActionResult Delete(int Id);
    }

    public class ProductController : Controller, IProduct
    {
        ShoppingEntities db = new ShoppingEntities();
        // GET: Product
        public ActionResult Index()
        {
            return View();

        }

        public ActionResult GetProduct()
        {
            var productslist = db.Products.Select(x => new Models.ProductViewModel
            {
                Id = x.Id,
                ProductName = x.ProductName,
                ProductPrice = x.ProductPrice,
            }).ToList();
            var result = new { Success = "True", AllProducts = productslist };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(int Id)
        {
            Product product = db.Products.Find(Id);
            if (product == null)
            {
                return HttpNotFound();
            }
            var prodview = new Product
            {
                Id = product.Id,
                ProductName = product.ProductName,
                ProductPrice = product.ProductPrice
            };
            var result = new { Success = "True", Product = prodview };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Edit(ProductViewModel model)
        {
            string msg;
            int id = model.Id;
            string name = model.ProductName;
            decimal? price = model.ProductPrice;
            if (id == 0) // New Record
            {
                try
                {
                    var newprod = db.Set<Product>();
                    newprod.Add(new Product {Id = id, ProductName = name, ProductPrice = price});
                    db.SaveChanges();
                    msg = "New record has been created";
                }
                catch (Exception)
                {
                    msg = "Unable to save new record. Contact the administrator.";
                }               
            } else // Existing record
            {
                var editproduct = db.Products.Find(id);
                if(editproduct == null)
                {
                    return HttpNotFound(); 
                }
                else
                {
                    try
                    {
                        editproduct.ProductName = name;
                        editproduct.ProductPrice = price;
                        db.SaveChanges();
                        msg = String.Format("Changes for record {0} have been saved", id);
                    } catch (Exception)
                    {
                        msg = String.Format("Unable to save changes to {0}. Contact the administrator.", id);
                    }
                }
            }
            var result = new { Success = "True", Message = msg};
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Delete(int Id)
        {
            string msg;
            var product = db.Products.Find(Id);
            if (product == null)
            {
                return HttpNotFound();
            } 
            if (product.Sales.Any())
            {
                msg = "Unable to delete record. Check this Product is not used by a Sale record."; 
            } else
            {
                db.Products.Remove(product);
                db.SaveChanges();
                msg = String.Format("Record {0} has been deleted.", Id);
            }
            var result = new { Success = "True", Message = msg };
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