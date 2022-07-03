//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger

const loadDailyOrderShipmentDetails = async() => {
    let fromDate = "";
    let toDate = "";
    let status = "";

    $("#fromDate").val() === "" ? fromDate = "01-01-01" : fromDate = $("#fromDate").val();
    $("#toDate").val() === "" ? toDate = "01-01-01" : toDate = $("#toDate").val();

    status = $("#StatusList option:selected").val();

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
    if (fromDate === "01-01-01" && toDate === "01-01-01" && status === "-1") {
        alert("Please Input Status.");
        $("#orderId").focus();
        return false;
    }

    let index = 0;
    let count = 10000;

    let statusArray = status.split(",");
    let statusList = [];
    for (let i = 0; i < statusArray.length; i++) {
        statusList.push(parseInt(statusArray[i]));
    }

    let Obj = {
        StatusList: statusList,
        Status: "-1",
        FromDate: fromDate,
        ToDate: toDate,
        OrderIds: "",
        courierUserId: -1,
        podNumber: "",
        Index: index,
        Count: count
    };
    $("#dailyOrderShipmentCourierCount").show();
    let html = `<div style='padding-left:45%;'>${loaderHtml}</div>`;
    document.getElementById('dailyOrderShipmentCourierCountDiv').innerHTML = html;
    await loadCurrentReportData(Obj,"",DrawDailyOrdershipmentCourierCount);
}
const loadCurrentReportData = (data,dataDiv,callback) => {
    let json = JSON.stringify(data);
    let url = apiBaseURL + "Fetch/LoadCourierOrder";
    $.ajax({
        beforeSend: function () {
            if (dataDiv !== "") {
                document.getElementById(dataDiv).innerHTML = loaderHtml;
            }
        },
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        async: true,
        data: json,
        complete: function (response) {
            if (response.readyState === 4) {
                if (response.status === 200) {
                    console.log(response.responseJSON.model);
                    return callback(response.responseJSON.model);
                }
            }
            else {
                alert("Error.");
                return false;
            }
        }
    });
}
const DrawDailyOrdershipmentCourierCount = (data) => {
    let totalCountHtml = `${$("#StatusList option:selected").text()}`;
    totalCountHtml += `<span class='label label-primary' style='margin:5px 0px 0px 10px;font-size:12px;'>${data.totalCount}</span></label>`;
    $("#dailyOrderShipmentCourierCountHeader").html(totalCountHtml);

    let allCourierIds = [];
    $.each(data.courierOrderViewModel, function (i, obj) {
        allCourierIds = [...allCourierIds, obj.courierId];
    });
    let uniqueCourierIds = [...new Set(allCourierIds)];

    let uniqueCourierNames =[];
    for (let i = 0; i < uniqueCourierIds.length; i++) {
        uniqueCourierNames = [...uniqueCourierNames, GetCourierName(uniqueCourierIds[i])];
    }

    let courierWiseOrderCountList = [];
    let courierWiseOrderDetailList = [];
    $.each(uniqueCourierIds, function (i, courierId) {
        let uniqueCourierData = data.courierOrderViewModel.filter(dataObject => dataObject.courierId == courierId);
        courierWiseOrderDetailList = [...courierWiseOrderDetailList, uniqueCourierData];
        courierWiseOrderCountList = [...courierWiseOrderCountList, uniqueCourierData.length];
    });

    console.log(uniqueCourierIds);
    console.log(uniqueCourierNames);
    console.log(courierWiseOrderCountList);
    console.log(courierWiseOrderDetailList);

    let html = "";
    for (let i = 0; i < uniqueCourierIds.length; i++) {
        let dataString = JSON.stringify(courierWiseOrderDetailList[i]).replace(/\s{2,}/g, ' ').replace(/'/g, '');
        html += `<div class='col-lg-3' onClick='DrawDailyOrderShipmentDetails(&#39;${dataString}&#39;)'>
                    <div class='widget style1 box-shadow'>
                        <div class='col-lg-12'>
                            <h5 class='m-b-xs' style='font-weight:400;'>${uniqueCourierNames[i]}</h5>
                            <h2 class='no-margins text-navy'>${courierWiseOrderCountList[i]}</h2>
                        </div>
                    </div>
                </div>`;
    }
    $("#dailyOrderShipmentCourierCountDiv").html(html);
}
const DrawDailyOrderShipmentDetails = (data) => {
    data = fixString(data);
    data = JSON.parse(data);
    $("#dailyOrderShipmentDetail").show();
    document.getElementById('dailyOrderShipmentDetailDiv').innerHTML = loaderHtml;
    
    let totalCourierCharge = 0.00;


    let html = "";
    html += `<table class='table table-bordered' id='dailyOrdershipmentDetailsTable'>`;
    html += `<thead>`;
    html += `<tr>`;
    html += `<th>No.</th>`;
    html += `<th>Order Id</th>`;
    html += `<th>Customer Info</th>`;
    html += `<th>District</th>`;
    html += `<th>Customer Mobile</th>`;
    html += `<th>Customer Address</th>`;
    html += `<th>Postal Code</th>`;
    html += `<th>Cash To Collect</th>`;
    if (data[0].courierId == 28) {
        html += `<th>Courier Charge</th>`;
    }
    html += `<th>POD Number</th>`;
    html += `<th>Hub Name</th>`;
    if (data[0].courierId == 34) {
        html += `<th>Redx Hub Name</th>`;
    }
    
    html += `</tr>`;
    html += `</thead>`;
    html += `<tbody>`;
    let count = 1;
    $.each(data, function (i, obj) {
        html += `<tr>`;
        html += `<td>${count}</td>`;
        html += `<td>${obj.courierOrdersId}</td>`;
        html += `<td>${obj.customerName}</td>`;
        html += `<td>${obj.courierAddressContactInfo.districtNameEng}</td>`;
        html += `<td>${obj.courierAddressContactInfo.mobile}${obj.courierAddressContactInfo.otherMobile == "" || null ? "" :", "+obj.courierAddressContactInfo.otherMobile}</td>`;
        html += `<td>${obj.courierAddressContactInfo.address}</td>`;
        html += `<td>${obj.courierAddressContactInfo.areaPostalCode == 0 ? obj.courierAddressContactInfo.thanaPostalCode: obj.courierAddressContactInfo.areaPostalCode}</td>`;
        html += `<td>${obj.courierPrice.collectionAmount}</td>`;
        if (obj.courierId == 28) {
            html += `<td>${obj.courierPrice.courierCharge}</td>`;
            totalCourierCharge += parseFloat(obj.courierPrice.courierCharge);
        }
        html += `<td>${obj.podNumber == "" || null ? "" : obj.podNumber}</td>`;
        html += `<td>${obj.hubName == "" || null ? "" : obj.hubName}</td>`;
        if (obj.courierName == 'Redx') {
            html += `<td>${obj.courierAddressContactInfo.redxHubName}</td>`;
        }
        
        html += `</tr>`;
        count++;
    });
    html += `</tbody>`;
    html += `</table>`;

    let totalCountHtml = `${$("#StatusList option:selected").text()} Of ${data[0].courierName}`;
    totalCountHtml += `<span class='label label-primary' style='margin-top:5px;font-size:12px;'>${data.length}</span></label>`;
    if (data[0].courierId == 28 && totalCourierCharge>0) {
        totalCountHtml += `<span class='label label-success' style='margin-top:5px;font-size:12px;margin-left:10px;'>Total Courier Charge: ${totalCourierCharge.toFixed(2)}</span>`;
    }
    $("#dailyOrderShipmentDetailHeader").html(totalCountHtml);

    document.getElementById('dailyOrderShipmentDetailDiv').innerHTML = html;
}