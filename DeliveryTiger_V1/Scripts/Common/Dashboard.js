/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/datatables/datatables.bootstrap4.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />
/// <reference path="../plugins/datatables/datatables.min.js" />

//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
//var localBaseURL = "http://localhost:58676/api/"; //local

var CurrentReportCount = 0;
var CurrentReportList = [];
var LogReportCount = 0;
var LogReportList = [];

const generateDashboardReport = async (statusList, fromDate, toDate) => {

    $("#dashboardFirstDiv").hide();
    $("#dashboardCurrentReportDiv").show();
    $("#dashboardLogReportDiv").show();
    await loadDashboardData([0, 1, 3, 7, 8, [9, 10], 11, 19, 20], "1/1/2001", "1/1/2001", "dashboardCurrentReportDivBody", CalculateDashboardCurrentReport);
    await loadDashboardData([0, 1, 3, 7, 8, [9, 10], 11, 19, 20], getToday(), getTomorrow(), "dashboardLogReportDivBody", CalculateDashboardLogReport);
}
const loadLogReportData = async() => {
    let fromDate = "";
    let toDate = "";
    $("#fromDate").val() === "" ? fromDate = "01-01-01" : fromDate = $("#fromDate").val();
    $("#toDate").val() === "" ? toDate = "01-01-01" : toDate = $("#toDate").val();
    $("#dashboardLogReportDivHeader").html(`From ${fromDate} To ${toDate}`);
    $("#logReportEditorModal .close").click();
    $('.modal-backdrop').css('z-index', '0px');
    $('.modal-backdrop').css('position', 'relative');
    await loadDashboardData([0, 1, 8, [9, 10], 19, 20, 21], fromDate, toDate, "dashboardLogReportDivBody", CalculateDashboardLogReport);
}
const statusArrayBuilder = x => {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        if (x[i][0] == undefined) {
            y = [...y, x[i]];
        } else {
            for (let j = 0; j < x[i].length; j++) {
                y = [...y, x[i][j]];
            }
        }
    }
    return y;
}
const getToday = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = mm + '/' + dd + '/' + yyyy; 
    return today.toString();
}
const getTomorrow = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let thirtyOneDaysMonths = [1, 3, 5, 8, 10, 12];

    if (dd + 1 == 31) {
        if (thirtyOneDaysMonths.includes(mm)) {
            dd++;
        }
        else {
            dd = 1;
            mm++;
        }
    }
    else {
        dd++;
    }
    if (mm == 2) {
        if (dd==28) {
            dd = 1;
            mm++;
        }
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let tomorrow = mm + '/' + dd + '/' + yyyy;
    return tomorrow.toString();
}
const loadDashboardData = (status, fromDate, toDate, dataDiv,callback) => {
    let statusList = statusArrayBuilder(status);
    let count = 1000;

    let Obj = {
        StatusList: statusList,
        Status: -1,
        FromDate: fromDate,
        ToDate: toDate,
        OrderIds: "",
        courierUserId: -1,
        podNumber: "",
        Index: 0,
        Count: count
    };

    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Fetch/LoadCourierReport";
    $.ajax({
        beforeSend: function () {
            if (dataDiv !== "") {
                let html = `<div style='padding-left:45%;'>${loaderHtml}</div>`;
                document.getElementById(dataDiv).innerHTML = html;
            }
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
                    console.log(response.responseJSON.model);
                    return callback(status, dataDiv,response.responseJSON.model);
                }
            }
            else {
                alert("Error.");
                return false;
            }
        }
    });
}
const CalculateDashboardCurrentReport = (statusArray, dataDiv, data) => {
    CurrentReportCount = data.totalCount;
    CurrentReportList = data.courierOrderViewModel;

    let StatusNameList = [];
    let StatusWiseCurrentDataDetailsList = [];
    let StatusWiseCurrentDataCountsList = [];


    for (let i = 0; i < statusArray.length; i++) {
        if (statusArray[i][0] == undefined) {
            let statusWiseData = CurrentReportList.filter(dataObject => dataObject.statusId == statusArray[i]);
            StatusWiseCurrentDataDetailsList = [...StatusWiseCurrentDataDetailsList, statusWiseData];
            StatusWiseCurrentDataCountsList = [...StatusWiseCurrentDataCountsList, statusWiseData.length];
            $.each(AllStatusGroupWiseData, (j, statusGroup) => {
                $.each(statusGroup.status, (k, status) => {
                    if (status.statusId === statusArray[i]) {
                        StatusNameList = [...StatusNameList, status.statusNameEng];
                    }
                });
            });
        }
        else {
            let statusWiseData = CurrentReportList.filter(dataObject => statusArray[i].includes(dataObject.statusId));
            StatusWiseCurrentDataDetailsList = [...StatusWiseCurrentDataDetailsList, statusWiseData];
            StatusWiseCurrentDataCountsList = [...StatusWiseCurrentDataCountsList, statusWiseData.length];
            $.each(AllStatusGroupWiseData, (j, statusGroup) => {
                $.each(statusGroup.status, (k, status) => {
                    if (status.statusId === statusArray[i][0]) {
                        StatusNameList = [...StatusNameList, statusGroup.fulfillmentStatusGroup];
                    }
                });
            });
        }
    }
    DrawDashboardReport(dataDiv,statusArray, StatusNameList, StatusWiseCurrentDataCountsList, StatusWiseCurrentDataDetailsList);
}
const DrawDashboardReport = (dataDiv,statusArray, StatusNameList, StatusWiseCurrentDataCountsList, StatusWiseCurrentDataDetailsList) => {
    console.log(statusArray);
    console.log(StatusNameList);
    console.log(StatusWiseCurrentDataCountsList);
    console.log(StatusWiseCurrentDataDetailsList);
    let html = "";
    for (let i = 0; i < statusArray.length; i++) {
        //#c1e7ff -- kinda blue
        //#d4fff6 -- kinda green
        let cardBackgroundColor = dataDiv.includes("Log") ? "#d4fff6" : "#c1e7ff";
        html += `<div class='col-lg-3 tooltip-demo'>
                    <div class='widget style1 box-shadow' style='background-color: ${cardBackgroundColor}' data-toggle='tooltip' data-placement='top' title='Status: ${statusArray[i]}'>
                        <div class='col-lg-12'>
                            <small style='font-weight:400;'>${StatusNameList[i]}</small>
                            <h2 class='no-margins text-navy'>${StatusWiseCurrentDataCountsList[i]}</h2>
                        </div>
                    </div>
                </div>`;
    }
    $("#" + dataDiv).html(html);
}
const CalculateDashboardLogReport = (statusArray,dataDiv,data) => {
    LogReportCount = data.totalCount;
    LogReportList = data.courierOrderViewModel;

    let StatusNameList = [];
    let StatusWiseCurrentDataDetailsList = [];
    let StatusWiseCurrentDataCountsList = [];


    for (let i = 0; i < statusArray.length; i++) {
        if (statusArray[i][0] == undefined) {
            let statusWiseData = LogReportList.filter(dataObject => dataObject.logStatusId == statusArray[i]);
            StatusWiseCurrentDataDetailsList = [...StatusWiseCurrentDataDetailsList, statusWiseData];
            StatusWiseCurrentDataCountsList = [...StatusWiseCurrentDataCountsList, statusWiseData.length];
            //StatusNameList = [...StatusNameList, statusWiseData.length === 0 ? "Un" : statusWiseData[0].LogStatus];
            $.each(AllStatusGroupWiseData, (j, statusGroup) => {
                $.each(statusGroup.status, (k, status) => {
                    if (status.statusId == statusArray[i]) {
                        StatusNameList = [...StatusNameList, status.statusNameEng];
                    }
                });
            });
        }
        else {
            let statusWiseData = LogReportList.filter(dataObject => statusArray[i].includes(dataObject.logStatusId));
            StatusWiseCurrentDataDetailsList = [...StatusWiseCurrentDataDetailsList, statusWiseData];
            StatusWiseCurrentDataCountsList = [...StatusWiseCurrentDataCountsList, statusWiseData.length];
            $.each(AllStatusGroupWiseData, (j, statusGroup) => {
                $.each(statusGroup.status, (k, status) => {
                    if (status.statusId == statusArray[i][0]) {
                        StatusNameList = [...StatusNameList, statusGroup.fulfillmentStatusGroup];
                    }
                });
            });
        }
    }
    DrawDashboardReport(dataDiv, statusArray, StatusNameList, StatusWiseCurrentDataCountsList, StatusWiseCurrentDataDetailsList);
}