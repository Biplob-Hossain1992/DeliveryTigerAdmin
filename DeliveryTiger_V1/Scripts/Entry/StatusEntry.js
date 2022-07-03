/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/datatables/datatables.bootstrap4.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />
/// <reference path="../plugins/datatables/datatables.min.js" />

//var apiBaseURL = "http://coreapi.ajkerdeal.com/api/"; //live
//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
const loaderHtml = `<div class="spiner-example"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div> <div class="sk-rect2"></div> <div class="sk-rect3"></div> <div class="sk-rect4"></div> <div class="sk-rect5"></div> </div></div>`;

//-- Status Entry --//

//Load Status
const loadAllStatusList = () => {
    let url = apiBaseURL + "Fetch/LoadCourierOrderStatus";
    $.ajax({
        beforeSend: function () {
            document.getElementById('statusListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawStatusListDetails(response.model);
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
const DrawStatusListDetails = data => {
    var html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="StatusDatatable" aria-describedby="StatusDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    //html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width:3%;">No.</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 5%;">Id</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 20%;">Status Eng</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 20%;">Status Bng</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 8%;">Report Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 8%;">Fulfillment Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 8%;">Tracking Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 8%;">Public Tracking Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 8%;">Dashboard Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 5%;">Type</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Thana: activate to sort column descending" style="width: 10%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    var count = 1;
    $.each(data, function (i, obj) {
        if (obj.statusId >= 0) {
            let id = obj.statusId;
            var evenOddClass = count % 2 === 0 ? "even" : "odd";
            html += "<tr class='gradeA " + evenOddClass + "' role='row'>";

            html += "<td style='text-align:center'>" + obj.statusId + "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='statusEngLblEdit" + id + "' style='display:block;'>" + obj.statusNameEng + "</label>";
            html += "<input type='text' id='statusEngInputField" + id + "' style='display:none;' value='" + obj.statusNameEng + "' class=form-control />";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='statusBngLblEdit" + id + "' style='display:block;'>" + obj.statusNameBng + "</label>";
            html += "<input type='text' id='statusBngInputField" + id + "' style='display:none;' value='" + obj.statusNameBng + "' class=form-control />";
            html += "</td>";


            html += "<td style='text-align:center'>";
            html += "<label id='reportStatusGroupLblEdit" + id + "' style='display:block;'>" + obj.statusGroup + "</label>";
            html += "<input type='hidden' id='reportStatusGroupHiddenField" + id + "' value='" + obj.statusGroup + "' />";
            html += "<select id='reportStatusGroup" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='fulfillmentStatusGroupLblEdit" + id + "' style='display:block;'>" + obj.fulfillmentStatusGroup + "</label>";
            html += "<input type='hidden' id='fulfillmentStatusGroupHiddenField" + id + "' value='" + obj.fulfillmentStatusGroup + "' />";
            html += "<select id='fulfillmentStatusGroup" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";


            html += "<td style='text-align:center'>";
            html += "<label id='orderTrackingStatusGroupLblEdit" + id + "' style='display:block;'>" + obj.orderTrackStatusGroup + "</label>";
            html += "<input type='hidden' id='orderTrackingStatusGroupHiddenField" + id + "' value='" + obj.orderTrackStatusGroup + "' />";
            html += "<select id='orderTrackingStatusGroup" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='publicOrderTrackingStatusGroupLblEdit" + id + "' style='display:block;'>" + obj.orderTrackStatusPublicGroup + "</label>";
            html += "<input type='hidden' id='publicOrderTrackingStatusGroupHiddenField" + id + "' value='" + obj.orderTrackStatusPublicGroup + "' />";
            html += "<select id='publicOrderTrackingStatusGroup" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            html += "<td style='text-align:center'>";
            html += "<label id='dashboardStatusGroupLblEdit" + id + "' style='display:block;'>" + obj.dashboardStatusGroup + "</label>";
            html += "<input type='hidden' id='dashboardStatusGroupHiddenField" + id + "' value='" + obj.dashboardStatusGroup + "' />";
            html += "<select id='dashboardStatusGroup" + id + "' class=form-control style='display:none;'>";
            html += "<option value='0'></option>";
            html += "</select>";
            html += "</td>";

            let statusTypePaidSelectedText = "";
            let statusTypeUnpaidSelectedText = "";
            if (obj.statusType !== null && obj.statusType.trim() === "Paid") {
                statusTypePaidSelectedText = "Selected";
            }
            if (obj.statusType !== null && obj.statusType.trim() === "Unpaid") {
                statusTypeUnpaidSelectedText = "Selected";
            }
            html += "<td style='text-align:center'>";
            html += "<label id='statusTypeLblEdit" + id + "' style='display:block;'>" + obj.statusType + "</label>";
            html += "<input type='hidden' id='statusTypeHiddenField" + id + "' value='" + obj.statusType + "' />";
            html += "<select id='statusType" + id + "' class=form-control style='display:none;'>";
            html += "<option value='Paid' " + statusTypePaidSelectedText + ">Paid</option>";
            html += "<option value='Unpaid' " + statusTypeUnpaidSelectedText + ">Unpaid</option>";
            html += "</select>";
            html += "</td>";

            html += "<td align='center'>";
            html += '<button type="button" id=editStatusBtn' + id + ' class="btn btn-secondary" style="display:block;" onclick="EditStatus(' + id + ')"><i class="fa fa-pencil"></i></button>';
            html += '<button type="button" id=updateStatusBtn' + id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateStatus(' + id + ')"><i class="fa fa-check"></i></button>';
            html += '<button type="button" id=cancelStatusBtn' + id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadAllStatusList()"><i class="fa fa-times"></i></button>';
            html += "</td>";
            html += "</tr>";
            count++;
        }
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("statusListDetails").innerHTML = html;
    //Data Table
    $('#StatusDatatable').DataTable({
        pageLength: 100,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'StatusList' },
            { extend: 'pdf', title: 'StatusLis' },

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
    $('#StatusDatatable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#StatusDatatable_wrapper').addClass("container-fluid dt-bootstrap4");
}
const EditStatus = id => {
    document.getElementById('statusEngLblEdit' + id).style.display = "none";
    document.getElementById('statusBngLblEdit' + id).style.display = "none";
    document.getElementById('reportStatusGroupLblEdit' + id).style.display = "none";
    document.getElementById('fulfillmentStatusGroupLblEdit' + id).style.display = "none";
    document.getElementById('orderTrackingStatusGroupLblEdit' + id).style.display = "none";
    document.getElementById('publicOrderTrackingStatusGroupLblEdit' + id).style.display = "none";
    document.getElementById('dashboardStatusGroupLblEdit' + id).style.display = "none";
    document.getElementById('statusTypeLblEdit' + id).style.display = "none";

    document.getElementById('statusEngInputField' + id).style.display = "block";
    document.getElementById('statusBngInputField' + id).style.display = "block";
    document.getElementById('reportStatusGroup' + id).style.display = "block";
    document.getElementById('fulfillmentStatusGroup' + id).style.display = "block";
    document.getElementById('orderTrackingStatusGroup' + id).style.display = "block";
    document.getElementById('publicOrderTrackingStatusGroup' + id).style.display = "block";
    document.getElementById('dashboardStatusGroup' + id).style.display = "block";
    document.getElementById('statusType' + id).style.display = "block";


    let reportStatusGroup = $("#reportStatusGroupHiddenField" + id).val();
    let fulfillmentStatusGroup = $("#fulfillmentStatusGroupHiddenField" + id).val();
    let orderTrackingStatusGroup = $("#orderTrackingStatusGroupHiddenField" + id).val();
    let publicOrderTrackingStatusGroup = $("#publicOrderTrackingStatusGroupHiddenField" + id).val();
    let dashboardStatusGroup = $("#dashboardStatusGroupHiddenField" + id).val();
    
    LoadStatusGroups(id, reportStatusGroup, fulfillmentStatusGroup, orderTrackingStatusGroup, publicOrderTrackingStatusGroup, dashboardStatusGroup);

    $('#editStatusBtn' + id).hide();
    $('#updateStatusBtn' + id).show();
    $('#cancelStatusBtn' + id).show();
}
const UpdateStatus = id => {
    let statusEng = "";
    let statusBng = "";
    let statusGroup = "";
    let fulfillmentStatusGroup = "";
    let orderTrackStatusGroup = "";
    let dashboardStatusGroup = "";
    statusEng = $("#statusEngInputField" + id).val() === "" ? null : $("#statusEngInputField" + id).val().trim();
    statusBng = $("#statusBngInputField" + id).val() === "" ? null : $("#statusBngInputField" + id).val().trim();
    statusGroup = $("#reportStatusGroup" + id + " option:selected").val() === "-1" ? "" : $("#reportStatusGroup" + id + " option:selected").text().trim();
    fulfillmentStatusGroup = $("#fulfillmentStatusGroup" + id + " option:selected").val() === "-1" ? "" : $("#fulfillmentStatusGroup" + id + " option:selected").text().trim();
    orderTrackStatusGroup = $("#orderTrackingStatusGroup" + id + " option:selected").val() === "-1" ? "" : $("#orderTrackingStatusGroup" + id + " option:selected").text().trim();
    publicOrderTrackStatusGroup = $("#publicOrderTrackingStatusGroup" + id + " option:selected").val() === "-1" ? "" : $("#publicOrderTrackingStatusGroup" + id + " option:selected").text().trim();
    dashboardStatusGroup = $("#dashboardStatusGroup" + id + " option:selected").val() === "-1" ? "" : $("#dashboardStatusGroup" + id + " option:selected").text().trim();
    statusType = $("#statusType" + id + " option:selected").val() === "-1" ? "" : $("#statusType" + id + " option:selected").text().trim();

    let Obj = {
        statusNameEng: statusEng,
        statusNameBng: statusBng,
        statusGroup: statusGroup,
        fulfillmentStatusGroup: fulfillmentStatusGroup,
        orderTrackStatusGroup: orderTrackStatusGroup,
        orderTrackStatusPublicGroup: publicOrderTrackStatusGroup,
        dashboardStatusGroup: dashboardStatusGroup,
        statusType: statusType
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateCourierOrderStatus/" + id;
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
                    alert("Status Updated.");
                    loadAllStatusList();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const addNewStatus = () => {
    let statusEng = "";
    let statusBng = "";
    let statusGroup = "";
    let fulfillmentStatusGroup = "";
    let orderTrackStatusGroup = "";
    let dashboardStatusGroup = "";
    let statusType = "";
    statusEng = $("#statusEng").val() === "" ? null : $("#statusEng").val().trim();
    statusBng = $("#statusBng").val() === "" ? null : $("#statusBng").val().trim();
    statusGroup = $("#reportStatusGroup option:selected").val() === "-1" ? "" : $("#reportStatusGroup option:selected").text().trim();
    fulfillmentStatusGroup = $("#fulfillmentStatusGroup option:selected").val() === "-1" ? "" : $("#fulfillmentStatusGroup option:selected").text().trim();
    orderTrackStatusGroup = $("#orderTrackingStatusGroup option:selected").val() === "-1" ? "" : $("#orderTrackingStatusGroup option:selected").text().trim();
    publicOrderTrackStatusGroup = $("#publicOrderTrackingStatusGroup option:selected").val() === "-1" ? "" : $("#publicOrderTrackingStatusGroup option:selected").text().trim();
    dashboardStatusGroup = $("#dashboardStatusGroup option:selected").val() === "-1" ? "" : $("#dashboardStatusGroup option:selected").text().trim();
    statusType = $("#statusType option:selected").val() === "-1" ? "" : $("#statusType option:selected").text().trim();

    let Obj = {
        statusNameEng: statusEng,
        statusNameBng: statusBng,
        statusGroup: statusGroup,
        fulfillmentStatusGroup: fulfillmentStatusGroup,
        orderTrackStatusGroup: orderTrackStatusGroup,
        orderTrackStatusPublicGroup: publicOrderTrackStatusGroup,
        dashboardStatusGroup: dashboardStatusGroup,
        statusType: statusType,
        isActive: true
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddCourierOrderStatus";

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
                    alert("Status Created.");
                    location.reload();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const addNewStatusGroup = () => {
    let reportGroup = $("#reportGroup").val();
    let fulfillmentGroup = $("#fulfillmentGroup").val();
    let orderTrackingGroup = $("#orderTrackingGroup").val();
    let publicOrderTrackingGroup = $("#publicOrderTrackingGroup").val();
    let dashboardStatusGroup = $("#dashboardStatusGroup").val();
    let Obj = {
        reportStatusGroup: reportGroup,
        fulfillmentStatusGroup: fulfillmentGroup,
        orderTrackStatusGroup: orderTrackingGroup,
        orderTrackStatusPublicGroup: publicOrderTrackingGroup,
        dashboardStatusGroup: dashboardStatusGroup,
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Entry/AddStatusGroup";

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
                    alert("Status Group Added.");
                    location.reload();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}
const LoadStatusGroups = (id, selectedReportGroupValue, selectedFulfillmentGroupValue, selectedOrderTrackingGroupValue, selectedPublicOrderTrackingGroupValue, selectedDashboardStatusGroup) => {
    let url = apiBaseURL + "Fetch/GetStatusGroup";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                $("#reportStatusGroup" + id).empty();
                $("#fulfillmentStatusGroup" + id).empty();
                $("#orderTrackingStatusGroup" + id).empty();
                $("#publicOrderTrackingStatusGroup" + id).empty();
                $("#dashboardStatusGroup" + id).empty();
                
                $("#reportStatusGroup" + id).append('<option value="-1">Select Group</option>');
                $("#fulfillmentStatusGroup" + id).append('<option value="-1">Select Group</option>');
                $("#orderTrackingStatusGroup" + id).append('<option value="-1">Select Group</option>');
                $("#publicOrderTrackingStatusGroup" + id).append('<option value="-1">Select Group</option>');
                $("#dashboardStatusGroup" + id).append('<option value="-1">Select Group</option>');

                $.each(response.model, function (i, group) {
                    if (group.reportStatusGroup !== "") {
                        $("#reportStatusGroup" + id).append('<option value="' + group.reportStatusGroup + '">' + group.reportStatusGroup + '</option>');
                    }
                    if (group.fulfillmentStatusGroup !== "") {
                        $("#fulfillmentStatusGroup" + id).append('<option value="' + group.fulfillmentStatusGroup + '">' + group.fulfillmentStatusGroup + '</option>');
                    }
                    if (group.orderTrackStatusGroup !== "") {
                        $("#orderTrackingStatusGroup" + id).append('<option value="' + group.orderTrackStatusGroup + '">' + group.orderTrackStatusGroup + '</option>');
                    }
                    if (group.orderTrackStatusPublicGroup !== "") {
                        $("#publicOrderTrackingStatusGroup" + id).append('<option value="' + group.orderTrackStatusPublicGroup + '">' + group.orderTrackStatusPublicGroup + '</option>');
                    }
                    if (group.dashboardStatusGroup !== "") {
                        $("#dashboardStatusGroup" + id).append('<option value="' + group.dashboardStatusGroup + '">' + group.dashboardStatusGroup + '</option>');
                    }
                });
                if (selectedReportGroupValue != null) {
                    $("#reportStatusGroup" + id + " option").prop('selected', false)
                        .filter("[value='" + selectedReportGroupValue + "']")
                        .prop('selected', true);
                }
                if (selectedFulfillmentGroupValue != null) {
                    $("#fulfillmentStatusGroup" + id + " option").prop('selected', false)
                        .filter("[value='" + selectedFulfillmentGroupValue + "']")
                        .prop('selected', true);
                }
                if (selectedOrderTrackingGroupValue != null) {
                    $("#orderTrackingStatusGroup" + id + " option").prop('selected', false)
                        .filter("[value='" + selectedOrderTrackingGroupValue + "']")
                        .prop('selected', true);
                }
                if (selectedPublicOrderTrackingGroupValue != null) {
                    $("#publicOrderTrackingStatusGroup" + id + " option").prop('selected', false)
                        .filter("[value='" + selectedPublicOrderTrackingGroupValue + "']")
                        .prop('selected', true);
                }
                if (selectedDashboardStatusGroup != null) {
                    $("#dashboardStatusGroup" + id + " option").prop('selected', false)
                        .filter("[value='" + selectedDashboardStatusGroup + "']")
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
const loadAllStatusGroupList = () => {
    let url = apiBaseURL + "Fetch/GetStatusGroup";
    $.ajax({
        beforeSend: function () {
            document.getElementById('statusGroupListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                DrawStatusGroupList(response.model);
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
const DrawStatusGroupList = data => {
    let html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="StatusGroupDatatable" aria-describedby="StatusGroupDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style="width:5%;">No.</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 17%;">Report Status Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 17%;">Fulfillment Status Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 17%;">Order Tracking Status Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 17%;">Public Order Tracking Status Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 17%;">Dashboard Status Group</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="StatusGroupDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="activate to sort column descending" style="width: 10%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    let count = 1;
    $.each(data, function (i, obj) {
        let id = obj.statusGroupId;
        let evenOddClass = count % 2 === 0 ? "even" : "odd";
        html += "<tr class='gradeA " + evenOddClass + "' role='row'>";

        html += "<td style='text-align:center'>" + count + "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='reportGroupLblEdit" + id + "' style='display:block;'>" + obj.reportStatusGroup + "</label>";
        html += "<input type='text' id='reportGroupInputField" + id + "' style='display:none;' value='" + obj.reportStatusGroup + "' class=form-control />";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='fulfillmentGroupLblEdit" + id + "' style='display:block;'>" + obj.fulfillmentStatusGroup + "</label>";
        html += "<input type='text' id='fulfillmentGroupInputField" + id + "' style='display:none;' value='" + obj.fulfillmentStatusGroup + "' class=form-control />";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='trackingGroupLblEdit" + id + "' style='display:block;margin: 0px;'>" + obj.orderTrackStatusGroup + "</label>";
        html += "<input type='text' id='trackingGroupInputField" + id + "' style='display:none;' value='" + obj.orderTrackStatusGroup + "' class=form-control />";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='publicTrackingGroupLblEdit" + id + "' style='display:block;margin: 0px;'>" + obj.orderTrackStatusPublicGroup + "</label>";
        html += "<input type='text' id='publicTrackingGroupInputField" + id + "' style='display:none;' value='" + obj.orderTrackStatusPublicGroup + "' class=form-control />";
        html += "</td>";

        html += "<td style='text-align:center'>";
        html += "<label id='dashboardStatusGroupLblEdit" + id + "' style='display:block;margin: 0px;'>" + obj.dashboardStatusGroup + "</label>";
        html += "<input type='text' id='dashboardStatusGroupInputField" + id + "' style='display:none;' value='" + obj.dashboardStatusGroup + "' class=form-control />";
        html += "</td>";

        html += "<td align='center'>";
        html += '<button type="button" id=editStatusGroupBtn' + id + ' class="btn btn-secondary" style="display:block;" onclick="EditStatusGroup(' + id + ')"><i class="fa fa-pencil"></i></button>';
        html += '<button type="button" id=updateStatusGroupBtn' + id + ' class="btn btn-success" style="display:none;margin-left:5px;" onclick="UpdateStatusGroup(' + id + ')"><i class="fa fa-check"></i></button>';
        html += '<button type="button" id=cancelStatusGroupBtn' + id + ' class="btn btn-danger" style="display:none;margin-left:5px;" onclick="loadAllStatusGroupList()"><i class="fa fa-times"></i></button>';
        html += "</td>";
        html += "</tr>";
        count++;
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("statusGroupListDetails").innerHTML = html;
    $('#StatusGroupDatatable').DataTable({
        pageLength: 100,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'StatusGroup' },
            { extend: 'pdf', title: 'StatusGroup' },

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
    $('#StatusGroupDatatable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#StatusGroupDatatable_wrapper').addClass("container-fluid dt-bootstrap4");
}
const EditStatusGroup = id => {
    document.getElementById('reportGroupLblEdit' + id).style.display = "none";
    document.getElementById('fulfillmentGroupLblEdit' + id).style.display = "none";
    document.getElementById('trackingGroupLblEdit' + id).style.display = "none";
    document.getElementById('publicTrackingGroupLblEdit' + id).style.display = "none";
    document.getElementById('dashboardStatusGroupLblEdit' + id).style.display = "none";
    
    document.getElementById('reportGroupInputField' + id).style.display = "block";
    document.getElementById('fulfillmentGroupInputField' + id).style.display = "block";
    document.getElementById('trackingGroupInputField' + id).style.display = "block";
    document.getElementById('publicTrackingGroupInputField' + id).style.display = "block";
    document.getElementById('dashboardStatusGroupInputField' + id).style.display = "block";

    $('#editStatusGroupBtn' + id).hide();
    $('#updateStatusGroupBtn' + id).show();
    $('#cancelStatusGroupBtn' + id).show();
}
const UpdateStatusGroup = id => {
    let statusGroupId = parseInt(id);
    let reportGroup = $("#reportGroupInputField" + id).val();
    let fulfillmentGroup = $("#fulfillmentGroupInputField" + id).val();
    let orderTrackingGroup = $("#trackingGroupInputField" + id).val();
    let publicOrderTrackingGroup = $("#publicTrackingGroupInputField" + id).val();
    let dashboardStatusGroup = $("#dashboardStatusGroupInputField" + id).val();
    
    let Obj = {
        statusGroupId: statusGroupId,
        reportStatusGroup: reportGroup,
        fulfillmentStatusGroup: fulfillmentGroup,
        orderTrackStatusGroup: orderTrackingGroup,
        orderTrackStatusPublicGroup: publicOrderTrackingGroup,
        dashboardStatusGroup: dashboardStatusGroup
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Update/UpdateStatusGroup/" + id;

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
                    alert("Status Group Updated.");
                    loadAllStatusGroupList();
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}