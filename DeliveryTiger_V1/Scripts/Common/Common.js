/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/datatables/datatables.bootstrap4.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />
/// <reference path="../plugins/datatables/datatables.min.js" />



//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
////var apiBaseURL = "http://localhost:58676/api/"; //local

const loaderHtml = `<div class="spiner-example"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div> <div class="sk-rect2"></div> <div class="sk-rect3"></div> <div class="sk-rect4"></div> <div class="sk-rect5"></div> </div></div>`;
const loaderHtmlSm = `<div class="spiner-example-sm"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div> <div class="sk-rect2"></div> <div class="sk-rect3"></div> <div class="sk-rect4"></div> <div class="sk-rect5"></div> </div></div>`;

const loadAllStatus = selectTagId => {
    let url = apiBaseURL + "Fetch/LoadCourierOrderStatus";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                if (window.location.href.includes('MailAndSmsEntry') == 1) {
                    AllStatusListData = response.model;
                }
                $("#" + selectTagId + "").empty();
                $.each(response.model, function (i, status) {
                    $("#" + selectTagId + "").append('<option value="' + status.statusId + '">' + status.statusNameEng + '</option>');
                });
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
const loadAllStatusGroupWise = () => {
    let url = apiBaseURL + "Fetch/GetCourierOrderStatus";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                AllStatusGroupWiseData = response.model;
                //console.log(AllStatusGroupWiseData);
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
const loadMerchantInfo = selectTagId => {
    let url = apiBaseURL + "Permission/GetAllCourierUsers";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllMerchantInfo = response.model;
                //console.log(AllMerchantInfo);
                DrawMerchantListData(response.model, selectTagId);
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

const loadMerchantInfoListList = selectTagId => {
    let url = apiBaseURL + "Permission/GetAllCourierUsersList";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllMerchantInfo = response.model;
                //console.log(AllMerchantInfo);
                DrawMerchantListData(response.model, selectTagId);
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

const loadMerchantInfoList = selectTagId => {
    let url = apiBaseURL + "Fetch/GetAllCourierUsersList";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllMerchantInfo = response.model;
                //console.log(AllMerchantInfo);
                DrawMerchantListData(response.model, selectTagId);
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
const DrawMerchantListData = (data, selectTagId) => {
    $("#" + selectTagId + "").empty();
    $("#" + selectTagId + "").append('<option value="-1" selected>Select Merchant</option>');
    $.each(data, function (i, merchant) {
        let merchantTitle = "";
        if (merchant.companyName !== "") {
            merchantTitle += merchant.companyName;
            if (merchant.mobile !== "") {
                merchantTitle += " - " + merchant.mobile;
            }
        }
        else if (merchant.userName !== "") {
            merchantTitle += merchant.userName;
            if (merchant.mobile !== "") {
                merchantTitle += " - " + merchant.mobile;
            }
        }
        else {
            merchantTitle += merchant.mobile;
        }
        $("#" + selectTagId + "").append('<option value="' + merchant.courierUserId + '">' + merchantTitle + '</option>');
    });
    $("#" + selectTagId + "").select2("val", "-1");
}
const loadCollectorInfo = (selectTagId, selectedValue) => {
    let url = apiBaseURL + "Fetch/GetAllCollectors";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllCollectorInfo = response.model;
                DrawCollectorListData(response.model, selectTagId, selectedValue);
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

const DrawCollectorListData = (data, selectTagId, selectedValue) => {
    $("#" + selectTagId + "").empty();
    $("#" + selectTagId + "").append('<option value="-1" selected>Select Collector</option>');
    $.each(data, function (i, collector) {
        if (collector.isActive == true) {
            $("#" + selectTagId + "").append('<option value="' + collector.collectorId + '">' + collector.collectorName + '</option>');
        }
    });
    if (selectedValue != null) {
        $("#" + selectTagId + " option").prop('selected', false)
            .filter("[value='" + selectedValue + "']")
            .prop('selected', true);
    }
}
const loadDeliveryManInfo = (selectTagId, selectedValue) => {
    let url = apiBaseURL + "Fetch/GetAllDeliveryMan";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                AllDeliveryManInfo = response.model;
                DrawDeliveryManListData(response.model, selectTagId, selectedValue);
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
const DrawDeliveryManListData = (data, selectTagId, selectedValue) => {
    $("#" + selectTagId + "").empty();
    $("#" + selectTagId + "").append('<option value="-1" selected>Select DeliveryMan</option>');
    $.each(data, function (i, deliveryman) {
        if (deliveryman.isActive == 1) {
            $("#" + selectTagId + "").append('<option value="' + deliveryman.id + '">' + deliveryman.name + '</option>');
        }
    });
    if (selectedValue != null) {
        $("#" + selectTagId + " option").prop('selected', false)
            .filter("[value='" + selectedValue + "']")
            .prop('selected', true);
    }
}
const loadOrderDetails = () => {
    cart =[];
    let mobile = "";
    let orderId = "";
    let fromDate = "";
    let toDate = "";
    let status = "";
    let merchant = "";
    let podNumber = "";
    let collectionName = "";
    $("#totalOrderCount").html("0");
    $("#orderId").val() === "" ? orderId = "" : orderId = $("#orderId").val();
    $("#fromDate").val() === "" ? fromDate = "01-01-01" : fromDate = $("#fromDate").val();
    $("#toDate").val() === "" ? toDate = "01-01-01" : toDate = $("#toDate").val();
    $("#podNumber").val() === "" ? podNumber = "" : podNumber = $("#podNumber").val();
    $("#collectionName").val() === "" ? collectionName = "" : collectionName = $("#collectionName").val();
    merchant = $("#Merchant option:selected").val();
    status = $("#Status option:selected").val();

    $("#customerMobileSearch").val() === "" ? mobile = "" : mobile = $("#customerMobileSearch").val().trim();

    let index = $("#index").val() === "" ? 0 : parseInt($("#index").val());

    let courierId = $("#couriersId option:selected").val();

    let districtIds = $("#CityOrSadar option:selected").val();
    let districtGroupName = $("#CityOrSadar option:selected").text();

    let districtIdsArr = [];

    if (districtIds != undefined) {

        districtIds.split(",").map(function (item) {
            if (item.trim() != '') { districtIdsArr.push(parseInt(item.trim())) }
        });
    }
    

    let count = $("#count").val() === "" ? 30 : parseInt($("#count").val());
    let districtId = $("#District").val() === "-1" ? 0 : parseInt($("#District").val());
    let thanaId = $("#Thana").val() === "-1" ? 0 : parseInt($("#Thana").val());
    let areaId = $("#Area").val() === "-1" ? 0 : parseInt($("#Area").val());
    let paymentType = $('#paymentType').val() === "-1" ? "-1" : $('#paymentType').val();
    let orderFrom = $('#orderFrom').val() === "-1" ? "-1" : $('#orderFrom').val();
    let lowestPrice = $("#lowestPrice").val() === "" ? 0 : parseInt($("#lowestPrice").val());
    let highestPrice = $("#highestPrice").val() === "" ? 0 : parseInt($("#highestPrice").val());
    let lowestWeight = $("#lowestWeight").val() === "" ? 0 : parseInt($("#lowestWeight").val());
    let highestWeight = $("#highestWeight").val() === "" ? 0 : parseInt($("#highestWeight").val());

    //let priorityField = window.location.search.split('?')[1].split('=')[1];
    let priorityField = window.location.search
    if (priorityField != '') {
        priorityField = priorityField.split("?")[1].split("=")[1];
    }
    

    let Obj = {};
    if (priorityField == 'priority') {

        Obj =
            {
                Priority: priorityField
            }
    }
    else
    {
        Obj = {
            Status: parseInt(status),
            FromDate: fromDate,
            ToDate: toDate,
            OrderIds: orderId,
            courierUserId: merchant,
            podNumber: podNumber,
            collectionName: collectionName,
            Index: parseInt(index),
            Count: count,
            DistrictIds: districtIdsArr,
            DistrictGroupName: districtGroupName,
            CourierId: courierId,
            DistrictId: districtId,
            ThanaId: thanaId,
            AreaId: areaId,
            paymentType: paymentType,
            mobile: mobile,
            Priority: "",
            OrderFrom: orderFrom,
            LowPrice: lowestPrice,
            HighPrice: highestPrice,
            MinWeight: lowestWeight,
            MaxWeight: highestWeight
        };
    }
    
    let json = JSON.stringify(Obj);
    //console.log(Obj);
    //let url = apiBaseURL + "Fetch/LoadCourierOrder";
    let url = apiBaseURL + "Fetch/LoadOrders";
    //let url = "http://localhost:58676/api/Fetch/LoadOrders";

    $.ajax({
        beforeSend: function () {
            $("#orderDetailDiv").show();
            document.getElementById('orderDetailTable').innerHTML = loaderHtml;
        },
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState === 4) {
                if (response.status === 200) {
                    //console.log(response.responseJSON.model);
                    loadDataTable(response.responseJSON.model);
                    document.getElementById('orderDetailTable')
                        .scrollIntoView({
                            behavior: "smooth"
                        });
                }

                if (response.status === 422) {
                    console.log(response.responseJSON.model);
                }
            }
            else {
                alert("Error.");
                return false;
            }
        }
    });
}


const loadDataTable = data => {
    $("#orderDetailTable").html(DrawOrderDetail(data));
    $('#OrderDetailDatatable').DataTable({
        pageLength: 100,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'OrderDetails' },
            { extend: 'pdf', title: 'OrderDetails' },

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
    $('#OrderDetailDatatable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#OrderDetailDatatable_wrapper').addClass("container-fluid dt-bootstrap4");
}
const DrawTableHeader = () => {
    let html = "";
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="OrderDetailDatatable" aria-describedby="OrderDetailDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width:3%;">No.</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Order Detail: activate to sort column descending" style="width: 20%;">Order Detail</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Merchant Detail: activate to sort column descending" style="width: 20%;">Merchant Detail</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Customer Detail: activate to sort column descending" style="width: 20%;">Customer Detail</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Product Detail: activate to sort column descending" style="width: 20%;">Product Detail</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="OrderDetailDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Action: activate to sort column descending" style="width: 17%;">Action</th>';
    html += '</tr>';
    html += '</thead>';
    return html;
}
const DrawOrderDetail = data => {
    let orderList = data.courierOrderViewModel;
    $("#totalOrderCount").html(data.totalCount);
    let html = "";
    let count = 1;
    html += DrawTableHeader();
    $.each(orderList, function (i, obj) {
        let objectString = JSON.stringify(obj);
        let evenOddClass = count % 2 === 0 ? "even" : "odd";
        html += "<tr class='gradeA " + evenOddClass + "' role='row'>";
        //Count
        html += "<td style='text-align:center'>";
        html += "<input type='checkbox' id='" + obj.courierOrdersId + "' onchange='checkedOrder(this,&#39" + objectString + "&#39)'>"
        html += count;
        html += "</td>";

        html += DrawDetailRow(obj);
        html += DrawActionHtml(obj);

        html += "</tr>";
        count++;
    });
    html += "</table>";
    return html;
}

const DrawDetailRow = obj => {
    //console.log(obj);
    let html = "";
    let id = obj.courierOrdersId;
    //Order Detail
    html += "<td>";
    html += "<span><b>Order Id:</b></span></br>";
    html += "<label>" + id + "</label></br>";

    if (obj.vouchersViewModel.voucherCode != '' && obj.vouchersViewModel.voucherCode != null) {
        html += "<span><b>Voucher Code:</b></span></br>";
        html += "<label>" + obj.vouchersViewModel.voucherCode + "</label></br>";
    }

    if (obj.vouchersViewModel.voucherDiscount > 0) {
        html += "<span><b>Voucher Discount:</b></span></br>";
        html += "<label>" + obj.vouchersViewModel.voucherDiscount + " tk" + "</label></br>";
    }

    if (obj.courierPrice.actualPackagePrice > 0) {
        html += "<span><b>Actual Price:</b></span></br>";
        html += "<label>" + obj.courierPrice.actualPackagePrice + "</label></br>";
    }

    if (obj.vouchersViewModel.voucherDiscount > 0) {
        html += "<span><b>Total Charge:</b></span></br>";
        html += "<label>" + (obj.courierPrice.totalAmount - obj.vouchersViewModel.voucherDiscount) + "</label></br>";
    }
    else {
        html += "<span><b>Total Charge:</b></span></br>";
        html += "<label>" + obj.courierPrice.totalAmount + "</label></br>";
    }
    
    html += "<span><b>Delivery Charge:</b></span></br>";
    html += "<input type='text' id='DeliveryChargeId' style='border: transparent; width: 50px;' value=" + "'" + obj.courierPrice.deliveryCharge + "'" + " autocomplete='off' disabled /></br>";

    if ([71, 132, 527, 1187, 806, 1421, 410].includes(+sessionStorage.getItem('userId')) || +sessionStorage.getItem('adminType') == 11) {
        html += "<button type='button' class='btn btn-sm btn-info' onClick='EditDeliveryCharge()'>Edit</button></br><button id='updateDeliveryChargeBtn' type='button' class='btn btn-sm btn-info' onClick='UpdateDeliveryCharge(" + obj.id + ", " + obj.courierPrice.deliveryCharge + "," + obj.userInfo.courierUserId + ")' style='display: none; margin-top: 2px;'>Update</button></br>";
    }
    

    if (obj.vouchersViewModel.voucherDiscount > 0) {
        html += "<span><b>Discount Delivery Charge :</b></span></br>";
        html += "<input type='text' id='DiscountDeliveryChargeId' style='border: transparent;' value=" + "'" + (obj.courierPrice.deliveryCharge + " - " + obj.vouchersViewModel.voucherDiscount) + " = " + (obj.courierPrice.deliveryCharge - obj.vouchersViewModel.voucherDiscount) + " tk'" + " autocomplete='off' disabled /></br>";
    }

    if (obj.vouchersViewModel.voucherDiscount > 0) {
        html += "<span><b>Voucher Service:</b></span></br>";
        html += "<input type='text' id='VoucherDeliveryRangeId' style='border: transparent; width: 190px;' value=" + "'" + (obj.deliveryRangeViewModel.name + " " + obj.deliveryRangeViewModel.day + " " + obj.deliveryRangeViewModel.dayType) + "'" + " autocomplete='off' disabled /></br>";
    }

    if (obj.deliveryRangeViewModel.onImageLink != '' && obj.deliveryRangeViewModel.onImageLink != null) {
        html += "<img style='max-height:100px; max-width:100px;' src=" + obj.deliveryRangeViewModel.onImageLink + "></br>";
    }

    if (parseInt(obj.courierPrice.collectionAmount) !== 0 && obj.courierPrice.collectionAmount !== null) {
        html += "<span><b>Cash To Collect:</b></span></br>";
        html += "<label>" + obj.courierPrice.collectionAmount + "</label></br>";
    }
    if (parseInt(obj.courierPrice.breakableCharge) !== 0 && obj.courierPrice.breakableCharge !== null) {
        html += "<span><b>Breakable Charge:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.courierPrice.breakableCharge + "</label></br>";
    }

    //console.log(obj.userInfo.isBreakAble + 'isBreakAble');
    if (obj.userInfo.isBreakAble) {
        html += "<label style='color:#f44336;'>ভঙ্গুর/তরল</label></br>";
    }
    if (parseInt(obj.courierPrice.codCharge) !== 0 && obj.courierPrice.codCharge !== null) {
        html += "<span><b>COD Charge:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.courierPrice.codCharge + "</label></br>";
    }
    if (parseInt(obj.courierPrice.packagingCharge) !== 0 && obj.courierPrice.packagingCharge !== null) {
        html += "<span><b>Packaging Charge:</b></span></br>";
        html += "<label style='color:#1e88e5;'>" + obj.courierPrice.packagingCharge + "</label></br>";
    }

    if (obj.courierId > 0) {
        html += "<span><b>Courier Name:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.courierName + "</label></br>";
    }

    if (obj.offerInformation.offerCode != '') {
        html += "<span style='color:#4caf50;'><b>Bkash Offer:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.offerInformation.offerBkashDiscount + "</label>";
        html += " <label style='color:#f44336;'>" + obj.offerInformation.isOfferBkashActive + "</label></br>";
    }

    if (obj.offerInformation.classifiedId > 0) {
        html += "<span style='color:#4caf50;'><b>Cod Offer:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.offerInformation.offerCodDiscount + "</label>";
        html += " <label style='color:#f44336;'>" + obj.offerInformation.isOfferCodActive + "</label></br>";
    }

    if (obj.podNumber !== "" && obj.podNumber !== null) {
        html += "<span><b>POD Number:</b></span></br>";
        html += "<label style='color:#f44336;'>" + obj.podNumber + "</label></br>";
    }
    html += "<span><b>Order Date: </b></span></br>";
    html += "<label id='orderDate" + id + "'>" + obj.courierOrderDateDetails.orderDate + "</label></br>";
    
    var merchantDateDiff = obj.userInfo.orderDateDiff;
    
    if (merchantDateDiff <= 15 || obj.courierOrderInfo.deliveryRangeId == 17 || obj.courierOrderInfo.deliveryRangeId == 18) {
        html += "<label style='color:#f44336;'><b>Priority Order</b></label></br>";
    }
    if (obj.courierOrderInfo.orderFrom !== "" && obj.courierOrderInfo.orderFrom !== null) {
        html += "<span><b>Order From: </b></span></br>";
        html += "<label>" + obj.courierOrderInfo.orderFrom + " (" + obj.courierOrderInfo.version + ")" + "</label></br>";
    }

    if (obj.transactionId !== "" && obj.transactionId !== null) {
        html += "<span><b>TransactionId: </b></span></br>";
        html += "<label>" + obj.transactionId + "</label></br>";
    }
    html += "<input type='hidden' id='podNumberHiddenField" + id + "' value='" + obj.podNumber + "'/>";

    if (obj.paymentServiceType == 1) {
        html += "<span><b style='color:#f44336;'>Poh Order</b></span></br>";
        if (!obj.paymentServiceTypeVerify) {
            html += "<span><b>Customer Not Verified</b></span></br>";
        }
        else {
            html += "<span><b>Customer Verified</b></span></br>";
        }
        if (!obj.paymentServiceTypeMerchantVerify) {
            html += "<span><b>Parcel Not Verified</b></span></br></br>";
        }
        else {
            html += "<span><b>Parcel Verified</b></span></br></br>";
        }
    }

    if (!obj.isDownloaded || sessionStorage.getItem("adminType") == '11' || sessionStorage.getItem("userId") == 652)
    {
        html += "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#updateOrderModal' onClick='showUpdateOrder(&#39;" + JSON.stringify(obj) + "&#39;)'>Update Order</button>";
    }
    
    html += "</td>";

    //Merchant Detail
    html += "<td>";
    html += "<span><b>Company Name:</b></span></br>";
    html += "<label>" + obj.userInfo.companyName + "</label></br>";
    html += "<span><b>Merchant Name:</b></span></br>";
    html += "<label>" + obj.userInfo.userName + "</label></br>";
    //html += "<span><b>Merchant Id:</b></span></br>";
    //html += "<label id='merchantId"+ id +"'>" + obj.userInfo.courierUserId + "</label></br>";
    html += "<span><b>Merchant Mobile:</b></span></br>";
    html += "<label>" + obj.userInfo.mobile + "</label></br>";
    if (obj.bookingMobile !== "" && obj.bookingMobile !== null) {
        html += "<span style='color:red;'><b>Booking Mobile:</b></span></br>";
        html += "<label>" + obj.bookingMobile + "</label></br>";
    }
    html += "<span><b>Merchant Address:</b></span></br>";
    html += "<label>" + obj.userInfo.address + "</label></br>";
    //if (obj.userInfo.collectAddress !== null && obj.userInfo.collectAddress.trim() !== "") {
        html += "<span><b>Collection Address:</b></span></br>";
        html += "<label style='color:#4caf50;'>" + obj.userInfo.collectAddress + "</label></br>";
        if (obj.courierAddressContactInfo.collectThanaName !== "") {
            html += "<span><b>District:</b></span></br>";
            html += "<label>" + obj.courierAddressContactInfo.collectDistrictName + "</label></br>";
        }
        if (obj.courierAddressContactInfo.collectThanaName !== "") {
            html += "<span><b>Thana:</b></span></br>";
            html += "<label>" + obj.courierAddressContactInfo.collectThanaName + "</label></br>";
        }
    //}
    html += "<span><b>Retention Manager:</b></span></br>";
    html += "<label>" + obj.userInfo.retentionUser + "</label></br>";
    html += "<button type='button' class='btn btn-warning' onClick='FixSpecialCharacter(&#39;" + id + "&#39;)'>Fix Error</button></br>";
    //if (obj.riderInformation.deliveryUserId) {
    //    html += "<span><b>Assign Rider:</b></span></br>";
    //    html += "<label style='color:darkorchid;'>" + obj.riderInformation.riderName + " (" + obj.riderInformation.riderMobile + ")" + "</label>";
    //}
    
    if (obj.courierAddressContactInfo.merchantDeliveryDate != null) {
        html += "<span><b>Merchant DeliveryDate:</b></span></br>";
        html += "<label>" + obj.courierAddressContactInfo.merchantDeliveryDate + "</label></br>";
    }
    if (obj.courierAddressContactInfo.merchantCollectionDate != null) {
        html += "<span><b>Merchant CollectionDate:</b></span></br>";
        html += "<label>" + obj.courierAddressContactInfo.merchantCollectionDate + "</label></br>";
    }
    if (obj.courierPrice.officeDrop) {
        html += "<span><b>Office Drop:</b></span></br>";
        html += "<label style='color:#f44336;'>অফিস এ ড্রপ করতে চাই</label></br>";
    }
    if (obj.isConfirmedBy == 'deliveryman' || obj.isConfirmedBy == 'admin' && obj.riderInformation.deliveryUserId != 0) {
        html += "<button style='margin-top:5px;' type='button' class='btn btn-info' data-toggle='modal' data-target='#riderInfoModal' onClick='showRiderInfo(&#39;" + obj.riderInformation.deliveryUserId + "&#39;)'>Rider Info</button></br>";
    }
    if (obj.referrerformation.offerType != "") {
        html += "<span><b>Offer Type:</b></span></br>";
        html += "<label>" + obj.referrerformation.offerType + "</label></br>";
    }

    html += "</td>";

    //Customer Detail
    html += "<td>";
    html += "<span><b>Customer Name:</b></span></br>";
    html += "<label>" + obj.customerName + "</label></br>";
    html += "<span><b>Mobile:</b></span></br>";
    html += "<label>" + obj.courierAddressContactInfo.mobile + "</label></br>";
    if (obj.courierAddressContactInfo.otherMobile !== "" && obj.courierAddressContactInfo.otherMobile !== null) {
        html += "<span><b>Other Mobile:</b></span></br>";
        html += "<label>" + obj.courierAddressContactInfo.otherMobile + "</label></br>";
    }
    if (obj.courierAddressContactInfo.eDeshMobileNo !== "" && obj.courierAddressContactInfo.eDeshMobileNo !== null && obj.courierId == 32) {
        html += "<span style='color:#f44336;'><b>DC Mobile:</b></span></br>";
        html += "<label><b>" + obj.courierAddressContactInfo.eDeshMobileNo + "</b></label></br>";
    }
    html += "<span><b>Address:</b></span></br>";
    html += "<label>" + obj.courierAddressContactInfo.address + "</label></br>";
    html += "<span><b>District:</b></span></br>";
    html += "<label>" + obj.courierAddressContactInfo.districtName + "</label></br>";
    if (obj.courierAddressContactInfo.thanaName !== "") {
        html += "<span><b>Thana:</b></span></br>";
        html += "<label>" + obj.courierAddressContactInfo.thanaName + "</label></br>";
    }
    if (obj.courierAddressContactInfo.areaName !== "") {
        html += "<span><b>Area:</b></span></br>";
        html += "<label>" + obj.courierAddressContactInfo.areaName + " (" + obj.courierAddressContactInfo.areaPostalCode + ")" + "</label></br>";
    }
    if (obj.courierAddressContactInfo.assignedCourierId !== 0 || obj.courierAddressContactInfo.assignedExpressCourierId !== 0) {
        if (obj.courierAddressContactInfo.dtAdvanceCourierId !== 0 && obj.courierOrderInfo.deliveryRangeId == 8) { // Postal Delivery
            html += "<span><b>Assigned Postal Courier:</b></span></br>";
            html += "<label>" + GetCourierName(obj.courierAddressContactInfo.dtAdvanceCourierId) + "</label></br>";
        }
        else {
            if (obj.courierOrderInfo.paymentType.split(" ")[0].toLowerCase() === "regular") {
                html += "<span><b>Assigned Regular Courier:</b></span></br>";
                html += "<label>" + GetCourierName(obj.courierAddressContactInfo.assignedCourierId) + "</label></br>";
            }
            else {
                html += "<span><b>Assigned Express Courier:</b></span></br>";
                html += "<label>" + GetCourierName(obj.courierAddressContactInfo.assignedExpressCourierId) + "</label></br>";
            }
        }
    }

    if (obj.courierOrderInfo.activeForCoronaMsgThana !== "" || obj.courierOrderInfo.activeForCoronaMsgArea !== "") {

        html += "<span style='color:#f44336;'><b>" + obj.courierOrderInfo.activeForCoronaMsgThana + "</b></span></br>";
        html += "<span style='color:#f44336;'><b>" + obj.courierOrderInfo.activeForCoronaMsgArea + "</b></span></br>";
    }

    if (obj.documentUrl !== "" && obj.documentUrl !== null) {

        html += "<span><a href=" + obj.documentUrl + " target='_blank'><img style='max-height:100px; max-width:100px;' src=" + obj.documentUrl + "></a></span></br>";
    }
    html += "<span style='color:mediumblue;'>---DeliveryMan (Lastmile):---</span></br>";
    html += "<span><b>Delivery Man Name:</b></span></br>";
    html += "<label>" + obj.courierDeliveryManName + "</label></br>";
    html += "<span><b>Delivery Man Mobile:</b></span></br>";
    html += "<label>" + obj.courierDeliveryManMobile + "</label></br>";
    html += "<span><b>District Center:</b></span></br>";
    html += "<label>" + obj.districtCenter + "</label></br>";

    if (obj.courierAddressContactInfo.isDtOwnSecondMileDelivery && obj.courierOrderInfo.deliveryRangeId == 17 || obj.courierOrderInfo.deliveryRangeId == 18) {
        html += "<label style='color:#f44336;'>Shipment Will be by SA</label></br>";
    }
    html += "<span><b>Invoice Number:</b></span></br>";
    html += "<label id='invoiceNo'>" + obj.invoiceNumber + "</label></br>";

    html += "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#updateInvoiceNumberModal' onClick='showUpdateInvoiceNumber(&#39;" + obj.id + "&#39;)'>Update Invoice</button></br>";

    if (obj.isConfirmedBy) {
        html += "<span><b>Is ConfirmedBy:</b></span></br>";
        html += "<label id='isConfirmedBy'>" + obj.isConfirmedBy + "</label></br>";
    }
    
    html += "</td>";

    //Product Detail
    html += "<td>";
    html += "<span><b>Product(s):</b></span></br>";
    if (obj.courierOrderInfo.orderFrom == 'ad' && obj.userInfo.merchantAssignActive == true) {
        html += "<label>" + obj.courierOrderInfo.couponIds + "</label></br>";
    }
    else {
        html += "<label>" + obj.courierOrderInfo.collectionName + "</label></br>";
    }
    //courierOrderInfo.isOpenBox
    html += `<label>${obj.courierOrderInfo.isOpenBox == true ? "<b style='color:green;'>Open Box</b>" : ""}</label></br>`;
    html += "<span><b>Order Type:</b></span></br>";
    html += "<label>" + obj.courierOrderInfo.orderType + "</label></br>";
    html += "<span><b>Weight:</b></span></br>";
    html += `<label>${obj.courierOrderInfo.weight} ${obj.courierOrderInfo.productType == '' ? `` : `(${obj.courierOrderInfo.productType})`}</label></br>`;
    html += "<span><b>Payment Type:</b></span></br>";
    html += "<label>" + obj.courierOrderInfo.paymentType + "</label></br>";
    html += "</br>";
    html += "<span><b>Current Status:</b></span></br>";
    html += "<label>" + obj.status + "</label></br>";
    html += "<span><b>Updated On:</b></span></br>";
    html += "<label>" + obj.courierOrderDateDetails.updatedOnDate + "</label></br>";
    if (obj.comment !== null) {
        html += "<span><b>Comment:</b></span></br>";
        html += "<label>" + obj.comment + "</label></br>";
        html += "<span><b>HubName:</b></span></br>";
        html += "<label>" + obj.hubName + "</label></br>";
    }
    html += "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#showAllCommentsModal' onClick='ShowAllComments(&#39;" + id + "&#39;)'>All Comments</button></br>";

    html += "<button style='margin-top:5px;' type='button' class='btn btn-primary' data-toggle='modal' data-target='#showCustomCommentsModal' onClick='showCustomComment(&#39;" + id.slice(3) + "&#39;)'>Show Custom Comments</button></br>";

    html += "<span style='color:mediumblue;'>---Slotting Details---</span></br>";
    if (obj.startTime !== null && obj.startTime != "") {
        html += "<span><b>Start Time:</b></span></br>";
        html += "<label>" + obj.startTime + "</label></br>";
    }
    if (obj.endTime !== null && obj.endTime != "") {
        html += "<span><b>End Time:</b></span></br>";
        html += "<label>" + obj.endTime + "</label></br>";
    }
    if (obj.slotName !== null && obj.slotName != "") {
        html += "<span><b>Slot Name:</b></span></br>";
        html += "<label>" + obj.slotName + "</label></br>";
    }
    if (obj.collectionTime !== null && obj.collectionTime != "") {
        html += "<span><b>Collection Time:</b></span></br>";
        html += "<label>" + obj.collectionTime + "</label></br>";
    }

    html += "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#addCustomCommentModal' onClick='CustomComment(&#39;" + id.slice(3) + "&#39;,&#39;" + obj.statusId + "&#39;)'>Add Custom Comment</button></br>";
    if (obj.quickOrderImageUrl !== "" && obj.quickOrderImageUrl !== null) {
        html += "<span style='color:mediumblue;'>---InstaCOD ImageUrl:---</span></br>";
        html += "<span><a href=" + obj.quickOrderImageUrl + " target='_blank'><img style='max-height:100px; max-width:100px;' src=" + obj.quickOrderImageUrl + "></a></span></br>";
    }
    html += "</td>";
    return html;
};

function EditDeliveryCharge() {
    var isDisabled = $('#DeliveryChargeId').prop('disabled');
    if (isDisabled) {
        $("#DeliveryChargeId").prop('disabled', false);
        document.getElementById('updateDeliveryChargeBtn').style.display = 'block';
    }
    else {
        $("#DeliveryChargeId").prop('disabled', true);
        document.getElementById('updateDeliveryChargeBtn').style.display = 'none';
    }
}

function UpdateDeliveryCharge(id, previousCharge, courierUserId) {
    var deliveryCharge = $("#DeliveryChargeId").val();
    //console.log(obj);
    var orderId = 'DT-'+id;
    //var url = 'http://localhost:58676/api/Update/UpdateDeliveryChargeFromOperation/' + orderId;
    var url = apiBaseURL + "Update/UpdateDeliveryChargeFromOperation/" + orderId;

    if (+deliveryCharge == previousCharge) {
        loadOrderDetails();
        return false;
    }

    Obj = {
        DeliveryCharge: deliveryCharge
    };

    let json = JSON.stringify(Obj);

    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.responseJSON.model != '' || response.responseJSON.model != null) {
                //console.log(response.responseJSON.model);
                //$("#DeliveryChargeId").prop('disabled', true);
                //document.getElementById('updateDeliveryChargeBtn').style.display = 'none';
                let notification = "আপনার অর্ডার dt-code এর ডেলিভার চার্জ previous টাকা হতে current টাকা এ পরিবর্তন হয়েছে";
                let notificationModel = {
                    notificationType: 0,
                    serviceType: "collection",
                    title: "ডেলিভার চার্জ পরিবর্তন হয়েছে",
                    description: notification.replace("dt-code", orderId).replace("previous", previousCharge).replace("current", deliveryCharge)
                }

                SendPushNotification(courierUserId , notificationModel);
                loadOrderDetails();
            }
            else {
                alert("Error.");
                return false;
            }
        }
    });


}



const SendPushNotification = (courierUserId, notificationModel) => {

    let url = apiBaseURL + "Order/SendPushNotification/" + courierUserId;

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(notificationModel),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            console.log('Notification Status: ' + response.model);

            if (response.model) {
                alert('Notification Sent to Merchant');
            }
        },
        error: function () {
            console.log('something went wrong');
        }
    });

}



const FixSpecialCharacter = orderId => {
    let url = apiBaseURL + "Update/FixSpecialCharacter/" + orderId;
    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response.model > 0) {
                alert("Fix Error.");
                loadOrderDetails();
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
};

const ShowAllComments = orderId => {
    let url = apiBaseURL + "Fetch/OrderUpdateHistory/" + orderId;
    $.ajax({
        beforeSend: function () {
            document.getElementById('showAllCommentsModalBody').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawShowAllCommentsDetails(response.model);
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
const DrawShowAllCommentsDetails = data => {
    let html = "";
    let count = 1;
    if (data.length != 0) {
        document.getElementById('showAllCommentsModalHeader').innerHTML = "All Comments of : " + data[0].courierOrderId;
        html += "<div class='modal-body col-md-12' style='float:left;padding:5px 0px 0px 0px'>";
        html += "<table class='table' style='border:1px solid black'>";
        html += "<tr style='border:1px solid lightgray'>";
        html += "<th style='text-align:center;Width:5%;border:1px solid lightgray;background-Color:steelblue;color:white;'>No.</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Commented By</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Commented On</th>";
        html += "<th style='text-align:center;Width:10%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Status</th>";
        html += "<th style='text-align:center;Width:35%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Comment</th>";
        html += "<th style='text-align:center;Width:35%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Hub</th>";
        html += "<th style='text-align:center;Width:35%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Delivery Man Name</th>";
        html += "<th style='text-align:center;Width:35%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Delivery Man Mobile</th>";
        html += "</tr>";

        $.each(data, function (i, row) {
            html += "<tr style='border:1px solid lightgray'>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + count + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.namePostedBy + " (" + row.isConfirmedBy + ")</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.postedOn + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.status + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.comment + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.hubName + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + (row.courierDeliveryManName != null ? row.courierDeliveryManName: '') + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + (row.courierDeliveryManMobile != null ? row.courierDeliveryManMobile: '') + "</td>";
            html += "</tr>";
            count++;
        });
    }
    else {
        html = "There are No Comments Of This Order";
    }
    document.getElementById('showAllCommentsModalBody').innerHTML = html;
}
const Popup = data => {
    let mywindow = window.open('', 'my div', 'height=500,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus();

    mywindow.print();
    mywindow.close();
    return true;
}
const GetAdUsers = (selectTagId, selectedValue, retentionUserId, selectRetentionTagId) => {
    let userId = parseInt($("#UserHidden").val());
    const allowedUsers = [100, 214, 442];
    let userAdminType = parseInt(sessionStorage.getItem("adminType"));
    let url = apiBaseURL + "Fetch/GetAdUsers";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                $("#" + selectTagId + "").empty();
                $("#" + selectTagId + "").append('<option value="0">Select Acqusition Manager</option>');
                $.each(response.model, function (i, user) {
                    $("#" + selectTagId + "").append('<option value="' + user.userId + '">' + user.fullName + '</option>');
                });
                if (selectedValue != null) {
                    $("#" + selectTagId + " option").prop('selected', false)
                        .filter("[value='" + selectedValue + "']")
                        .prop('selected', true);
                }
                $("#" + selectTagId).prop('disabled', true);
                if (allowedUsers.includes(userId) || userAdminType == 11 || selectedValue == 0) {
                    $("#" + selectTagId).prop('disabled', false);
                }

                let retentionManagerList = response.model.filter(x => x.isRetention == true);
                $("#" + selectRetentionTagId + "").empty();
                $("#" + selectRetentionTagId + "").append('<option value="0">Select Retention Manager</option>');
                $.each(retentionManagerList, function (i, retentionusers) {
                    $("#retentionManager").append('<option value="' + retentionusers.userId + '">' + retentionusers.fullName + '</option>');
                });

                if (retentionUserId != null) {
                    $("#" + selectRetentionTagId + " option").prop('selected', false)
                        .filter("[value='" + retentionUserId + "']")
                        .prop('selected', true);
                }
                $("#" + selectRetentionTagId).prop('disabled', true);
                if (allowedUsers.includes(userId) || userAdminType == 11 || retentionUserId == 0) {
                    $("#" + selectRetentionTagId).prop('disabled', false);
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
const ConvertNumberToWord = num => {
    var a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
        "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    var b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = 'Taka ';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? ' And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' Only ' : '';
    return str;
}
const GetCourierName = value => {
    if (value == "0") {
        return "Unknown";
    }
    if (value == "3") {
        return "E-Courier";
    }
    else if (value == "4") {
        return "SA Paribahan";
    }
    else if (value == "5") {
        return "Sundarban Courier";
    }
    else if (value == "20") {
        return "I Express ";
    }
    else if (value == "21") {
        return "Merchant Payable";
    }
    else if (value == "22") {
        return "Pathao";
    }
    else if (value == "26") {
        return "Biddyut";
    }
    else if (value == "27") {
        return "NRB Express";
    }
    else if (value == "23") {
        return "Go Go Bangla";
    }
    else if (value == "28") {
        return "Bangladesh Postal Service";
    }
    else if (value == "30") {
        return "Paperfly";
    }
    else if (value == "31") {
        return "Parija Courier";
    }
    else if (value == "32") {
        return "E-Desh Courier";
    }
    else if (value == "34") {
        return "Redx";
    }
    else if (value == "35") {
        return "Delivery Bondhu";
    }
    else if (value == "49") {
        return "Steadfast Courier";
    }
    else if (value == "50") {
        return "Chittagong Tiger";
    }
    else if (value == "51") {
        return "Sylhet Tiger";
    }
    else if (value == "52") {
        return "Khulna Tiger";
    }
    else if (value == "53") {
        return "Narayangonj Tiger";
    }
    else if (value == "54") {
        return "Gazipur Tiger";
    }
    else if (value == "55") {
        return "Dhaka Tiger";
    }
    else if (value == "56") {
        return "Coxsbazar Tiger";
    }
    else if (value == "57") {
        return "Jatrabari Tiger";
    }
    else if (value == "58") {
        return "Uttara Tiger";
    }
    else if (value == "59") {
        return "Mirpur10 Tiger";
    }
    else if (value == "60") {
        return "Mirpur01 Tiger";
    }
    else if (value == "61") {
        return "Lalmatia Tiger";
    }
    else if (value == "62") {
        return "NewMarket Tiger";
    }
    else if (value == "63") {
        return "Islampur Tiger";
    }
    else if (value == "64") {
        return "Santinagar Tiger";
    }
    else if (value == "65") {
        return "Gulisthan Tiger";
    }
    else if (value == "66") {
        return "Jatrabari Tiger";
    }
    else if (value == "66") {
        return "Rampura Tiger";
    }
    else if (value == "67") {
        return "Badda Tiger";
    }
    else if (value == "69") {
        return "KawranBazar Tiger";
    }
    else if (value == "75") {
        return "Savar Tiger";
    }
    else {
        return "";
    }
}
const removeLastComma = textData => {
    //let text = textData.trim();
    //if (text[text.length - 1] == ",") {
    //    return text.slice(0, text.length - 1);
    //}
    //else {
    //    return text;
    //}
    var output = input.replace(/,\s*$/, "");;
    while (output.slice(-1) == ",") {
        output = output.replace(/,\s*$/, "");
    }
    return output;
}
const CreateExcelSheet = divName => {
    window.open('data:application/vnd.ms-excel,' + escape($('#' + divName).html()));
    e.preventDefault();
}
const fixString = input => {
    let output = input.replace(/(\r\n|\n|\r)/gm, ""); //remove line breaks
    output = output.replace(/ +(?= )/g, ''); // remove multiple spaces
    output = output.replace('\t', ''); // remove tab
    return output;
}
const scrollToTop = () => {
    window.scrollTo(0, 0);
}

let DTtoADStatusUpdate = (courierOrdersId, statusId,Comments) => {

    let comments = Comments.replace(/[-$\d]/gm, '');

    let obj = {
        PODnumber: courierOrdersId,
        CourierId: 33,
        StatusId: +statusId,
        Comments: comments,
        CourierDeliveryManName: "",
        CourierDeliveryManMobile: ""
    }


    let url = admBaseUrl + "Update/UpdatePODwiseADcode";

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(obj),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (response.MessageText == 'success') {
                console.log('Update AD was successful');
            }
            else {
                console.log('Update AD was unsuccessful');
            }
        },
        error: function (msg) {
            console.log('Update AD was failed');
        }
    });

}




let SmsService = (smsObjList) => {

    let url = apiBaseURL + 'SmsComunication/SendSms';

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(smsObjList),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            alert('SMS Sent Successful');
            console.log('SMS Sent Successful');
        },
        error: function (error) {
            console.log('SMS Sent Unsuccessful');
        }
    });
}


let EmailService = (emailTo, mailBody, emailSub, flag) => {

    let obj = {
        "MailTo": emailTo,
        "MailFrom": "complain@ajkerdeal.com",
        "MailBody": mailBody,
        "MailSubject": emailSub,
        "Flag": flag
    }


    //let url = 'http://localhost:15332/api/' + 'Complain/Mail/SendMailForCommon';
    let url = admBaseUrl + 'Complain/Mail/SendMailForCommon';

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            if (response) {
                //alert('Mail send successful');
                console.log('Mail Send Successful');
            }
        },
        error: function (error) {
            console.log("Mail send unsuccessful");
        }
    });
}

const showRiderInfo = bondhuId => {
    let url = apiBaseURL + "Bondhu/GetBondhuInfo/" + bondhuId;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {

                $("#riderName").val(response.model.name);
                $("#riderMobile").val(response.model.mobile);
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

const CustomComment = (orderId, statusId) => {
    $("#addCustomCommentButton").attr("onclick", `AddCustomComment(${orderId},${statusId})`);
}

const AddCustomComment = (orderId, statusId) => {

    let comment = $("#addCustomComment").val();
    let userId = sessionStorage.getItem("userId");
    let obj = {
        OrderId: orderId,
        Comment: comment,
        PostedBy: userId,
        StatusId: statusId
    }
    let url = apiBaseURL + "Entry/AddCustomComment";
    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                alert("Comment Added Successfully...!");
                //$("#addCustomCommentModal").modal("hide");
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

const showCustomComment = (orderId) => {
    let url = apiBaseURL + "Fetch/GetAllCustomComment/" + orderId;
    $.ajax({
        beforeSend: function () {
            document.getElementById('showCustomCommentsModalBody').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawShowCustomCommentsDetails(response.model);
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
const DrawShowCustomCommentsDetails = data => {
    let html = "";
    let count = 1;
    if (data.length != 0) {
        document.getElementById('showCustomCommentsModalHeader').innerHTML = "All Comments of : " + data[0].orderId;
        html += "<div class='modal-body col-md-12' style='float:left;padding:5px 0px 0px 0px'>";
        html += "<table class='table' style='border:1px solid black'>";
        html += "<tr style='border:1px solid lightgray'>";
        html += "<th style='text-align:center;Width:5%;border:1px solid lightgray;background-Color:steelblue;color:white;'>No.</th>";
        html += "<th style='text-align:center;Width:10%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Order Id</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Posted On</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Comment</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Status</th>";
        html += "<th style='text-align:center;Width:25%;border:1px solid lightgray;background-Color:steelblue;color:white;'>Posted By</th>";
        html += "</tr>";

        $.each(data, function (i, row) {
            html += "<tr style='border:1px solid lightgray'>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + count + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.orderId + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.postedOn + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.comment + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.statusNameEng + "</td>";
            html += "<td style='text-align:center;border:1px solid lightgray'>" + row.fullName + " (" + row.isConfirmedBy + ")</td>";
            html += "</tr>";
            count++;
        });
    }
    else {
        html = "There are No Comments Of This Order";
    }
    document.getElementById('showCustomCommentsModalBody').innerHTML = html;
};

