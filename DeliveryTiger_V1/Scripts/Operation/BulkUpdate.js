const upLoadExcel = () => {
    var fileUpload = document.getElementById("excelInput");
    let fileName = $("#excelInput").val().split('.')[0];
    $("#excelInput").next('.custom-file-label').addClass("selected").html(fileName);
    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx|.csv)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    //if (window.location.href.includes('Merchant') == 1) {
                    //    ProcessMerchantExcel(e.target.result);
                    //}
                    //else {
                    //    ProcessExcel(e.target.result);
                    //}
                    ProcessUpdateExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    //if (window.location.href.includes('Merchant') == 1) {
                    //    ProcessMerchantExcel(data);
                    //}
                    //else {
                    //    ProcessExcel(data);
                    //}
                    ProcessUpdateExcel(data)
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
}
const ProcessUpdateExcel = data => {
    //if (!CurrentMerchant) {
    //    alert("Select Merchant First.")
    //    return false;
    //}
    $("#bulkOrderListTableDiv").show();
    $("#failedBulkOrderListTableDiv").show();
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];
    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    let jsonData = [];
    let jsonDataObjList = [];
    if (excelRows.length > 300) {
        alert("Please Insert 300 Orders At Once.");
        return false;
    }
    let html = "";
    let failedOrderHtml = "";
    for (var i = 0; i < excelRows.length; i++) {
        if (buldOrderUpdateValidation(excelRows[i])) {
            //Adding Row to Table

            let OrderId = excelRows[i].OrderId.trim();
            if (OrderId !== null) {
                //Adding data To List
                jsonData = [...jsonData, OrderId];
                let obj = {
                    courierOrdersId: OrderId
                }
                jsonDataObjList = [...jsonDataObjList, obj]
            }
            //else {
            //    //console.log(generatedData);
            //    //TODO
            //    failedOrderHtml += generateFailedOrderList(generatedData);
            //}
        }
        else {
            //$("#bulkOrderListTableDiv").hide();
        }
    }
    //Assigning Data To Global Json Object
    allOrderToUpdateData = jsonDataObjList;
    //console.log(jsonData);
    //console.log(allOrderToUpdateData);
    //updateBulkOrder(jsonDataObjList);
    
    //$("#bulkOrderListTableBody").html(html);
    //$("#failedBulkOrderListTableBody").html(failedOrderHtml);
}
const buldOrderUpdateValidation = data => {
    if (data.OrderId === undefined) {
        alert("Please Insert Order ID");
        return false;
    }
    else {
        return true;
    }
}
const updateBulkOrder = () => {
    if (allOrderToUpdateData.length > 0) {
        let json = JSON.stringify(allOrderToUpdateData);
        let url = apiBaseURL + "Update/UpdateOrdersBulk/";
        $.ajax({
            type: "PUT",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
            url: url,
            contentType: "application/json",
            dataType: 'json',
            data: json,
            complete: function (response) {
                if (response.readyState === 4) {
                    if (response.status === 201) {
                        console.log(response.responseJSON.model);
                        alert("Updated " + response.responseJSON.model + " Orders!");
                    }
                }
                else {
                    alert("Error.");
                }
            }
        });
    }
    else {
        alert("No Valid CouponId Found!");
        return false;
    }
}