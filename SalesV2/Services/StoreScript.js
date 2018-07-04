function GetStores() {
    var editbtn = '<input type= "button" id = "edit" value =  "Edit" class = "btn btn-success" onclick = "ClickEdit(this)"/>';
    var deletebtn = '<input type= "button" id = "delete" value =  "Delete" class = "btn btn-danger" onclick = "ClickDelete(this)"/>';
    $.ajax({
        url: 'Store/GetStore',
        type: 'GET',
        datetype: 'json'
    })
        .success(function (result) {
            $("#storetable").empty();
            $.each(result.AllStores, function (i ,item) {
                var rows = "<tr>" +
                    "<td>" + item.Id + "</td>" +
                    "<td>" + item.StoreName + "</td>" +
                    "<td>" + item.StoreAddress + "</td>" +
                    "<td>" + editbtn + "</td>" +
                    "<td>" + deletebtn + "</td>" +
                    "</tr>";
                $("#storetable").append(rows);
            });
         })
        .error(function (xhr, status) {
            alert("Unable to load Stores. Contact the administrator.");
        })
}

function ClickEdit(elm) {
    var id = $(elm).closest("tr").find("td:lt(1)").text();
    $.ajax({
        url: "Store/Edit",
        data: { Id: id },
        type: "GET",
        datatype: JSON
    })
        .success(function (result) {
            $("#modeltitle").html("Edit Store");
            $("#btnsave").html("Save");
            $("#storeid").html(result.Store.Id);
            $("#storename").val(result.Store.StoreName);
            $("#storeaddress").val(result.Store.StoreAddress);
            $("#storemsg").hide();
            $("#addressmsg").hide();
            $("#btnsave").attr('disabled', false);
            $("#updatemodal").modal();
        })
        .error(function (xhr, status) {
            alert("Unable to load Store record. Contact the administrator.");
        })
}

function ClickCreate() {
    var id = 0;
    $("#modeltitle").html("Create Store");
    $("#btnsave").html("Create");
    $("#storeid").html(id);
    $("#storename").val("");
    $("#storeaddress").val("");
    $("#btnsave").attr('disabled', true);
    $("#storemsg").show();
    $("#addressmsg").show();
    $("#updatemodal").modal();
}

function SaveChanges() {
    var id = $("#storeid").html();
    var storename = $("#storename").val();
    var storeaddress = $("#storeaddress").val();
    $.ajax({
        url: '/Store/Edit',
        data: {
            Id: id,
            StoreName: storename,
            StoreAddress: storeaddress
        },
        type: 'POST',
        dataType: 'json'
    })
        .success(function (result) {
            alert(result.Message);
            location.reload();
        })
        .error(function (xhr, status) {
            alert("Unable to updarte record. Contact the administrator.");
            location.reload();
        });
}

function ClickDelete(elm) {
    if (confirm("Are you sure?")) {
        var id = $(elm).closest("tr").find("td:lt(1)").text();
        $.ajax({
            url: '/Store/Delete',
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
                location.reload();
            });
    }
}

function Validations() {
    var name = $("#storename").val();
    var address = $("#storeaddress").val();

    if (name.length === 0) {
        $("#storemsg").show();
    } else {
        $("#storemsg").hide();
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