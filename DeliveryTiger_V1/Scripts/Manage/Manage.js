//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
//var apiBaseURL = "http://localhost:58676/api/"; //local

//$(function () {
//    //let distId = parseInt($('#thana').val());
//    LoadAllDistricts(distId);
//});

//declare variable merchant info update
var companyNameMerchantInfoUpdate,
    mobileNumberMerchantInfoUpdate,
    emailMerchantInfoUpdate,
    retentionUserIdMerchantInfoUpdate,
    acquisitionUserIdMerchantInfoUpdate;

$(document).on('change', '#Sms', () => {
    if (this.checked) {
        $('#smsCharge').prop('readonly', false);
    }
    else {
        $('#smsCharge').prop('readonly', true);
    }
});
$(document).on('change', '#Mail', () => {
    if (this.checked) {
        $('#mailCharge').prop('readonly', false);
    }
    else {
        $('#mailCharge').prop('readonly', true);
    }
});
var thanaPickupList
var thana
var allDistInfo
var counts = 0;
const LoadAllDistricts = id => {
    let url = apiBaseURL + "Fetch/LoadAllDistricts";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                $('#thanaPickup').empty();
                allDistInfo = response.model;
                thanaPickupList = response.model.filter(d => d.parentId == id);
                $('#thanaPickup').append('<option value="-1">Select</option>');
                for (var i = 0; i < thanaPickupList.length; i++) {
                    
                    $('#thanaPickup').append('<option value=' + thanaPickupList[i].districtId + '>' + thanaPickupList[i].district + "-" + thanaPickupList[i].districtBng + '</option>');
                }

                //district
                let district = allDistInfo.filter(d => d.parentId === 0 && d.isActive === true);
                $('#district').append('<option value="0">Select</option>');
                for (var i = 0; i < district.length; i++) {
                    $('#district').append('<option value=' + district[i].districtId + '>' + district[i].district + '</option>');
                }

                //thana
                let thanaList = response.model.filter(d => d.districtId == id);
                if (id == 0) {
                    $('#thana').append('<option value="0">Select</option>');
                }
                else {
                    for (var i = 0; i < thanaList.length; i++) {

                        $('#thana').append('<option value=' + thanaList[i].districtId + '>' + thanaList[i].district + '</option>');
                    }
                }

                //districtPickup
                var districtPickup = allDistInfo.filter(d => d.isPickupLocation === true);
                if (counts === 0) {
                    $('#districtPickup').empty();
                    $('#districtPickup').append('<option value="0">Select</option>');
                    for (var i = 0; i < districtPickup.length; i++) {
                        $('#districtPickup').append('<option value=' + districtPickup[i].districtId + '>' + districtPickup[i].district + '</option>');
                    }
                }
                counts++;

                
                
            }
            else {
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

const districtOnchange = () => {

    //let thana = allDistInfo.filter(d => d.parentId === parseInt(districtId.value) && d.isActive === true);
    //$('#thana').html('');
    //$('#thana').append('<option value="-1">Select</option>');
    //for (var i = 0; i < thana.length; i++) {
    //    $('#thana').append('<option value=' + thana[i].districtId + '>' + thana[i].district + '</option>');
    //}
    let distId = parseInt($('#districtPickup').val());
    LoadAllDistricts(distId);
}

const updateMerchantMailAndSmsPermission = () => {
    let merchantId = parseInt($("#Merchant").select2("val"));
    let status = $("#Status").select2("val");
    let collectionCharge = parseFloat($("#collectionCharge").val());
    let returnCharge = parseFloat($("#returnCharge").val());
    let mailCharge = $("#Mail").prop("checked") === true ? parseFloat($("#mailCharge").val()) : 0.0;
    let smsCharge = $("#Sms").prop("checked") === true ? parseFloat($("#smsCharge").val()) : 0.0;
    let email = $("#Mail").prop("checked") === true ? 1 : 0;
    let sms = $("#Sms").prop("checked") === true ? 1 : 0;

    let Obj = {
        merchantId: merchantId,
        smsCharge: smsCharge,
        mailCharge: mailCharge,
        returnCharge: returnCharge,
        collectionCharge: collectionCharge,
        permissionModel: {
            merchantId: merchantId,
            statusId: status,
            email: email,
            sms: sms,
            permissionType: 'merchant'
        }
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Permission/AddPermission";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201) {
                    alert("Permission Updated.");
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const loadMerchantDetailInfo = () => {
    let merchantId = parseInt($("#Merchant").val());
    let merchantObj;
    $.each(AllMerchantInfo, function (i, merchant) {
        if (merchant.courierUserId == merchantId) {
            merchantObj = merchant;
        }
    });
    $("#Status").val(merchantObj.statusId).trigger('change');
    $("#collectionCharge").val(merchantObj.collectionCharge);
    $("#returnCharge").val(merchantObj.returnCharge);
    $("#mailCharge").val(merchantObj.mailCharge);
    $("#smsCharge").val(merchantObj.smsCharge);
    if (merchantObj.email === true) {
        $("#Mail").prop("checked", true);
        $('#mailCharge').prop('readonly', false);
    }
    else {
        $("#Mail").prop("checked", false);
        $('#mailCharge').prop('readonly', true);
    }
    if (merchantObj.sms === true) {
        $("#Sms").prop("checked", true);
        $('#smsCharge').prop('readonly', false);
    }
    else {
        $("#Sms").prop("checked", false);
        $('#smsCharge').prop('readonly', true);
    }
}

// -- Collector Assign --//

const AssignCollectorToMerchant = () => {
    let merchantId = parseInt($("#Merchant").val());
    let collectorId = parseInt($("#Collector").val());
    let assignType = $("#AssignType").val();
    let userId = parseInt($("#UserHidden").val());
    if (merchantId === -1) {
        alert("Please Select Merchant.")
        $("#Merchant").focus();
        return false;
    }
    if (collectorId === -1) {
        alert("Please Select Collector.")
        $("#Collector").focus();
        return false;
    }
    if (assignType === "-1") {
        alert("Please Select Assign Type.")
        $("#AssignType").focus();
        return false;
    }

    let Obj = {
        courierUserId: merchantId,
        collectorId: collectorId,
        assignType: assignType,
        updatedBy: userId
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddCollectorAssign";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201) {
                    alert("Collector Assigned.");
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const LoadCollectorAssignInfo = () => {
    let url = apiBaseURL + "Fetch/GetAllCollectorsAssign";
    $.ajax({
        beforeSend: function () {
            document.getElementById('collectorAssignListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllCollectorAssignInfo = response.model;
                DrawCollectorAssignData(response.model);
            }
            else {
                alert("Error.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
const DrawCollectorAssignData = data => {

    let html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="CourierAssignDataTable" aria-describedby="StatusDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="CourierAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width: 5%;">No</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="CourierAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Merchant: activate to sort column descending" style="width: 30%;">Merchant</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="CourierAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Collector: activate to sort column descending" style="width: 30%;">Collector</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="CourierAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Type: activate to sort column descending" style="width: 25%;">Type</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="CourierAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Thana: activate to sort column descending" style="width: 10%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    let count = 1;
    $.each(data, function (i, obj) {
        if (obj.collectorAssignId >= 0) {
            let id = obj.collectorAssignId;
            var evenOddClass = count % 2 === 0 ? "even" : "odd";
            html += "<tr class='gradeA " + evenOddClass + "' role='row'>";

            html += "<td style='text-align:center'>" + count + "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='courierUserName" + id + "' style='display:block;'>" + obj.companyName + "</label>";
            html += "<input type='hidden' id='merchantIdHiddenField" + id + "' value='" + obj.courierUserId + "' />";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='collectorName" + id + "' style='display:block;'>" + obj.collectorName + "</label>";
            html += "<input type='hidden' id='collectorIdHiddenField" + id + "' value='" + obj.collectorId + "' />";
            html += "<select id='collector" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            let assignTypeCollectionSelectedText = "";
            let assignTypeReturnSelectedText = "";

            if (obj.assignType !== null && obj.assignType.trim() === "collection") {
                assignTypeCollectionSelectedText = "Selected";
            }
            if (obj.assignType !== null && obj.assignType.trim() === "return") {
                assignTypeReturnSelectedText = "Selected";
            }
            html += "<td style='text-align:center'>";
            html += "<label id='assignTypeLbl" + id + "' style='display:block;'>" + obj.assignType + "</label>";
            html += "<select id='assignType" + id + "' class=form-control style='display:none;'>";
            html += "<option value='collection' " + assignTypeCollectionSelectedText + ">Collection</option>";
            html += "<option value='return' " + assignTypeReturnSelectedText + ">Return</option>";
            html += "</select>";
            html += "</td>";

            html += "<td align='center'>";
            html += '<button type="button" id=editCollectorAssignBtn' + id + ' class="btn btn-secondary" style="display:block;" onclick="EditCollectorAssign(' + id + ')"><i class="fa fa-pencil"></i></button>';
            html += '<button type="button" id=updateCollectorAssignBtn' + id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateCollectorAssign(' + id + ')"><i class="fa fa-check"></i></button>';
            html += '<button type="button" id=deleteCollectorAssignBtn' + id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="DeleteCollectorAssign(' + id + ')"><i class="fa fa-trash-o"></i></button>';
            html += '<button type="button" id=cancelCollectorAssignBtn' + id + ' class="btn btn-secondary" style="display:none;margin-left:5px;" onclick="LoadCollectorAssignInfo()"><i class="fa fa-times"></i></button>';
            html += "</td>";
            html += "</tr>";
            count++;
        }
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("collectorAssignListDetails").innerHTML = html;
    //Data Table
    $('#CourierAssignDataTable').DataTable({
        pageLength: 10,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'CourierAssignList' },
            { extend: 'pdf', title: 'CourierAssignList' },

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]

    });
    $('#CourierAssignDataTable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#CourierAssignDataTable_wrapper').addClass("container-fluid dt-bootstrap4");
}
const EditCollectorAssign = id => {
    document.getElementById('collectorName' + id).style.display = "none";
    document.getElementById('assignTypeLbl' + id).style.display = "none";

    document.getElementById('collector' + id).style.display = "block";
    document.getElementById('assignType' + id).style.display = "block";

    let collectorId = parseInt($("#collectorIdHiddenField" + id).val());

    loadCollectorInfo('collector' + id, collectorId);

    $('#editCollectorAssignBtn' + id).hide();
    $('#updateCollectorAssignBtn' + id).show();
    $('#deleteCollectorAssignBtn' + id).show();
    $('#cancelCollectorAssignBtn' + id).show();
}
const UpdateCollectorAssign = id => {
    let merchantId = parseInt($("#merchantIdHiddenField"+id).val());
    let collectorId = parseInt($("#collector" + id).val());
    let assignType = $("#assignType" + id).val();
    let userId = parseInt($("#UserHidden").val());
    
    if (collectorId === -1) {
        alert("Please Select Collector.")
        $("#collector" + id).focus();
        return false;
    }
    if (assignType === "-1") {
        alert("Please Select Assign Type.")
        $("#assignType"+id).focus();
        return false;
    }

    let Obj = {
        collectorAssignId: parseInt(id),
        courierUserId: merchantId,
        collectorId: collectorId,
        assignType: assignType,
        updatedBy: userId
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateCollectorAssign/" + id;
    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 200) {
                    alert("Collector Assign Updated.");
                    LoadCollectorAssignInfo();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const DeleteCollectorAssign = id => {
    var confirmation = confirm("Are You Sure?");
    if (!confirmation) {
        return false;
    }
    let url = apiBaseURL + "Delete/DeleteCollectorAssign/" + id;
    $.ajax({
        type: "DELETE",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 200) {
                    alert("Collector Assignment Deleted Successfully.");
                    LoadCollectorAssignInfo();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

// --- Delivery man Assign --- //
const AssignDeliveryManToMerchant = () => {
    let merchantId = parseInt($("#Merchant").val());
    let deliveryManId = parseInt($("#DeliveryMan").val());
    let assignType = "delivery";//$("#AssignType").val();
    let userId = parseInt($("#UserHidden").val());
    if (merchantId === -1) {
        alert("Please Select Merchant.")
        $("#Merchant").focus();
        return false;
    }
    if (deliveryManId === -1) {
        alert("Please Select Delivery Man.")
        $("#DeliveryMan").focus();
        return false;
    }
    //if (assignType === "-1") {
    //    alert("Please Select Assign Type.")
    //    $("#AssignType").focus();
    //    return false;
    //}

    let Obj = {
        courierUserId: merchantId,
        deliveryManUserId: deliveryManId,
        assignType: assignType,
        updatedBy: userId
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddDeliveryBonduAssign";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201) {
                    alert("Delivery Man Assigned.");
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

const LoadDeliveryManAssignInfo = () => {
    let url = apiBaseURL + "Fetch/GetAllDeliveryMansAssign";
    $.ajax({
        beforeSend: function () {
            document.getElementById('deliveryManAssignListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllDeliveryManAssignInfo = response.model;
                DrawDeliveryManAssignData(response.model);
            }
            else {
                alert("Error.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
const DrawDeliveryManAssignData = data => {
    ///console.log(data);
    let html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="DeliveryManAssignDataTable" aria-describedby="StatusDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryManAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width: 5%;">No</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryManAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Merchant: activate to sort column descending" style="width: 30%;">Merchant</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryManAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="DeliveryMan: activate to sort column descending" style="width: 30%;">DeliveryMan</th>';
    //html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryManAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Type: activate to sort column descending" style="width: 25%;">Type</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryManAssignDataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Thana: activate to sort column descending" style="width: 10%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    let count = 1;
    $.each(data, function (i, obj) {
        if (obj.id >= 0) {
            let id = obj.id;
            var evenOddClass = count % 2 === 0 ? "even" : "odd";
            html += "<tr class='gradeA " + evenOddClass + "' role='row'>";

            html += "<td style='text-align:center'>" + count + "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='courierUserName" + id + "' style='display:block;'>" + obj.companyName + "</label>";
            html += "<input type='hidden' id='merchantIdHiddenField" + id + "' value='" + obj.courierUserId + "' />";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='deliveryManName" + id + "' style='display:block;'>" + obj.name + "</label>";
            html += "<input type='hidden' id='deliveryManIdHiddenField" + id + "' value='" + obj.deliveryManUserId + "' />";
            html += "<select id='deliveryMan" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            //let assignTypeCollectionSelectedText = "";
            //let assignTypeReturnSelectedText = "";

            //if (obj.assignType !== null && obj.assignType.trim() === "delivery") {
            //    assignTypeCollectionSelectedText = "Selected";
            //}
            //if (obj.assignType !== null && obj.assignType.trim() === "parcel") {
            //    assignTypeReturnSelectedText = "Selected";
            //}
            //if (obj.assignType !== null && obj.assignType.trim() === "both") {
            //    assignTypeReturnSelectedText = "Selected";
            //}
            //html += "<td style='text-align:center'>";
            //html += "<label id='assignTypeLbl" + id + "' style='display:block;'>" + obj.assignType + "</label>";
            //html += "<select id='assignType" + id + "' class=form-control style='display:none;'>";
            //html += "<option value='collection' " + assignTypeCollectionSelectedText + ">Collection</option>";
            //html += "<option value='return' " + assignTypeReturnSelectedText + ">Return</option>";
            //html += "</select>";
            //html += "</td>";

            html += "<td align='center'>";
            html += '<button type="button" id=editDeliveryManAssignBtn' + id + ' class="btn btn-secondary" style="display:block;" onclick="EditDeliveryManAssign(' + id + ')"><i class="fa fa-pencil"></i></button>';
            html += '<button type="button" id=updateDeliveryManAssignBtn' + id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateDeliveryManAssign(' + id + ')"><i class="fa fa-check"></i></button>';
            html += '<button type="button" id=deleteDeliveryManAssignBtn' + id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="DeleteDeliveryManAssign(' + id + ')"><i class="fa fa-trash-o"></i></button>';
            html += '<button type="button" id=cancelDeliveryManAssignBtn' + id + ' class="btn btn-secondary" style="display:none;margin-left:5px;" onclick="LoadDeliveryManAssignInfo()"><i class="fa fa-times"></i></button>';
            html += "</td>";
            html += "</tr>";
            count++;
        }
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("deliveryManAssignListDetails").innerHTML = html;
    //Data Table
    $('#DeliveryManAssignDataTable').DataTable({
        pageLength: 10,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'DeliveryManAssignList' },
            { extend: 'pdf', title: 'DeliveryManAssignList' },

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]

    });
    $('#DeliveryManAssignDataTable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#DeliveryManAssignDataTable_wrapper').addClass("container-fluid dt-bootstrap4");
}
//--- DeliveryMan Assign End ---//


// --- Merchant Information --- //
const searchMerchantDetailsInfo = () => {
    if ($("#myInput").val().trim() !== "") {
        loadMerchantDetailsInfo(0, 20, $("#myInput").val().trim());
    }
    else {
        loadMerchantDetailsInfo(0, 20, "");
    }
}
const loadMerchantDetailsInfo = (offset, count, searchText) => {
    let Obj = {
        Index: parseInt(offset),
        Count: parseInt(count),
        Search: searchText
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "fetch/GetCourierUsersInfo";
    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        success: function (response) {
            if (response != null) {
                console.log(response);
                let totalCountofRechargeHis = response.model.totalUsers;
                CallPagination(Math.ceil(totalCountofRechargeHis / 20));
                DrawMerchantDetailsListData(response.model);
            }
            else {
                alert("Error.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
const DrawMerchantDetailsListData = data => {
    
    let merchantData = data.courierUsers;
    let html = "";
    //html += "<div class='col-md-12' style='padding:0px;'>";
    html += "<thead>";
    html += "<tr style='height:30px;'>";
    html += "<th style='text-align:center;width:5%'>No</th>";
    html += "<th style='text-align:center;width:10%'>Action</th>";
    html += "<th style='text-align:center;width:15%'>Company Name</th>";
    html += "<th style='text-align:center;width:10%'>Mobile</th>";
    html += "<th style='text-align:center;width:10%'>Bkash Number</th>";
    html += "<th style='text-align:center;width:10%'>Email</th>";
    html += "<th style='text-align:center;width:35%'>Address</th>";
    html += "<th style='text-align:center;width:5%'>Document</th>";
    html += "<th style='text-align:center;width:5%'>AutoProcess</th>";
    html += "</tr>";
    html += "<thead>";
    html += "<tbody id='myTable'>";
    let no = offset + 1;
    $.each(merchantData, function (i, obj) {
        let objectString = JSON.stringify(obj);
        html += "<tr style='height:auto;'>";
        html += "<td style='text-align:center'>" + no + "</td>";
        html += "<td align='center'>";
        html += "<button type='button' id='editMerchantInfoBtn" + obj.courierUserId + "' class='btn btn-secondary' style='display:block;' data-toggle='modal' data-target='#updateMerchantModal' onclick='EditMerchantInfo(&#39;" + objectString + "&#39;)'><i class='fa fa-pencil'></i></button>";
        html += "</td>";
        html += "<td style='text-align:center'><lebel id=nameEditLbl" + obj.courierUserId + ">" + obj.companyName + "(" + obj.courierUserId + ")" + "</lebel></td>";
        html += "<td style='text-align:center'><lebel id=mobileEditLbl" + obj.courierUserId + ">" + obj.mobile + "</br>" + obj.alterMobile + "</lebel></td>";
        html += "<td style='text-align:center'><lebel id=bkashNumberLbl" + obj.courierUserId + ">" + obj.bkashNumber + "</lebel></td>";
        html += "<td style='text-align:center'><lebel id=emailEditLbl" + obj.courierUserId + ">" + obj.emailAddress +"</lebel></td>";
        html += "<td style='text-align:center'><lebel id=addressEditLbl" + obj.courierUserId + ">" + obj.address + "</lebel></td>";
        let isDocumentText = obj.isDocument == true ? "Yes" : "No";
        html += "<td style='text-align:center'><lebel id=isDocumentEditLbl" + obj.courierUserId + ">" + isDocumentText + "</lebel></td>";
        let isAutoProcessText = obj.isAutoProcess == true ? "Yes" : "No";
        html += "<td style='text-align:center'><lebel id=isAutoProcessEditLbl" + obj.courierUserId + ">" + isAutoProcessText + "</lebel></td>";
        html += "</tr>";
        no++;
    });
    html += "</tbody>";
    document.getElementById("loadMerchantDetails").innerHTML = html;
}


function RemovePickupLocations(obj) {
    //let obj = JSON.parse(objectString);

    let url = apiBaseURL + "Delete/DeletePickupLocations/" + obj.id;

    $.ajax({
        type: "DELETE",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 200) {
                    alert("Delete");
                    GetPickupLocations(obj.courierUserId);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function UpdatePickupLocations(obj) {
    //let obj = JSON.parse(objectString);

    let distId = $("#districtUpdateVal" + obj.id).val();
    let thanaPickup = $("#thanaPickup" + obj.thanaId).val();
    let pickupAddress = $("#pickupAddress" + obj.thanaId).val();
    let pickupMobile = $("#pickupMobile" + obj.mobile).val();

    let pickupLocations = {
        districtId: distId,
        thanaId: thanaPickup,
        courierUserId: obj.courierUserId,
        pickupAddress: pickupAddress,
        mobile: pickupMobile
    };

    let json = JSON.stringify(pickupLocations);
    let url = apiBaseURL + "Update/UpdatePickupLocations/" + obj.id;

    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 200) {
                    alert("Update");
                    GetPickupLocations(obj.courierUserId);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function AddPickupLocations() {
    
    let districtPickup = $("#districtPickup option:selected").val();
    let thanaPickup = $("#thanaPickup option:selected").val();
    let pickupAddress = $("#pickupAddress").val();
    let pickupMobile = $("#pickupMobile").val();
    let courierUserId = $("#merchantIdHidden").val();

    if (districtPickup == 0 || districtPickup == null) {
        alert("Please select distric");
        return false;
    }

    if (thanaPickup == 0 || thanaPickup == null || thanaPickup == "-1") {
        alert("Please select thana");
        return false;
    }
    if (pickupAddress == "") {
        alert("Pickup Address can not empty");
        return false;
    }

    if (pickupMobile == "") {
        alert("Mobile Number can not empty");
        return false;
    }

    let pickupLocations = {
        districtId: districtPickup,
        thanaId: thanaPickup,
        courierUserId: courierUserId,
        pickupAddress: pickupAddress,
        mobile: pickupMobile
    };

    let json = JSON.stringify(pickupLocations);
    let url = apiBaseURL + "Entry/AddPickupLocations";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201) {
                    alert("Created.");
                    GetPickupLocations(courierUserId);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function GetPickupLocations(courierUserId) {
    let url = apiBaseURL + "Fetch/GetPickupLocations/" + courierUserId;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                let html = "";
                let thanas = response.model;
                //let option = ""
                $.each(response.model, function (i, obj) {
                    let objectString = JSON.stringify(obj);
                    //console.log(objectString);
                    html += "<tr>"
                    html += "<td><select disabled id='districtUpdateVal" + obj.id + "' class='form-control' onchange='loadDistOnChange(" + obj.id + "," + obj.thanaId + ");'><option value='14'>Dhaka</option><option value='80'>Chittagong</option><option value='43'>Narayanganj</option><option value='19'>Gazipur</option><option value='79'>Sylhet</option><option value='76'>Outside Dhaka</option></select></td>";
                    
                    //let thanaPickupListForUpdate = allDistInfo.filter(d => d.parentId == obj.districtId);
                    html += "<td><select style='width: 250px;' disabled id='thanaPickup" + obj.thanaId + "' class='form-control'><option value='-1'>Select</option></select></td>"
                   
                    html += "<td><textarea  id='pickupAddress" + obj.thanaId + "' style='height: auto;' class='form-control' rows='3'>" + obj.pickupAddress + "</textarea>'</td>";
                    html += "<td><input type='text' id = 'pickupMobile" + obj.mobile + "' class = 'form-control' placeholder = 'Mobile Number' autocomplete = 'off' maxlength = '11' value = '" + obj.mobile + "' /></td>";
                    html += "<td><button type='button' class='btn btn-warning' onclick='UpdatePickupLocations(" + objectString + ")'>Update</button><br/><button style='margin-top: 3px' type='button' class='btn btn-danger' onclick='RemovePickupLocations(" + objectString + ")'>Remove</button></td>";
                    html += "</tr>"
                });

                document.getElementById("pickupLocationsTable").innerHTML = html;
                
                for (var i = 0; i < thanas.length; i++) {
                    let thanaPickupListForUpdate = allDistInfo.filter(d => d.parentId == thanas[i].districtId);
                    let option = "";
                    $("#thanaPickup" + thanas[i].thanaId).empty();
                    for (var j = 0; j < thanaPickupListForUpdate.length; j++) {
                        $("#thanaPickup" + thanas[i].thanaId).append('<option value=' + thanaPickupListForUpdate[j].districtId + '>' + thanaPickupListForUpdate[j].districtBng + "-" + thanaPickupListForUpdate[j].district + '</option>');
                    }

                    $("#thanaPickup" + thanas[i].thanaId).val(thanas[i].thanaId);
                    $("#districtUpdateVal" + thanas[i].id).val(thanas[i].districtId);
                }
            }
            else {
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

const loadDistOnChange = (id,thanaId) => {
    let dist = $("#districtUpdateVal" + id).val();
    let thanaPickupListForUpdate = allDistInfo.filter(d => d.parentId == dist);
    $("#thanaPickup" + thanaId).empty();
    for (var j = 0; j < thanaPickupListForUpdate.length; j++) {
        $("#thanaPickup" + thanaId).append('<option value=' + thanaPickupListForUpdate[j].districtId + '>' + thanaPickupListForUpdate[j].districtBng + "-" + thanaPickupListForUpdate[j].district + '</option>');
    }
}

const EditMerchantInfo = objectString => {
    objectString = fixString(objectString);
    console.log(objectString);
    let obj = JSON.parse(objectString);
    let userId = parseInt($("#UserHidden").val());
    let userAdminType = parseInt(sessionStorage.getItem("adminType"));
    const allowedUsers = [83, 214, 240, 442];
    GetPickupLocations(obj.courierUserId);

    $("#merchantIdHidden").val(obj.courierUserId);
    if (userAdminType == 11 || userId == 11 || userId == 442) {
        document.getElementById('passwordId').style.display = 'block';
        $("#password").val(obj.password);
    }
    $("#companyName").val(obj.companyName);
    companyNameMerchantInfoUpdate = obj.companyName;
    if (obj.companyName.trim() !== "") {
        $('#companyName').prop('readonly', true);
    }
    $("#merchantName").val(obj.userName);
    $("#merchantMobile").val(obj.mobile);
    mobileNumberMerchantInfoUpdate = obj.mobile;
    $("#merchantAlterMobile").val(obj.alterMobile);
    $("#bKashMobile").val(obj.bkashNumber);
    $("#merchantEmail").val(obj.emailAddress);
    emailMerchantInfoUpdate = obj.emailAddress;
    $("#merchantAddress").val(obj.address);
    $("#maxCodCharge").val(obj.maxCodCharge);
    $("#sourceType").val(obj.sourceType);
    //$("#retentionManager").val(obj.retentionUserId);
    //$("#retentionManager").prop('disabled', true);
    //if (allowedUsers.includes(userId) || userAdminType == 11 || obj.retentionUserId == 0) {
    //    $("#retentionManager").attr('disabled', false);
    //}

    GetAdUsers('acqusitionManager', obj.acquisitionUserId, obj.retentionUserId, 'retentionManager');
    retentionUserIdMerchantInfoUpdate = obj.retentionUserId;
    acquisitionUserIdMerchantInfoUpdate = obj.acquisitionUserId;
    if (obj.isDocument === true) {
        $("#isDocument").prop("checked", true);
    }
    else {
        $("#isDocument").prop("checked", false);
    }

    if (obj.isAutoProcess === true) {
        $("#isAutoProcess").prop("checked", true);
    }
    else {
        $("#isAutoProcess").prop("checked", false);
    }

    if (obj.isQuickOrderActive === true) {
        $("#isQuickOrderActive").prop("checked", true);
    }
    else {
        $("#isQuickOrderActive").prop("checked", false);
    }

    $("#remarks").val(obj.remarks);
    if (obj.isActive === true) {
        $("#isActive").prop("checked",true);
    }
    else {
        $("#isActive").prop("checked", false);
    }

    if (obj.isEmail === true) {
        $("#isEmail").prop("checked", true);
    }
    else {
        $("#isEmail").prop("checked", false);
    }

    if (obj.isSms === true) {
        $("#isSMS").prop("checked", true);
    }
    else {
        $("#isSMS").prop("checked", false);
    }
    $("#credit").val(obj.credit);
    if ([1, 2, 11, 67].includes(userId)) {
        //$("#credit").prop("disabled", false);
        $('#credit').prop('readonly', false);
    }
    else {
        $('#credit').prop('readonly', true);
    }
    $("#mailCharge").val(obj.mailCharge);
    $("#smsCharge").val(obj.smsCharge);
    $("#collectionCharge").val(obj.collectionCharge);
    $("#returnCharge").val(obj.returnCharge);
    if (obj.joinDate !== null && obj.joinDate !== "") {
        $("#joinDate").val(obj.joinDate.split("T")[0]);
    }
    else {
        $("#joinDate").val("");
    }


    if (obj.isOfferActive === true) {
        $("#isOfferActive").prop("checked", true);
    }
    else {
        $("#isOfferActive").prop("checked", false);
    }

    if (obj.isBreakAble === true) {
        $("#isBreakAble").prop("checked", true);
    }
    else {
        $("#isBreakAble").prop("checked", false);
    }

    if (obj.isHeavyWeight === true) {
        $("#isHeavyWeight").prop("checked", true);
    }
    else {
        $("#isHeavyWeight").prop("checked", false);
    }

    if (obj.merchantAssignActive === true) {
        $("#merchantAssignActive").prop("checked", true);
    }
    else {
        $("#merchantAssignActive").prop("checked", false);
    }

    if (obj.autoDownload === true) {
        $("#autoDownload").prop("checked", true);
    }
    else {
        $("#autoDownload").prop("checked", false);
    }
    if (obj.isDana === true) {
        $("#isDanaId").prop("checked", true);
    }
    else {
        $("#isDanaId").prop("checked", false);
    }

    $("#offerType").val(obj.offerType);
    $("#offerCodDiscount").val(obj.offerCodDiscount);
    $("#offerBkashDiscountDhaka").val(obj.offerBkashDiscountDhaka);
    $("#offerBkashDiscountOutSideDhaka").val(obj.offerBkashDiscountOutSideDhaka);
    $("#knowingSource").val(obj.knowingSource);
    $("#priority").val(obj.priority);
    $("#district").val(obj.districtId);
    $("#thana").val(obj.thanaId);
    $("#categoryId").val(obj.categoryId);
    $("#subCategoryId").val(obj.subCategoryId);

    $("#paymentServiceType").val(obj.paymentServiceType);
    $("#verify").val(obj.verify);
    $("#paymentServiceCharge").val(obj.paymentServiceCharge);
    $("#collectionAmountLimt").val(obj.collectionAmountLimt);
    $('#codChargeInsideDhaka').val(obj.codChargeDhaka);
    $('#codChargeOutsideDhaka').val(obj.codChargeOutsideDhaka);
    $('#codChargePercentageInsideDhaka').val(obj.codChargePercentageDhaka);
    $('#codChargePercentageOutsideDhaka').val(obj.codChargePercentageOutsideDhaka);
    /*obj.CodChargeTypeFlag == null ? $('#codChargeType').val('0') : $('#codChargeType').val(obj.codChargeDhaka);*/
    $('#codChargeType').val(obj.codChargeTypeFlag.toString());
    $('#codChargeTypeOutside').val(obj.codChargeTypeOutsideFlag.toString());
    $('#firstCollectionCharge').val(obj.firstCollectionCharge);
    $('#instaCod').val(String(obj.isInstaCod == false ? 0 : 1));
    
    LoadAllDistricts(obj.thanaId);
    LoadAllCategory(obj.categoryId, 'categoryId');
    LoadAllSubCategory(obj.categoryId, obj.subCategoryId, 'subCategoryId');
    
    
}
const UpdateMerchantInfo = () => {

    let id = $("#merchantIdHidden").val();
    let companyName = $("#companyName").val();
    let userName = $("#merchantName").val();
    let mobile = $("#merchantMobile").val();
    let bkashNumber = $("#bKashMobile").val();
    let email = $("#merchantEmail").val();
    let address = $("#merchantAddress").val();
    let sourceType = $("#sourceType").val();
    let retentionUserId = $("#retentionManager").val() === "0" ? 0 : parseInt($("#retentionManager").val());
    let acquisitionUserId = $("#acqusitionManager").val() === "0" ? 0 : parseInt($("#acqusitionManager").val());
    let isDocument = $("#isDocument").prop("checked") == true ? true : false;
    let isAutoProcess = $("#isAutoProcess").prop("checked") == true ? true : false;
    let credit = parseFloat($("#credit").val());
    let maxCodCharge = $("#maxCodCharge").val();
    let remarks = $("#remarks").val();
    let collectionCharge = $("#collectionCharge").val();

    let isOfferActive = $("#isOfferActive").prop("checked") == true ? true : false;
    let offerType = $("#offerType").val() === "0" ? 0 : parseInt($("#offerType").val());
    let offerCodDiscount = $("#offerCodDiscount").val();
    let offerBkashDiscountDhaka = $("#offerBkashDiscountDhaka").val();
    let offerBkashDiscountOutSideDhaka = $("#offerBkashDiscountOutSideDhaka").val();
    let knowingSource = $("#knowingSource").val();
    let priority = $("#priority").val();
    let districtId = $("#district").val();
    let thanaId = $("#thana").val();
    let isQuickOrderActive = $("#isQuickOrderActive").prop("checked") == true ? true : false;
    let isBreakAble = $("#isBreakAble").prop("checked") == true ? true : false;
    let isHeavyWeight = $("#isHeavyWeight").prop("checked") == true ? true : false;
    let merchantAssignActive = $("#merchantAssignActive").prop("checked") == true ? true : false;
    let categoryId = $("#categoryId").val();
    let subCategoryId = $("#subCategoryId").val();
    let paymentServiceType = $("#paymentServiceType").val();
    let verify = $("#verify").val();
    let paymentServiceCharge = $("#paymentServiceCharge").val();
    let alterMobile = $("#merchantAlterMobile").val();
    let collectionAmountLimt = $("#collectionAmountLimt").val();
    let codChargeInsideDhaka = $('#codChargeInsideDhaka').val() == "" || undefined ? 0 : parseInt($('#codChargeInsideDhaka').val());
    let codChargeOutsideDhaka = $('#codChargeOutsideDhaka').val() == "" || undefined ? 0 : parseInt($('#codChargeOutsideDhaka').val());
    let codChargePercentageDhaka = $('#codChargePercentageInsideDhaka').val() == "" || undefined ? 0 : parseInt($('#codChargePercentageInsideDhaka').val());
    let codChargePercentageOutsideDhaka = $('#codChargePercentageOutsideDhaka').val() == "" || undefined ? 0 : parseInt($('#codChargePercentageOutsideDhaka').val());
    let codChargeType = $("#codChargeType").val();
    let codChargeTypeOutside = $("#codChargeTypeOutside").val();
    let firstCollectionCharge = $('#firstCollectionCharge').val();
    let autoDownload = $("#autoDownload").prop("checked") == true ? true : false;
    let isDana = $("#isDanaId").prop("checked") == true ? true : false;
    let isInstaCod = parseInt($("#instaCod").val());

    if (paymentServiceType == 1 && bkashNumber == "" || bkashNumber.length != 11 && paymentServiceType == 1) {
        alert("Please update currect bkash Number and then select poh");
        return false;
    }
    let userId = parseInt($("#UserHidden").val());
    const allowedUsers = [100, 214, 442];
    let userAdminType = parseInt(sessionStorage.getItem("adminType"));
    if (retentionUserIdMerchantInfoUpdate == 0) { //if merchant retention manager is not set before
        retentionUserIdMerchantInfoUpdate = retentionUserId;
        companyNameMerchantInfoUpdate = companyName;
        mobileNumberMerchantInfoUpdate = mobile;
    }
    if (acquisitionUserIdMerchantInfoUpdate == 0) { //if merchant acquisition manager is not set before
        acquisitionUserIdMerchantInfoUpdate = acquisitionUserId;
        companyNameMerchantInfoUpdate = companyName;
        mobileNumberMerchantInfoUpdate = mobile;
    }
    if (allowedUsers.includes(userId) || userAdminType == 11) { //this group of user are always allowed to update
        companyNameMerchantInfoUpdate = companyName;
        mobileNumberMerchantInfoUpdate = mobile;
        retentionUserIdMerchantInfoUpdate = retentionUserId;
        acquisitionUserIdMerchantInfoUpdate = acquisitionUserId;
    }
    if (emailMerchantInfoUpdate == "") { //if merchant email is not set before
        emailMerchantInfoUpdate = email;
    }
    if (userAdminType == 8 || userAdminType == 11) { //this group of user are always allowed to update
        emailMerchantInfoUpdate = email;
    }

    let Obj = {
        CourierUserId: id,
        UserName: userName,
        CompanyName: companyNameMerchantInfoUpdate,//companyName,
        Mobile: mobileNumberMerchantInfoUpdate,//mobile,
        BkashNumber: bkashNumber,
        EmailAddress: emailMerchantInfoUpdate,
        Address: address,
        sourceType: sourceType,
        retentionUserId: retentionUserIdMerchantInfoUpdate,//retentionUserId,
        acquisitionUserId: acquisitionUserIdMerchantInfoUpdate,//acquisitionUserId,
        IsDocument: isDocument,
        IsAutoProcess: isAutoProcess,
        Remarks: remarks,
        Credit: credit,
        MaxCodCharge: maxCodCharge,
        CollectionCharge: collectionCharge,
        IsActive: true,
        isOfferActive: isOfferActive,
        offerType: offerType,
        offerCodDiscount: offerCodDiscount,
        offerBkashDiscountDhaka: offerBkashDiscountDhaka,
        offerBkashDiscountOutSideDhaka: offerBkashDiscountOutSideDhaka,
        knowingSource: knowingSource,
        priority: priority,
        districtId: districtId,
        thanaId: thanaId,
        isQuickOrderActive: isQuickOrderActive,
        isBreakAble: isBreakAble,
        isHeavyWeight: isHeavyWeight,
        merchantAssignActive: merchantAssignActive,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        paymentServiceType: paymentServiceType,
        verify: verify,
        paymentServiceCharge: paymentServiceCharge,
        alterMobile: alterMobile,
        collectionAmountLimt: collectionAmountLimt,
        codChargeDhaka: codChargeInsideDhaka,
        codChargeOutsideDhaka: codChargeOutsideDhaka,
        CodChargePercentageDhaka: codChargePercentageDhaka,
        CodChargePercentageOutsideDhaka: codChargePercentageOutsideDhaka,
        CodChargeTypeFlag: parseInt(codChargeType),
        CodChargeTypeOutsideFlag: parseInt(codChargeTypeOutside),
        firstCollectionCharge: firstCollectionCharge,
        autoDownload: autoDownload,
        isInstaCod: isInstaCod,
        isDana: isDana
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateMerchantInformation/" + id;

    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 200) {
                    alert("Updated.");
                    AddMerchantInfoUpdateLog(id);
                    loadMerchantDetailsInfo(offset, count, "");
                }
                else {
                    alert("Error. Please Contact Devloper.");
                    Console.log(response);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const CallPagination = (page) => {
    $('#pagination-demo').bootpag({
        total: page,
        maxVisible: 20,
        firstLastUse: true,

        next: '&rsaquo;',
        prev: '&lsaquo;',
        first: '&laquo;',
        last: '&raquo;'
    }).on("page", function (event, num) {
        offset = (num - 1) * count;
        if ($("#myInput").val().trim() !== "") {
            loadMerchantDetailsInfo(offset, count, $("#myInput").val().trim());
        }
        else {
            loadMerchantDetailsInfo(offset, count, "");
        }
    });
}

const onchangeDistrict = (districtId) => {

    let thana = allDistInfo.filter(d => d.parentId === parseInt(districtId.value) && d.isActive === true);
    $('#thana').html('');
    if (districtId.value == '0') {
        $('#thana').append('<option value="0">Select</option>');
    }
    else {
        $('#thana').append('<option value="0">Select</option>');
        for (var i = 0; i < thana.length; i++) {
            $('#thana').append('<option value=' + thana[i].districtId + '>' + thana[i].district + '</option>');
        }
    }
    

}

const AddMerchantInfoUpdateLog = (courierUserId) => {

    let userId = +sessionStorage.getItem("userId");
    let Obj = {
        CourierUserId: +courierUserId,
        UserId: userId
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddMerchantInfoUpdateLog";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201) {
                    
                }
                else {
                    alert("Error. Please Contact Devloper.");
                    Console.log(response);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

const LoadAllCategory = (categoryId, categoryTagId) => {
    let url = apiBaseURL + "Fetch/GetCategoriesForAdmin" + "/" + false;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                let allCategory = response.model;
               
                let activeCategories = allCategory.filter(d => d.isActive === true);
                $('#categoryId').append('<option value="0">Select</option>');
                for (var i = 0; i < activeCategories.length; i++) {
                    $('#categoryId').append('<option value=' + activeCategories[i].categoryId + '>' + activeCategories[i].categoryNameEng + '</option>');
                }

                if (categoryId != null) {
                    $("#" + categoryTagId + " option").prop('selected', false)
                        .filter("[value='" + categoryId + "']")
                        .prop('selected', true);
                }
                
            }
            else {
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

let allSubCategory = [];

const LoadAllSubCategory = (categoryId,subCategoryId, subCategoryTagId) => {

    //let categoryId = +document.getElementById('categoryId').value;
    let url = apiBaseURL + "Fetch/GetSubCategoryById" + "/" + true + "/" + categoryId;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                allSubCategory = response.model;

                let subCategories = allSubCategory.filter(d => d.isActive === true);
                $('#subCategoryId').empty();
                $('#subCategoryId').append('<option value="0">Select</option>');
                for (var i = 0; i < subCategories.length; i++) {
                    $('#subCategoryId').append('<option value=' + subCategories[i].subCategoryId + '>' + subCategories[i].subCategoryNameEng + '</option>');
                }

                if (subCategoryId != null) {
                    $("#" + subCategoryTagId + " option").prop('selected', false)
                        .filter("[value='" + subCategoryId + "']")
                        .prop('selected', true);
                }

            }
            else {
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

const onchangeCategory = () => {

    let categoryId = +document.getElementById('categoryId').value;
    LoadAllSubCategory(categoryId, null,'subCategoryTagId');
    let subCategories = allSubCategory.filter(d => d.isActive === true);
    $('#subCategoryId').empty();
    $('#subCategoryId').append('<option value="0">Select</option>');
    for (var i = 0; i < subCategories.length; i++) {
        $('#subCategoryId').append('<option value=' + subCategories[i].subCategoryId + '>' + subCategories[i].subCategoryNameEng + '</option>');
    }
};