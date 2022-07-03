//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
////var apiBaseURL = "http://localhost:58676/api/"; //local
//var admBaseUrl = "https://adm.ajkerdeal.com/api/";

$(function () {
    //CheckExistingBookingCode();
    $("#orderId").focus();


    let queryString = window.location.search;
    if (queryString != '') {
        courierOrderId = queryString.split("?")[1].split("=")[1];
        $("#orderId").val(courierOrderId);
        setTimeout(function () {
            searchOrderDetails();
        }, 1000);
    }


    // var barcode ="";
    var value = "";
    $("#orderId").keydown(function (e) {
        // var code = (e.keyCode ? e.keyCode : e.which);
        if (e.which == 17 || e.which == 74) {
            e.preventDefault();
            value = document.getElementById('orderId').value;
            //if (code == 13) {
            //    document.getElementById('BookingCode').value = barcode;
            //    barcode = "";
            //}
            //else if (code == 9) {
            //    document.getElementById('BookingCode').value = barcode;
            //    barcode = "";
            //}
            if (value != 0) {
                searchOrderDetails();
                //let element = document.querySelector("#OrderDetailDatatable");
                //element.scrollIntoView();
            }
            else {
                console.log(e.which);
            }
        }
    });
});

const searchOrderDetails = () => {
    let mobile = "";
    let orderId = "";
    let fromDate = "";
    let toDate = "";
    let status = "";
    let merchant = "";
    let podNumber = "";
    let collectionName = "";
    let districtId = 0;
    let thanaId = 0;
    let areaId = 0;
    let paymentType = "";
    let orderFrom = "";

    $("#totalOrderCount").html("0");
    $("#orderId").val() === "" ? orderId = "" : orderId = $("#orderId").val();
    $("#fromDate").val() === "" ? fromDate = "01-01-01" : fromDate = $("#fromDate").val();
    $("#toDate").val() === "" ? toDate = "01-01-01" : toDate = $("#toDate").val();
    $("#podNumber").val() === "" ? podNumber = "" : podNumber = $("#podNumber").val();
    $("#collectionName").val() === "" ? collectionName = "" : collectionName = $("#collectionName").val();
    $("#District").val() === "-1" ? districtId = 0 : districtId = parseInt($("#District").val());
    $("#Thana").val() === "-1" ? thanaId = 0 : thanaId = parseInt($("#Thana").val());
    $("#Area").val() === "-1" ? areaId = 0 : areaId = parseInt($("#Area").val());
    $('#paymentType').val() === "-1" ? paymentType = "-1" : paymentType = $('#paymentType').val();
    $('#orderFrom').val() === "-1" ? orderFrom = "-1" : orderFrom = $('#orderFrom').val();

    $("#customerMobileSearch").val() === "" ? mobile = "" : mobile = $("#customerMobileSearch").val().trim();

    status = $("#Status option:selected").val();
    merchant = $("#Merchant option:selected").val();
    if (fromDate === "01-01-01" && toDate !== "01-01-01") {
        alert("Please Input From Date.");
        $("#fromDate").focus();
        return false;
    }
    if (fromDate !== "01-01-01" && toDate === "01-01-01") {
        alert("Please Input To Date.");
        $("#toDate").focus();
        return false;
    }
    if (fromDate === "01-01-01" && toDate === "01-01-01" && status === "-1" && orderId === "" && merchant === "-1" && podNumber === "" && collectionName === "") {
        alert("Please Input Order Id or Status or Dates or Merchant or Pod Number or Product Name.");
        $("#orderId").focus();
        return false;
    }

    let FromDate = new Date(fromDate);
    let ToDate = new Date(toDate);
    let timeDiff = Math.abs(ToDate.getTime() - FromDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 7) {
        alert("Please ensure day differance has been 7 days")

    }
    else {
        loadOrderDetails();
    }

    //$("#orderDetailDiv").show();
    //loadOrderDetails();

};

//Status Group Button collumn
const DrawActionHtml = obj => {
    let html = "";
    var paymentType = '';
    let objectString = JSON.stringify(obj);
    let orderId = obj.courierOrdersId;
    html += "<td style='text-align:center;vertical-align: middle;'>";
    if (obj.isDownloaded == false || [421, 422, 67, 11, 529, 92, 554, 652, 642, 204, 524, 132,752].includes(parseInt($("#UserHidden").val()))) {
        if (obj.statusId === 7) {

            if (/*obj.userInfo.orderDateDiff <= 15*/ obj.courierOrderInfo.deliveryRangeId == 14 || obj.courierOrderInfo.deliveryRangeId == 17 || obj.courierOrderInfo.deliveryRangeId == 18) {
                paymentType = obj.courierOrderInfo.paymentType;
            }

            html += "<button type='button' class='btn btn-primary' style='margin-bottom:10px;' data-toggle='modal' data-target='#PackagingModal' onClick='startPackaging(&#39;" + orderId + "&#39;,&#39;" + objectString.replace(/'/g, '') + "&#39;,&#39;" + paymentType + "&#39;," + obj.courierAddressContactInfo.isDtOwnSecondMileDelivery + "," + obj.courierAddressContactInfo.isDtOwnSecondMileDeliveryThana + "," + obj.courierAddressContactInfo.isDtOwnSecondMileDeliveryArea + ")'>Package</button></br>";
        }
        if (obj.statusId === 8 && obj.courierId === 28) {
            html += `<button type='button' class='btn btn-primary' style='margin-bottom:10px;' data-toggle='modal' data-target='#epostInvoiceModal' onClick='ePostInvoice(&#39;${fixString(objectString)}&#39;)'>Print Epost Invoice</button></br>`;
        }
        $.each(AllStatusGroupWiseData, function (i, statusGroup) {
            let groupName = statusGroup.fulfillmentStatusGroup;
            html += `<button type='button' class='btn btn-info' style='margin-bottom:5px;' data-toggle='modal' data-target='#groupWiseButtonModal' onClick='LoadUpdateStatusModal(&#39;${groupName}&#39;,&#39;${fixString(objectString)}&#39;)'>${groupName}</button></br>`;
        });
    }
    else {
        $.each(AllStatusGroupWiseData, function (i, statusGroup) {
            let groupName = statusGroup.fulfillmentStatusGroup;
            if (groupName == "Return" || groupName == "Hub") {
                html += `<button type='button' class='btn btn-info' style='margin-bottom:5px;' data-toggle='modal' data-target='#groupWiseButtonModal' onClick='LoadUpdateStatusModal(&#39;${groupName}&#39;,&#39;${fixString(objectString)}&#39;)'>${groupName}</button></br>`;
            }
        });
        html += "<label>No Other Actions Available For Post Delivered Order.</label>";
    }


    html += "</td>";
    return html;
}

cart = [];
const checkedOrder = (chk, objectString) => {

    objectString = fixString(objectString);
    const obj = JSON.parse(objectString);
    if (chk.checked) {

        //console.log(obj);
        let id = obj.id;
        let userId = $("#UserHidden").val();
        let orderId = obj.courierOrdersId;
        let orderDate = obj.courierOrderDateDetails.orderDate.trim();
        orderDate = orderDate.split(" ")[0];
        let courierId = obj.courierId;
        let comment = "Return order accepted by merchant";
        let podNumber = obj.podNumber;
        let companyname = obj.userInfo.companyName;
        let customerName = obj.customerName;
        let merchantId = obj.userInfo.courierUserId;
        let merchantName = obj.userInfo.userName;
        let courierName = obj.courierName;
        let merchantEmail = obj.userInfo.emailAddress;
        let merchantMobile = obj.userInfo.mobile;

        //let messageFormat = statusModel.messageFormat;
        //let emailFormat = statusModel.emailFormat;
        let messageFormat = "";
        let emailFormat = "";

        let isSms = obj.adCourierCommunicationInfo.isSms;
        let isEmail = obj.adCourierCommunicationInfo.isEmail;
        let customerMessageFormat = "";
        let customerEmailFormat = "";

        //let customerMessageFormat = statusModel.customerMessageFormat;
        //let customerEmailFormat = statusModel.customerEmailFormat;
        let isCustomerSms = obj.adCourierCommunicationInfo.isCustomerSms;
        let isCustomerEmail = obj.adCourierCommunicationInfo.isCustomerEmail;

        let bkashNumber = obj.userInfo.bkashNumber;
        let courierCharge = obj.courierPrice.courierCharge;
        let merchantPaymentAmount = obj.courierPrice.collectionAmount - obj.courierPrice.totalServiceCharge;
        let districtName = obj.courierAddressContactInfo.districtName;
        let thanaName = obj.courierAddressContactInfo.thanaName;
        let areaName = obj.courierAddressContactInfo.areaName;
        let customerMobile = obj.courierAddressContactInfo.mobile;
        let hubName = sessionStorage.getItem("hubName").trim();
        let paymentServiceType = obj.paymentServiceType;

        let Obj = {
            id: id,
            courierOrderId: orderId,
            orderDate: orderDate,
            isConfirmedBy: "admin",
            courierId: courierId,
            status: 21,
            postedBy: parseInt(userId),
            comment: comment,
            podNumber: podNumber,
            bkashNumber: bkashNumber,
            companyName: companyname,
            courierName: courierName,
            customerName: customerName,
            districtName: districtName,
            thanaName: thanaName,
            areaName: areaName,
            merchantId: parseInt(merchantId),
            merchantName: merchantName,
            merchantEmail: merchantEmail,
            merchantMobile: merchantMobile,
            merchantPaymentAmount: merchantPaymentAmount,
            messageFormat: messageFormat,
            emailFormat: emailFormat,
            customerMessageFormat: customerMessageFormat,
            customerEmailFormat: customerEmailFormat,
            isSms: isSms,
            isEmail: isEmail,
            isCustomerSms: isCustomerSms,
            isCustomerEmail: isCustomerEmail,
            customerMobile: customerMobile,
            courierCharge: courierCharge,
            hubName: hubName,
            paymentServiceType: paymentServiceType
        };

        cart.push(Obj);

    }
    else {

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            if (item.courierOrderId === obj.courierOrdersId) {
                cart.splice(i, 1);
                break;
            }
        }
    }


}

const LoadUpdateStatusModal = (groupName, objectString) => {
    $('#hubGroup').hide();
    $('#hubId').hide();
    $('#hubId').html('');
    let html = "";
    let statusList;
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    $.each(AllStatusGroupWiseData, function (i, statusGroup) {
        if (statusGroup.fulfillmentStatusGroup.trim() === groupName.trim()) {
            statusList = statusGroup.status;
        }
    });
    if (groupName === "Packaging" && obj.podNumber !== "" && obj.podNumber !== null) {
        html += `<button type='button' class='btn btn-danger' style='margin-bottom:5px;' onClick='CancelPOD("${objectString}")'>Cancel Pod</button></br>`;
    }
    $.each(statusList, function (i, status) {
        let statusId = status.statusId;
        let statusName = status.statusNameEng;

        if (statusId == 32) {
            html += `<button type='button' class='btn btn-warning' style='margin-bottom:5px;' data-target='#onverificationModal' data-toggle='modal' onClick='loadOnVerificationModal(&#39;${objectString}&#39;,${statusId},&#39;${statusName}&#39;)'>${statusName}</button></br>`;
        }
        else if ([62, 63, 68, 69].includes(statusId))
        {
            html += `<button type='button' class='btn btn-warning' style='margin-bottom:5px;' data-target='#probableLostModal' data-toggle='modal' onClick='loadprobableLostModal(&#39;${objectString}&#39;,${statusId},&#39;${statusName}&#39;)'>${statusName}</button></br>`;
        }
        else
            if (statusId == 7 && ![480, 623, 779, 554, 680, 642].includes(+sessionStorage.getItem('userId'))) {
                html += `<button type='button' class='btn btn-success' style='margin-bottom:5px;' onClick='CheckOrderStatusHistory(&#39;${objectString}&#39;,${statusId},&#39;${statusName}&#39;)'>${statusName}</button></br>`;
            }
            else {
                html += `<button type='button' class='btn btn-success' style='margin-bottom:5px;' onClick='UpadateOrderStatus(&#39;${objectString}&#39;,${statusId},&#39;${statusName}&#39;)'>${statusName}</button></br>`;
            }
    });
    $("#groupWiseButtonModalHeader").html(groupName);
    $("#groupWiseButtonModalBody").html(html);
}
const loadOnVerificationModal = (objectString, statusId, statusName) => {
    $("#onVerificationUpdateButton").attr("onclick", "UpadateOnVerificationStatus('" + objectString + "'," + statusId + ",'" + statusName + "')");
}

const loadprobableLostModal = (objectString, statusId, statusName) => {
    $("#probableLostUpdateButton").attr("onclick", "UpadateOnVerificationStatus('" + objectString + "'," + statusId + ",'" + statusName + "')");

    if (statusId == 62) {
        $("#dynamicLostModalHeader").html("Probable Lost Percel - 62");
    }
    else if (statusId == 63) {
        $("#dynamicLostModalHeader").html("Lost Percel - 63");
    }
    else if (statusId == 68) {
        $("#dynamicLostModalHeader").html("Customer Hold - On Verification - 68");
    }
    else if (statusId == 69) {
        $("#dynamicLostModalHeader").html("Courier Not Attempt - On Verification - 69");
    }
}
const UpadateOnVerificationStatus = (objectString, statusId, statusName) => {
    let comment;
    if (statusId == 32) {
        comment = $("#onVerificationComment").val();
        //UpdateToComplain(objectString, comment); no need as per Complain Team
    }
    else if ([62, 63, 68, 69].includes(statusId)) {
        comment = $("#probableLostComment").val();
    }
    
    if (comment == "") {
        alert("Please Insert Comment.");
        return false;
    }
    else {
        let obj = JSON.parse(objectString);
        obj.comment = comment;
        let objString = JSON.stringify(obj);
        UpadateOrderStatus(objString, statusId, statusName);
    }
}

const UpadateOrderStatus = (objectString, statusId, statusName) => {

    let statusIdsArray = [19, 21, 59, 60];
    let obj = JSON.parse(objectString);
    let pohArray = [];

    //stop performing any action for on three status id --> 2, 4, 29 (for poh order)
    let pohOrderStatusUpdate = [2, 4, 29];
    if (obj.paymentServiceType == 1 && pohOrderStatusUpdate.includes(statusId)) {
        alert("POH সার্ভিস এর জন্য এই অর্ডারে নির্বাচিত স্ট্যাটাসটি আপডেট করা যাবেনা।")
        return false;
    }

    if (obj.paymentServiceType == 1 && statusId == 10
        && obj.paymentServiceTypeMerchantVerify ==! "verify"
        && obj.paymentServiceTypeVerify ==! "verify") {

        alert("Please verify customer && Parcel then update this status. More details contact CRM sidhu OR FF Tuser")
        return false;
    }
    else if (obj.paymentServiceType == 1 && statusId == 10
        && (obj.paymentServiceTypeMerchantVerify == ! "verify"
            || obj.paymentServiceTypeVerify == ! "verify")) {

        alert("Please verify customer && Parcel then update this status. More details contact CRM sidhu OR FF Tuser")
        return false;
    }

    else if (obj.paymentServiceType == 1 && statusId == 7
        && obj.paymentServiceTypeMerchantVerify == ! "verify"
        && obj.paymentServiceTypeVerify == ! "verify") {

        alert("Please verify customer && Parcel then update this status. More details contact CRM sidhu OR FF Tuser")
        return false;
    }
    else if (obj.paymentServiceType == 1 && statusId == 7
        && (obj.paymentServiceTypeMerchantVerify == ! "verify"
            || obj.paymentServiceTypeVerify == ! "verify")) {

        alert("Please verify customer && Parcel then update this status. More details contact CRM sidhu OR FF Tuser")
        return false;
    }


    let statusModel;
    $.each(AllStatusGroupWiseData, function (i, statusGroup) {
        $.each(statusGroup.status, function (j, status) {
            if (status.statusId === statusId) {
                statusModel = status;
            }
        });
    });

    if (statusId == 60) {
        let poh = cart.filter(poh => poh.paymentServiceType == 1);
        for (b = 0; b < poh.length; b++) {
            pohArray.push(poh[b].courierOrderId);
        }
    }

    

    //if ($('input[type="checkbox"]').prop('checked') && parseInt(statusId) == 21) { //changed by Biplob
    if ($('input[type="checkbox"]').prop('checked') && statusIdsArray.includes(+statusId)) {

        if (+statusId == 21) {
            $('#MailandSmsModal').modal("show");
            $('#statusId').val(statusId);
            $('#hiddenObjString').val(objectString);
            $('#hiddenObjstatusName').val(statusName);
            $('#hiddenObjstatusModel').val(statusModel);
        }
        else {
            
            if (statusId == 60 && pohArray.length > 0) {
                if (confirm('এই ' + pohArray.join(',') + ' সকল অর্ডার গুলোতে Poh আছে আপনি কি আপডেট করতে চান...???')) {
                    
                    updateBulkOrderStatus(objectString, statusId, statusName, statusModel);
                }
                else {
                    return false;
                }
            }
            else {

                updateBulkOrderStatus(objectString, statusId, statusName, statusModel);

            }
            
        }
        
    }

    else if ($('input[type="checkbox"]').prop('checked') && !statusIdsArray.includes(+statusId)) {
        //alert("ONLY FOR Return order accepted by merchant");
        alert("Multiple Order Update only for 19,21,59,60 status...!!!");
    }
    else if (!$('input[type="checkbox"]').prop('checked')) {

        if (statusId == 36 || statusId == 38) {

            window.objectStringForupdateSelectiveStatus = objectString;
            window.statusIdForupdateSelectiveStatus = statusId;
            window.statusNameForupdateSelectiveStatus = statusName;
            window.statusModelForupdateSelectiveStatus = statusModel;
            loadHubs();
        }
        else if (statusId == 21) {
            $('#MailandSmsModal').modal("show");
            $('#statusId').val(statusId);
            $('#hiddenObjString').val(objectString);
            $('#hiddenObjstatusName').val(statusName);
            $('#hiddenObjstatusModel').val(statusModel);
        }
        else if (statusId == 15) {
            $('#statusId15').val(statusId);
            $('#hiddenObjString15').val(objectString);
            $('#hiddenObjstatusName15').val(statusName);
            $('#hiddenObjstatusModel15').val(JSON.stringify(statusModel));
            $('#dateModal').modal("show");
            let currentDate = getCurrentDate();
            $('#selectedDate').val(currentDate);
        }
        else {
            if (statusId == 60 && obj.paymentServiceType == 1) {
                if (confirm('এই অর্ডারে Poh আছে আপনি কি আপডেট করতে চান...???')) {
                    changeOrderStatus(objectString, statusId, statusName, statusModel);
                }
                else {
                    return false;
                }
            }
            else {
                changeOrderStatus(objectString, statusId, statusName, statusModel);
            }
        }
    }

}

let updateBulkOrderStatus = (objectString, statusId, statusName, statusModel) => {

    cart.forEach(cartItem => {
        cartItem.status = statusId;
        cartItem.comment = statusName;

    });

    $('#statusId').val(statusId);
    $('#hiddenObjString').val(objectString);
    $('#hiddenObjstatusName').val(statusName);
    $('#hiddenObjstatusModel').val(statusModel);

    let url = apiBaseURL + "Order/UpdateBulkOrders";
    let options = {
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(cart),
        complete: function (response) {
            if (response.readyState === 4) {
                cart = [];
                if (response.status === 201) {
                    //console.log(response);
                    alert("Updated.");
                    if (!window.location.href.includes("ReturnProcess")) {
                        loadOrderDetails();
                        if (statusId == 32) {
                            $("#onverificationModal .close").click();
                        }
                        else if ([62, 63, 68, 69].includes(statusId)) { //this conditions is not neccessary here
                            $("#probableLostModal .close").click();
                        }
                        $("#groupWiseButtonModal .close").click();
                    }
                    $('.modal-backdrop').css('z-index', '0px');
                    $('.modal-backdrop').css('position', 'relative');
                }
                if (response.status === 422) {
                    console.log(response);
                }
            }
            else {
                console.log(response);
                alert("Error.");
                cart = [];
            }
        }
    };
    $.ajax(options);
}

let UpdateandSend =  (date, statusId, objectString, statusName, statusModel) => {


    if (date == null || date == '') {
        alert('Please select Date');
        $('#MailandSmsModal').modal("hide");
        return false;
    }

    let message = 'নিম্ন লিখিত পণ্যগুলো আপনি (dt-date) ফেরত পেয়েছেন dt-orders, পণ্য সংক্রান্ত কোন সমস্যা থাকলে ২৪ ঘন্টার মধ্যে অবিহিত করুন। এরপরে অভিযোগ গ্রহনযোগ্য নহে।\n - ডেলিভারি টাইগার';


    if (cart.length > 0) {
        let url = apiBaseURL + "Order/UpdateBulkOrders";
        $.ajax({
            type: "PUT",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
            url: url,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(cart),
            complete: function (response) {
                if (response.readyState === 4) {
                    //cart = [];
                    if (response.status === 201) {
                        //console.log(response);
                        alert("Updated.");
                        let smsList = [];


                        let merchantIds = [...new Set(cart.map(x => x.merchantId))];
                        for (let i = 0; i < merchantIds.length; i++) {

                            let courierOrders = cart.filter(x => x.merchantId == merchantIds[i]).map(y => y.courierOrderId).join(', ');
                            let emailTo = cart.filter(x => x.merchantId == merchantIds[i])[0].merchantEmail;
                            let mailBody = message.replace("dt-orders", courierOrders).replace("dt-date", date);
                            let mailSub = 'About Complain Information';

                            EmailService(emailTo, mailBody, mailSub, 'dt');

                            let sms = {
                                "numbers": [cart.filter(x => x.merchantId == merchantIds[i])[0].merchantMobile],
                                "text": mailBody,
                                "type": 0,
                                "datacoding": 0
                            }

                            smsList.push(sms);
                        }

                        cart = [];

                        SmsService(smsList);


                        if (!window.location.href.includes("ReturnProcess")) {
                            loadOrderDetails();
                            $('#MailandSmsModal').modal("hide");

                            if (statusId == 32) {
                                $("#onverificationModal .close").click();
                            }
                            else if ([62, 63, 68, 69].includes(statusId)) {
                                $("#probableLostModal .close").click();
                            }
                            $("#groupWiseButtonModal .close").click();
                        }
                        $('.modal-backdrop').css('z-index', '0px');
                        $('.modal-backdrop').css('position', 'relative');
                    }
                    if (response.status === 422) {
                        console.log(response);
                    }
                }
                else {
                    console.log(response);
                    alert("Error.");
                    cart = [];
                }
            }
        });
    }

    else {
        let smsList = [];
        let object = fixString(objectString);
        let obj = JSON.parse(object);
        let courierOrdersid = 'DT-' + obj.id;
        let emailTo = obj.userInfo.emailAddress;
        let mailBody = message.replace("dt-orders", courierOrdersid).replace("dt-date", date);
        let mailSub = 'About Complain Information';
        let sms = {
            "numbers": [obj.userInfo.mobile],
            "text": mailBody,
            "type": 0,
            "datacoding": 0
        }
        smsList.push(sms);

        changeOrderStatus(objectString, statusId, statusName, statusModel);
        //EmailService(emailTo, mailBody, mailSub, 'dt');
        //SmsService(smsList);

        $('#MailandSmsModal').modal("hide");
    }
}

function updateSelectiveStatus() {

    if ($("#hubId option:selected").val() === "-1") {
        alert("Please Select Your Hub.");
        $("#hubId").focus();
        return false;
    }
    else {
        let statusWithHubName = statusNameForupdateSelectiveStatus + '-' + $("#hubId option:selected").text();
        changeOrderStatus(objectStringForupdateSelectiveStatus, statusIdForupdateSelectiveStatus,
            statusWithHubName, statusModelForupdateSelectiveStatus);
    }

}

function loadHubs() {
    let url = apiBaseURL + "Fetch/GetAllHubs";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            if (response.readyState === 4) {
                if (response.status === 200) {
                    //console.log(response.responseJSON.model);
                    $('#hubGroup').show();
                    $('#hubId').show();
                    $('#hubId').append('<option value="-1" selected="">Select Hub</option>');
                    for (var i = 0; i < response.responseJSON.model.length; i++) {
                        $('#hubId').append('<option value=' + response.responseJSON.model[i].value + '>' + response.responseJSON.model[i].name + '</option>');
                    }
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function changeOrderStatus(objectString, statusId, statusName, statusModel) {

    let selectedDate = $("#selectedDate").val();
    if (statusId == 15) {
        let model = fixString(statusModel);
        statusModel = JSON.parse(model);

        let date = new Date().toLocaleTimeString();
        selectedDate = selectedDate + ' ' + date;
    }

    if (selectedDate == "" || selectedDate == undefined) {
        let date = new Date().toLocaleTimeString();
        let getDate = getCurrentDate();
        selectedDate = getDate + ' ' + date;
    }
    let statusIdArray = [32, 62, 63, 68, 69];
    //console.log(statusModel);
    objectString = fixString(objectString);
    const obj = JSON.parse(objectString);
    //console.log(obj);
    let userId = $("#UserHidden").val();
    let orderId = obj.courierOrdersId;
    let orderDate = obj.courierOrderDateDetails.orderDate.trim();
    orderDate = orderDate.split(" ")[0];
    let courierId = obj.courierId;
    //let comment = statusId == 32 ? obj.comment : statusName;
    let comment = statusIdArray.includes(statusId) ? obj.comment : statusName;
    let podNumber = obj.podNumber;
    let companyname = obj.userInfo.companyName;
    let customerName = obj.customerName;
    let merchantId = obj.userInfo.courierUserId;
    let merchantName = obj.userInfo.userName;
    let courierName = obj.courierName;
    let merchantEmail = obj.userInfo.emailAddress;
    let merchantMobile = obj.userInfo.mobile;
    let messageFormat = statusModel.messageFormat;
    let emailFormat = statusModel.emailFormat;
    let isSms = obj.adCourierCommunicationInfo.isSms;
    let isEmail = obj.adCourierCommunicationInfo.isEmail;

    let customerMessageFormat = statusModel.customerMessageFormat;
    let customerEmailFormat = statusModel.customerEmailFormat;
    let isCustomerSms = obj.adCourierCommunicationInfo.isCustomerSms;
    let isCustomerEmail = obj.adCourierCommunicationInfo.isCustomerEmail;

    let bkashNumber = obj.userInfo.bkashNumber;
    let courierCharge = obj.courierPrice.courierCharge;
    let merchantPaymentAmount = obj.courierPrice.collectionAmount - obj.courierPrice.totalServiceCharge; //obj.courierPrice.collectionAmount - (obj.courierPrice.deliveryCharge + obj.courierPrice.breakableCharge + obj.courierPrice.codCharge + obj.courierPrice.ReturnCharge + obj.courierPrice.packagingCharge + obj.courierPrice.collectionCharge)
    let districtName = obj.courierAddressContactInfo.districtName;
    let thanaName = obj.courierAddressContactInfo.thanaName;
    let areaName = obj.courierAddressContactInfo.areaName;
    let customerMobile = obj.courierAddressContactInfo.mobile;
    let hubName = sessionStorage.getItem("hubName").trim();
    let retentionUserMobile = obj.userInfo.retentionUserMobile;
    let retentionMessageFormat = statusModel.retentionMessageFormat;
    let riderMobile = obj.riderInformation.riderMobile;
    let referrerMobile = obj.referrerformation.referrer;
    let districtId = obj.courierAddressContactInfo.districtId;

    let Obj = {
        id: 0,
        courierOrderId: orderId,
        orderDate: orderDate,
        isConfirmedBy: "admin",
        courierId: courierId,
        status: parseInt(statusId),
        postedBy: parseInt(userId),
        comment: comment,
        podNumber: podNumber,
        bkashNumber: bkashNumber,
        companyName: companyname,
        courierName: courierName,
        customerName: customerName,
        districtName: districtName,
        thanaName: thanaName,
        areaName: areaName,
        merchantId: parseInt(merchantId),
        merchantName: merchantName,
        merchantEmail: merchantEmail,
        merchantMobile: merchantMobile,
        merchantPaymentAmount: merchantPaymentAmount,
        messageFormat: messageFormat,
        emailFormat: emailFormat,
        customerMessageFormat: customerMessageFormat,
        customerEmailFormat: customerEmailFormat,
        isSms: isSms,
        isEmail: isEmail,
        isCustomerSms: isCustomerSms,
        isCustomerEmail: isCustomerEmail,
        customerMobile: customerMobile,
        courierCharge: courierCharge,
        hubName: hubName,
        riderMobile: riderMobile,
        retentionUserMobile: retentionUserMobile,
        retentionMessageFormat: retentionMessageFormat,
        referrerMobile: referrerMobile,
        districtId: districtId,
        postedOn: selectedDate
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateOrderHistory/" + orderId;
    //let url = "http://localhost:58676/api/Update/UpdateOrderHistory/" + orderId;
    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState === 4) {

                if (response.status === 200) {
                    if (obj.courierPrice.breakableCharge > 0) {
                        alert(" ভঙ্গুর/তরল ");
                    }
                    alert("Updated.");
                    $('#dateModal').modal("hide");
                    //debugger;
                    if (statusId == 15) {
                        if (obj.courierOrderInfo.orderFrom == 'ad') {
                            DTtoADStatusUpdate(obj.courierOrdersId, statusId, statusName);
                        }

                        //if (obj.userInfo.autoDownload) {
                        //    accountingAndMIS(obj.courierOrdersId); //call to MIS api
                        //}
                        
                    }
                    
                    if (statusId == 21) {
                        let orderId = Obj.courierOrderId.slice(3);
                        CheckExistingBookingCode(orderId, 'রিটার্ন পার্সেল এখনো বুঝে পাই নাই');
                    }

                    if (statusId == 25) {
                        let orderId = Obj.courierOrderId.slice(3);
                        CheckExistingBookingCode(orderId, 'COD পেমেন্ট এখনো পাই নাই');
                    }

                    ////Accounting part //commented as per Rony dada's requirements
                    //if (statusId == 8 && obj.paymentServiceType == 1 && obj.paymentServiceTypeMerchantVerify != '' && obj.paymentServiceTypeVerify != '') {

                    //    downLoadPoh(obj.courierOrdersId);
                    //}

                    if (!window.location.href.includes("ReturnProcess")) {
                        loadOrderDetails();
                        if (statusId == 32) {
                            $("#onverificationModal .close").click();
                        }
                        else if ([62, 63, 68, 69].includes(statusId)) {
                            $("#probableLostModal .close").click();
                        }
                        $("#groupWiseButtonModal .close").click();
                    }
                    $('.modal-backdrop').css('z-index', '0px');
                    $('.modal-backdrop').css('position', 'relative');
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}


function getDeliveryChargeDetailsPrice(deliveryChargeDetails, breakableCharge) {
    document.getElementById("printPackageBtn").style.display = "none";
    
    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: apiBaseURL + "Order/GetDeliveryChargeDetailsPrice",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(deliveryChargeDetails),
        complete: function (response) {
            if (response.status === 200) {
                document.getElementById("printPackageBtn").style.display = "block";
                let responseModel = JSON.parse(response.responseText);
                localStorage.setItem("courierIdKey", responseModel.model.courierId);

                if (deliveryChargeDetails.weightRangeId > 6) {
                    $("#courier").val(34);
                }
                else if (deliveryChargeDetails.districtId == 14 && breakableCharge > 0) {
                    $("#courier").val(55);
                }
                else {
                    $("#courier").val(responseModel.model.courierId);
                }
                
                setWeightField();
                if (parseInt(sessionStorage.getItem("userId")) != 779 && +sessionStorage.getItem("userId") != 642) {
                    document.getElementById("courier").style.display = "none";
                }
            }
            if (response.status === 404) {
                alert("এই অর্ডারটি প্যাকেজ করতে হলে আপডেট অর্ডার এ গিয়ে সার্ভিস টাইপ চেঞ্জ করুন অথবা হাব ইনচার্জ এর সাথে যোগাযোগ করুন");
            }
            else {
                console.log(response);
            }
        }
    });
}

const GetDeliveryChargeMerchantDetailsCourier = (deliveryChargeMerchantDetails, breakableCharge, weightRangeId) => {
    document.getElementById("printPackageBtn").style.display = "none";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: apiBaseURL + "Order/GetDeliveryChargeMerchantDetailsCourier",
        data: JSON.stringify(deliveryChargeMerchantDetails),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            //console.log(response);
            document.getElementById("printPackageBtn").style.display = "block";
            localStorage.setItem("courierIdKey", response.model.courierId);

            if (weightRangeId > 6) {
                $("#courier").val(34);
            }
            else if (deliveryChargeMerchantDetails.districtId == 14 && breakableCharge > 0) {
                $("#courier").val(55);
            }
            else {
                $("#courier").val(response.model.courierId);
            }

            setWeightField();
            if (parseInt(sessionStorage.getItem("userId")) != 779 && +sessionStorage.getItem("userId") != 642) {
                document.getElementById("courier").style.display = "none";
            }

        },
        error: function (error) {

            getDeliveryChargeDetailsPrice(deliveryChargeMerchantDetails, breakableCharge);

           // alert("এই অর্ডারটি প্যাকেজ করতে হলে আপডেট অর্ডার এ গিয়ে সার্ভিস টাইপ চেঞ্জ করুন অথবা হাব ইনচার্জ এর সাথে যোগাযোগ করুন");
            //alert('Something went Wrong');
        }

    });
} 

//Packaging 
const startPackaging = (couponId, objectString, paymentType, isDTOwnSecondMileDelivery, IsDtOwnSecondMileDeliveryThana, IsDtOwnSecondMileDeliveryArea) => {
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    //Api obj start
    let Orderids = obj.id.toString();
    let CustomerBillingAddress = obj.courierAddressContactInfo.address;
    let CustomerName = obj.customerName;
    let CustomerMobileNo = obj.courierAddressContactInfo.mobile;
    let CustomerAltMobileNo = obj.courierAddressContactInfo.otherMobile;
    let CashToCollect = obj.offerInformation.isOfferBkashActive == true ? 0 : obj.courierPrice.collectionAmount;
    let TotalAmount = obj.offerInformation.isOfferBkashActive == true ? 0 : obj.courierPrice.collectionAmount;//obj.courierPrice.collectionAmount;
    let CourierId = 0;
    let CourierName = "";
    let Thana = obj.courierAddressContactInfo.thanaNameEng;
    let District = obj.courierAddressContactInfo.districtNameEng;
    let CustomerId = 0;
    let FirebaseToken = "";
    let DeviceId = "";
    let ThanaId = obj.courierAddressContactInfo.thanaId;
    let DistrictId = obj.courierAddressContactInfo.districtId;
    let PostalCode = obj.courierAddressContactInfo.thanaPostalCode;
    let ProductTotalWeight = 0.400;
    let MerchentPickUpFlag = 0;
    let AreaId = obj.courierAddressContactInfo.areaId;
    let Area = obj.courierAddressContactInfo.areaNameEng;
    let AreaPostalCode = obj.courierAddressContactInfo.areaPostalCode;
    let ProductList = [];
    let productTitle = obj.courierOrderInfo.collectionName;
    let RedxPickUpStoreId = +sessionStorage.getItem("redxPickUpStoreId");
    let RedxAreaId = obj.courierAddressContactInfo.redxAreaId;
    let RedxAreaName = obj.courierAddressContactInfo.redxAreaName;
    let edeshThanaName = obj.courierAddressContactInfo.edeshThana;
    let isMerchantAssignActive = obj.userInfo.merchantAssignActive;
    let weightRangeId = obj.courierOrderInfo.weightRangeId;
    let breakableCharge = obj.courierPrice.breakableCharge;
    let actualPackagePrice = obj.courierPrice.actualPackagePrice;

    let quantity = 1;
    let ProductDetail = {
        productTitle: productTitle,
        qtn: quantity
    };
    ProductList.push(ProductDetail);


    if (isMerchantAssignActive) {

        let deliveryChargeMerchantDetails = {
            "districtId": obj.courierAddressContactInfo.districtId,
            "thanaId": obj.courierAddressContactInfo.thanaId,
            "areaId": obj.courierAddressContactInfo.areaId,
            "deliveryRangeId": obj.courierOrderInfo.deliveryRangeId,
            "serviceType": obj.courierOrderInfo.serviceType,
            "courierUserId": obj.userInfo.courierUserId
        }

        GetDeliveryChargeMerchantDetailsCourier(deliveryChargeMerchantDetails, breakableCharge, weightRangeId);
    }
    else {

        let deliveryChargeDetails = {
            "districtId": obj.courierAddressContactInfo.districtId,
            "thanaId": obj.courierAddressContactInfo.thanaId,
            "areaId": obj.courierAddressContactInfo.areaId,
            "weightRangeId": obj.courierOrderInfo.weightRangeId,
            "deliveryRangeId": obj.courierOrderInfo.deliveryRangeId,
            "serviceType": obj.courierOrderInfo.serviceType
        };
        getDeliveryChargeDetailsPrice(deliveryChargeDetails, breakableCharge);
    }

    //Api obj create
    const courApiObj = {
        Orderids: Orderids,
        CustomerBillingAddress: CustomerBillingAddress,
        CustomerName: CustomerName,
        CustomerMobileNo: CustomerMobileNo,
        CustomerAltMobileNo: CustomerAltMobileNo,
        CashToCollect: CashToCollect,
        TotalAmount: TotalAmount,
        CourierId: CourierId,
        CourierName: CourierName,
        Thana: Thana,
        District: District,
        CustomerId: CustomerId,
        FirebaseToken: FirebaseToken,
        DeviceId: DeviceId,
        ThanaId: ThanaId,
        DistrictId: DistrictId,
        PostalCode: PostalCode,
        ProductTotalWeight: ProductTotalWeight,
        MerchentPickUpFlag: MerchentPickUpFlag,
        AreaId: AreaId,
        Area: Area,
        AreaPostalCode: AreaPostalCode,
        CourierLocationId: RedxAreaId,
        CourierLocationName: RedxAreaName,
        ProductDetails: ProductList,
        ActualPackagePrice: actualPackagePrice,
        Flag: "dt",
        EdeshThana: edeshThanaName,
        PickupStoreId: RedxPickUpStoreId
    };
    const courApiObjString = JSON.stringify(courApiObj);

    let merchantName = obj.userInfo.companyName.trim();
    let merchantAddress = obj.userInfo.address.trim();
    let merchantMobile = obj.userInfo.mobile.trim();
    let packagingName = obj.courierPrice.packagingName === null ? "" : obj.courierPrice.packagingName.trim();

    let d = new Date();
    let dtToday = d.getDate() + "/" + (parseInt(d.getMonth()) + 1) + "/" + d.getFullYear();
    let time = d.getHours() + ":" + d.getMinutes();
    let customerPostalCode = "";
    let html = "";

    //From-TO Info table
    //top
    html += "<div class='col-md-6 offset-3' id='invoiceDiv' style='height:400px; width:390px;border:1px solid gray'>" +
        "<span style='float:left;font-size:11px;'>Date: " + dtToday + " - " + time + " </span>"
    /*+"<span style='float:right;font-size:11px;'><b>" + packagingName + "</b></span>" */

    if (obj.userInfo.courierUserId != 90871) {
        if (obj.courierAddressContactInfo.isDtOwnSecondMileDeliveryThana) {
            html += "<span style='float:right;font-size:21px;'><b>" + obj.courierAddressContactInfo.ownSecondMileDeliveryThana + "</b></span>"
        }
        else if (obj.courierAddressContactInfo.isDtOwnSecondMileDeliveryArea) {
            html += "<span style='float:right;font-size:21px;'><b>" + obj.courierAddressContactInfo.ownSecondMileDeliveryArea + "</b></span>"
        }
        else {
            html += "<span style='float:right;font-size:21px;'><b>" + obj.courierAddressContactInfo.ownSecondMileDelivery + "</b></span>"
        }
    }
    


    html +="<table width='100%;' style='margin:2px 0px 2px 0px;font-size: 13px;padding:2px;'>" +
        "<tr><td  valign='top' colspan='3' style='text-align:center'><strong>Invoice/ Money Receipt</strong></td></tr>";

    //merchant info
    html += "<tr><td style='width:50%;vertical-align:top;padding-right:5px;'>Merchant: ";
    //html += "<p style='font-size:10px;margin-bottom:1px;'><b style='font-size:12px'>" + merchantName + "</b><br/>" + merchantAddress + "</p>";
    html += "<p style='font-size:10px;margin-bottom:1px;'><b style='font-size:20px'>" + merchantName + "</b></p>";
    html += "<span style='font-size:10px;margin-bottom:1px;'>Mobile: </span></br>";
    //html += "<b style='font-size:11px'>" + merchantMobile + "</b></br>";
    html += "<b style='font-size:12px'>01894811222</b></br>";
    if (obj.courierPrice.breakableCharge > 0) {
        html += "<b style='font-size:11px'> ভঙ্গুর/তরল </b>";
    }
    html += "</td>";

    //customer info
    html += "<td style='width:50%;vertical-align:top;'>Customer:" +
        "<p style='font-size:10px;margin-bottom:1px;'><b style='font-size:12px'>" + CustomerName + "</b><br/>" +
        CustomerBillingAddress + "<br/>";
    if (paymentType == '') {
        html += "<b style='font-size:20px'>" + District + "</b>";
    } else {
        html += "<b style='font-size:15px'>" + District + "</b>";
    }
    
    if (Thana !== null && Thana !== '' && Thana !== 'null') {
        html += " , ";
        html += "<b style='font-size:11px'>"+Thana+"</b>";
    }
    if (Area !== null && Area !== '' && Area !== 'null') {
        html += " , ";
        html += "<br/>";
        html += "<b style='font-size:11px'>"+Area+"</b>";
    }

    if (AreaPostalCode !== 'NULL' && AreaPostalCode !== 'null' && AreaPostalCode !== null && AreaPostalCode !== 0) {
        customerPostalCode = AreaPostalCode;
    }
    else if (PostalCode !== 'NULL' && PostalCode !== 'null' && PostalCode !== null && PostalCode !== 0) {
        customerPostalCode = PostalCode;
    }

    if (customerPostalCode !== "" && customerPostalCode !== null) {
        html += "<br/>";
        html += "Postal Code: " + customerPostalCode;
    }
    html += "</p>";
    html += "<span style='font-size:10px;margin-bottom:1px;'>Mobile: </span></br>";
    html += "<b style='font-size:11px'>" +
        CustomerMobileNo + "</br>" + CustomerAltMobileNo + "</b></td>";

    html += "</tr>";

    html += "</table>";

    //Detail Table
    html += "<table style='width:100%;font-size: 12px;' cellspacing='0px' border='1'><thead>" +
        "<tr style='text-align:center;'><th>Order Id</th><th>Product</th><th>Amount</th><th>Barcode</th>" +
        "</tr></thead>";
    let CashToCollectText = CashToCollect === 0 ? "Paid" : CashToCollect;

    html += "<tr style='text-align:center;'>";
    html += "<td>" + couponId + "</td>";
    if (obj.courierOrderInfo.orderFrom == 'ad' && obj.userInfo.merchantAssignActive == true) {
        html += "<td>" + obj.courierOrderInfo.couponIds + "</td>";
    }
    else {
        html += "<td>" + productTitle + "</td>";
    }
    html += "<td>" + CashToCollectText + "</td>";
    html += "<td><div style='text-align:center;'><svg id ='barCode" + couponId + "' width='120' height='50'></svg></div></td>";
    html += "</tr>";
    html += "</table>";
    html += `<div style='margin:5px;text-align:center;font-size:10px;'><b>${obj.courierOrderInfo.isOpenBox == true ? "OPEN BOX" : "NO OPEN BOX"} :: ${packagingName.toUpperCase()}</b></div>`;

    if (paymentType != '') {

        if (IsDtOwnSecondMileDeliveryArea) {
            html += `<div style="margin:5px;text-align:center;font-size:10px;"><lable><h4>Priority Order: <b>${paymentType} - <b style="font-size: 20px;">${District}</b>, <b style="font-size: 20px;">${Thana}</b>, <b style="font-size: 20px;">${Area}</b></b></h4></lable></div>`;
        }

        else if (IsDtOwnSecondMileDeliveryThana ) {
            html += `<div style="margin:5px;text-align:center;font-size:10px;"><lable><h4>Priority Order: <b>${paymentType} - <b style="font-size: 20px;">${District}</b>, <b style="font-size: 20px;">${Thana}</b></b></h4></lable></div>`;
        }
        
        else if (isDTOwnSecondMileDelivery) {
            html += `<div style="margin:5px;text-align:center;font-size:10px;"><lable><h4>Priority Order: <b>${paymentType} - <b style="font-size: 20px;">${District}</b></b></h4></lable></div>`;
        }
        
       
        else {
            html += `<div style="margin:5px;text-align:center;font-size:10px;"><lable><h4>Priority Order: <b>${paymentType}</b></h4></lable></div>`;
        }
       
    }

    if (obj.courierOrderInfo.deliveryRangeId == 19 && paymentType == '') {
        html += `<div style="margin:5px;text-align:center;font-size:10px;"><lable><h3>Priority Order: <b>${obj.courierOrderInfo.paymentType}</b></h3></lable></div>`;
    }
    html += "<div id='qrCodeDiv' style='margin-top:6px;text-align:center;'></div>";
    html += "<div id='courierNameDiv' style='margin-bottom:6px;text-align:center;'></div>";

    if (obj.courierOrderInfo.paymentType.includes('Next Day Delivery')) {
        html += `<div style='margin-top:5px;'><label style='border: 3px solid #676a6c;padding: 3px; font-size: 13px !important;float:left;margin-right:5px;font-size:10px;font-weight: bold;'>Priority Customer</label><label style='float:right;margin-right:5px;font-size:10px;'>Delivered By - <b>Delivery Tiger</b></label></div>`;
    }

    let arrayList = checkCustomerInfoForPackaging(obj);

    if (arrayList.length > 0) {
        var requiredField = arrayList.join(',');
        alert('প্যাকেজ করার জন্য  ' + requiredField + '  প্রয়োজন');

        $("#onlyPrintBtn").prop('disabled', true);
        $("#printPackageBtn").prop('disabled', true);
        $("#onlyStatusUpdateBtn").hide();
    }
    else {
        $("#PackagingModalBody").html(html);
        generateBarcode(couponId);
        $("#onlyPrintBtn").prop('disabled', false);
        $("#printPackageBtn").prop('disabled', false);
        $("#onlyStatusUpdateBtn").show();
        $("#onlyPrintBtn").attr("onclick", "onlyPrint('" + objectString + "')");
        $("#printPackageBtn").attr("onclick", "printInvoiceAndUpdate('" + objectString + "'," + CashToCollect + ",'" + courApiObjString + "')");
        $("#onlyStatusUpdateBtn").attr("onclick", "onlyUpdate('" + objectString + "')");

    }
    
    
}
const onlyPrint = objectString => {
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    let html = "";
    if (obj.podNumber !== null || obj.podNumber !== "") {
        generateBase64andPrint(obj);
    }
    else return false;
}

function getCourierName(courierIdKey) {
    let selectedCourierNameKey = "";
    if (courierIdKey == 28) {
        selectedCourierNameKey = "Postal";
    }
    else if (courierIdKey == 30) {
        selectedCourierNameKey = "Paperfly";
    }
    else if (courierIdKey == 32) {
        selectedCourierNameKey = "E-Desh";
    }
    else if (courierIdKey == 34) {
        selectedCourierNameKey = "Redx";
    }
    else if (courierIdKey == 49) {
        selectedCourierNameKey = "Steadfast";
    }
    else if (courierIdKey == 52) {
        selectedCourierNameKey = "Khulna Tiger";
    }
    else if (courierIdKey == 51) {
        selectedCourierNameKey = "Sylhet Tiger";
    }
    else if (courierIdKey == 50) {
        selectedCourierNameKey = "Chittagong Tiger";
    }
    else if (courierIdKey == 53) {
        selectedCourierNameKey = "Narayangonj Tiger";
    }
    else if (courierIdKey == 54) {
        selectedCourierNameKey = "Gazipur Tiger";
    }
    else if (courierIdKey == 55) {
        selectedCourierNameKey = "Dhaka Tiger";
    }
    else if (courierIdKey == 56) {
        selectedCourierNameKey = "Coxsbazar Tiger";
    }
    else if (courierIdKey == 57) {
        selectedCourierNameKey = "Jatrabari Tiger";
    }
    else if (courierIdKey == 58) {
        selectedCourierNameKey = "Uttara Tiger";
    }
    else if (courierIdKey == 59) {
        selectedCourierNameKey = "Mirpur10 Tiger";
    }
    else if (courierIdKey == 60) {
        selectedCourierNameKey = "Mirpur01 Tiger";
    }
    else if (courierIdKey == 61) {
        selectedCourierNameKey = "Lalmatia Tiger";
    }
    else if (courierIdKey == 62) {
        selectedCourierNameKey = "NewMarket Tiger";
    }
    else if (courierIdKey == 63) {
        selectedCourierNameKey = "Islampur Tiger";
    }
    else if (courierIdKey == 64) {
        selectedCourierNameKey = "Santinagar Tiger";
    }
    else if (courierIdKey == 65) {
        selectedCourierNameKey = "Gulisthan Tiger";
    }
    else if (courierIdKey == 66) {
        selectedCourierNameKey = "Rampura Tiger";
    }
    else if (courierIdKey == 67) {
        selectedCourierNameKey = "Badda Tiger";
    }
    else if (courierIdKey == 69) {
        selectedCourierNameKey = "KawranBazar Tiger";
    }
    else if (courierIdKey == 75) {
        selectedCourierNameKey = "Savar Tiger";
    }
    else {
        selectedCourierNameKey = "";
    }

    return selectedCourierNameKey;
}


function addOrderAssignTrack(orderId, selectCourierId, assignCourierId) {

    let orderAssignTrack = {
        orderId: orderId,
        selectCourierId: selectCourierId,
        assignCourierId: assignCourierId
    };
    let json = JSON.stringify(orderAssignTrack);
    let url = apiBaseURL + "Entry/AddOrderAssignTrack";
    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            console.log(response);
        }
    });
}

//Print DT Invoice
const printInvoiceAndUpdate = (objectString, cashToCollect, courApiObjString) => {

    let selectedCourierId = parseInt($("#courier option:selected").val().trim());

    let selectedCourierName = $("#courier option:selected").text().trim();
    if (confirm('Are you sure Print Invoice?')) {
        objectString = fixString(objectString);
        let courApiObj = JSON.parse(courApiObjString);
        let obj = JSON.parse(objectString);
        let statusId = 8;
        let statusName = "Packaged to courier";
        if ($("#courier option:selected").val() === "-1") {
            alert("Select Courier.");
            return false;
        }
        else {
            //let courierIdsArray = [49, 50, 51, 52];
            let courierIdsArray = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 75];
            courApiObj.CourierName = $("#courier option:selected").text().trim();
            courApiObj.CourierId = parseInt($("#courier option:selected").val().trim());
            obj.courierId = parseInt($("#courier option:selected").val().trim());
            if (obj.courierId == 28) {
                courApiObj.ProductTotalWeight = parseFloat($("#epostWeight").val().trim());
                obj.courierPrice.courierCharge = calculateEpostDeliveryCharge(obj);
            }
            obj.courierName = $("#courier option:selected").text().trim();
            //console.log(courApiObj);
            //if (courApiObj.CourierId != 49) {
            if (!courierIdsArray.includes(courApiObj.CourierId)) {
                // logic told me rony dada, please don't blame me
                if (parseInt(sessionStorage.getItem("userId")) == 779) {
                    let courierIdKey = parseInt(localStorage.getItem("courierIdKey"));
                    let courierNameKey = getCourierName(courierIdKey);
                    if (selectedCourierId != courierIdKey) {
                        if (confirm('You select ' + selectedCourierName + ' courier but assign courier is ' + courierNameKey + ' Are you sure to proceed')) {

                            addOrderAssignTrack(obj.id, selectedCourierId, courierIdKey);
                            updateOrderStatusAndThirdParty(courApiObj, obj, statusId, statusName);
                        } else {
                            return false;
                        }
                    }

                    else {
                        updateOrderStatusAndThirdParty(courApiObj, obj, statusId, statusName);
                    }
                }
                else {
                    updateOrderStatusAndThirdParty(courApiObj, obj, statusId, statusName);
                }
            }
            else {
                obj.courierId = courApiObj.CourierId;
                obj.podNumber = obj.id + courApiObj.CourierName.replace(" ", "-");
                let newObjectString = JSON.stringify(obj);
                // logic told me rony dada, please don't blame me
                let courierIdKey = parseInt(localStorage.getItem("courierIdKey"));
                let courierNameKey = getCourierName(courierIdKey);
                if (parseInt(sessionStorage.getItem("userId")) == 779) {
                    if (selectedCourierId != courierIdKey) {
                        if (confirm('You select ' + selectedCourierName + ' courier but assign courier is ' + courierNameKey + ' Are you sure to proceed')) {

                            let courierModel = {
                                CourierId: obj.courierId,
                                PODNumber: obj.podNumber,
                                Base64String: obj.id,
                                IsSuccess: true,
                                Message: "print",
                                DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
                            };
                            printQRcode(courierModel);

                            Popup($('#PackagingModalBody').html());
                            $("#PackagingModal .close").click();
                            $('.modal-backdrop').css('z-index', '0px');
                            $('.modal-backdrop').css('position', 'relative');

                            addOrderAssignTrack(obj.id, selectedCourierId, courierIdKey);
                            UpadateOrderStatus(newObjectString, statusId, statusName);
                        } else {
                            return false;
                        }
                    }

                    else {
                        let courierModel = {
                            CourierId: obj.courierId,
                            PODNumber: obj.podNumber,
                            Base64String: obj.id,
                            IsSuccess: true,
                            Message: "print",
                            DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
                        };
                        printQRcode(courierModel);

                        Popup($('#PackagingModalBody').html());
                        $("#PackagingModal .close").click();
                        $('.modal-backdrop').css('z-index', '0px');
                        $('.modal-backdrop').css('position', 'relative');
                        UpadateOrderStatus(newObjectString, statusId, statusName);
                    }
                }

                else {
                    let courierModel = {
                        CourierId: obj.courierId,
                        PODNumber: obj.podNumber,
                        Base64String: obj.id,
                        IsSuccess: true,
                        Message: "print",
                        DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
                    };
                    printQRcode(courierModel);

                    Popup($('#PackagingModalBody').html());
                    $("#PackagingModal .close").click();
                    $('.modal-backdrop').css('z-index', '0px');
                    $('.modal-backdrop').css('position', 'relative');
                    UpadateOrderStatus(newObjectString, statusId, statusName);
                }
            }
        }

        localStorage.removeItem("courierIdKey");
    }
    else {
        return false;
    }
    
}

//todo
const onlyUpdate = (objectString) => {

    let statusId = 8;
    let statusName = "Packaged to courier";
    let statusModel;
    $.each(AllStatusGroupWiseData, function (i, statusGroup) {
        $.each(statusGroup.status, function (j, status) {
            if (status.statusId === statusId) {
                statusModel = status;
            }
        });
    });

    changeOrderStatus(objectString, statusId, statusName, statusModel);
    $("#PackagingModal .close").click();

}

function updateOrderStatusAndThirdParty(courApiObj, obj, statusId, statusName) {
    //Packaging Api Call
    let url = bridgeBaseUrl + "Courier/CreateDelivaryInfo";
    //let url = "http://localhost:3433/Courier/CreateDelivaryInfo";
    $.ajax({
        type: "POST",
        headers: {
            "API_KEY": "Ajkerdeal_~La?Rj73FcLm"
        },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(courApiObj),
        complete: function (response) {
            if (response.status === 200) {
                //console.log(response);
                let responseModel = JSON.parse(response.responseText);
                if (responseModel.IsSuccess === true) {
                    let courierModel = {
                        CourierId: courApiObj.CourierId,
                        PODNumber: responseModel.podNumber,
                        Base64String: responseModel.base64string,
                        IsSuccess: responseModel.IsSuccess,
                        Message: responseModel.Message,
                        DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
                    };
                    obj.courierId = courierModel.CourierId;
                    obj.podNumber = courierModel.PODNumber;
                    let newObjectString = JSON.stringify(obj);

                    printQRcode(courierModel);

                    Popup($('#PackagingModalBody').html());
                    $("#PackagingModal .close").click();
                    $('.modal-backdrop').css('z-index', '0px');
                    $('.modal-backdrop').css('position', 'relative');
                    //StatusUpdate
                    UpadateOrderStatus(newObjectString, statusId, statusName);
                }
                else {
                    alert("Error Code: " + responseModel.IsSuccess + " \n Error Message: " + responseModel.Message);
                    return false;
                }
            }
            else if (response.status === 400) {
                let responseModel = JSON.parse(response.responseText);
                alert("Error Message: " + responseModel.Message);
            }
            else {
                console.log(response);
                alert("Error.");
            }
        }
    });
}

//don't blame me ...i am just victim of this situation(Bipli)
let courierIdsArray = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 75]; //courierId

const printQRcode = courierModel => {
    let imgData = courierModel.Base64String;
    let podNumber = courierModel.PODNumber;
    //let courierId = parseInt($("#courier option:selected").val().trim());
    let courierId = courierModel.CourierId;
    let deliveryRangeId = courierModel.DeliveryRangeId;
    let courierName = getCourierName(courierId);

    let html = "";
    let htmlCourierName = "";

    $("#qrCodeDiv").html("");
    $("#courierNameDiv").html("");
    if (courierId == 23) {
        imgData = imgData.split('"');
        html = '<img id="QRCOde" src="data:image/png;base64,' + imgData[1].toString() + '"  width="100" />';
    }
    else if (courierId == 32) {
        html = '<img id="QRCOde" src="data:image/png;base64,' + imgData.toString() + '"  width="400" height="100"/>';
    }
    else if (courierId == 34 || courierId == 30 || courierIdsArray.includes(courierId)) {
        html += `<div style="text-align: center"><svg id="barCodeOfRedx"></svg></div>`;
    }
    else if (courierId == 3 || courierId == 28) {
        html = '<img id="QRCOde" src="data:image/png;base64,' + imgData.toString() + '"  width="100" />';
    }

    if (courierId == 30 || courierId == 34) {
        html += '<p style="font-size:20px;margin-left: 20px;"><b>' + podNumber + '</b></p>';
    }
    else {
        html += '<p style="font-size:12px;margin-left: 15px;">' + podNumber + '</p>';
    }

    htmlCourierName += '<p style="font-size:28px;margin-left: 15px;"><b>' + courierName + '</b></p>'

    if (courierId == 32 && deliveryRangeId == 17) {
        htmlCourierName += '<p style="font-size:28px;margin-left: 15px;"><b>Deliver Today</b></p>';
    }

    $("#qrCodeDiv").html(html);
    $("#courierNameDiv").html(htmlCourierName);

    //generating JsBarcode
    if (courierId == 34 || courierIdsArray.includes(courierId)) {//RedX
        JsBarcode("#barCodeOfRedx", podNumber, {
            width: 1.6,
            height: 60,
            displayValue: false
        });
    }
    else if (courierId == 30) { //Paperfly
        JsBarcode("#barCodeOfRedx", podNumber, {
            width: 1.3,
            height: 60,
            displayValue: false
        });
    }
}
//e-post Invoce
const ePostInvoice = (objectString) => {
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    //calcualation
    let couponList = obj.courierOrderId;
    let couponQuantity = 1;
    let TotalQuantity = 1;
    let grandTotal;
    let customerName = obj.customerName.trim();
    let customerAddress = obj.courierAddressContactInfo.address;
    let customerMobile1 = obj.courierAddressContactInfo.mobile;
    let customerMobile2 = obj.courierAddressContactInfo.otherMobile;
    let collectionAmount = obj.courierPrice.collectionAmount;
    let couponDeliveryCharge = obj.courierPrice.deliveryCharge;
    let podNumber = obj.podNumber;
    let districtName = obj.courierAddressContactInfo.districtNameEng;
    let thanaName = obj.courierAddressContactInfo.thanaNameEng;
    let areaName = obj.courierAddressContactInfo.areaNameEng;
    let thanaPostalCode = obj.courierAddressContactInfo.thanaPostalCode;
    let areaPostalCode = obj.courierAddressContactInfo.areaPostalCode;
    let companyName = obj.userInfo.companyName;
    let companyAddress = obj.userInfo.address;
    let companyMobile = obj.userInfo.mobile;
    let courierCharge = parseFloat(obj.courierPrice.courierCharge);
    let courierId = 28;
    let courierName = "Bangladesh Postal Service";
    let dealTitle = obj.courierOrderInfo.collectionName;
    //let PostalDeliveryCharge = 0;

    if (collectionAmount !== 0) {
        grandTotal = collectionAmount.toString();
        //PostalDeliveryCharge = (grandTotal/100)+10; // 1%
    }
    else {
        grandTotal = 'Paid';
        //PostalDeliveryCharge = 10;
    }


    let html = "<div id='printEpostArea'>";
    html += "<style>td {padding-left:3px;font-size:11px;}th {font-size:13px;}</style>";
    //top table
    html += '<table class="ta" width="600px;" style="float:left;">';
    html += '<tr>';
    html += "<td style='width:100%;vertical-align:top'>";

    //left table
    html += '<table class="ta" width="280px;" style="float:top;">';
    html += '<tr><td><table style="width:100%;"><tr>';
    html += '<td style="width:100%;text-align:center;">অর্ডার আইডি</td></tr>';
    html += '<tr><td style="width:100%;height:35px;border:solid 1px grey;font-size:18px;text-align:center;"><b>' + podNumber + '</b></td>';
    html += '</tr></table></td></tr>';
    html += '<tr><td style="text-align:center;">';
    html += '<div style="text-align:center;margin-top:10px;" id="printBar"></div>';
    html += '</td></tr>';
    html += '<tr><td style="text-align:center;">';
    html += '<div style="text-align:center;margin-top:10px;" id="printQR"></div>';
    html += '</td></tr>';
    //product details

    html += '<tr><td>';
    html += '<table style="border:1px solid #d4d4d5;width: 100%;margin-bottom:5px;">';


    var fullAddress = "";
    fullAddress += customerAddress;
    if (areaName != null && areaName != "" && areaName != "Other") {
        fullAddress += " (" + districtName + ", " + thanaName + ", " + areaName;
        if (areaPostalCode != null && areaPostalCode != 'null' && areaPostalCode != 0 && areaPostalCode != '') {
            fullAddress += "- " + areaPostalCode + ")";
        }
        else {
            fullAddress += ")";
        }
    }
    else {
        fullAddress += " (" + districtName + ", " + thanaName;
        if (thanaPostalCode != null && thanaPostalCode != 'null' && thanaPostalCode != 0 && thanaPostalCode != '') {
            fullAddress += "- " + thanaPostalCode + ")";
        }
        else {
            fullAddress += ")";
        }
    }
    html += '<tr style="height:40px;"><th style="border:1px solid #d4d4d5;background-color: #eae8e8;width: 70%;text-align:center;">সর্বমোট মূল্য</br><span style="font-size:12px;">(ডেলিভারি চার্জ সহ)</span></th>';
    html += '<th style="border:1px solid #d4d4d5;background-color: #eae8e8;width: 30%;text-align:center;" id="GrandTotal">' + grandTotal + '</th>';
    html += '</tr>';
    html += '</table>';
    html += '</td></tr>';
    html += '<tr><td>';
    html += '<table style="border:1px solid #d4d4d5;width: 100%;">';
    html += '<tr><th style="background-color: #d4d4d5;text-align:center;"> ক্রেতা পণ্য বুঝে পেল</th></tr>';
    html += '<tr style="height: 60px;"><td style="text-align:center"></br></br></br>(ক্রেতার স্বাক্ষর)</td></tr>';
    html += '</table>';
    html += '</td></tr>';
    html += '</table>';

    html += '</td><td style="width:100%;vertical-align: top;">';
    //right table
    html += '<table class="ta" width="420px;" style="float:left;">';
    html += '<tr>';
    html += "<td style='width:100%;height:auto;text-align:center;'>";
    html += "<img src='https://s3.us-east-2.amazonaws.com/ajkerdeal-images-ohio-1/images/Courier/bangladesh_post_office_logo.svg.png' style='margin:15px;' width='40'>";
    html += "<img src='https://s3.us-east-2.amazonaws.com/ajkerdeal-images-ohio-1/images/Courier/e-cab-Logo.png' style='margin:15px;' width='40'>";
    html += '</td></tr>';

    html += '<tr><td>';
    html += '<table style="border:1px solid #d4d4d5;width: 100%;margin-bottom:5px;">';
    html += '<tr><th style="width: 60%;background-color: #d4d4d5;text-align:center;">ক্রেতার তথ্য</th></tr>';
    html += '<tr><td style="border-bottom: 1px solid #d4d4d5;"><b><span style="font-size:11px;">ক্রেতার নাম: </b>' + customerName + '</td></tr>';
    html += '<tr><td style="border-bottom: 1px solid #d4d4d5;" > <b><span style="font-size:11px;">ক্রেতার ঠিকানা: </b>' + customerAddress + '</span><br/>';
    html += '<span style="font-size:11px;"><b>' + thanaName + '</b></span><br/>';
    html += '<span style="font-size:11px;">জেলা: <b>' + districtName + '</b></span><br/>';
    if (areaName != null && areaName != "" && areaName != "Other") {
        html += '<span style="font-size:11px;">পোস্ট অফিসের নাম: <b>' + areaName + '</b></span><br/>';
    }
    else {
        html += '<span style="font-size:11px;">পোস্ট অফিসের নাম: <b>' + thanaName + '</b></span><br/>';
    }
    if (areaName != null && areaName != "" && areaName != "Other") {
        html += '<span style="font-size:11px;">পোস্ট কোড: <b>' + areaPostalCode + '</b></span>';
    }
    else {
        html += '<span style="font-size:11px;">পোস্ট কোড: <b>' + thanaPostalCode + '</b></span>';
    }

    html += '</td ></tr >';
    html += '<tr><td><b><span style="font-size:11px;">ক্রেতার মোবাইল নাম্বার: <span></b>' + customerMobile1 + ", " + customerMobile2 + '</td></tr>';
    html += '</table>';
    html += '</td></tr>';
    html += '<tr><td>';
    html += '<table style="border:1px solid #dcdcdc;width: 100%;margin-bottom:5px;">';
    html += '<tr><th style="background-color: #d4d4d5;text-align:center;">মার্চেন্টের তথ্য</th></tr>';
    html += '<tr><td style="border-bottom: 1px solid #d4d4d5;"><b><span style="font-size:11px;">নাম:</span> </b> Delivery Tiger </td></tr>';
    //html += '<tr><td style="border-bottom: 1px solid #d4d4d5;"><b><span style="font-size:11px;">ঠিকানা: </span></b>e-Commerce counter, Dhaka GPO, Dhaka-1000</td></tr>';
    html += '<tr><td style="border-bottom: 1px solid #d4d4d5;"><b><span style="font-size:11px;">ঠিকানা: </span></b>Tejgaon mail processing centre, e-Commerce cell, Tejgaon TSO, Post code-1208</td></tr>'; //1215 changed to 1208
    html += '<tr><td><b>EMTS <span style="font-size:11px;">করার নাম্বার:</span> 01704172990</b></td></tr>';
    html += '</table>';
    html += '</td></tr>';
    html += '<tr><td>';
    html += '<table style="width:100%;margin-bottom:5px;border: 1px solid black;background-color: #eae8e8;">';
    html += '<tr><th style="background-color: #d4d4d5;text-align:center;border-bottom:1px solid black;">EMTS / MTO করতে লক্ষণীয়</th></tr>';
    html += '<tr><td style="border-bottom:1px solid black";>Beneficiary Name/<span style="font-size:11px;">প্রাপকের নাম</span>: DeliveryTiger.com</td></tr>';
    html += '<tr><td style="border-bottom:1px solid black";>Beneficiary Address/<span style="font-size:11px;">প্রাপকের ঠিকানা:এই অর্ডার আইডি লিখুন- </span><b>' + podNumber + '</b></td></tr>';
    html += '<tr><td style="border-bottom:1px solid black";>EMTS <span style="font-size:11px;">করার নাম্বার</span>: <b>01704172990</b>, MTO Code: <b>1018</b></td></tr>';
    html += '<tr><td><label style="font-size:11px;padding:1px;margin: 1px;float: right;"><b>DC: <span id="PostalDeliveryCharge">' + courierCharge + '</span></b></label></td></tr>';
    html += '</table>';

    html += '</table>';
    
    html += '</td></tr>';
    html += '</table>';
    html += '<tr><td style="border-bottom: 1px solid #d4d4d5;"><b><span style="font-size:11px;">আমি এই মর্মে অঙ্গীকার করছি যে, উপরে দেওয়া সকল তথ্যাদি সত্য। বাংলাদেশের প্রচলিত আইন অনুযায়ী এই পণ্যের ভিতরে কোনো ধরণের অবৈধ বা বিপজ্জনক পণ্য নেই।</td></tr>';
    html += '</div>';
    $("#epostInvoiceModalBody").html(html);
    PrintBarCodeForEPost(podNumber);
    PrintQRCodeForEPost(podNumber);
    $("#printEpostInvoiceBtn").attr("onclick", "printEpostInvoiceAndUpdate('" + objectString + "'," + collectionAmount + ")");
}
const printEpostInvoiceAndUpdate = (objectString, collectionAmount) => {
    let Obj = JSON.parse(objectString);
    if ($("#PostalDeliveryCharge").text() != "" && parseFloat($("#PostalDeliveryCharge").text()) >= 10) {
        Obj.courierPrice.courierCharge = parseFloat($("#PostalDeliveryCharge").text());
    }
    else {
        alert("Please Insert Valid Weight.");
        return false;
    }

    Popup($('#printEpostArea').html());
    let statusId = 9;
    let statusName = "Paid Order Given to courier";

    if (collectionAmount > 0) {
        statusId = 10;
        statusName = "UnPaid Order Given to courier";
    }
    let newObjectString = JSON.stringify(Obj);

    $("#epostInvoiceModal .close").click();
    $('.modal-backdrop').css('z-index', '0px');
    $('.modal-backdrop').css('position', 'relative');
    //Update Status
    UpadateOrderStatus(newObjectString, statusId, statusName);
}
const PrintBarCodeForEPost = podNumber => {
    let apiUrl = bridgeBaseUrl + "Courier/CreateBarCodeForPostalService/" + podNumber;
    $.ajax({
        type: "GET",
        url: apiUrl.toLowerCase(),
        headers: { "API_KEY": 'Ajkerdeal_~La?Rj73FcLm' },
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            let imgData = data.split('"');
            let image = "";
            $("#printBar").html("");
            image = '<img id="QRCOde" src="data:image/png;base64,' + imgData[0].toString() + '" style="width:100px;height:50px;"/>';
            $("#printBar").html(image);
        },
        error: function (result) {
            alert('Error');
            return false;
        }
    })


}
const PrintQRCodeForEPost = podNumber => {
    var apiUrl = bridgeBaseUrl + "Courier/CreateQrCodeForEcourier/" + podNumber;
    $.ajax({
        type: "GET",
        url: apiUrl.toLowerCase(),
        headers: { "API_KEY": 'Ajkerdeal_~La?Rj73FcLm' },
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            var imgData = data.split('"');
            var image = "";
            $("#printQR").html("");
            //image = '<img id="QRCOde" src="data:image/png;base64,' + imgData[0].toString() + '" style="width:100px;height:100px;" width="100" />';
            //image = '<img src="http://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=' + podNumber + '">';
            image += '<img src="https://qrcode.kaywa.com/img.php?s=4&d=' + podNumber + '">';
            image += '<p style="font-size:12px;">' + podNumber + '</p>';
            $("#printQR").html(image);
        },
        error: function (result) {
            alert('Error');
            return false;
        }
    });
}

const CancelPOD = (objectString) => {
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    let CourierId = obj.courierId;
    let PODnumber = obj.podNumber;
    let statusId = obj.statusId;
    let statusName = obj.status;
    var URL = bridgeBaseUrl + "Courier/canceldeliveryOrder/" + CourierId + "/" + PODnumber;
    $.ajax({
        type: "GET",
        url: URL.toLocaleLowerCase(),
        headers: { 'API_KEY': 'Ajkerdeal_~La?Rj73FcLm' },
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            alert('Pod cancellation Successfull!');
            obj.podNumber = "";
            let newObjectString = JSON.stringify(obj);
            UpadateOrderStatus(newObjectString, statusId, statusName);
        },
        error: function (result) {
            alert('Pod cancellation Failed!');
        }
    });
}
const generateBase64andPrint = obj => {
    let CourierId = obj.courierId;
    let PODnumber = obj.podNumber;
    let URL = "";


    if (CourierId === 28) {
        URL = bridgeBaseUrl + "Courier/CreateBarCodeForPostalService/" + PODnumber;
    }
    if (CourierId === 32) {
        URL = bridgeBaseUrl + "Courier/CreateBarCodeForEDesh/" + PODnumber;
    }
    if (CourierId === 3) {
        URL = bridgeBaseUrl + "Courier/CreateQrCodeForEcourier/" + PODnumber;
    }
    if (CourierId == 34) {
        let courierModel = {
            PODNumber: obj.podNumber,
            Base64String: "",
            IsSuccess: true,
            Message: "success",
            CourierId: CourierId,
            DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
        };
        printQRcode(courierModel);
        Popup($('#PackagingModalBody').html());
    }
    else if (courierIdsArray.includes(CourierId)) {
        let courierModel = {
            PODNumber: obj.podNumber,
            Base64String: "",
            IsSuccess: true,
            Message: "success",
            CourierId: CourierId,
            DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
        };
        printQRcode(courierModel);
        Popup($('#PackagingModalBody').html());
    }
    else if (CourierId !== 30 && !courierIdsArray.includes(CourierId)) {
        $.ajax({
            type: "GET",
            url: URL.toLocaleLowerCase(),
            headers: { 'API_KEY': 'Ajkerdeal_~La?Rj73FcLm' },
            contentType: "application/json",
            dataType: "json",
            async: false,
            success: function (data) {
                //console.log(data);
                if (data !== null) {
                    let courierModel = {
                        CourierId: obj.courierId,
                        PODNumber: obj.podNumber,
                        Base64String: data,
                        IsSuccess: true,
                        Message: "success"
                    };
                    printQRcode(courierModel);
                    Popup($('#PackagingModalBody').html());
                }
            },
            error: function (result) {
                alert('Error.');
            }
        });
    }
    else {
        let courierModel = {
            PODNumber: obj.podNumber,
            Base64String: "",
            IsSuccess: true,
            Message: "success",
            CourierId: CourierId,
            DeliveryRangeId: obj.courierOrderInfo.deliveryRangeId
        };
        printQRcode(courierModel);
        Popup($('#PackagingModalBody').html());
    }

}

var allDistricts = [];
var currentObj;

const showUpdateOrder = objectString => {
    $('#normalOrder').prop('checked', false);
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    currentObj = JSON.parse(objectString);
    $("#orderIdHiddenField").val(obj.courierOrdersId);
    $("#idHiddenField").val(obj.id);
    $("#customerName").val(obj.customerName);
    $("#customerMobile").val(obj.courierAddressContactInfo.mobile);
    $("#alternateMobile").val(obj.courierAddressContactInfo.otherMobile);
    $("#customerAddress").val(obj.courierAddressContactInfo.address);
    $("#productName").val(obj.courierOrderInfo.collectionName);
    $("#collectionAddress").val(obj.userInfo.collectAddress);
    //$("#deliveryCharge").val(obj.courierPrice.deliveryCharge);
    $("#productType").val(obj.courierOrderInfo.productType);

    if (obj.courierPrice.officeDrop) {
        $("#officeDrop").val(1);
    }
    else {
        $("#officeDrop").val(0);
    }
    $("#merchantDeliveryDate").val(obj.courierAddressContactInfo.merchantDeliveryDate);
    $("#merchantCollectionDate").val(obj.courierAddressContactInfo.merchantCollectionDate);


    //if (obj.offerInformation.offerCode != "" && obj.offerInformation.offerCode != null) {
    //    $('#normalOrder').prop('checked', true);
    //}
    //else
    //{
    //    $("#makeNormalOrder").hide();
    //}
    if (obj.courierAddressContactInfo.thanaId > 0 && obj.userInfo.merchantAssignActive == true) {
        getDeliveryChargeMerchantDetailsAreaWise(obj);
    }
    else if (obj.courierAddressContactInfo.thanaId > 0) {
        getGeliveryChargeDetailsAreaWise(obj);
    }

    getPackagingChargeRange(obj);


    GetMerchnatPickupLocations(obj.userInfo.courierUserId, obj.courierAddressContactInfo.collectAddressDistrictId,
        obj.courierAddressContactInfo.collectAddressThanaId);

    // district
    let district = allDistricts.filter(d => d.parentId === 0 && d.isActive === true);
    $('#district').html('');
    for (var i = 0; i < district.length; i++) {
        $('#district').append('<option value=' + district[i].districtId + '>' + district[i].district + '</option>');
    }
    $('#district').val(obj.courierAddressContactInfo.districtId);
    // thana
    let thana = allDistricts.filter(d => d.parentId === obj.courierAddressContactInfo.districtId && d.isActive === true);
    $('#thana').html('');
    for (var i = 0; i < thana.length; i++) {
        $('#thana').append('<option value=' + thana[i].districtId + '>' + thana[i].district + '</option>');
    }
    $('#thana').val(obj.courierAddressContactInfo.thanaId);
    // area
    let area = allDistricts.filter(d => d.parentId === obj.courierAddressContactInfo.thanaId && d.isActive === true);
    $('#area').html('');
    for (var i = 0; i < area.length; i++) {
        $('#area').append('<option value=' + area[i].districtId + '>' + area[i].district + '</option>');
    }
    $('#area').val(obj.courierAddressContactInfo.areaId);

    $("#offerCodeHiddenField").val(obj.offerInformation.offerCode);
    $("#offerCodDiscountHiddenField").val(obj.offerInformation.offerCodDiscount);
    $("#offerBkashDiscountHiddenField").val(obj.offerInformation.offerBkashDiscount);
    $("#isOfferCodActiveHiddenField").val(obj.offerInformation.isOfferCodActive);
    $("#isOfferBkashActiveHiddenField").val(obj.offerInformation.isOfferBkashActive);
    $("#classifiedIdHiddenField").val(obj.offerInformation.classifiedId);
    $("#offerType").val(obj.referrerformation.offerType);
    $("#deliveryCharge").val(obj.courierPrice.deliveryCharge);
    $("#serviceType").val(obj.courierOrderInfo.serviceType);
};

var weightList;
const getGeliveryChargeDetailsAreaWise = (obj, districtId, thanaId, areaId, serviceType) => {
    let Obj =
    {
        districtId: districtId == null ? obj.courierAddressContactInfo.districtId : districtId,
        thanaId: thanaId == null ? obj.courierAddressContactInfo.thanaId : thanaId,
        areaId: areaId == null ? obj.courierAddressContactInfo.areaId : areaId
    };

    object = {};
    if (serviceType == '' || serviceType == undefined) {
        object = {
            ...Obj,
            serviceType: obj.courierOrderInfo.serviceType
        }
    }
    else {
        object = {
            ...Obj,
            serviceType: serviceType
        }
    }

    let json = JSON.stringify(object);

    //let json = JSON.stringify(
    //    {
    //        districtId: districtId == null ? obj.courierAddressContactInfo.districtId : districtId,
    //        thanaId: thanaId == null ? obj.courierAddressContactInfo.thanaId : thanaId,
    //        areaId: areaId == null ? obj.courierAddressContactInfo.areaId : areaId,
    //        serviceType: obj.courierOrderInfo.serviceType
    //    }
    //);

    let url = apiBaseURL + "Fetch/DeliveryChargeDetailsAreaWise";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {

            $('#weight').html('');
            $('#deliveryType').html('');

            weightList = response.responseJSON.model;
            for (var i = 0; i < weightList.length; i++) {
                $('#weight').append('<option value=' + weightList[i].weightRangeId + '>' + weightList[i].weight + '</option>');
            }
            let weightRangeId = obj.courierOrderInfo.weightRangeId;

            $('#weight').val(weightRangeId);

            let weightRange = weightList.find(o => o.weightRangeId === weightRangeId);
            for (var p = 0; p < weightRange.weightRangeWiseData.length; p++) {
                $('#deliveryType').append('<option value=' + weightRange.weightRangeWiseData[p].deliveryRangeId + '>' + weightRange.weightRangeWiseData[p].deliveryType + ' ' + weightRange.weightRangeWiseData[p].days + '</option>');
            }
            let deliveryRangeId = obj.courierOrderInfo.deliveryRangeId;
            $('#deliveryType').val(deliveryRangeId);

        }
    });
};


const getPackagingChargeRange = (obj) => {
    let url = apiBaseURL + "Fetch/GetPackagingChargeRange/true";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            $('#packaging').html('');
            for (var i = 0; i < response.responseJSON.model.length; i++) {
                $('#packaging').append('<option value=' + response.responseJSON.model[i].packagingCharge + '>' + response.responseJSON.model[i].packagingName + '</option>');
            }
            $('#packaging').val(obj.courierPrice.packagingCharge);
        }
    });
};


var deliveryRange;
const weightChange = (weight) => {
    deliveryRange = weightList.find(o => o.weightRangeId == weight.value);

    $('#deliveryType').html('');
    for (var p = 0; p < deliveryRange.weightRangeWiseData.length; p++) {
        $('#deliveryType').append('<option value=' + deliveryRange.weightRangeWiseData[p].deliveryRangeId + '>' + deliveryRange.weightRangeWiseData[p].deliveryType + ' ' + deliveryRange.weightRangeWiseData[p].days + '</option>');
    }
};

var districtIdValue;
const districtOnchange = (districtId) => {

    let thana = allDistricts.filter(d => d.parentId === parseInt(districtId.value) && d.isActive === true);
    $('#thana').html('');
    for (var i = 0; i < thana.length; i++) {
        $('#thana').append('<option value=' + thana[i].districtId + '>' + thana[i].district + '</option>');
    }
    districtIdValue = districtId.value;
}

const collectDistrictOnchange = (districtId) => {


    let pickupDistrict = pickupLocations.filter(d => d.districtId === parseInt(districtId.value));

    $('#collectThana').html('');
    for (var i = 0; i < pickupDistrict.length; i++) {
        $('#collectThana').append('<option value=' + pickupDistrict[i].thanaId + '>' + pickupDistrict[i].thanaName + '</option>');
    }
}

var thanaIdValue;
const thanaOnchange = (thanaId) => {

    let area = allDistricts.filter(d => d.parentId === parseInt(thanaId.value) && d.isActive === true);
    $('#area').html('');
    for (var i = 0; i < area.length; i++) {
        $('#area').append('<option value=' + area[i].districtId + '>' + area[i].district + '</option>');
    }

    if (currentObj.userInfo.merchantAssignActive == true) {
        getDeliveryChargeMerchantDetailsAreaWise(currentObj, districtIdValue, thanaId.value, 0);
    }
    else {
        getGeliveryChargeDetailsAreaWise(currentObj, districtIdValue, thanaId.value, 0);
    }
    
}

const serviceTypeOnchange = (serviceType) => {

    if (currentObj.userInfo.merchantAssignActive == true) {
        getDeliveryChargeMerchantDetailsAreaWise(currentObj, districtIdValue, currentObj.courierAddressContactInfo.thanaId, 0, serviceType.value);
    }
    else {
        getGeliveryChargeDetailsAreaWise(currentObj, districtIdValue, currentObj.courierAddressContactInfo.thanaId, 0, serviceType.value);
    }
}

const updateOrderInfo = () => {
    let orderId = $("#orderIdHiddenField").val();
    let id = $("#idHiddenField").val();
    let customerName = $("#customerName").val();
    let customerMobile = $("#customerMobile").val();
    let alternateMobile = $("#alternateMobile").val();
    let customerAddress = $("#customerAddress").val();
    let productName = $("#productName").val();
    let collectionAddress = $("#collectionAddress").val();
    let productType = $("#productType").val();

    let weight = $("#weight option:selected").text();
    let weightRangeId = $("#weight option:selected").val();

    let deliveryType = $("#deliveryType option:selected").text();

    let deliveryRangeId = $("#deliveryType option:selected").val();

    let districtId = $("#district option:selected").val();
    let thanaId = $("#thana option:selected").val();
    let areaId = $("#area option:selected").val();

    let collectAddressDistrictId = $("#collectDistrict option:selected").val() == null ? 0 : $("#collectDistrict option:selected").val();
    let collectAddressThanaId = $("#collectThana option:selected").val() == null ? 0 : $("#collectThana option:selected").val();

    let officeDrop = $("#officeDrop option:selected").val();
    let merchantDeliveryDate = $("#merchantDeliveryDate").val();
    let merchantCollectionDate = $("#merchantCollectionDate").val();

    let packagingCharge = $("#packaging").val();
    let packagingName = $("#packaging option:selected").text();

    let offerType = $("#offerType").val();
    let deliveryCharge = 0;
    if (offerType == "freedelivery") {
        deliveryCharge = $("#deliveryCharge").val();
    }
    else {
        deliveryCharge = weightList.find(o => o.weightRangeId == weightRangeId).weightRangeWiseData.find(d => d.deliveryRangeId == deliveryRangeId).chargeAmount;

    }



    //////////////deliveryCharge//////////////

    //let deliveryCharge = 0;
    //if ($("#deliveryChargeApply").prop("checked")) {
    //    deliveryCharge = $("#deliveryCharge").val();
    //    $("#deliveryChargeApply").prop("checked", true);
    //}

    //else {

    //if (productType === 'big' || productType === 'small') {
    //    if (productType === 'big') {
    //        deliveryCharge = weightList.find(o => o.weightRangeId == weightRangeId).weightRangeWiseData.find(d => d.deliveryRangeId == deliveryRangeId).chargeAmount + 200;
    //    }
    //    else {
    //        deliveryCharge = weightList.find(o => o.weightRangeId == weightRangeId).weightRangeWiseData.find(d => d.deliveryRangeId == deliveryRangeId).chargeAmount;
    //    }
    //}

    //}
    //////////////deliveryCharge//////////////

    let OfferCode = $("#offerCodeHiddenField").val();
    let OfferCodDiscount = $("#offerCodDiscountHiddenField").val();
    let OfferBkashDiscount = $("#offerBkashDiscountHiddenField").val();
    let IsOfferCodActive = $("#isOfferCodActiveHiddenField").val();
    let IsOfferBkashActive = $("#isOfferBkashActiveHiddenField").val();
    let ClassifiedId = $("#classifiedIdHiddenField").val();
    let serviceType = $("#serviceType").val();

    let obj =
    {
        Id: id,
        CustomerName: customerName,
        Mobile: customerMobile,
        OtherMobile: alternateMobile,
        Address: customerAddress,
        CollectionName: productName,
        CollectAddress: collectionAddress,
        Weight: weight,
        WeightRangeId: weightRangeId,
        PaymentType: deliveryType,
        DeliveryRangeId: deliveryRangeId,
        DeliveryCharge: deliveryCharge,
        ProductType: productType,
        DistrictId: districtId,
        ThanaId: thanaId,
        AreaId: areaId,
        CollectAddressDistrictId: collectAddressDistrictId,
        CollectAddressThanaId: collectAddressThanaId,
        OfficeDrop: officeDrop == "1" ? true : false,
        MerchantDeliveryDate: merchantDeliveryDate,
        MerchantCollectionDate: merchantCollectionDate,
        PackagingCharge: packagingCharge,
        PackagingName: packagingName,
        ServiceType: serviceType
    };


    if ($('#normalOrder').prop("checked") == true) {
        Obj = {};
        if (confirm('Do you want to Make a Normal Order?')) {
            Obj = {
                ...obj,
                offerCode: '',
                offerCodDiscount: 0,
                offerBkashDiscount: 0,
                isOfferCodActive: 0,
                isOfferBkashActive: 0,
                classifiedId: 0

            }
        }
        else {
            alert("Please Unchecked the checkbox & click again Update button...!!!.");
            return false;
        }

    }
    else {
        Obj =
        {
            ...obj,
            offerCode: OfferCode,
            offerCodDiscount: OfferCodDiscount,
            offerBkashDiscount: OfferBkashDiscount,
            isOfferCodActive: IsOfferCodActive,
            isOfferBkashActive: IsOfferBkashActive,
            classifiedId: ClassifiedId
        };
    }

    let json = JSON.stringify(Obj);
    //console.log(json);
    let url = apiBaseURL + "Update/UpdateCourierOrders/" + orderId;
    //console.log(json);
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
                    alert("Order Updated.");
                    searchOrderDetails();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

const calculateEpostDeliveryCharge = (data) => {
    let weight = parseFloat($("#epostWeight").val());
    let GrandTotal = data.courierPrice.collectionAmount;//$("#GrandTotal").html() == 'Paid' ? 0 : parseFloat($("#GrandTotal").html());
    let codPercentage = GrandTotal / 100; // 1% flat
    let PostalDeliveryCharge = 0;
    if (weight < .400) {
        //$("#epostWeight").css("color", "red");
        PostalDeliveryCharge = 10 + codPercentage;
    }
    else {
        //$("#epostWeight").css("color", "black");
        PostalDeliveryCharge = ((weight - .400) * 10) + 10 + codPercentage;
    }
    PostalDeliveryCharge = PostalDeliveryCharge.toFixed(2);
    return PostalDeliveryCharge;
    //$("#PostalDeliveryCharge").html(PostalDeliveryCharge);
}
const generateBarcode = orderId => {
    var divId = "#barCode" + orderId;
    JsBarcode(divId, orderId, {
        format: "CODE128",
        width: 1,
        height: 50,
        displayValue: false
    });
}
const setWeightField = () => {
    let courierId = $("#courier").val();
    if (courierId == 28 || courierId == 34) {
        $("#epostWeightField").show();
    }
    else {
        $("#epostWeightField").hide();
    }
}


var pickupLocations = [];
function GetMerchnatPickupLocations(courierUserId, collectAddressDistrictId, collectAddressThanaId) {
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
                //console.log(response.model, collectAddressDistrictId, collectAddressThanaId);
                pickupLocations = response.model;


                let pickupDistrict = pickupLocations.reduce((x, y) => x.findIndex(e => e.districtId == y.districtId) < 0 ? [...x, y] : x, [])
                //console.log(pickupDistrict);
                $('#collectDistrict').html('');
                for (var i = 0; i < pickupDistrict.length; i++) {
                    $('#collectDistrict').append('<option value=' + pickupDistrict[i].districtId + '>' + pickupDistrict[i].districtName + '</option>');
                }
                $('#collectDistrict').val(collectAddressDistrictId);

                $('#collectThana').html('');
                for (var i = 0; i < pickupLocations.length; i++) {
                    $('#collectThana').append('<option value=' + pickupLocations[i].thanaId + '>' + pickupLocations[i].thanaName + '</option>');
                }
                $('#collectThana').val(collectAddressThanaId);
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

const LoadAllDistrictsOperation = () => {
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

                allDistricts = response.model;

                let districtsSort = [];

                let otherCity = {};
                otherCity['name'] = "Other City";
                otherCity['ids'] = response.model.filter(d => d.isCity === true && d.areaType === 2 && d.parentId === 0).map((d) => { return d.districtId });

                let allDistrictsShador = {};
                allDistrictsShador['name'] = "All Districts Shador";
                allDistrictsShador['ids'] = response.model.filter(d => d.isCity === true && d.areaType === 3).map((d) => { return d.districtId });

                let upozillaShador = {};
                upozillaShador['name'] = "All Upozilla Shador";
                upozillaShador['ids'] = response.model.filter(d => d.isCity === true && d.areaType === 4).map((d) => { return d.districtId });

                districtsSort = [...districtsSort, {
                    "name": "Select City / Sadar",
                    "ids": [-1]
                }];
                districtsSort = [...districtsSort, {
                    "name": "Dhaka City",
                    "ids": [14]
                }];

                districtsSort = [...districtsSort, otherCity];
                districtsSort = [...districtsSort, allDistrictsShador];
                districtsSort = [...districtsSort, upozillaShador];

                for (var i = 0; i < districtsSort.length; i++) {
                    $('#CityOrSadar').append('<option value=' + districtsSort[i].ids + '>' + districtsSort[i].name + '</option>');
                }

                // district
                let districtSearch = allDistricts.filter(d => d.parentId === 0 && d.isActive === true);
                DrawLocationData(districtSearch, "District", null);

            }
            else {
                //console.log(response);
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

const GetThanaList = () => {
    document.getElementById('Thana').disabled = false;
    let distIdForThana = parseInt($("#District").val());
    let thanaSearch = allDistricts.filter(d => d.parentId === distIdForThana && d.isActive === true);

    DrawLocationData(thanaSearch, "Thana", null);
};

const GetAreaList = () => {
    let CityDistricts = [14, 77, 78, 79, 80];
    if (!CityDistricts.includes(parseInt($("#District").val()))) {
        document.getElementById('Area').disabled = false;
        let thanaIdForArea = parseInt($("#Thana").val());
        let areaSearch = allDistricts.filter(d => d.parentId === thanaIdForArea && d.isActive === true);

        DrawLocationData(areaSearch, "Area", null);
    }
};

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
            $("#" + selectTagId + "").append('<option value="' + district.districtId + '">' + district.district + ' (' + district.postalCode + ')</option>');
        }
    });
    if (selectedValue != null) {
        $("#" + selectTagId + " option").prop('selected', false)
            .filter("[value='" + selectedValue + "']")
            .prop('selected', true);
    }
};

const LoadDeliveryRange = () => {
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

                $('#paymentType').append('<option value="-1" selected="">Select Service Type</option>');
                for (var i = 0; i < response.model.length; i++) {
                    $('#paymentType').append('<option value="' + response.model[i].name + ' ' + response.model[i].day + '">' + response.model[i].name + ' ' + response.model[i].day + '</option>');
                }

            }
            else {
                //console.log(response);
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

let CheckOrderStatusHistory = (objectString, statusId, statusName) => {

    let { courierOrdersId } = JSON.parse(objectString);
    let url = apiBaseURL + "Fetch/OrderUpdateHistory/" + courierOrdersId;

    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                let statusIdHistory = response.model.map(x => x.status);
                if (!statusIdHistory.includes(7)) {
                    UpadateOrderStatus(objectString, statusId, statusName);
                }
                else {
                    alert(`This OrderId(${courierOrdersId}) has already Office Received!`);
                    return false;
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



};


//let complainType = 'রিটার্ন পার্সেল এখনো বুঝে পাই নাই';
const CheckExistingBookingCode = (orderId, complainType) => {
    let url = admBaseUrl + "Complain/IsComplainExist/" + orderId + "/dt/" + complainType;
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            console.log(response);
        },
        Error: function (response) {
            console.log(response);
        }
    });
}


const showUpdateInvoiceNumber = id => {
    
    $("#idHiddenField").val(id);
    
};
const UpdateInvoiceNumber = () => {

    if (confirm('Do you really want to update Invoice Number?')) {
        let id = $("#idHiddenField").val();
        let invoiceCourier = $("#invoiceCourier").val();
        let invoiceNumber = $("#invoiceNumber").val();

        let obj =
        {
            Id: id,
            InvoiceCourier: invoiceCourier,
            InvoiceNumber: invoiceNumber
        };

        let json = JSON.stringify(obj);
        let url = apiBaseURL + "Update/UpdateInvoiceNumber";

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
                        alert("Invoice Updated Successfully...!!!");
                        searchOrderDetails();
                    }
                }
                else {
                    alert("Error.");
                }
            }
        });
    }
    else {
        alert("Invoice Not Updated...!!!.");
        return false;
    }
    
}

const checkCustomerInfoForPackaging = (obj) => {

    let arraylist = [];
    let districtIdsArray = [14, 77, 78, 79, 80];
    
    if (obj.customerName == '' || obj.customerName == undefined) {
        arraylist.push('কাস্টমের নাম');
    }
    if (obj.courierAddressContactInfo.mobile == '' || obj.courierAddressContactInfo.mobile == undefined) {
        arraylist.push('মোবাইল নম্বর');
    }
    if (obj.courierAddressContactInfo.address == '' || obj.courierAddressContactInfo.address == undefined) {
        arraylist.push('এড্রেস');
    }
    if (obj.courierAddressContactInfo.districtId == 0 ) {
        arraylist.push('জেলা');
    }
    if (obj.courierAddressContactInfo.thanaId == 0 ) {
        arraylist.push('থানা');
    }
    if (!districtIdsArray.includes(obj.courierAddressContactInfo.districtId) && obj.courierAddressContactInfo.areaId == 0) {
        arraylist.push('এরিয়া');
    }
    if (obj.courierOrderInfo.deliveryRangeId == 0 ) {
        arraylist.push('সার্ভিস টাইপ');
    }
    if (obj.courierOrderInfo.weightRangeId == 0 ) {
        arraylist.push('ওয়েট');
    }
    if (obj.courierPrice.deliveryCharge == 0 && obj.referrerformation.offerType != 'freedelivery') {
        arraylist.push('ডেলিভারি চার্জ');
    }

    return arraylist;
}


const getDeliveryChargeMerchantDetailsAreaWise = (obj, districtId, thanaId, areaId, serviceType) => {
    let Obj =
    {
        districtId: districtId == null ? obj.courierAddressContactInfo.districtId : districtId,
        thanaId: thanaId == null ? obj.courierAddressContactInfo.thanaId : thanaId,
        areaId: areaId == null ? obj.courierAddressContactInfo.areaId : areaId
    };

    object = {};
    if (serviceType == '' || serviceType == undefined) {
        object = {
            ...Obj,
            serviceType: obj.courierOrderInfo.serviceType
        }
    }
    else {
        object = {
            ...Obj,
            serviceType: serviceType
        }
    }

    let json = JSON.stringify(object);

    let url = apiBaseURL + "Fetch/DeliveryChargeMerchantDetailsAreaWise";

    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {

            $('#weight').html('');
            $('#deliveryType').html('');

            weightList = response.responseJSON.model;
            for (var i = 0; i < weightList.length; i++) {
                $('#weight').append('<option value=' + weightList[i].weightRangeId + '>' + weightList[i].weight + '</option>');
            }
            let weightRangeId = obj.courierOrderInfo.weightRangeId;

            $('#weight').val(weightRangeId);

            let weightRange = weightList.find(o => o.weightRangeId === weightRangeId);
            for (var p = 0; p < weightRange.weightRangeWiseData.length; p++) {
                $('#deliveryType').append('<option value=' + weightRange.weightRangeWiseData[p].deliveryRangeId + '>' + weightRange.weightRangeWiseData[p].deliveryType + ' ' + weightRange.weightRangeWiseData[p].days + '</option>');
            }
            let deliveryRangeId = obj.courierOrderInfo.deliveryRangeId;
            $('#deliveryType').val(deliveryRangeId);

        }
    });
};

const UpdateToComplain = (objectString, comment) => {

    let userId = +sessionStorage.getItem('userId');
    let orderId = JSON.parse(objectString).id;

    let obj = {
        BookingCode: orderId.toString(),
        Status: 210201,
        UpdatedBy: userId,
        Comments: comment
        
    }

    let json = JSON.stringify(obj);
    let url = admBaseUrl + "Complain/UpdateComplaintSatatusByBookingcodeForDT";
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        success: function (response) {
            console.log(response);
        },
        Error: function (response) {
            console.log(response);
        }
    });
}

const getCurrentDate = () => {

    let date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let currDate = year + '-' + month + '-' + day;

    return currDate;
}

//const downLoadPoh = (courierOrdersId) => {

//    let obj = {
//        OrderCode: courierOrdersId
//    }

//    let json = JSON.stringify(obj);
//    let url = admBaseUrl + "account/reports/DownloadPoh";
//    $.ajax({
//        type: "POST",
//        crossDomain: true,
//        url: url,
//        contentType: "application/json",
//        dataType: 'json',
//        data: json,
//        success: function (response) {
//            console.log(response);
//        },
//        Error: function (response) {
//            console.log(response);
//        }
//    });
//}

//const accountingAndMIS = (orderId) => {

//    let obj = {
//        CourierOrderId: orderId,
//        UserID: 3026
//    }

//    let json = JSON.stringify(obj);
//    let url = admBaseUrl + "transaction/SyncronizeAccountingAndMIS";
//    $.ajax({
//        type: "POST",
//        crossDomain: true,
//        url: url,
//        contentType: "application/json",
//        dataType: 'json',
//        data: json,
//        success: function (response) {
//            console.log(response);
//        },
//        Error: function (response) {
//            console.log(response);
//        }
//    });
//}