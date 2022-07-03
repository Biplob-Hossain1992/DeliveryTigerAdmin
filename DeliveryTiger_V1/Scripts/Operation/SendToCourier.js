/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />

//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger

//Scan 
$(function () {
    $("#scanText").focus();
    var value = "";
    $("#scanText").keydown(function (e) {
        if (e.which == 17 || e.which == 74) {
            e.preventDefault();
            value = document.getElementById('scanText').value;
            if (value != 0) {
                loadOrderForSendToCourier();
            }
            else {
                console.log(e.which);
            }
        }
    });
});
const loadOrderForSendToCourier = () => {

    let status = -1;
    let statusList = [-1];
    let statusGroup = ["-1"];
    let fromDate = "1/1/2001";
    let toDate = "1/1/2001";
    let courierUserId = -1;
    let podNumber = "";
    let orderIds = "";
    let collectionName = "";
    let index = 0;
    let count = 20;
    let mobile = "";
    let districtIds = [
        -1
    ];
    let districtGroupName = "Select City / Sadar";
    let courierId = 0;
    let districtId = 0;
    let thanaId = 0;
    let areaId = 0;
    let paymentType = "-1";


    if ($("#scanText").val() === "") {
        return false;
    }
    else if ($("#scanText").val().length < 4) {
        return false;
    }
    else {
        if ($("#scanText").val().split("-")[0].toLowerCase() === "dt") {
            orderIds = $("#scanText").val();
        }
        else {
            podNumber = $("#scanText").val();
        }
    }

    let Obj = {
        status: parseInt(status),
        statusList: statusList,
        statusGroup: statusGroup,
        fromDate: fromDate,
        toDate: toDate,
        courierUserId: courierUserId,
        podNumber: podNumber,
        orderIds: orderIds,
        collectionName: collectionName,
        index: index,
        count: count,
        mobile: mobile,
        districtIds: districtIds,
        districtGroupName: districtGroupName,
        courierId: courierId,
        districtId: districtId,
        thanaId: thanaId,
        areaId: areaId,
        paymentType: paymentType
    };


    let json = JSON.stringify(Obj);
    //let url = apiBaseURL + "Fetch/LoadCourierOrder";
    let url = apiBaseURL + "Fetch/LoadOrders";

    $.ajax({
        beforeSend: function () {
            //document.getElementById('orderDetailTable').innerHTML = loaderHtml;
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
                    let obj = response.responseJSON.model.courierOrderViewModel[0];
                    let status = 10;
                    let statusText = "UnPaid Order Given to courier";
                    //console.log(obj);
                    if (parseInt(obj.statusId) === 8) {
                        if (obj.statusType.toLowerCase() == "unpaid") {
                            UpadateOrderStatus(JSON.stringify(obj), status, statusText);
                            document.getElementById("scanText").value = "";
                        }
                        else {
                            status = 9;
                            statusText = "Paid Order Given to courier";
                            UpadateOrderStatus(JSON.stringify(obj), status, statusText);
                            document.getElementById("scanText").value = "";
                        }
                    }
                    else {
                        alert("Package The Product First.")
                    }
                }
            }
            else {
                alert("Error.");
                return false;
            }
        }
    });
}