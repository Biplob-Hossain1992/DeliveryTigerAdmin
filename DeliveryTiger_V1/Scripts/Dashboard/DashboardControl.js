const loadAllDashboardSummaryList = () => {
    let url = apiBaseURL + "Dashboard/GetOrderCountByStatusGroup";
    let obj = {
        "month": 9,
        "year": 2019,
        "courierUserId": 3464
    }
    let Json = JSON.stringify(obj);
    $.ajax({
        beforeSend: function () {
            document.getElementById('dashboardSummaryListDetails').innerHTML = loaderHtml;
        },
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: Json,
        success: function (response) {
            if (response != null) {
                DrawDashboardSummaryListDetails(response.model);
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
            document.getElementById('dashboardSummaryListDetails').innerHTML = loaderHtml;
        },
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                //DrawStatusGroupList(response.model);
                DrawDashboardSummaryListDetails(response.model);
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
const DrawDashboardSummaryListDetails = (data) => {
    var html = '';
    html += '<table class="table table-striped table-bordered table-hover dataTables-example dataTable" id="DashboardSummaryDatatable" aria-describedby="DashboardSummaryDatatable_info" role="grid">';
    html += '<thead>';
    html += '<tr role="row">';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 3%;">No.</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 10%;">Name</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 7%;">Span Count</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 10%;">Color Type</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 5%;">Order By</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 10%;">Route Url</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 10%;">Count / Sum</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 10%;">Filter</th>';
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="District: activate to sort column descending" style="width: 20%;">Img Url</th>';
    
    html += '<th class="sorting_asc" tabindex="0" aria-controls="DashboardSummaryDatatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Thana: activate to sort column descending" style="width: 15%;">Action</th>';
    html += '</tr>';
    html += '</thead>';

    var count = 1;
    $.each(data, function (i, obj) {
        let id = obj.statusGroupId;
        if (obj.dashboardStatusGroup !== "") {

            var evenOddClass = count % 2 === 0 ? "even" : "odd";
            html += `<tr class='gradeA ${evenOddClass}' role='row'>`;

            html += `<td style='text-align:center'>${count}</td>`;

            html += `<td style='text-align:center'>${obj.dashboardStatusGroup}</td>`;

            //dashboardSpanCount
            let dashboardSpanCount1SelectedText = parseInt(obj.dashboardSpanCount) == 1 ? "Selected" : "";
            let dashboardSpanCount2SelectedText = parseInt(obj.dashboardSpanCount) == 2 ? "Selected" : "";

            html += `<td style='text-align:center'>
                 <label id='dashboardSpanCountLblEdit${id}' style='display:block;'>${obj.dashboardSpanCount}</label>
                 <input type='hidden' id='dashboardSpanCountHiddenField${id}' value='${obj.dashboardSpanCount}' />
                 <select id='dashboardSpanCount${id}' class=form-control style='display:none;'>
                 <option value='1' ${dashboardSpanCount1SelectedText}>1</option>
                 <option value='2' ${dashboardSpanCount2SelectedText}>2</option>
                 </select>
                 </td>`;

            //dashboardViewColorType

            let ColorTypePositiveSelectedText = obj.dashboardViewColorType == "positive" ? "Selected" : "";
            let ColorTypeNegativeSelectedText = obj.dashboardViewColorType == "negative" ? "Selected" : "";
            let ColorTypeNeutralSelectedText = obj.dashboardViewColorType == "neutral" ? "Selected" : "";
            let ColorTypeWaitingSelectedText = obj.dashboardViewColorType == "waiting" ? "Selected" : "";


            html += `<td style='text-align:center'>
                 <label id='dashboardViewColorTypeLblEdit${id}' style='display:block;'>${obj.dashboardViewColorType}</label>
                 <input type='hidden' id='dashboardViewColorTypeHiddenField${id}' value='${obj.dashboardViewColorType}' />
                 <select id='dashboardViewColorType${id}' class=form-control style='display:none;'>
                 <option value='positive' ${ColorTypePositiveSelectedText}>Positive</option>
                 <option value='negative' ${ColorTypeNegativeSelectedText}>Negative</option>
                 <option value='neutral' ${ColorTypeNeutralSelectedText}>Neutral</option>
                 <option value='waiting' ${ColorTypeWaitingSelectedText}>Waiting</option>
                 </select>
                 </td>`;

            //dashboardViewOrderBy

            html += `<td style='text-align:center'>
                 <label id='dashboardViewOrderByLblEdit${id}' style='display:block;'>${obj.dashboardViewOrderBy}</label>
                 <input type='number' id='dashboardViewOrderBy${id}' style='display:none;' value='${obj.dashboardViewOrderBy}' class=form-control />
                 </td>`;


            //dashboardRouteUrl

            let RouteUrladdorderSelectedText = obj.dashboardRouteUrl == "add-order" ? "Selected" : "";
            let RouteUrlbillingserviceSelectedText = obj.dashboardRouteUrl == "billing-service" ? "Selected" : "";
            let RouteUrlordertrackingSelectedText = obj.dashboardRouteUrl == "order-tracking" ? "Selected" : "";
            let RouteUrlshipmentchargeSelectedText = obj.dashboardRouteUrl == "shipment-charge" ? "Selected" : "";
            let RouteUrlallorderSelectedText = obj.dashboardRouteUrl == "all-order" ? "Selected" : "";
            let RouteUrlcodcollectionSelectedText = obj.dashboardRouteUrl == "cod-collection" ? "Selected" : "";

            html += `<td style='text-align:center'>
                 <label id='dashboardRouteUrlLblEdit${id}' style='display:block;'>${obj.dashboardRouteUrl}</label>
                 <input type='hidden' id='dashboardRouteUrlHiddenField${id}' value='${obj.dashboardRouteUrl}' />
                 <select id='dashboardRouteUrl${id}' class=form-control style='display:none;'>
                    <option value='all-order' ${RouteUrlallorderSelectedText}>all-order</option>
                    <option value='add-order' ${RouteUrladdorderSelectedText}>add-order</option>
                    <option value='billing-service' ${RouteUrlbillingserviceSelectedText}>billing-service</option>
                    <option value='order-tracking' ${RouteUrlordertrackingSelectedText}>order-tracking</option>
                    <option value='shipment-charge' ${RouteUrlshipmentchargeSelectedText}>shipment-charge</option>
                    <option value='cod-collection' ${RouteUrlcodcollectionSelectedText}>cod-collection</option>
                 </select>
                 </td>`;

            //dashboardCountSumView
            let countSelectedText = obj.dashboardCountSumView == 'count' ? "Selected" : "";
            let sumSelectedText = obj.dashboardCountSumView == 'sum' ? "Selected" : "";
            let countsumSelectedText = obj.dashboardCountSumView == 'countsum' ? "Selected" : "";

            html += `<td style='text-align:center'>
                 <label id='dashboardCountSumViewLblEdit${id}' style='display:block;'>${obj.dashboardCountSumView}</label>
                 <input type='hidden' id='dashboardCountSumViewHiddenField${id}' value='${obj.dashboardCountSumView}' />
                 <select id='dashboardCountSumView${id}' class=form-control style='display:none;'>
                    <option value='count' ${countSelectedText}>Count</option>
                    <option value='sum' ${sumSelectedText}>Sum</option>
                    <option value='countsum' ${countsumSelectedText}>Both</option>
                 </select>
                 </td>`;

            //dashboardStatusFilter
            html += `<td style='text-align:center'>
                 <label id='dashboardStatusFilterLblEdit${id}' style='display:block;'>${obj.dashboardStatusFilter}</label>
                 <input type='text' id='dashboardStatusFilter${id}' style='display:none;' value='${obj.dashboardStatusFilter}' class=form-control />
                 </td>`;
            //dashboardImageUrl
            html += `<td style='text-align:center'>
                 <label id='dashboardImageUrlLblEdit${id}' style='display:block;'>${obj.dashboardImageUrl}</label>
                 <input type='text' id='dashboardImageUrl${id}' style='display:none;' value='${obj.dashboardImageUrl}' class=form-control />
                 </td>`;
            //Action
            html += `<td align='center'>`;
            if (id != 0) {
                html += `<button type='button' id=editDashboardSummaryBtn${id} class='btn btn-secondary' style='display:block;' onclick='editDashboardSummary(${id})'><i class="fa fa-pencil"></i></button>
                 <button type='button' id=updateDashboardSummaryBtn${id} class='btn btn-success' style='display:none;margin-left:5px;' onclick='UpdateDashboardSummary(${id})'><i class="fa fa-check"></i></button>
                 <button type='button' id=cancelDashboardSummaryBtn${id} class='btn btn-danger' style='display:none;margin-left:5px;' onclick='loadAllStatusGroupList()'><i class="fa fa-times"></i></button>`;
            }
            html += `</td>`;

            html += "</tr>";
            count++;
        }
    });
    html += "</table>";
    html += "</div>";

    document.getElementById("dashboardSummaryListDetails").innerHTML = html;
    //Data Table
    $('#DashboardSummaryDatatable').DataTable({
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
    $('#DashboardSummaryDatatable_wrapper').removeClass("form-inline dt-bootstrap no-footer");
    $('#DashboardSummaryDatatable_wrapper').addClass("container-fluid dt-bootstrap4");
}

const editDashboardSummary = id => {
    $("#dashboardSpanCountLblEdit" + id).hide();
    $("#dashboardViewColorTypeLblEdit" + id).hide();
    $("#dashboardViewOrderByLblEdit" + id).hide();
    $("#dashboardRouteUrlLblEdit" + id).hide();
    $("#dashboardCountSumViewLblEdit" + id).hide();
    $("#dashboardStatusFilterLblEdit" + id).hide();
    $("#dashboardImageUrlLblEdit" + id).hide();
    
    $("#dashboardSpanCount" + id).show();
    $("#dashboardViewColorType" + id).show();
    $("#dashboardViewOrderBy" + id).show();
    $("#dashboardRouteUrl" + id).show();
    $("#dashboardCountSumView" + id).show();
    $("#dashboardStatusFilter" + id).show();
    $("#dashboardImageUrl" + id).show();

    $("#editDashboardSummaryBtn" + id).hide();
    $("#updateDashboardSummaryBtn" + id).show();
    $("#cancelDashboardSummaryBtn" + id).show();
}

const UpdateDashboardSummary = id => {
    let dashboardSpanCount = $("#dashboardSpanCount" + id).val();
    let dashboardViewColorType = $("#dashboardViewColorType" + id).val();
    let dashboardViewOrderBy = $("#dashboardViewOrderBy" + id).val();
    let dashboardRouteUrl = $("#dashboardRouteUrl" + id).val();
    let dashboardCountSumView = $("#dashboardCountSumView" + id).val();
    let dashboardStatusFilter = $("#dashboardStatusFilter" + id).val().trim();
    let dashboardImageUrl = $("#dashboardImageUrl" + id).val().trim();
    let Obj = {
        "statusGroupId": parseInt(id),
        "dashboardSpanCount": dashboardSpanCount,
        "dashboardViewColorType": dashboardViewColorType,
        "dashboardViewOrderBy": parseInt(dashboardViewOrderBy),
        "dashboardRouteUrl": dashboardRouteUrl,
        "dashboardCountSumView": dashboardCountSumView,
        "dashboardStatusFilter": dashboardStatusFilter,
        "dashboardImageUrl": dashboardImageUrl
    }
    let Json = JSON.stringify(Obj);

    let url = apiBaseURL + "Dashboard/UpdateSummary/"+id;
    $.ajax({
        type: "PUT",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: Json,
        success: function (response) {
            if (response != null) {
                alert("Updated.");
                loadAllStatusGroupList();
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