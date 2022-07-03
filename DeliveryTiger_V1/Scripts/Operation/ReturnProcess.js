/// <reference path="../common/jsbarcode.min.js" />
//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger

//var apiBaseURL = "http://localhost:58676/api/"; //local

const loadAllReturnMerchants = () => {
    let url = apiBaseURL + "Fetch/GetAllReturnProductsReport/";
    let Status = parseInt($("#Status option:selected").val());
    $.ajax({
        beforeSend: function () {
            document.getElementById('returnMerchantList').innerHTML = loaderHtml;
            document.getElementById('totalReturnMerchantCount').innerHTML = loaderHtmlSm;
            document.getElementById('totalReturnProductCount').innerHTML = loaderHtmlSm;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url + Status,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawReturnMerchantData(response.model);
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
const hubNameOnChange = (hubName) => {
    let hubSplit = hubName.split('-');
    if (hubSplit.length>1) {
        let hubSplit1 = hubSplit[0].charAt(0).toUpperCase() + hubSplit[0].slice(1);
        let hubSplit2 = hubSplit[1].charAt(0).toUpperCase() + hubSplit[1].slice(1);
        let concat = hubSplit1 + '-' + hubSplit2;
        document.getElementById('showHubNameOnChangeId').innerHTML = concat;
    }
    else {
        let hubSplit = hubName.split(' ');
        let hubSplit1 = hubSplit[0].charAt(0).toUpperCase() + hubSplit[0].slice(1);
        let hubSplit2 = hubSplit[1].charAt(0).toUpperCase() + hubSplit[1].slice(1);
        let concat = hubSplit1 + '-' + hubSplit2;
        document.getElementById('showHubNameOnChangeId').innerHTML = concat;
    }
}
const loadAllHubName = () => {
    let url = apiBaseURL + 'Fetch/GetAllHubs';
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then((data) => {
            let model = data.model;
            var design = "";
            design += ("<option value=''>Select Hub</option>");
            for (var i = 0; i < model.length; i++) {
                design += ("<option value='" + model[i].value + "'>" + model[i].name + "</option>");
            }
            document.getElementById('loadHubOptionsId').innerHTML = design;
        })
        .catch((errors) => {
            console.error(errors);
        })
}
const DrawReturnMerchantData = data => {
    $("#totalReturnMerchantCount").html(data.totalReturnMerchantCount);
    $("#totalReturnProductCount").html(data.totalReturnProductCount);
    let html = "";
    $.each(data.returnMerchantDetails, function (i, obj) {
        html += `<div class='col-lg-12' style='padding:0px;'>`;
        html += `<div class='box-1' style='width:100%;' onClick='showMerchantReturnDetails(${JSON.stringify(obj)});'>`;
        html += `<label style='margin:.3rem;font-size:15px;font-weight:500;vertical-align:middle;width:80%;'>${obj.companyName}`;
        html += `<span class='label label-primary pull-right' style='margin-top:5px;font-size:12px;'>${obj.totalReturnProductCount}</span></label>`;
        html += `<i class='fa fa-angle-right fa-2x pull-right' style='margin-top:5px;width:10%;'></i>`;
        html += `</div>`;
        html += `</div>`;
    });
    $("#returnMerchantList").html(html);
}
const showMerchantReturnDetails = data => {
    scrollToTop();
    $("#returnMerchantProductList").show();
    let headerHtml = "";
    headerHtml += `<h3><b>${data.companyName}</b> (${data.merchantMobile})  `;
    headerHtml += `<small>${data.returnCollectorName === null ? "" : data.returnCollectorName}</small></h3>`;
    $("#returnMerchantProductListHeader").html(headerHtml);
    let html = "";
    html += `<div class='col-lg-12' style='padding:0px;'>`;
    $.each(data.returnProductDetails, function (i, obj) {
        let disabledString = obj.statusId == 19 ? "" : "disabled";
        html += `<div class='box-2' style='width:100%;'>`;
        html += `<input type='checkbox' class='i-checks' id='isReturn${obj.id}' ${disabledString}>`;
        html += `<label style='margin-bottom:2px;font-size:15px;font-weight:500;vertical-align:middle;'><b style="font-weight:550;">${obj.courierOrdersId}</b> ${obj.courierOrderInfo.collectionName == "" || null ? "" : " - " + obj.courierOrderInfo.collectionName}</label>`;
        html += `</div>`;
    });
    html += `<div class='form-group row' style='justify-content:center;'>`;
    html += `<button type='button' class='btn btn-success' data-toggle='modal' data-target='#returnInvoiceModal' onClick='showReturnInvoice(${JSON.stringify(data)});'>Get Invoice</button>`;
    html += `</div>`;

    html += `</div>`;
    $("#returnMerchantProductListDetails").html(html);

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green pull-left',
        radioClass: 'iradio_square-green',
    });
    $('.icheckbox_square-green').css("margin-right","10px");
}
const generateDtBarcode = (result, id) => {
    $.each(result, function (i, data) {
        if ($("#isReturn" + data["id"]).prop("checked") == true) {
            var value = data["courierOrdersId"];
            var canvasId = "#" + id + value;
            JsBarcode(canvasId, value);
            
        }
    });
}
const showReturnInvoice = data => {
    let totalSum = 0;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    //header
    let html = "<div id='ReturnPrintArea'><table style='margin: 15px;  width: 96%;'><tr>";
    html += "<td style='width: 40%;'><img src='/Content/Assets/dt_logo.png' width='120px;'/></td>";
    html += "<td style='float: right;'><b style='font-size: 20px; float: right;'>DeliveryTiger.com Ltd.</b><br/>";
    html += "<span style='float: right;'>Sumona Goni Trade Center, Plot-2,Level-5</span><br/>";
    html += "<span style='float: right;'>Panthapath, Karwan Bazar,Dhaka-1215</span><br/></tr>";

    html += `<tr><td style='width: 50%;'><b>Merchant Name: </b><span id='merchantName'>${data.companyName}</span></td>`;
    html += `<td><span style='float: right;'>Contact: 01844487626, 0963800077</span></td></tr>`;
    html += `<tr><td><b>Phone Number: </b>${data.merchantMobile}</br></td>`;
    html += "<td><span style='float: right;'>E-mail: returndeliverytiger@gmail.com</span></td></tr>"; // deliverytiger.return@gmail.com
    //html += `<tr><td><b>Address: </b>${data.returnProductDetails[0].userInfo.address}</br>`;
    html += `<tr><td><b>Address: </b>${data.returnProductDetails[0].userInfo.collectAddress}</br>`;
    html += `<td><span style='float:right;'>Date: ${date}</span><br><span style='font-size:16px;color:#f44336;float:right;'><b> Hub Name: <span style='color: black;' id='showHubNameOnChangeId'></span></b></span></br></td>`;///*${data.returnCollectorName == null ? "" : "Collector: " + data.returnCollectorName}*/
    
    //body
    let bodyHtml = "<table border='1px solid #ececec' class='table-striped' cellpadding='0' cellspacing='0' style='margin: 15px; width: 96%;'>";
    bodyHtml += "<tr style='border: 1px solid #000000;height:30px' align='center'>";
    bodyHtml += "<th style='width:10%;'><b>No</b></th>";
    bodyHtml += "<th style='width:20%;'><b>Order Id</b></th>";
    bodyHtml += "<th style='width:30%;'><b>Product Details</b></th>";
    bodyHtml += "<th style='width:20%;'><b>Return Charge</b></th>";
    bodyHtml += "<th style='width:20%;'><b>Barcode</b></th>";
    bodyHtml += "</tr>";

    let count = 1;
    $.each(data.returnProductDetails, function (i, obj) {
        if ($("#isReturn" + obj.id).prop("checked") == true) {
            bodyHtml += `<tr align='center'>`;
            bodyHtml += `<td>${count}</td>`;
            bodyHtml += `<td>${obj.courierOrdersId}</td>`;
            bodyHtml += `<td>${obj.courierOrderInfo.collectionName}</td>`;
            bodyHtml += `<td>${obj.courierPrice.returnCharge}</td>`;
            bodyHtml += `<td><img id='canvas${obj.courierOrdersId}' width='120' height='50'/></td>`;
            bodyHtml += `</tr>`;
            count++;
            totalSum += obj.courierPrice.returnCharge;
        }
    });

    let inWordAmount = ConvertNumberToWord(totalSum);
    inWordAmount = "(" + inWordAmount + ")";
    //merchant address
    
    html += `</table>`;
    html += bodyHtml;

    html += "<tr style='border: 1px solid #000000'>";
    html += `<td style='border-right: 1px solid #000000; padding: 2px;' colspan='9'><span class='pull-right' style="margin-right:10px;"> Total : ${totalSum == 0 ? "Paid" : totalSum} ${totalSum == 0 ? "" :inWordAmount}</span></td>`;
    html += "</tr></table>";

    html += "<table style='margin: 15px; width: 96%; margin-top: 55px;'><tr>";
    html += "<td>..............................................</td><td>..........................</td><td>..............................................</td></tr>";
    html += "<tr><td  style='vertical-align:top; width: 35%;' >Delivered/Accepted by <br/>Cont. No. </td>";
    html += "<td  style='vertical-align:top; width: 35%;'>Collected By. <br />Collecter: <br/>Deliverytiger.com Ltd.</td>";
    html += "<td  style='vertical-align:top; width: 26%;'>Received/Refunded By<br/>Fulfillment Department<br/>Deliverytiger.com Ltd</td>";
    html += "</tr></table></div>";
    html += "<div class='print-btn-container' id='printBtnField' style='padding:10px;'>";
    html += "<input id='PrintOnlyButton' name='PrintOnlyButton' style='margin-left:10px;display:none;' value='Print' onclick='PrintOnly(&#39;#ReturnPrintArea&#39;);' class='btn btn-success' type='button'></div>";
    $("#returnInvoiceModalBody").html(html);
    generateDtBarcode(data.returnProductDetails, "canvas");
    //$("#printReturnInvoiceBtn").attr("onclick", "printReturnInvoiceAndUpdate('" + JSON.stringify(data) + "')");
    $("#printReturnInvoiceHubBtn").attr("onclick", "printReturnInvoiceAndUpdate('" + JSON.stringify(data) + "',59)");
    $("#printReturnInvoiceMerchantBtn").attr("onclick", "printReturnInvoiceAndUpdate('" + JSON.stringify(data) + "',20)");
}
const printReturnInvoiceAndUpdate = (objectString,sid) => {
    objectString = fixString(objectString);
    let obj = JSON.parse(objectString);
    let statusId = sid;
    let statusName = statusId == 20 ? "Return order send to merchant By DT" : "Return order send to hub";
    let toBeUpdateOrders = [];
    let statusModel;
    let hubName = document.getElementById('loadHubOptionsId').value
    if (hubName == '') {
        alert('Please Select Hub Name before send to hub!');
        return false;
    };
    $.each(AllStatusGroupWiseData, function (i, statusGroup) {
        $.each(statusGroup.status, function (j, status) {
            if (status.statusId === statusId) {
                statusModel = status;
            }
        });
    });
    //console.log(obj.returnProductDetails);
    $.each(obj.returnProductDetails, function (i, obj) {
        if ($("#isReturn" + obj.id).prop("checked") == true) {
            //let singleobjectString = JSON.stringify(obj);
            let updateOrderObject = createUpdateOrderObject(obj, statusId, statusName, statusModel);
            toBeUpdateOrders = [...toBeUpdateOrders, updateOrderObject]
            //Update Status
            //UpadateOrderStatus(singleobjectString, statusId, statusName);
        }
    });
    UpdateMultipleOrders(toBeUpdateOrders);
    if ($("#isPrint").prop("checked") == true) {
        Popup($('#ReturnPrintArea').html());
    }
    
    //window.location.reload();
}
const createUpdateOrderObject = (obj, statusId, statusName, statusModel) => {
    let userId = $("#UserHidden").val();
    let orderId = obj.courierOrdersId;
    let orderDate = obj.courierOrderDateDetails.orderDate.trim();
    orderDate = orderDate.split(" ")[0];
    let courierId = obj.courierId;
    let comment = statusId == 32 ? obj.comment : statusName;
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
    let selectHubName = document.getElementById('loadHubOptionsId').value

    let Obj = {
        id: 0,
        courierOrderId: orderId,
        orderDate: orderDate,
        isConfirmedBy: "admin",
        courierId: courierId,
        status: parseInt(statusId),
        postedBy: parseInt(userId),
        comment: comment + ' - ' + selectHubName,
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
        riderMobile: ""
    };
    return Obj;
}
const UpdateMultipleOrders = (orders) => {
    let url = apiBaseURL + "Order/UpdateBulkOrders";
    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(orders),
        complete: function (response) {
            if (response.readyState === 4) {
                if (response.status === 201) {
                    //console.log(response);
                    alert("Updated.");
                    $("#returnInvoiceModal .close").click();
                    $('.modal-backdrop').css('z-index', '0px');
                    $('.modal-backdrop').css('position', 'relative');
                    location.reload();
                }
                if (response.status === 422) {
                    console.log(response);
                }
            }
            else {
                console.log(response);
                alert("Error.");
            }
        }
    });
}