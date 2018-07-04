using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SalesV2.Models;

namespace SalesV2.Controllers
{
    interface ISales
    {
        ActionResult Index();
        ActionResult GetSales();
        ActionResult Edit();
        ActionResult GetSalesLists(int id);
        ActionResult Edit(Sale model);
        ActionResult Delete(int Id);
    }

    public class SalesController : Controller, ISales
    {
        ShoppingEntities db = new ShoppingEntities();
        // GET: Sales
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetSales()
        {
            var saleslist = db.TotalSales.Select(x => new Models.TotalSaleModel()
            {
                Id = x.Id,
                ProductName = x.ProductName,
                CustomerName = x.CustomerName,
                StoreName = x.StoreName,
                SaleDate = x.SaleDate
            }).ToList().Select(y => new
            {
                 y.Id,
                 y.ProductName,
                 y.CustomerName,
                 y.StoreName,
                 DateOfSale = String.Format("{0:dd/MM/yyyy}", y.SaleDate)
            });
            var result = new { success = "True", AllSales = saleslist };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit()
        {
            return View();
        }

        public ActionResult GetSalesLists(int id)
        {
            string msg;
            var products = db.Products.ToList();
            var customers = db.Customers.ToList();
            var stores = db.Stores.ToList();
            int productid = 0, customerid = 0, storeid = 0;
            DateTime saledate;
            if (id == 0)
            {  // New Record
                string firstselect = "--- Please Select ---";
                products.Add(new Product {Id = 0, ProductName = firstselect });
                customers.Add(new Customer {Id = 0, CustomerName = firstselect });
                stores.Add(new Store { Id = 0, StoreName = firstselect });
                saledate = System.DateTime.Now;
                msg = "New record";
            } else
            { // Existing Record
                var sales = db.Sales.Find(id);
                if (sales == null)
                {
                    return HttpNotFound();
                }
                productid = sales.ProductId;
                customerid = sales.CustomerId;
                storeid = sales.StoreId;
                saledate = sales.SaleDate;
                msg = "Edit record";
            }

            SelectList productlist = new SelectList(products, "Id", "ProductName", productid.ToString());
            SelectList customerlist = new SelectList(customers, "Id", "CustomerName", customerid.ToString());
            SelectList storelist = new SelectList(stores, "Id", "StoreName", storeid.ToString());

            var result = new { success = "True", Id = id, Products = productlist, Customers = customerlist, Stores = storelist, SaleDate = String.Format("{0:yyyy-MM-dd}", saledate), Message = msg };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Edit(Sale model)
        {
            int id = model.Id;
            int productid = model.ProductId;
            int customerid = model.CustomerId;
            int storeid = model.StoreId;
            DateTime saledate = model.SaleDate;
            string msg;
            if (id == 0 )
            {  // New Record
                try
                {
                    var sale = db.Set<Sale>();
                    sale.Add(new Sale {
                        Id = id,
                        ProductId = productid,
                        CustomerId = customerid,
                        StoreId = storeid,
                        SaleDate = saledate
                    });
                    db.SaveChanges();
                    msg = "New record created.";
                } catch (Exception)
                {
                    msg = "Cannot save new record. Contact the administrator.";
                }
            }
            else
            { // Existing Record
                var sale = db.Sales.Find(id);
                if (sale == null)
                {
                    return HttpNotFound();
                }
                else
                {
                    try
                    {                        
                        sale.ProductId = productid;
                        sale.CustomerId = customerid;
                        sale.SaleDate = saledate;
                        db.SaveChanges();
                        msg = String.Format("Changes to record {0} have been saved.", id);
                    } catch (Exception)
                    {
                        msg = "Changes cannot be saved. Contact the administrator";
                    }
                }
            }
            var result = new {success = "True", Message = msg };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Delete(int Id)
        {
            string msg;
            var sale = db.Sales.Find(Id);
            if (sale == null)
            {
                return HttpNotFound();
            }
            else{
                try
                {
                    db.Sales.Remove(sale);
                    db.SaveChanges();
                    msg = String.Format("Record {0} has been deleted.", Id);

                } catch (Exception)
                {
                    msg = String.Format("Unable to delete record {0}. Contact the administrator.", Id);
                }
            }
            var result = new {success = "True", Message = msg };
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