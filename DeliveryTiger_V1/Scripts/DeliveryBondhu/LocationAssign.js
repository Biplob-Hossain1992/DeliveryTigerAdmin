/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/datatables/datatables.bootstrap4.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />
/// <reference path="../plugins/datatables/datatables.min.js" />

const loaderHtml = `<div class="spiner-example"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div> <div class="sk-rect2"></div> <div class="sk-rect3"></div> <div class="sk-rect4"></div> <div class="sk-rect5"></div> </div></div>`;

//Zone
const getZoneInfo = () => {
    let url = apiBaseURL + "Fetch/GetDeliveryZone";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                var zoneInfo = response.model;

                $('#zoneId').empty();
                $('#zoneId').append('<option value="0">Select-Zone</option>');
                for (var i = 0; i < zoneInfo.length; i++) {
                    $('#zoneId').append('<option value=' + zoneInfo[i].zoneId + '>' + zoneInfo[i].zoneName + '</option>');
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

//District
var allDistInfo = [];
var addDeliveryZoneLocation = [];
var deliveryZoneData = '';
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
                allDistInfo = response.model;

                //district
                let district = allDistInfo.filter(d => d.parentId === 0 && d.isActive === true);
                $('#DistrictSearch').empty();
                $('#DistrictSearch').append('<option value="0">Select-District</option>');
                for (var i = 0; i < district.length; i++) {
                    $('#DistrictSearch').append('<option value=' + district[i].districtId + '>' + district[i].district + '</option>');
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
//onChange
const onchangeDistrict = (selectedValue) => {

    var districtId = parseInt($("#DistrictSearch option:selected").val());
    if (districtId == 14 || districtId == 77 || districtId == 78 || districtId == 79 || districtId == 80) {
        $("#Thana").select2();
    } else {
        $("#LocationDropDownList").select2();
        $("#Thana").select2();
        $('#Thana').removeAttr('multiple');
    }

    let thana = allDistInfo.filter(d => d.parentId === parseInt(districtId) && d.isActive === true);
    $('#Thana').html('');
    if (districtId.value == '0') {
        $('#Thana').append('<option value="0">Select-Thana</option>');
    }
    else {
        $('#Thana').append('<option value="0">Select</option>');
        for (var i = 0; i < thana.length; i++) {
            $('#Thana').append('<option value=' + thana[i].districtId + '>' + thana[i].district + '</option>');
        }

        if (selectedValue != 0) {

            $("#Thana").val(selectedValue).trigger('change'); //Load Selected value from hidden field
        }
    }


}
//onChange Thana
const onchangeThana = (selectedValue) => {

    var districtId = parseInt($("#Thana option:selected").val());
    if (districtId == 14 || districtId == 77 || districtId == 78 || districtId == 79 || districtId == 80) {
        $("#Thana").select2();
    } else {
        $("#Area").select2();
    }

    let area = allDistInfo.filter(d => d.parentId === parseInt(districtId) && d.isActive === true);
    $('#Area').html('');
    if (districtId.value == '0') {
        $('#Area').append('<option value="0">Select-Area</option>');
    }
    else {
        $('#Area').append('<option value="0">Select</option>');
        for (var i = 0; i < area.length; i++) {
            $('#Area').append('<option value=' + area[i].districtId + '>' + area[i].district + '</option>');
        }

        if (selectedValue != 0) {

            $("#Area").val(selectedValue).trigger('change'); //Load Selected value from hidden field
        }
    }


}

//Add location
function addLocation() {

    addDeliveryZoneLocation = [];
    let deliveryZoneId = $("#zoneId").val();
    let isActive = $('#isActive').val();
    let districtId = $('#DistrictSearch').val();
    let thanaId = $('#Thana').val();
    let areaId = $('#Area').val();
    let userId = sessionStorage.getItem("userId").trim();



    if (Validation(deliveryZoneId, isActive, districtId, thanaId)) {

        if (Array.isArray(thanaId) == true) {

            for (var i = 0; i < thanaId.length; i++) {
                var obj = {
                    ZoneId: parseInt(deliveryZoneId),
                    DistrictId: parseInt(districtId),
                    ThanaId: parseInt(thanaId[i]),
                    AreaId: parseInt("0"),
                    IsActive: parseInt(isActive),
                    InsertedBy: parseInt(userId)
                }
                addDeliveryZoneLocation.push(obj);
            }

        }
        else {
            for (var i = 0; i < areaId.length; i++) {
                var obj = {
                    ZoneId: parseInt(deliveryZoneId),
                    DistrictId: parseInt(districtId),
                    ThanaId: parseInt(thanaId),
                    AreaId: parseInt(areaId[i]),
                    IsActive: parseInt(isActive),
                    InsertedBy: parseInt(userId)
                }
                addDeliveryZoneLocation.push(obj);
            }
        }
        ProcessToInsertDeliveryZone("DeliveryZone/AddDeliveryZoneLocationDT");
    } else {
        return false;
    }


}

function updateLocation() {

    addDeliveryZoneLocation = [];
    let deliveryZoneId = $("#zoneId").val();
    let isActive = $('#isActive').val();
    let districtId = $('#DistrictSearch').val();
    let thanaId = $('#Thana').val();
    let areaId = $('#Area').val();
    let userId = sessionStorage.getItem("userId").trim();



    if (Validation(deliveryZoneId, isActive, districtId, thanaId)) {

        if (Array.isArray(thanaId) == true) {

            for (var i = 0; i < thanaId.length; i++) {
                var obj = {
                    ZoneId: parseInt(deliveryZoneId),
                    DistrictId: parseInt(districtId),
                    ThanaId: parseInt(thanaId[i]),
                    AreaId: parseInt("0"),
                    IsActive: parseInt(isActive),
                    InsertedBy: parseInt(userId)
                }
                addDeliveryZoneLocation.push(obj);
            }

        }
        else {
            for (var i = 0; i < areaId.length; i++) {
                var obj = {
                    ZoneId: parseInt(deliveryZoneId),
                    DistrictId: parseInt(districtId),
                    ThanaId: parseInt(thanaId),
                    AreaId: parseInt(areaId[i]),
                    IsActive: parseInt(isActive),
                    InsertedBy: parseInt(userId)
                }
                addDeliveryZoneLocation.push(obj);
            }
        }
        ProcessToInsertDeliveryZone("DeliveryZone/UpdateDeliveryZoneLocationDT");
    } else {
        return false;
    }


}


function ProcessToInsertDeliveryZone(url) {

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: admBaseOnlyUrl + url,
        data: JSON.stringify(addDeliveryZoneLocation),
        dataType: "",
        success: function (data) {
            if (data > 0) {
                addDeliveryZoneLocation = [];
                alert("Successfully");
                location.reload();
            } else {
                addDeliveryZoneLocation = [];
                alert("Unsuccessfully");
                location.reload();
            }
        },
        error: function () {
            alert("Oops!", "Have a Problem", "error");
        }
    });
}

function Validation(id, isActive, district, thana) {

    if (id == "-1") {
        alert("Please select a  Delivery Zone!");
        return false;
    }

    if (district == "-1") {
        alert("Please select District!");
        return false;
    }

    if (isActive == "-1") {
        alert("Please select Active or Inactive!");
        return false;
    }

    if (thana == "-1") {
        alert("Please select Thana!");
        return false;
    }
    else {
        return true;
    }
}

function loadDeliveryZoneLocation() {
    $.ajax({
        type: 'GET',
        url: admBaseOnlyUrl + 'DeliveryZone/LoadDeliveryZoneLocationDT',
        beforeSend: function () {
            //$(".circle-loader").show();
        },
        async: false,
        success: function (data) {
            var result = data;

            if (result.length > 0) {

                $('#ShowAllInfo').show();
                deliveryZoneLocationReportDataBind(result)
                deliveryZoneData = result;
            }
        },
        error: function (xhr) {

        },
        complete: function () {
            //$(".circle-loader").css("display", "none");
        }
    });
}

function deliveryZoneLocationReportDataBind(deliveryUsersData) {

    var deliveryZoneLocationReportDataBind = '';
    deliveryZoneLocationReportDataBind += '<thead>';
    deliveryZoneLocationReportDataBind += '<tr>';
    deliveryZoneLocationReportDataBind += '<th style="text-align:center;">Delivery Zone Name</th>';
    deliveryZoneLocationReportDataBind += '<th style="text-align:center;">District</th>';
    deliveryZoneLocationReportDataBind += '<th style="text-align:center;">Thana</th>';
    deliveryZoneLocationReportDataBind += '<th style="text-align:center;">Is Active</th>';
    deliveryZoneLocationReportDataBind += '<th style="text-align:center;">Action</th>';
    deliveryZoneLocationReportDataBind += '</tr>';
    deliveryZoneLocationReportDataBind += '</thead>';
    deliveryZoneLocationReportDataBind += '<tbody>';
    for (var loop = 0; loop < deliveryUsersData.length; loop++) {
        deliveryZoneLocationReportDataBind += '<tr>';

        var isActive = "Yes";

        deliveryZoneLocationReportDataBind += '<td style="text-align:center;">' + deliveryUsersData[loop].ZoneName + '</td>';
        deliveryZoneLocationReportDataBind += '<td style="text-align:center;">' + deliveryUsersData[loop].DistrictName + '</td>';
        deliveryZoneLocationReportDataBind += '<td style="text-align:center;">' + deliveryUsersData[loop].ThanaNames + '</td>';
        deliveryZoneLocationReportDataBind += '<td style="text-align:center;">' + isActive + '</td>';
        deliveryZoneLocationReportDataBind += '<td style="padding: 5px;"><input type="button" value="Edit" class="btn btn-success" id="updateButton" onclick="updateDeliveryZoneLocation(' + loop + ');" /></td>';
        deliveryZoneLocationReportDataBind += '</tr>';
    }
    deliveryZoneLocationReportDataBind += '</tbody>';

    $('#loadforeditinfo').empty();
    $('#loadforeditinfo').append(deliveryZoneLocationReportDataBind);

    $('#loadforeditinfo').DataTable();

}

function updateDeliveryZoneLocation(loopValue) {
    $('#updateLocation').show();
    $('#addLocation').hide();
    var editData = deliveryZoneData[loopValue];
    $("#zoneId").val(editData.ZoneId);
    $('#isActive').val("1");
    $('#DistrictSearch').val(editData.DistrictId);
    onchangeDistrict(editData.ThanaIds);

}