function GetProducts() {
    var edtitbtn = '<input type="button" id="edit" value = "Edit" class="btn btn-success" onclick = "ClickEdit(this)"/>';
    var deletebtn = '<input type="button" id="delete" value = "Delete" class="btn btn-danger" onClick = "ClickDelete(this)"/>';
    $.ajax({
        url: '/Product/GetProduct',
        type: 'GET',
        dataType: 'json'
        
    })
        .success(function (result) {
            $('#producttable').empty();
            $.each(result.AllProducts, function (i, item) {
                var rows = "<tr>"
                    + "<td>" + item.Id + "</td>"
                    + "<td>" + item.ProductName + "</td>"
                    + "<td>" + item.ProductPrice.toFixed(2) + "</td>"
                    + "<td>" + edtitbtn + "</td>"
                    + "<td>" + deletebtn + "</td>"
                    + "</tr>";
                $('#producttable').append(rows);
            });
        })
        .error(function (xhr, status) {
            alert("Unable to load Products. Contact the administrator.");
        });
}

function ClickEdit(elm) {
    var id = $(elm).closest("tr").find("td:lt(1)").text();
    $.ajax({
        url: '/Product/Edit',
        contentType: 'application/html; charset=utf-8',
        type: 'GET',
        data: { Id: id },
        dataType: 'json'
    })
        .success(function (result) {
            $("#modeltitle").html("Edit Product");
            $("#btnsave").html("Save");
            $("#productid").html(result.Product.Id);
            $("#productname").val(result.Product.ProductName);
            $("#productprice").val(result.Product.ProductPrice.toFixed(2));
            $("#productmsg").hide();
            $("#pricemsg").hide();
            $("#btnsave").attr('disabled', false);
            $("#updatemodal").modal();
        })
        .error(function (xhr, status) { 
            alert("Unable to load record. Contact the administrator.");
        });
}

function ClickCreate() {
    var id = 0;
    $("#modeltitle").html("Create Product");
    $("#btnsave").html("Create");
    $("#productid").html(id);
    $("#productname").val("");
    $("#productprice").val("00.00");
    $("#btnsave").attr('disabled', true);
    $("#productmsg").show();
    $("#pricemsg").show();
    $("#updatemodal").modal();
}

function SaveChanges() {
    var id = $("#productid").html();
    var productname = $("#productname").val();
    var productprice = $("#productprice").val();
    $.ajax({
        url: '/Product/Edit',
        data: {
            Id: id,
            ProductName: productname,
            ProductPrice: productprice
        },
        type: 'POST',
        dataType: 'json'
    })
        .success(function (result) {
            alert(result.Message);
            location.reload();
        })
        .error(function (xhr, status) {
            alert("Unable to save changes. Contact the administrator.");
            location.reload();
        });
}
   

function ClickDelete(elm) {
    if (confirm("Are you sure?")) {
        var id = $(elm).closest("tr").find("td:lt(1)").text();
        $.ajax({
            url: 'Product/Delete',
            data: { Id: id },
            type: 'POST',
            datatype: 'json'
        })
            .success(function (result) {
                alert(result.Message);
                location.reload();
            })
            .error(function (xhr, status) {
                alert("Unable to delete record. Contact the administrator.");
            });
    };
}

function Validations() {
    var name = $("#productname").val();
    var price = $("#productprice").val();
    var isvalid = false;
    if (isNaN(price * 100 / 100)) {
        isvalid = false; // Number check
    } else if (price.indexOf(".") === -1) {
        isvalid = false; // No decimal
    } else if (price.substring(price.indexOf(".")).length !== 3) {
        isvalid = false; // 2 after decimal
    } else if (price < 1.00) {
        isvalid = false; // Less $1.00
    } else {
        isvalid = true;
    }

    if (name.length === 0 || price.length === 0 || !isvalid) {
        $("#btnsave").attr('disabled', true);
    } else {
        $("#btnsave").attr('disabled', false);
    }
    if (name.length === 0){
        $("#productmsg").show();
    } else {
        $("#productmsg").hide();
    }
    if (price.length === 0 || !isvalid) {
        $("#pricemsg").show();
    } else {
        $("#pricemsg").hide();
    }
}

