function GetCustomers() {
    var editbtn = '<input type = "button", class = "btn btn-success", value = "Edit", id = "edtit" onclick = "ClickEdit(this)"/>';
    var deletebtn = '<input type = "button", class = "btn btn-danger", value = "Delete", id = "delete", onclick = "ClickDelete(this)"/>';
    $.ajax({
        url: '/Customer/GetCustomers',
        type: 'GET',
        datatype: JSON
    })
        .success(function(result){
            $("#customertable").empty();
            $.each(result.AllCustomers, function (i, item) {
                var rows = '<tr>'
                    +'<td>' + item.Id + '</td>'
                    +'<td>' + item.CustomerName + '</td>'
                    +'<td>' + item.CustomerAddress + '</td>'
                    +'<td>' + editbtn + '</td>'
                    +'<td>' + deletebtn + '</td>'
                    +'<tr>';
                $("#customertable").append(rows);
            });
    })
        .error(function(xhr){
            alert("Unable to load Customers. Contact the administrator.")
        });
}

function ClickCreate() {
    var id = 0;
    $("#modeltitle").html("Create Customer");
    $("#btnsave").html("Create");
    $("#customerid").html(id);
    $("#customername").val("");
    $("#customeraddress").val("");
    $("#btnsave").attr('disabled', true);
    $("#customermsg").show();
    $("#addressmsg").show();
    $("#updatemodal").modal();
}

function ClickEdit(elm) {
    var id = $(elm).closest("tr").find("td:lt(1)").text();
    $.ajax({
        url: '/Customer/Edit',
        data: { Id: id },
        type: 'GET',
        datetype: JSON
    })
        .success(function (result) {
            $("#modeltitle").html("Edit Customer");
            $("#btnsave").html("Save");
            $("#customerid").html(result.Customer.Id);
            $("#customername").val(result.Customer.CustomerName);
            $("#customeraddress").val(result.Customer.CustomerAddress);
            $("#customermsg").hide();
            $("#addressmsg").hide();
            $("#btnsave").attr('disabled', false);
            $("#updatemodal").modal();            
        })
        .error(function (xhr) {
            alert("Unable to load record. Contact the administrator.");
        })
}

function SaveChanges() {
    var id = $("#customerid").html();
    var customername = $("#customername").val();
    var customeraddress = $("#customeraddress").val();
    $.ajax({
        url: '/Customer/Edit',
        data: {
            Id: id,
            CustomerName: customername,
            CustomerAddress: customeraddress
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
            url: '/Customer/Delete',
            data: { Id: id },
            type: 'POST',
            datatype: 'json'
        })
            .success(function (result) {
                alert(result.Message);
                location.load();
            })
            .error(function (xhr, status) {
                alert("Unable to delete record. Contact the administrator.");
                Location.load();
            })
    };
}

function Validations() {
    var name = $("#customername").val();
    var address = $("#customeraddress").val();

    if (name.length === 0) {
        $("#customermsg").show();
    } else {
        $("#customermsg").hide();
    }
    if (address.length === 0) {
        $("#addressmsg").show();
    } else {
        $("#addressmsg").hide();
    }

    if (name.length === 0 || address.length === 0) {
        $("#btnsave").attr('disabled', true);
    } else {
        $("#btnsave").attr('disabled', false);
    }
}