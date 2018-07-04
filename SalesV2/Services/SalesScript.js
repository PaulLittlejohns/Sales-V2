function GetSales() {
    var editbtn = '<input type = "button", class = "btn btn-success", value = "Edit", id = "edtit" onclick = "ClickEdit(this)"/>';
    var deletebtn = '<input type = "button", class = "btn btn-danger", value = "Delete", id = "delete", onclick = "ClickDelete(this)"/>';
    $.ajax({
        url: '/Sales/GetSales',
        type: 'GET',
        datatype: JSON
    })
        .success(function (result) {
            $("#saletable").empty();
            $.each(result.AllSales, function (i, item) {
                var rows = '<tr>'
                    + '<td>' + item.Id + '</td>'
                    + '<td>' + item.ProductName + '</td>'
                    + '<td>' + item.CustomerName + '</td>'
                    + '<td>' + item.StoreName + '</td>'
                    + '<td>' + item.DateOfSale + '</td>'
                    + '<td>' + editbtn + '</td>'
                    + '<td>' + deletebtn + '</td>'
                    + '<tr>';
                $("#saletable").append(rows);
            });
        })
        .error(function (xhr) {
            alert("Unable to load Sales. Contact the administrator.")
        });
}

function ClickEdit(elm) {
    var id = $(elm).closest("tr").find("td:lt(1)").text();
    $.ajax({
        url: "Sales/GetSalesLists",
        data: { Id: id },
        type: "POST",
        datatype: JSON
    })
        .success(function (result) {
            var products = result.Products;
            var customers = result.Customers;
            var stores = result.Stores;
            SetLists(products, customers, stores);
            $("#modeltitle").html("Edit Sale");
            $("#btnsave").html("Edit");
            $("#saleid").html(result.Id);
            $("#saledate").val(result.SaleDate);
            $("#btnsave").attr('disabled', false);
            $("#productmsg").hide();
            $("#customermsg").hide();
            $("#storemsg").hide();
            $("#datemsg").hide();
            $("#updatemodal").modal();
        })
        .error(function (xhr, status) {
            alert("Unable to load record. Contact the administrator.");
        })
}

function SetLists(products, customers, stores) {

    var optionhtmlp
    var optionhtmlc
    var optionhtmls;
    $.each(products, function (i) {
        if (products[i].Selected) {
            optionhtmlp = '<option value="' + products[i].Value + '" selected="selected">' + products[i].Text + '</option>';
        } else {
            optionhtmlp = '<option value="' + products[i].Value + '">' + products[i].Text + '</option>';
        }
        $("#productlist").append(optionhtmlp);
    });
    $.each(customers, function (i) {
        if (customers[i].Selected) {
            optionhtmlc = '<option value="' + customers[i].Value + '" selected="selected">' + customers[i].Text + '</option>';
        } else {
            optionhtmlc = '<option value="' + customers[i].Value + '">' + customers[i].Text + '</option>';
        }
        $("#customerlist").append(optionhtmlc);
    });
    $.each(stores, function (i) {
        if (stores[i].Selected) {
            optionhtmls = '<option value="' + stores[i].Value + '" selected="selected">' + stores[i].Text + '</option>';
        } else {
            optionhtmls = '<option value="' + stores[i].Value + '">' + stores[i].Text + '</option>';
        }
        $("#storelist").append(optionhtmls);
    });
}

function ClickCreate() {
    var id = 0;
    $.ajax({
        url: "Sales/GetSalesLists",
        data: { Id: id },
        type: "POST",
        datatype: JSON
    })
        .success(function (result) {
            var products = result.Products;
            var customers = result.Customers;
            var stores = result.Stores;
            SetLists(products, customers, stores);
            $("#modeltitle").html("Create Sale");
            $("#btnsave").html("Create");
            $("#saleid").html(result.Id);
            $("#saledate").val(result.SaleDate);
            $("#btnsave").attr('disabled', true);
            $("#productmsg").show();
            $("#customermsg").show();
            $("#storemsg").show();
            $("#datemsg").hide();
            $("#updatemodal").modal();
        })
        .error(function (xhr, status) {
            alert("Unable to save record. Contact the administrator.");
        }) 
}

function Validations() {
    if ($("#productlist").val() == 0) {
        $("#productmsg").show();
    } else {
        $("#productmsg").hide();
    }
    if ($("#customerlist").val() == 0) {
        $("#customermsg").show();
    } else {
        $("#customermsg").hide();
    }
    if ($("#storelist").val() == 0) {
        $("#storemsg").show();
    } else {
        $("#storemsg").hide();
    }
    if ($("#saledate").val().length == 0) {
        $("#datemsg").show();
    } else {
        $("#datemsg").hide();
    }

    if ($("#productlist").val() == 0 || $("#customerlist").val() == 0 || $("#storelist").val() == 0 || $("#saledate").val().length == 0){
        $("#btnsave").attr("disabled", true);
    } else {
        $("#btnsave").attr("disabled", false);
    }
}

function SaveChanges() {
    var id = $("#saleid").html();
    var product = $("#productlist").val();
    var customer = $("#customerlist").val();
    var store = $("#storelist").val();
    var saledate = $("#saledate").val();
    $.ajax({
        url: "Sales/Edit",
        type: "POST",
        data: {
            Id: id,
            ProductId: product,
            CustomerId: customer,
            StoreId: store,
            SaleDate: saledate
        },
        datatype: JSON
    })
        .success(function (result) {
            alert(result.Message);
            location.reload();
        })
        .error(function (xhr, status) {
            alert("Unable to save changes. Contact the administrator.");
        })
}

function ClickDelete(elm) {
    if (confirm("Are you sure?")) {
        var id = $(elm).closest("tr").find("td:lt(1)").text();
        $.ajax({
            url: "Sales/Delete",
            data: { Id: id },
            type: "POST",
            datatype: JSON
        })
            .success(function(result){
            alert(result.Message);
            location.reload();
        })
        .error(function(xhr, status){
            alert("Unable to delete record. Contact the administrator.");
        })
    };
}