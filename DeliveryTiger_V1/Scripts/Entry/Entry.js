/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/datatables/datatables.bootstrap4.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />
/// <reference path="../plugins/datatables/datatables.min.js" />


//const { image } = require("d3");


//var apiBaseURL = "http://coreapi.ajkerdeal.com/api/"; //live
//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
//var apiBaseURL = "http://localhost:58676/api/"; //local
const loaderHtml = `<div class="spiner-example"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div> <div class="sk-rect2"></div> <div class="sk-rect3"></div> <div class="sk-rect4"></div> <div class="sk-rect5"></div> </div></div>`;
//-- Weight & Delivery Type Entry --//
const checkWeightValue = () => {
    if ($("#Weight").val() != "") {
        document.getElementById('lblMsgForWieghtEntry').innerHTML = "";
    }
}
const checkDayValue = () => {
    if ($("#Day").val() != "") {
        document.getElementById('lblMsgTypeEntry2').innerHTML = "";
    }
}
const checkDeliveryTypeValue = () => {
    if ($("#DeliveryType").val() != "") {
        document.getElementById('lblMsgTypeEntry1').innerHTML = "";
    }
}
const checkShowHide = () => {
    if ($("#ShowHide").val() != "") {
        document.getElementById('lblMsgTypeEntry6').innerHTML = "";
    }
}

const checkType = () => {
    if ($("#ErType").val() != "") {
        document.getElementById('lblMsgTypeEntry66').innerHTML = "";
    }
}



//Weight Entry
const addWeight = () => {
    let check = WeightValidation();
    if (check) {
        let Weight = $("#Weight").val();
        let Type = $("#Type").val();
        let WeightNumber = $("#WeightNumber").val();
        let ReDeliveryCharge = $("#RegularTypeCourierDeliveryCharge").val();
        let ExDeliveryCharge = $("#ExpressTypeCourierDeliveryCharge").val();
        let Obj = {
            Weight: Weight,
            Type: Type,
            WeightNumber: WeightNumber,
            RegularTypeCourierDeliveryCharge: ReDeliveryCharge,
            ExpressTypeCourierDeliveryCharge: ExDeliveryCharge
        };
        let json = JSON.stringify(Obj);
        let url = apiBaseURL + "Entry/AddWeightRange";

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
                        redisClear('GetWeightRange');
                    }
                }
                else {
                    alert("Error.");
                }
            }
        });

    }
}
const WeightValidation = () => {
    let Weight = $("#Weight").val();
    if (Weight == '') {
        document.getElementById('lblMsgForWieghtEntry').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#Weight").focus();
        return false;
    }
    else {
        return true;
    }
}
//Delivery Type Entry
const addDeliveryType = () => {
    let check = DeliveryTypeValidation();
    if (check) {
        //let DeliveryType = $("#DeliveryType option:selected").text();
        let DeliveryType = $("#DeliveryType").val();
        let DeliveryCharge = $("#DeliveryCharge").val();
        let Day = $("#Day").val();
        let DayType = $("#DayType").val();
        let OnImageLink = $("#OnImageLink").val();
        let OffImageLink = $("#OffImageLink").val();
        let ShowHide = $("#ShowHide option:selected").val();
        let DeliveryAlertMessage = $("#DeliveryAlertMessage").val();
        let LoginHours = $("#LoginHours").val();
        let ErType = $("#ErType").val();

        let Obj = {
            Name: DeliveryType,
            CourierDeliveryCharge: DeliveryCharge,
            Day: Day,
            IsActive: 1,
            DayType: DayType,
            OffImageLink: OffImageLink,
            OnImageLink: OnImageLink,
            ShowHide: ShowHide,
            DeliveryAlertMessage: DeliveryAlertMessage,
            LoginHours: LoginHours,
            Type: ErType
        };
        let json = JSON.stringify(Obj);
        //console.log(json);
        let url = apiBaseURL + "Entry/AddDeliveryRange";

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
                    }
                }
                else {
                    alert("Error.");
                }
            }
        });

    }
}
const DeliveryTypeValidation = () => {
    let DeliveryType = $("#DeliveryType").val();
    let Day = $("#Day").val();
    let DayType = $("#DayType").val();
    let OnImageLink = $("#OnImageLink").val();
    let OffImageLink = $("#OffImageLink").val();
    let ErType = $("#ErType").val();

    if (ErType == "") {
        document.getElementById('lblMsgTypeEntry66').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#Type").focus();
        return false;
    }

    if (DeliveryType == "") {
        document.getElementById('lblMsgTypeEntry1').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#DeliveryType").focus();
        return false;
    }
    else if (Day == "") {
        document.getElementById('lblMsgTypeEntry2').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#Day").focus();
        return false;
    }
    else if (DayType == "") {
        document.getElementById('lblMsgTypeEntry3').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#DayType").focus();
        return false;
    }
    else if (OnImageLink == "") {
        document.getElementById('lblMsgTypeEntry4').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#DayType").focus();
        return false;
    }
    else if (OffImageLink == "") {
        document.getElementById('lblMsgTypeEntry5').innerHTML = "<div class='text text-danger'>Required!!!!</div>";
        $("#DayType").focus();
        return false;
    }

    else {
        return true;
    }
}
//Load Lists
const loadWeightList = () => {
    let url = apiBaseURL + "Fetch/GetWeightRange";
    $.ajax({
        beforeSend: function () {
            document.getElementById('WeightListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawWeightListData(response.model);
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


const loadDeliveryTypeList = () => {
    let url = apiBaseURL + "Fetch/GetDeliveryRange";
    $.ajax({
        beforeSend: function () {
            document.getElementById('DeliveryTypeListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawDeliveryRangeListData(response.model);
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
//Draw Lists
const DrawWeightListData = data => {
    let html = "";
    html += "<div class='col-md-12' style='padding:0px;'>";
    html += "<table class='table-bordered' style='border:1px' width='100%'>";
    html += "<tr style='height:30px;'>";
    html += "<th style='text-align:center;'>No.</th>";
    html += "<th style='text-align:center;'>Weight</th>";
    html += "<th style='text-align:center;'>Type</th>";
    html += "<th style='text-align:center;'>Weight Number</th>";
    html += "<th style='text-align:center;'>Regular Delivery Charge</th>";
    html += "<th style='text-align:center;'>Express Delivery Charge</th>";
    html += "<th style='text-align:center;'>Action</th>";
    html += "</tr>";
    let count = 1;
    $.each(data, function (i, obj) {
        html += "<tr style='height:auto;'>";
        html += "<td style='text-align:center'>" + count + "</td>";
        html += "<td style='text-align:center'><input type=text id=weightEdit" + obj.id + " value= '" + obj.weight + "' Class=form-control readonly /></td>";
        html += "<td style='text-align:center'><select id='typeEdit" + obj.id + "' class=form-control disabled>";
        html += "<option value='deliverytiger' selected>Delivery Tiger</option>";
        html += "</select></td>";
        html += "<td style='text-align:center'><input type=text id=weightNumberEdit" + obj.id + " value= '" + obj.weightNumber + "' Class=form-control readonly/></td>";
        html += "<td style='text-align:center'><input type=text id=regularTypeCourierDeliveryChargeEdit" + obj.id + " value= '" + obj.regularTypeCourierDeliveryCharge + "' Class=form-control readonly/></td>";
        html += "<td style='text-align:center'><input type=text id=expressTypeCourierDeliveryChargeEdit" + obj.id + " value= '" + obj.expressTypeCourierDeliveryCharge + "' Class=form-control  readonly/></td>";


        html += "<td align='center'>";
        html += '<button type="button" id=editWeightBtn' + obj.id + ' class="btn btn-secondary" style="display:block;" onclick="EditWeight(' + obj.id + ')"><i class="fa fa-pencil"></i></button>';
        html += '<button type="button" id=updateWeightBtn' + obj.id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateWeight(' + obj.id + ')"><i class="fa fa-check"></i></button>';
        html += '<button type="button" id=cancelWeightBtn' + obj.id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadWeightList()"><i class="fa fa-times"></i></button>';
        html += "</td>";
        html += "</tr>";
        count++;
    });
    html += "</table>";
    html += "</div>";
    document.getElementById("WeightListDetails").innerHTML = html;
}
const DrawDeliveryRangeListData = data => {
    let html = "";
    html += "<div class='col-md-12' style='padding:0px;'>";
    html += "<table class='table-bordered' style='border:1px' width='100%'>";
    html += "<tr>";
    html += "<th style='text-align:center;width:5%'>No.</th>";
    html += "<th style='text-align:center;width:12%'>Name</th>";
    html += "<th style='text-align:center;width:5%'>Day</th>";
    html += "<th style='text-align:center;width:5%'>Day Type</th>";
    html += "<th style='text-align:center;width:23%'>On ImageLink</th>";
    html += "<th style='text-align:center;width:23%'>Off ImageLink</th>";
    html += "<th style='text-align:center;width:7%'>IsActive</th>";
    html += "<th style='text-align:center;width:3%'>Delivery Charge</th>";
    html += "<th style='text-align:center;width:7%'>Type</th>";
    html += "<th style='text-align:center;width:10%'>Action</th>";
    html += "</tr>";
    let count = 1;

    $.each(data, function (i, obj) {
        //let typeSelectedTextRegular = "";
        //let typeSelectedTextExpress = "";
        //let typeSelectedTextSameDay = "";

        let isActiveSelectedTextTrue = "";
        let isActiveSelectedTextFalse = "";

        //if (obj.name.trim() == "Regular Delivery") {
        //    typeSelectedTextRegular = "selected";
        //}
        //else if (obj.name.trim() == "SameDay Delivery") {
        //    typeSelectedTextSameDay = "selected";
        //}
        //else {
        //    typeSelectedTextExpress = "selected";
        //}
        //if (obj.isActive == true) {
        //    isActiveSelectedTextTrue = "selected";
        //}
        //else {
        //    isActiveSelectedTextFalse = "selected";
        //}
        html += "<tr>";
        html += "<td style='text-align:center'>" + count + "</td>";
        //html += "<td style='text-align:center'>" + obj.name + "</td>";
        //html += "<td style='text-align:center'><select id='deliveryTypeEdit" + obj.id + "' class=form-control disabled>";
        //html += "<option value='1' " + typeSelectedTextRegular + " >Regular Delivery</option>";
        //html += "<option value='2' " + typeSelectedTextExpress + " >Express Delivery</option>";
        //html += "<option value='5' " + typeSelectedTextSameDay + " >SameDay Delivery</option>";
        //html += "</select></td>";
        html += "<td style='text-align:center'>";
        html += "<input type=text id=deliveryTypeEdit" + obj.id + " value = '" + obj.name + "' Class=form-control readonly />";
        html += "</td>";


        html += "<td style='text-align:center'><input type=text id=dayEdit" + obj.id + " value= '" + obj.day + "' Class=form-control readonly /></td>";
        html += "<td style='text-align:center'><input type=text id=dayTypeEdit" + obj.id + " value= '" + obj.dayType + "' Class=form-control readonly /></td>";

        html += "<td style='text-align:center'>";
        html += "<input type='text' id='onImageLinkEdit" + obj.id + "' value ='" + obj.onImageLink + "' class='form-control' style='display:none' readonly />";
        html += "<input type='button' id='imageUp" + obj.id + "' class='btn btn-primary btn-sm' value='Click' onclick ='ImageUpAction(" + obj.id + ")' style='display:blocked' />"
        html += "<input type='button' id='onImageUp" + obj.id + "' class='btn btn-primary btn-sm' value='Upload' onclick ='OnImageUpload(" + obj.id + ")' style='display:none;margin-left:5px' />"
        html += "<input type='button' id='viewLink" + obj.id + "'class='btn btn-primary btn-sm' value='View' onclick ='ViewImage(" + obj.id + ")' style='display:none;margin-left:5px' />"
       

        html += "</td > ";
        html += "<td style='text-align:center'>";
        html += "<input type='text' id='offImageLinkEdit" + obj.id + "' value= '" + obj.offImageLink + "' class='form-control' style='display:none' readonly />";
        html += "<input type='button' id='accessImageUp" + obj.id + "' class='btn btn-primary btn-sm' value='Click' onclick ='AccessImageUp(" + obj.id + ")' style='display:blocked' />"
        html += "<input type='button' id='offImageUp" + obj.id + "' class='btn btn-primary btn-sm' value='Upload' onclick ='OffImageUpload(" + obj.id + ")' style='display:none;margin-left:5px' />"
        html += "<input type='button' id='offviewLink" + obj.id + "'class='btn btn-primary btn-sm' value='View' onclick ='OffViewImage(" + obj.id + ")' style='display:none;margin-left:5px' />"

        html += "</td>";
        html += "<td style='text-align:center'><select id='isActiveEdit" + obj.id + "' class=form-control disabled>";
        html += "<option value='1' " + isActiveSelectedTextTrue + " >Yes</option>";
        html += "<option value='0' " + isActiveSelectedTextFalse + " >No</option>";
        html += "</select></td>";

        html += "<td style='text-align:center'>";
        html += "<input type=text id=deliveryChargeEdit" + obj.id + " value = '" + obj.courierDeliveryCharge + "' Class=form-control readonly />";
        html += "</td>";


        html += "<td style='text-align:center'><select id='erTypeEdit" + obj.id + "' class=form-control disabled>";

        if (obj.type == 'express') {
            html += "<option value='express' selected>Express</option>";
            html += "<option value='regular'>Regular</option>";
        }
        else if (obj.type == 'regular') {
            html += "<option value='express'>Express</option>"; 
            html += "<option value='regular' selected>Regular</option>";
        }
        html += "</select></td>";

        html += "<td align='center'>";
        html += '<button type="button" id=editDeliveryTypeBtn' + obj.id + ' class="btn btn-secondary" style="display:block;" onclick="EditDeliveryType(' + obj.id + ')"><i class="fa fa-pencil"></i></button>';
        html += '<button type="button" id=updateDeliveryTypeBtn' + obj.id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateDeliveryType(' + obj.id + ')"><i class="fa fa-check"></i></button>';
        html += '<button type="button" id=cancelDeliveryTypeBtn' + obj.id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadDeliveryTypeList()"><i class="fa fa-times"></i></button>';
        
        html += "</td>";
        html += "</tr>";
        count++;
    });
    html += "</table>";
    html += "</div>";
    document.getElementById("DeliveryTypeListDetails").innerHTML = html;
}
const EditWeight = id => {
    document.getElementById('weightEdit' + id).removeAttribute("readonly");
    document.getElementById('typeEdit' + id).disabled = false;
    document.getElementById('weightNumberEdit' + id).removeAttribute("readonly");
    document.getElementById('regularTypeCourierDeliveryChargeEdit' + id).removeAttribute("readonly");
    document.getElementById('expressTypeCourierDeliveryChargeEdit' + id).removeAttribute("readonly");

    $('#editWeightBtn' + id).hide();
    $('#updateWeightBtn' + id).show();
    $('#cancelWeightBtn' + id).show();
    
}
const EditDeliveryType = id => {
    //document.getElementById('deliveryTypeEdit' + id).disabled = false;
    document.getElementById('deliveryTypeEdit' + id).removeAttribute("readonly");
    document.getElementById('dayEdit' + id).removeAttribute("readonly");
    document.getElementById('dayTypeEdit' + id).removeAttribute("readonly");
    document.getElementById('onImageLinkEdit' + id).removeAttribute("readonly");
    document.getElementById('offImageLinkEdit' + id).removeAttribute("readonly");
    document.getElementById('isActiveEdit' + id).disabled = false;

    document.getElementById('deliveryChargeEdit' + id).removeAttribute("readonly");
    document.getElementById('erTypeEdit' + id).disabled = false;

    $('#editDeliveryTypeBtn' + id).hide();
    $('#updateDeliveryTypeBtn' + id).show();
    $('#cancelDeliveryTypeBtn' + id).show();
}
//Update Lists
const UpdateWeight = id => {
    let Weight = $("#weightEdit" + id).val();
    let Type = $("#typeEdit" + id).val();
    if (Weight == "") {
        alert("Please Input Weight.");
        $("#weightEdit" + id).focus();
        return false;
    }

    let weightNumber = $("#weightNumberEdit" + id).val();
    let expressTypeCourierDeliveryCharge = $("#expressTypeCourierDeliveryChargeEdit" + id).val();
    let regularTypeCourierDeliveryCharge = $("#regularTypeCourierDeliveryChargeEdit" + id).val();

    let Obj = {
        Id: parseInt(id),
        Weight: Weight,
        Type: Type,
        WeightNumber: weightNumber,
        expressTypeCourierDeliveryCharge: expressTypeCourierDeliveryCharge,
        regularTypeCourierDeliveryCharge: regularTypeCourierDeliveryCharge
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateWeightRange/" + id;

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
                    redisClear('GetWeightRange');
                    alert("Updated.");
                    loadWeightList();
                    updateWeightRangePriceBulk(Obj);

                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function updateWeightRangePriceBulk(obj) {
    let url = apiBaseURL + "Update/UpdateWeightRangePriceBulk";
    let json = JSON.stringify(obj);
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
                    console.log(response.responseJSON.model);
                }
            }
            else {
                console.log(response);
            }
        }
    });
}

function updateServicePriceBulk(obj) {
    let url = apiBaseURL + "Update/UpdateServicePriceBulk";
    let json = JSON.stringify(obj);
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
                    console.log(response.responseJSON.model);
                }
            }
            else {
                console.log(response);
            }
        }
    });
}

function redisClear(value) {
    $.ajax({
        type: "DELETE",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: apiBaseURL + 'Redis/SingleRemoveAsync/' + value,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            if (response.readyState == 4) {
                console.log('weightRangeRedisClear');
            }
            else {
                console.log('weightRangeRedisClear');
            }
        }
    });
}

const UpdateDeliveryType = id => {
    //let deliveryType = $("#deliveryTypeEdit" + id + " option:selected").text();
    let deliveryType = $("#deliveryTypeEdit" + id).val();
    let day = $("#dayEdit" + id).val();

    let onImageLink = $("#onImageLinkEdit" + id).val();
    let offImageLink = $("#offImageLinkEdit" + id).val();

    let dayType = $("#dayTypeEdit" + id).val();
    let isActiveValue = $("#isActiveEdit" + id).val();
    let isActive = true;
    if (isActiveValue == "0") {
        isActive = false;
    }
    if (day == "") {
        alert("Please Input Day Range.");
        $("#dayEdit" + id).focus();
        return false;
    }

    let courierDeliveryCharge = $("#deliveryChargeEdit" + id).val();
    let type = $("#erTypeEdit" + id).val();

    let Obj = {
        Id: parseInt(id),
        Name: deliveryType,
        Day: day,
        IsActive: isActive,
        DayType: dayType,
        OnImageLink: onImageLink,
        OffImageLink: offImageLink,
        CourierDeliveryCharge: courierDeliveryCharge,
        Type: type
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateDeliveryRange/" + id;

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
                    alert("Delivery Range Updated.");
                    loadDeliveryTypeList();
                    updateServicePriceBulk(Obj);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

//-- Delivery & Extra Charge Entry --//

//Load All Lists
const LoadDistrictParentIdWise = (parentId, selectTagId, selectedValue) => {
    let url = apiBaseURL + "Other/GetAllDistrictFromApi/" + parentId;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                if (selectTagId.includes("District")) {
                    DrawLocationData(response.data.districtInfo, selectTagId, selectedValue);
                }
                if (!selectTagId.includes("District")) {
                    DrawLocationData(response.data.districtInfo[0].thanaHome, selectTagId, selectedValue);
                }
            }
            else {
                console.log(response);
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
const GetThanaList = () => {
    document.getElementById('Thana').disabled = false;
    LoadDistrictParentIdWise($("#District").val(), "Thana", null);
}
const GetThanaSearchList = () => {
    document.getElementById('ThanaSearch').disabled = false;
    LoadDistrictParentIdWise($("#DistrictSearch").val(), "ThanaSearch", null);
}
const GetAreaList = () => {
    let CityDistricts = [14, 77, 78, 79, 80];
    if (!CityDistricts.includes(parseInt($("#District").val()))) {
        document.getElementById('Area').disabled = false;
        LoadDistrictParentIdWise($("#Thana").val(), "Area", null);
    }
}
const DrawLocationData = (data, selectTagId, selectedValue) => {
    $("#" + selectTagId + "").empty();
    let tagName = selectTagId.includes("District") ? "District" : "";
    tagName = selectTagId.includes("Thana") ? "Thana" : tagName;
    tagName = selectTagId.includes("Area") ? "Area" : tagName;
    $("#" + selectTagId + "").append('<option value="-1">Select ' + tagName + '</option>');
    $.each(data, function (i, district) {
        if (selectTagId.includes("District")) {
            $("#" + selectTagId + "").append('<option value="' + district.districtId + '">' + district.district + '</option>');
        }
        if (!selectTagId.includes("District")) {
            $("#" + selectTagId + "").append('<option value="' + district.thanaId + '">' + district.thana + ' (' + district.postalCode + ')</option>');
        }
    });
    if (selectedValue != null) {
        $("#" + selectTagId + " option").prop('selected', false)
            .filter("[value='" + selectedValue + "']")
            .prop('selected', true);
    }
}
const LoadWeightList = (selectTagId, selectedValue) => {
    let url = apiBaseURL + "Fetch/GetWeightRange";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer "+ sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                $("#" + selectTagId + "").empty();
                $("#" + selectTagId + "").append('<option value="-1">Select Weight</option>');
                $.each(response.model, function (i, weight) {
                    $("#" + selectTagId + "").append('<option value="' + weight.id + '">' + weight.weight + '</option>');
                });
                if (selectedValue != null) {
                    $("#" + selectTagId + " option").prop('selected', false)
                        .filter("[value='" + selectedValue + "']")
                        .prop('selected', true);
                }
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
const LoadDeliveryType = (selectTagId, selectedValue) => {
    let url = apiBaseURL + "Fetch/GetDeliveryRange";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                $("#" + selectTagId + "").empty();
                $("#" + selectTagId + "").append('<option value="-1">Select Delivery Type</option>');
                $.each(response.model, function (i, DeliveryType) {
                    $("#" + selectTagId + "").append('<option value="' + DeliveryType.id + '">' + DeliveryType.name + ' (' + DeliveryType.day + ')</option>');
                });
                if (selectedValue != null) {
                    $("#" + selectTagId + " option").prop('selected', false)
                        .filter("[value='" + selectedValue + "']")
                        .prop('selected', true);
                }
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
//Delivery Charge Entry
const addDeliveryCharge = () => {
    let check = deliveryChargeValidation();
    if (check) {
        let districtId = parseInt($("#District").val());
        let thanaId = parseInt($("#Thana").val());
        //var areaId = parseInt($("#Area").val());
        let weight = parseInt($("#Weight").val());
        let deliveryType = parseInt($("#DeliveryType").val());
        let deliveryCharge = parseFloat($("#DeliveryCharge").val());
        let Obj = {
            DistrictId: districtId,
            ThanaId: thanaId,
            AreaId: 0,
            WeightRangeId: weight,
            DeliveryRangeId: deliveryType,
            CourierDeliveryCharge: deliveryCharge
        };
        let json = JSON.stringify(Obj);
        let url = apiBaseURL + "Entry/AddDeliveryChargeDetails";

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
                        alert("Delivery Charge Added.");
                    }
                }
                else {
                    alert("Error.");
                }
            }
        });

    }
}
const deliveryChargeValidation = () => {
    let CityDistricts = [14, 77, 78, 79, 80];
    if ($("#District").val() == "0" || $("#District").val() == "-1") {
        alert("Please Input District");
        $("#District").focus();
        return false;
    }
    else if ($("#Thana").val() == "0" || $("#Thana").val() == "-1") {
        alert("Please Input Thana");
        $("#Thana").focus();
        return false;
    }
    else if ($("#Weight").val() == "0" || $("#Weight").val() == "-1") {
        alert("Please Input Weight Range");
        $("#Weight").focus();
        return false;
    }
    else if ($("#DeliveryType").val() == "0" || $("#DeliveryType").val() == "-1") {
        alert("Please Input Delivery Type");
        $("#DeliveryType").focus();
        return false;
    }
    else if ($("#DeliveryCharge").val() == "0" || $("#DeliveryCharge").val() == "-1" || $("#DeliveryCharge").val() == "") {
        alert("Please Input Delivery Charge");
        $("#DeliveryCharge").focus();
        return false;
    }
    else {
        return true;
    }
}
//Load Delivery Charge List
const loadDeliveryChargeList = () => {
    let districtId = parseInt($("#DistrictSearch").val());
    let thanaId = parseInt($("#ThanaSearch").val());
    let areaId = parseInt($("#AreaSearch").val());
    let weight = parseInt($("#WeightSearch").val());

    let Obj = {
        districtId: districtId,
        thanaId: thanaId
    }
    let json = JSON.stringify(Obj);

    let url = apiBaseURL + "Fetch/DeliveryChargeDetailsSearchWise";
    $.ajax({
        beforeSend: function () {
            document.getElementById('deliveryChargeListDetails').innerHTML = loaderHtml;
        },
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        success: function (response) {
            if (response != null) {
                DrawDeliveryChargeListData(response.model);
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
const DrawDeliveryChargeListData = data => {
    let districtBng = $("#DistrictSearch option:selected").text().trim();
    let thanaBng = $("#ThanaSearch option:selected").text().trim();

    let html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="DeliveryChargeDatatable" aria-describedby="DeliveryChargeDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width:3%;">No.</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 15%;">District</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Thana: activate to sort column descending" style="width: 15%;">Thana</th>';
    //html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Area: activate to sort column descending" style="width: 15%;">Area</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Weight Range: activate to sort column descending" style="width: 12%;">Weight</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Delivery Type: activate to sort column descending" style="width: 15%;">Delivery Type</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Delivery Charge: activate to sort column descending" style="width: 10%;">Charge</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DeliveryChargeDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Action: activate to sort column descending" style="width: 10%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    let count = 1;
    $.each(data, function (i, obj) {
        let evenOddClass = count % 2 === 0 ? "even" : "odd";
        html += "<tr class='gradeA " + evenOddClass + "' role='row'>";

        html += "<td style='text-align:center'>" + count + "</td>";

        html += "<td style='text-align:center'>" + districtBng + "</td>";
        html += "<td style='text-align:center'>" + thanaBng + "</td>";
        //var areaname = obj.areaNameEng === null ? 'n/a' : obj.areaNameEng;
        //html += "<td style='text-align:center'>" + areaname + "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='weightRangeLblEdit" + obj.id + "' style='display:block;'>" + obj.weight + "</label>";
        html += "<input type='hidden' id='weightRangeIdHiddenField" + obj.id + "' value='" + obj.weightRangeId + "' />";
        html += "<select id='weightRangeEdit" + obj.id + "' class=form-control style='display:none;'>";
        html += "<option value='0'></option>";
        html += "</select>";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='deliveryRangeLblEdit" + obj.id + "' style='display:block;'>" + obj.name + ": " + obj.day + "</label>";
        html += "<input type='hidden' id='deliveryRangeIdHiddenField" + obj.id + "' value='" + obj.deliveryRangeId + "' />";
        html += "<select id='deliveryRangeEdit" + obj.id + "' class=form-control style='display:none;'>";
        html += "<option value='0'></option>";
        html += "</select>";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='deliveryChargeLblEdit" + obj.id + "' style='display:block;margin: 0px;'>" + obj.courierDeliveryCharge + "</label>";
        html += "<input type='number' id='deliveryChargeInputField" + obj.id + "' style='display:none;' value='" + parseFloat(obj.courierDeliveryCharge) + "' class=form-control />";
        html += "</td>";

        html += "<td align='center'>";
        html += "<input type='hidden' id='districtIdHiddenField" + obj.id + "' value='" + obj.districtId + "' />";
        html += "<input type='hidden' id='thanaIdHiddenField" + obj.id + "' value='" + obj.thanaId + "' />";
        html += "<input type='hidden' id='areaIdHiddenField" + obj.id + "' value='" + obj.areaId + "' />";

        html += '<button type="button" id=editDeliveryChargeBtn' + obj.id + ' class="btn btn-secondary" style="display:block;" onclick="EditDeliveryCharge(' + obj.id + ')"><i class="fa fa-pencil"></i></button>';
        html += '<button type="button" id=updateDeliveryChargeBtn' + obj.id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateDeliveryCharge(' + obj.id + ')"><i class="fa fa-check"></i></button>';
        html += '<button type="button" id=cancelDeliveryChargeBtn' + obj.id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadDeliveryChargeList()"><i class="fa fa-times"></i></button>';

        html += "</td>";
        html += "</tr>";
        count++;
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("deliveryChargeListDetails").innerHTML = html;
    $('#DeliveryChargeDatatable').DataTable({
        pageLength: 10,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'DeliveryCharge' },
            { extend: 'pdf', title: 'DeliveryCharge' },

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
    $('#DeliveryChargeDatatable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#DeliveryChargeDatatable_wrapper').addClass("container-fluid dt-bootstrap4");
}
//Update Delivery Charge List
const EditDeliveryCharge = id => {
    document.getElementById('weightRangeLblEdit' + id).style.display = "none";
    document.getElementById('deliveryRangeLblEdit' + id).style.display = "none";
    document.getElementById('deliveryChargeLblEdit' + id).style.display = "none";

    document.getElementById('weightRangeEdit' + id).style.display = "block";
    document.getElementById('deliveryRangeEdit' + id).style.display = "block";
    document.getElementById('deliveryChargeInputField' + id).style.display = "block";

    let weightRangeId = $("#weightRangeIdHiddenField" + id).val();
    let deliveryRangeId = $("#deliveryRangeIdHiddenField" + id).val();
    LoadWeightList("weightRangeEdit" + id, weightRangeId);
    LoadDeliveryType("deliveryRangeEdit" + id, deliveryRangeId);

    $('#editDeliveryChargeBtn' + id).hide();
    $('#updateDeliveryChargeBtn' + id).show();
    $('#cancelDeliveryChargeBtn' + id).show();
}
const UpdateDeliveryCharge = id => {
    if ($("#weightRangeEdit" + id + "option:selected").val() == "0" || $("#weightRangeEdit" + id + "option:selected").val() == "-1") {
        alert("Please Input Weight Range");
        $("#weightRangeEdit" + id).focus();
        return false;
    }
    else if ($('#deliveryRangeEdit' + id + "option:selected").val() == "0" || $('#deliveryRangeEdit' + id + "option:selected").val() == "-1") {
        alert("Please Input Delivery Type");
        $('#deliveryRangeEdit' + id).focus();
        return false;
    }
    else if ($('#deliveryChargeInputField' + id).val() == "0" || $('#deliveryChargeInputField' + id).val() == "-1" || $('#deliveryChargeInputField' + id).val() == "") {
        alert("Please Input Delivery Charge");
        $('#deliveryChargeInputField' + id).focus();
        return false;
    }

    let districtId = $("#districtIdHiddenField" + id + "").val();
    let thanaId = $("#thanaIdHiddenField" + id + "").val();
    let areaId = $("#areaIdHiddenField" + id + "").val();
    let weightRangeId = $("#weightRangeEdit" + id + " option:selected").val();
    let deliveryRangeId = $("#deliveryRangeEdit" + id + " option:selected").val();
    let deliveryCharge = $("#deliveryChargeInputField" + id).val();

    let Obj = {
        Id: parseInt(id),
        DistrictId: parseInt(districtId),
        ThanaId: parseInt(thanaId),
        AreaId: parseInt(areaId),
        WeightRangeId: parseInt(weightRangeId),
        DeliveryRangeId: parseInt(deliveryRangeId),
        CourierDeliveryCharge: parseFloat(deliveryCharge)
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateDeliveryChargeDetails/" + id;

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
                    loadDeliveryChargeList();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
//Extra Charge Entry
const LoadBreakableCharge = () => {
    let url = apiBaseURL + "Fetch/GetBreakableCharge";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                //console.table(response.model);
                DrawBreakableCharge(response.model);
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
const DrawBreakableCharge = data => {
    $("#BreakableCharge").empty();
    $("#CODMinCharge").empty();
    $("#CODPercentageCharge").empty();
    $("#CODPercentageDhakaCharge").empty();
    $("#BigProductCharge").empty();

    $("#BreakableChargeIdHidden").val(data.id);
    $("#BreakableCharge").val(parseFloat(data.breakableCharge));
    $("#CODMinCharge").val(parseFloat(data.codChargeMin));
    $("#CODPercentageCharge").val(parseFloat(data.codChargePercentage));
    $("#CODPercentageDhakaCharge").val(parseFloat(data.codChargeDhakaPercentage));
    $("#BigProductCharge").val(parseFloat(data.bigProductCharge));
    

    $("#BreakableCharge").prop('readonly', true);
    $("#CODMinCharge").prop('readonly', true);
    $("#CODPercentageCharge").prop('readonly', true);
    $("#CODPercentageDhakaCharge").prop('readonly', true);
    $("#BigProductCharge").prop('readonly', true);

    $("#editBreakableChargeBtn").show();
    $("#editCodChargeBtn").show();
    $("#editCodPercentageBtn").show();
    $("#editCodPercentageDhakaBtn").show();
    $("#editBigProductChargeBtn").show();

    $("#updateBreakableChargeBtn").hide();
    $("#updateCodChargeBtn").hide();
    $("#updateCodPercentageBtn").hide();
    $("#updateCodPercentageDhakaBtn").hide();
    $("#updateBigProductChargeBtn").hide();

    $("#cancelBreakableChargeBtn").hide();
    $("#cancelCodChargeBtn").hide();
    $("#cancelCodPercentageBtn").hide();
    $("#cancelCodPercentageDhakaBtn").hide();
    $("#cancelBigProductChargeBtn").hide();
}
const editBreakableCharge = () => {
    $("#BreakableCharge").removeAttr("readonly");
    $("#editBreakableChargeBtn").hide();
    $("#updateBreakableChargeBtn").show();
    $("#cancelBreakableChargeBtn").show();
}
const editCodMinCharge = () => {
    $("#CODMinCharge").removeAttr("readonly");
    $("#editCodChargeBtn").hide();
    $("#updateCodChargeBtn").show();
    $("#cancelCodChargeBtn").show();
}
const editCodPercentageCharge = () => {
    $("#CODPercentageCharge").removeAttr("readonly");
    $("#editCodPercentageBtn").hide();
    $("#updateCodPercentageBtn").show();
    $("#cancelCodPercentageBtn").show();
}
const editCodPercentageDhakaCharge = () => {
    $("#CODPercentageDhakaCharge").removeAttr("readonly");
    $("#editCodPercentageDhakaBtn").hide();
    $("#updateCodPercentageDhakaBtn").show();
    $("#cancelCodPercentageDhakaBtn").show();
}
const editBigProductCharge = () => {
    $("#BigProductCharge").removeAttr("readonly");
    $("#editBigProductChargeBtn").hide();
    $("#updateBigProductChargeBtn").show();
    $("#cancelBigProductChargeBtn").show();
}
//Update Extra Charge
const updateBreakableCharge = () => {
    let id = $("#BreakableChargeIdHidden").val();
    
    let breakableCharge = $("#BreakableCharge").val();
    let codMinCharge = $("#CODMinCharge").val();
    let codPercentageCharge = $("#CODPercentageCharge").val();
    let codPercentageDhakaCharge = $("#CODPercentageDhakaCharge").val();
    let bigProductCharge = $("#BigProductCharge").val();
    let Obj = {
        Id: parseInt(id),
        breakableCharge: parseInt(breakableCharge),
        codChargeMin: parseInt(codMinCharge),
        codChargePercentage: parseFloat(codPercentageCharge),
        codChargeDhakaPercentage: parseFloat(codPercentageDhakaCharge),
        bigProductCharge: parseFloat(bigProductCharge)
    };

    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateBreakableCharge/" + id;

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
                    LoadBreakableCharge();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}


// --- Packaging Charge --- //

const addPackagingCharge = () => {
    let packagingName = $("#PackagingName").val();
    if (packagingName === "" || $("#PackagingCharge").val() === "") {
        alert("Please Input All Values.");
        return false;
    }
    let packagingCharge = parseFloat($("#PackagingCharge").val());

    let Obj = {
        PackagingName: packagingName,
        PackagingCharge: packagingCharge,
        IsActive: true
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddPackagingChargeRange";

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
                    alert("Packaging Charge Added.");
                    $("#PackagingName").val("");
                    $("#PackagingCharge").val("");
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const loadPackagingChargeList = () => {
    let url = apiBaseURL + "Fetch/GetPackagingChargeRange/false";
    $.ajax({
        beforeSend: function () {
            document.getElementById('PackagingChargeListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawPackagingChargeListData(response.model);
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
const DrawPackagingChargeListData = data => {
    console.log(data);
    let html = "";
    html += "<div class='col-md-12' style='padding:0px;'>";
    html += "<table class='table-bordered' style='border:1px' width='100%'>";
    html += "<tr style='height:30px;'>";
    html += "<th style='text-align:center;width:5%'>No.</th>";
    html += "<th style='text-align:center;width:35%'>Packaging Name</th>";
    html += "<th style='text-align:center;width:15%'>Packaging Charge</th>";
    html += "<th style='text-align:center;width:15%'>Is Active</th>";
    html += "<th style='text-align:center;width:30%'>Action</th>";
    html += "</tr>";
    let count = 1;
    $.each(data, function (i, obj) {
        let id = obj.packagingChargeId;
        html += "<tr style='height:auto;'>";
        html += "<td style='text-align:center'>" + count + "</td>";
        html += "<td style='text-align:center'><input type=text id=packagingNameEdit" + id + " value= '" + obj.packagingName + "' Class=form-control readonly /></td>";
        html += "<td style='text-align:center'><input type=number id=packagingChargeEdit" + id + " value= '" + obj.packagingCharge + "' Class=form-control readonly /></td>";
        let checkedText = "";
        if (obj.isActive == true) {
            checkedText = "checked";
        }

        html += "<td style='text-align:center'>";
        html += "<input type='checkbox' " + checkedText +" class='i-checks' id='isActive"+ id +"' disabled>";
        html += "</td>";

        html += "<td align='center'>";
        html += '<button type="button" id=editPackagingChargeBtn' + id + ' class="btn btn-secondary" style="display:block;" onclick="EditPackagingCharge(' + id + ')"><i class="fa fa-pencil"></i></button>';
        html += '<button type="button" id=updatePackagingChargeBtn' + id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdatePackagingCharge(' + id + ')"><i class="fa fa-check"></i></button>';
        html += '<button type="button" id=cancelPackagingChargeBtn' + id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadPackagingChargeList()"><i class="fa fa-times"></i></button>';
        html += "</td>";
        html += "</tr>";
        count++;
    });
    html += "</table>";
    html += "</div>";
    document.getElementById("PackagingChargeListDetails").innerHTML = html;
}
const EditPackagingCharge = id => {
    $("#packagingNameEdit" + id).removeAttr("readonly");
    $("#packagingChargeEdit" + id).removeAttr("readonly");
    $("#isActive" + id).removeAttr("disabled");

    $("#editPackagingChargeBtn"+ id ).hide();
    $("#updatePackagingChargeBtn"+ id).show();
    $("#cancelPackagingChargeBtn"+ id).show();
}
const UpdatePackagingCharge = id => {
    let packagingName = $("#packagingNameEdit" + id).val();
    let packagingCharge = parseFloat($("#packagingChargeEdit" + id).val());
    let isActive = $("#isActive" + id).prop("checked") === true ? true : false;

    if (packagingName === "") {
        alert("Please Input Packaging Name.");
        $("#packagingNameEdit" + id).focus();
        return false;
    }

    if ($("#packagingChargeEdit" + id).val() === "") {
        alert("Please Input Packaging Charge.");
        $("#packagingChargeEdit" + id).focus();
        return false;
    }


    let Obj = {
        PackagingName: packagingName,
        PackagingCharge: packagingCharge,
        IsActive: isActive
    };

    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdatePackagingChargeRange/" + id;

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
                    loadPackagingChargeList();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

//TimeSlot Entry
//const timeSlotEntry = () => {

//    let StartTime = $("#StartTime").val();
//    let EndTime = $("#EndTime").val();
//    let Priority = $("#Priority").val();
//    let IsActive = $("#IsActive").val();
//    let Obj = {
//        StartTime: StartTime,
//        EndTime: EndTime,
//        Ordering: Priority,
//        IsActive: IsActive
//    };
//    let json = JSON.stringify(Obj);
//    let url = apiBaseURL + "Entry/AddCollectionTimeSlot";

//    $.ajax({
//        type: "POST",
//        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
//        crossDomain: true,
//        url: url,
//        contentType: "application/json",
//        dataType: 'json',
//        data: json,
//        complete: function (response) {
//            if (response.readyState == 4) {
//                if (response.status == 201) {
//                    alert("Created.");
//                }
//            }
//            else {
//                alert("Error.");
//            }
//        }
//    });

//}

//const getCollectionTimeSlot = () => {
//    let url = apiBaseURL + "Fetch/GetCollectionTimeSlot";
//    $.ajax({
//        beforeSend: function () {
//            document.getElementById('TimeSlotListDetails').innerHTML = loaderHtml;
//        },
//        type: "GET",
//        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
//        crossDomain: true,
//        url: url,
//        contentType: "application/json",
//        dataType: 'json',
//        success: function (response) {
//            if (response != null) {
//                DrawTimeSlottListData(response.model);
//            }
//            else {
//                alert("Error.");
//            }
//        },
//        Error: function (response) {
//            console.log(response);
//            alert("Error.");
//        }
//    });
//}

//const DrawTimeSlottListData = data => {
//    let html = "";
//    html += "<div class='col-md-12' style='padding:0px;'>";
//    html += "<table class='table-bordered' style='border:1px' width='100%'>";
//    html += "<tr style='height:30px;'>";
//    html += "<th style='text-align:center;width:5%'>No.</th>";
//    html += "<th style='text-align:center;width:30%'>Start Time</th>";
//    html += "<th style='text-align:center;width:30%'>End Time</th>";
//    html += "<th style='text-align:center;width:17%'>Priority</th>";
//    html += "<th style='text-align:center;width:20%'>IsActive</th>";
//    //html += "<th style='text-align:center;width:20%'>Action</th>";
//    html += "</tr>";
//    let count = 1;
//    $.each(data, function (i, obj) {
//        html += "<tr style='height:auto;'>";
//        html += "<td style='text-align:center'>" + count + "</td>";
//        html += "<td style='text-align:center; width:10px'><input type=text id=startTimeEdit" + obj.collectionTimeSlotId + " value= '" + obj.startTime + "' Class=form-control readonly /></td>";
//        html += "<td style='text-align:center'><input type=text id=endTimeEdit" + obj.collectionTimeSlotId + " value= '" + obj.endTime + "' Class=form-control readonly /></td>";
//        html += "<td style='text-align:center'><input type=text id=priorityEdit" + obj.collectionTimeSlotId + " value= '" + obj.ordering + "' Class=form-control readonly /></td>";

//        html += "<td style='text-align:center'>";
//        //html += "<label id='isActiveLblEdit" + obj.collectionTimeSlotId + "' style='display:block;'>" + obj.isActive + "</label>";
//        html += "<input type='hidden' id='deliveryRangeIdHiddenField" + obj.collectionTimeSlotId + "' value='" + obj.isActive + "' />";
//        html += "<select id='isActiveEdit" + obj.collectionTimeSlotId + "' class=form-control disabled>";
//        if (obj.isActive == true) {
//            html += "<option value='true'>true</option>";
//        }
//        else
//        {
//            html += "<option value='false'>false</option>";
//        }
        
//        html += "</select>";
//        html += "</td>";

//        html += "<td align='center'>";
//        //html += '<button type="button" id=editTimeSlotBtn' + obj.collectionTimeSlotId + ' class="btn btn-secondary" style="display:block;" onclick="EditTimeSlot(' + obj.collectionTimeSlotId + ')"><i class="fa fa-pencil"></i></button>';
//        //html += '<button type="button" id=updateTimeSlotBtn' + obj.collectionTimeSlotId + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateTimeSlot(' + obj.collectionTimeSlotId + ')"><i class="fa fa-check"></i></button>';
//        //html += '<button type="button" id=cancelTimeSlotBtn' + obj.collectionTimeSlotId + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="getCollectionTimeSlot()"><i class="fa fa-times"></i></button>';
//        html += "</td>";
//        html += "</tr>";
//        count++;
//    });
//    html += "</table>";
//    html += "</div>";
//    document.getElementById("TimeSlotListDetails").innerHTML = html;
//}

//const EditTimeSlot = collectionTimeSlotId => {
//    document.getElementById('startTimeEdit' + collectionTimeSlotId).removeAttribute("readonly");
//    document.getElementById('endTimeEdit' + collectionTimeSlotId).removeAttribute("readonly");
//    document.getElementById('priorityEdit' + collectionTimeSlotId).removeAttribute("readonly");
//    document.getElementById('isActiveEdit' + collectionTimeSlotId).disabled = false;

//    $('#editTimeSlotBtn' + id).hide();
//    $('#updateTimeSlotBtn' + id).show();
//    $('#cancelTimeSlotBtn' + id).show();
//}

//const UpdateTimeSlot = collectionTimeSlotId => {
//    let StartTime = $("#startTimeEdit" + collectionTimeSlotId).val();
//    let EndTime = $("#endTimeEdit" + collectionTimeSlotId).val();
//    let Priority = $("#priorityEdit" + collectionTimeSlotId).val();
//    let IsActive = $("#isActiveEdit" + collectionTimeSlotId).val();

    
//    let Obj = {
//        CollectionTimeSlotId: parseInt(collectionTimeSlotId),
//        StartTime: StartTime,
//        EndTime: EndTime,
//        Priority: Priority,
//        IsActive: IsActive
//    };
//    let json = JSON.stringify(Obj);
//    //let url = apiBaseURL + "Update/UpdateWeightRange/" + id;

//    $.ajax({
//        type: "PUT",
//        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
//        crossDomain: true,
//        //url: url,
//        contentType: "application/json",
//        dataType: 'json',
//        data: json,
//        complete: function (response) {
//            if (response.readyState == 4) {
//                if (response.status == 200) {
//                    alert("Updated.");
//                    loadWeightList();
//                }
//            }
//            else {
//                alert("Error.");
//            }
//        }
//    });
//}


const ImageUpload = () => {
    //alert('Image Upload ' + deliveryRangeId);
    const rangeId = $('#hiddenRangeId').val();
    const imageOf = $('#hiddenImageLink').val();

    let name = $('#deliveryTypeEdit' + rangeId).val();
    let day = $('#dayEdit' + rangeId).val();


    const imageUrl = 'images/dt';
    let imageLink = '';
    let file = $("#attacedFile")[0].files[0];
    let extention = $("#attacedFile")[0].files[0].name.split('.').pop();



    let fileName = $('#fileName').val();
    let fileExtension = fileName.split('.').pop();

    if (fileExtension != extention) {
        alert("FIle Extension didn't match");
        return false;
    }


    if (file == null || file == undefined || file.length === 0 || fileName == '') {
        alert('Please insert File/FileName');
        return false;
    }

    let formData = new FormData();

    formData.append('FileName',fileName);
    formData.append('ImageUrl', imageUrl);
    formData.append('file', file);

    $.ajax({
        url: admBaseOnlyUrl +'Image/ImageUploadForFile'.toLowerCase(),
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            console.log(response);
            if (!response) {
                alert('Image Upload Failed');
                return false;
            }

            imageLink = staticBaseUrl + imageUrl + '/' + fileName.toLowerCase();

            if (imageOf == 1) {
                //alert(imageURL);
               
                let obj = {
                    Id: rangeId,
                    OnImageLink: imageLink,
                    OffImageLink: '',
                    Name: name,
                    Day: day
                };
                UpdateImageLink(obj);
            }
            else {
                let obj = {
                    Id: rangeId,
                    OnImageLink: '',
                    OffImageLink: imageLink,
                    Name: name,
                    Day: day
                };
                UpdateImageLink(obj);
            }
            
            console.log(imageLink);
            $('#fileAttachmentModal').modal('hide');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        }
    });

}


const ImageUpAction = (rangeId) => {
    $('#onImageUp' + rangeId).show();
    $('#viewLink' + rangeId).show();
    $('#imageUp' + rangeId).hide();
}

const OnImageUpload = (rangeId) => {

    $('#hiddenRangeId').val(rangeId);
    $('#hiddenImageLink').val(1);
    $('#imageOf').text('OnImage');

    $('#viewLink' + rangeId).hide();
    $('#onImageLinkEdit' + rangeId).show();

    $('#fileAttachmentModal').modal('show');

}


const ViewImage = (rangeId) => {
    //$('#onImageUp' + rangeId).hide();

    $('#viewLink' + rangeId).hide();
    $('#onImageLinkEdit' + rangeId).show();
}


let UpdateImageLink = (requestBody) => {

    $.ajax({
        type: 'PUT',
        url: apiBaseURL + 'Update/UpdateImageLink',
        data: JSON.stringify(requestBody),
        dataType: "json",
        contentType: "application/json;utf=charset-8",
        success: function (response) {

            if (response.didEror) {
                alter('Update unsuccessful');
                return false;
            }

            if (requestBody.OnImageLink != '') {
                $('#onImageLinkEdit'+requestBody.Id).val(response.model.onImageLink);
            }
            else {
                $('#offImageLinkEdit' + requestBody.Id).val(response.model.offImageLink);
            }

            alert('Update Successful');
           
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

let AccessImageUp = (rangeId) => {
    $('#offImageUp' + rangeId).show();
    $('#offviewLink' + rangeId).show();
    $('#accessImageUp' + rangeId).hide();
}

let OffViewImage = (rangeId) => {
    $('#offviewLink' + rangeId).hide();
    $('#offImageLinkEdit' + rangeId).show();
}

let OffImageUpload = (rangeId) => {
    $('#hiddenRangeId').val(rangeId);
    $('#hiddenImageLink').val(0);
    $('#imageOf').text('OffImage');

    $('#offviewLink' + rangeId).hide();
    $('#offImageLinkEdit' + rangeId).show();

    $('#fileAttachmentModal').modal('show');
}

