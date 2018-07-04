using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesV2.Models
{
    public class ProductViewModel
    {
        public int Id { set; get; }
        public string ProductName { set; get; }
        public Nullable<decimal> ProductPrice { set; get; }
    }
}