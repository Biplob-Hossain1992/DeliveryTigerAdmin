
//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
////var apiBaseURL = "http://localhost:58676/api/"; //local

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
                    if (window.location.href.includes('Merchant') == 1) {
                        ProcessMerchantExcel(e.target.result);
                    }
                    else {
                        ProcessExcel(e.target.result);
                    }
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
                    if (window.location.href.includes('Merchant') == 1) {
                        ProcessMerchantExcel(data);
                    }
                    else {
                        ProcessExcel(data);
                    }
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
const ProcessExcel = data => {
    $("#bulkOrderListTableDiv").show();
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];
    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    let jsonData = [];
    if (excelRows.length > 200) {
        $("#bulkOrderListTableDiv").hide();
        alert("Please Insert 200 Orders At Once.");
        return false;
    }
    let html = "";

    for (var i = 0; i < excelRows.length; i++) {
        if (buldOrderValidation(excelRows[i])) {
            //Adding Row to Table
            html += drawOrderRow(excelRows[i]);
            //Adding data To List
            jsonData = [...jsonData, createOrderObject(excelRows[i])];
        }
        else {
            $("#bulkOrderListTableDiv").hide();
        }
    }
    //Assigning Data To Global Json Object
    allOrderData = jsonData;
    $("#bulkOrderListTableBody").html(html);
};
const buldOrderValidation = data => {
    if (data.CustomerName == undefined) {
        alert("Please Insert CustomerName");
        return false;
    }
    else if (data.CustomerMobile == undefined) {
        alert("Please Insert CustomerMobile");
        return false;
    }
    else if (data.CustomerOtherMobile == undefined) {
        //alert("Please Insert CustomerOtherMobile");
        //return false;
        return true;
    }
    else if (data.CustomerAddress == undefined) {
        alert("Please Insert CustomerAddress");
        return false;
    }
    else if (data.DistrictId == undefined) {
        alert("Please Insert DistrictId");
        return false;
    }
    else if (data.ThanaId == undefined) {
        alert("Please Insert ThanaId");
        return false;
    }
    else if (data.AreaId == undefined) {
        alert("Please Insert AreaId");
        return false;
    }
    else if (data.PaymentType == undefined) {
        alert("Please Insert PaymentType");
        return false;
    }
    else if (data.OrderType == undefined) {
        alert("Please Insert OrderType");
        return false;
    }
    else if (data.Weight == undefined) {
        alert("Please Insert Weight");
        return false;
    }
    else if (data.ProductName == undefined) {
        alert("Please Insert ProductName");
        return false;
    }
    else if (data.CollectionAmount == undefined) {
        alert("Please Insert CollectionAmount");
        return false;
    }
    else if (data.MerchantId == undefined) {
        alert("Please Insert MerchantId");
        return false;
    }
    else if (data.BreakableCharge == undefined) {
        alert("Please Insert BreakableCharge");
        return false;
    }
    else if (data.Note == undefined) {
        //alert("Please Insert Note");
        //return false;
        return true;
    }
    else if (data.CodCharge == undefined) {
        alert("Please Insert CodCharge");
        return false;
    }
    else if (data.CollectionCharge == undefined) {
        alert("Please Insert CollectionCharge");
        return false;
    }
    else if (data.ReturnCharge == undefined) {
        alert("Please Insert ReturnCharge");
        return false;
    }
    else if (data.PackagingName == undefined) {
        alert("Please Insert PackagingName");
        return false;
    }
    else if (data.PackagingCharge == undefined) {
        alert("Please Insert PackagingCharge");
        return false;
    }
    else if (data.CollectAddress == undefined) {
        alert("Please Insert CollectAddress");
        return false;
    }
    else {
        return true;
    }
}
const drawOrderRow = data => {
    let html = "";
    html += `<tr>
                <td>
                    <b>Name: </b>${data.CustomerName}<br>
                    <b>Mobile: </b>${data.CustomerMobile}<br>
                    <b>Other Mobile: </b>${data.CustomerOtherMobile}<br>
                    <b>Address: </b>${data.CustomerAddress}<br>
                    <b>DistrictId: </b>${data.DistrictId} ${data.District == "" || data.District == undefined? "" : " - "+data.District}<br>
                    <b>ThanaId: </b>${data.ThanaId} ${data.Thana == "" || data.Thana == undefined? "" : " - " + data.Thana}<br>
                    <b>AreaId: </b>${data.AreaId} ${data.Area == "" || data.Area == undefined? "" : " - " + data.Area}<br>
                </td>
                <td>
                    <b>ProductName: </b>${data.ProductName}<br>
                    <b>Payment Type: </b>${data.PaymentType}<br>
                    <b>Order Type: </b>${data.OrderType}<br>
                    <b>Weight: </b>${data.Weight}<br>
                </td>
                <td>
                    <b>Collection Amount: </b>${data.CollectionAmount}<br>
                    <b>Delivery Charge: </b>${data.DeliveryCharge}<br>
                    <b>BreakableCharge: </b>${data.BreakableCharge}<br>
                    <b>COD Charge: </b>${data.CodCharge}<br>
                    <b>Collection Charge: </b>${data.CollectionCharge}<br>
                    <b>Return Charge: </b>${data.ReturnCharge}<br>
                    <b>Packaging Charge: </b>${data.PackagingCharge}<br>
                </td>
                <td>
                    <b>MerchantId: </b>${data.MerchantId}<br>
                    <b>Packaging Name: </b>${data.PackagingName}<br>
                    <b>Collect Address: </b>${data.CollectAddress}<br>
                    <b>Note: </b>${data.Note}<br>
                </td>
            </tr>`;
    return html;
}


const createOrderObject = data => {

    let autoProcess = $("#isAutoProcess").prop("checked");

    let singleRow = {
        customerName: data.CustomerName,
        mobile: data.CustomerMobile,
        otherMobile: data.CustomerOtherMobile,
        address: data.CustomerAddress,
        districtId: parseInt(data.DistrictId),
        thanaId: parseInt(data.ThanaId),
        areaId: data.AreaId == ""? 0 : parseInt(data.AreaId),
        paymentType: data.PaymentType,
        orderType: data.OrderType,
        weight: data.Weight,
        collectionName: data.ProductName,
        collectionAmount: data.CollectionAmount == "" ? 0 : parseFloat(data.CollectionAmount),
        deliveryCharge: parseInt(data.DeliveryCharge),
        merchantId: parseInt(data.MerchantId),
        breakableCharge: data.BreakableCharge == "" ? 0 : parseFloat(data.BreakableCharge),
        note: data.Note,
        codCharge: data.CodCharge == "" ? 0 : parseFloat(data.CodCharge),
        collectionCharge: data.CollectionCharge == "" ? 0 : parseFloat(data.CollectionCharge),
        returnCharge: data.ReturnCharge == "" ? 0 : parseFloat(data.ReturnCharge),
        packagingName: data.PackagingName,
        packagingCharge: data.PackagingCharge == "" ? 0 : parseFloat(data.PackagingCharge),
        collectAddress: data.CollectAddress,
        orderFrom: "adbulk",
        isAutoProcess: autoProcess,
        status: autoProcess ? 1 : 0,
        isConfirmedBy: autoProcess ? "autoprocess" : "",
        comment: autoProcess ? "Merchant confirmation(Accepted)" : "",
        isActive: true
    };
    return singleRow;
}
const placeBulkOrder = () => {
    //console.log(allOrderData);
    let json = JSON.stringify(allOrderData);
    let url = apiBaseURL + "Order/AddOrdersBulk";
    $.ajax({
        type: "POST",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState === 4) {
                if (response.status === 201) {
                    alert("Orders Placed.");
                    location.reload();
                }
                else if (response.status === 422) {
                    console.log(response.responseJSON);
                }
            }

            else {
                alert("Error.");
            }
        }
    });
}

// --- Merchant Bulk Order --- //
const LoadAllDistricts = () => {
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
                allDistrictData = response.model;
                //console.log(allDistrictData);
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

const setMerchant = () => {
    let selectedMerchantId = $("#Merchant").val();
    if (selectedMerchantId !== -1) {
        CurrentMerchant = AllMerchantInfo.filter(m => m.courierUserId == selectedMerchantId)[0];
        //console.log(CurrentMerchant);
    }
}
const ProcessMerchantExcel = data => {
    if (!CurrentMerchant) {
        alert("Select Merchant First.")
        return false;
    }
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
    if (excelRows.length > 200) {
        $("#bulkOrderListTableDiv").hide();
        $("#failedBulkOrderListTableDiv").hide();
        alert("Please Insert 200 Orders At Once.");
        return false;
    }
    let html = "";
    let failedOrderHtml = "";
    for (var i = 0; i < excelRows.length; i++) {
        if (buldMerchantOrderValidation(excelRows[i])) {
            //Adding Row to Table

            let generatedData = generateOrderData(excelRows[i]);
            if (generatedData !== null && generatedData.DistrictId !== 0) {
                //Generating Order Table
                html += drawOrderRow(generatedData);
                //Adding data To List
                jsonData = [...jsonData, createOrderObject(generatedData)];
            }
            else {
                //console.log(generatedData);
                //TODO
                failedOrderHtml += generateFailedOrderList(generatedData);
            }
        }
        else {
            $("#bulkOrderListTableDiv").hide();
        }
    }
    //Assigning Data To Global Json Object
    allOrderData = jsonData;
    $("#bulkOrderListTableBody").html(html);
    $("#failedBulkOrderListTableBody").html(failedOrderHtml);
}
const generateFailedOrderList = data => {
    let html = "";
    html += `<tr>
                <td>
                    ${data.ProductName}
                </td>
                <td>
                    ${data.CollectionAmount}
                </td>
                <td>
                    ${data.Weight}
                </td>
                <td>
                    ${data.DeliveryCharge}
                </td>
                <td>
                    ${data.CodCharge}
                </td>
                <td>
                    ${data.CustomerName}
                </td>
                <td>
                    ${data.CustomerMobile}
                </td>
                <td>
                    ${data.CustomerOtherMobile}
                </td>
                <td>
                    ${data.CustomerAddress}
                </td>
                <td>
                    ${data.PostCode}
                </td>
            </tr>`;
    return html;
}
const buldMerchantOrderValidation = data => {
    if (data.OrderId === undefined) {
        alert("Please Insert Merchant Order ID");
        return false;
    }
    else if (data.CustomerName === undefined) {
        alert("Please Insert Customer Name");
        return false;
    }
    else if (data.CustomerMobile === undefined) {
        alert("Please Insert Customer Mobile");
        return false;
    }
    //else if (data.CustomerAlternateMobile === undefined) {
    //    alert("Please Insert Customer Alternate Mobile");
    //    return false;
    //}
    else if (data.CustomerAddress === undefined) {
        alert("Please Insert Customer Address");
        return false;
    }
    else if (data.PostCode === undefined) {
        alert("Please Insert Post Code");
        return false;
    }
    else if (data.Payable === undefined) {
        alert("Please Insert Payable");
        return false;
    }
    else if (data.Weight === undefined) {
        alert("Please Insert Weight");
        return false;
    }
    else if (data.DeliveryCharge === undefined) {
        alert("Please Insert Delivery Charge");
        return false;
    }
    else if (data.CodCharge === undefined) {
        alert("Please Insert Customer COD Charge");
        return false;
    }
    else {
        return true;
    }
}
const generateOrderData = data => {
    let CustomerName = data.CustomerName;
    let CustomerMobile = data.CustomerMobile;
    let CustomerOtherMobile = data.CustomerAlternateMobile == null || data.CustomerAlternateMobile == undefined ? "" : data.CustomerAlternateMobile;
    let CustomerAddress = fixString(data.CustomerAddress);

    //TODO
    let DistrictId = "";
    let ThanaId = "";
    let AreaId = "";

    let District = "";
    let Thana = "";
    let Area = "";

    let CollectionAmount = parseInt(data.Payable); // Payable= 0 If Paid order
    let OrderType = CollectionAmount === 0 ? "Only Delivery" : "Delivery Taka Collection";
    let PaymentType= "Regular Delivery ৩-৭";  // fixed for now 
    
    let WeightObject = getWeightValue(parseFloat(data.Weight));

    let Weight = WeightObject.weightText;
    
    let ProductName = data.OrderId; // Set Product Name Right Away

    //STILL TODO
    let DeliveryCharge = parseFloat(data.DeliveryCharge);
    let MerchantId = parseInt(CurrentMerchant.courierUserId);
    let Note = "";
    
    let CodCharge = Math.round(parseFloat(data.CodCharge), 1); // Round and set Cod Charge
    let BreakableCharge = 0;
    let CollectionCharge = 0;
    let ReturnCharge = 0;
    let PackagingName = "No Extra Packing";
    let PackagingCharge = 0;
    let CollectAddress = CurrentMerchant.address;

    let PostalCode = data.PostCode;
    let DeliveryRangeId = 4; // fixed for now  (needed for delivery charge calculation)
    let WeightRangeId = WeightObject.weightRangeId; // needed for delivery charge calculation
    //TODO
    let LocationDetailsObj = getLocationData(PostalCode, CustomerAddress, DeliveryRangeId, WeightRangeId);
    if (!LocationDetailsObj) {
        DistrictId = 0;
        ThanaId = 0;
        AreaId = 0;
    }
    else {
        DistrictId = LocationDetailsObj.DistrictId;
        ThanaId = LocationDetailsObj.ThanaId;
        AreaId = LocationDetailsObj.AreaId;
        District = LocationDetailsObj.District;
        Thana = LocationDetailsObj.Thana;
        Area = LocationDetailsObj.Area;
    }
    let excelRowObj = {
        CustomerName : CustomerName,
        CustomerMobile: CustomerMobile,
        CustomerOtherMobile: CustomerOtherMobile,
        CustomerAddress: CustomerAddress,
        DistrictId: DistrictId,
        ThanaId: ThanaId,
        AreaId: AreaId,
        District,
        Thana,
        Area,
        PaymentType: PaymentType,
        OrderType: OrderType,
        Weight: DistrictId == 0 ? data.Weight: Weight,
        ProductName: ProductName,
        CollectionAmount: CollectionAmount,
        DeliveryCharge: DeliveryCharge,
        MerchantId: MerchantId,
        BreakableCharge: BreakableCharge,
        Note: Note,
        CodCharge: CodCharge,
        CollectionCharge: CollectionCharge,
        ReturnCharge: ReturnCharge,
        PackagingName: PackagingName,
        PackagingCharge: PackagingCharge,
        CollectAddress: CollectAddress,
        PostCode: PostalCode
    }
    return excelRowObj;
}
const getWeightValue = (weight) => {
    let weightText = "";
    let weightRangeId = 0;
    if (weight <= .5) {
        weightText = "< 500 gm";
        weightRangeId = 0;
    }
    if (weight > .5 && weight <= 1) {
        weightText = "500 gm - 1 kg";
        weightRangeId = 0;
    }
    if (weight > 1 && weight <= 2) {
        weightText = "1 kg - 2 kg";
        weightRangeId = 0;
    }
    if (weight > 2 && weight <= 3) {
        weightText = "2 kg - 3 kg";
        weightRangeId = 0;
    }
    if (weight > 3 && weight <= 4) {
        weightText = "3 kg - 4 kg";
        weightRangeId = 0;
    }
    if (weight > 4 && weight <= 5) {
        weightText = "4 kg - 5 kg";
        weightRangeId = 0;
    }
    let WeightObj = {
        weightText,
        weightRangeId
    }
    return WeightObj;
}
const getLocationData = (PostalCode, CustomerAddress, DeliveryRangeId, WeightRangeId) => {
    
    let DistrictId = "";
    let ThanaId = "";
    let AreaId = "";

    // TODO
    let District = "";
    let Thana = "";
    let Area = "";

    let CustomerAddressWithoutComma = CustomerAddress.replace(/,/g, ' ');
    let CustomerAddressWordList = CustomerAddressWithoutComma.toLowerCase().split(" ");

    let areaObjList = [];
    let thanaObjList = [];
    let districtObjList = [];
    //Try Area & Thana
    try {
        areaObjList = allDistrictData.filter(d => d.postalCode == PostalCode && d.areaType == 4);
        if (areaObjList.length > 0) { // if area found
            if (areaObjList.length == 1) { //if only one area found 
                AreaId = areaObjList[0].districtId;
                Area = areaObjList[0].district;
                thanaObjList = allDistrictData.filter(d => d.districtId == areaObjList[0].parentId && d.areaType == 3);
                if (thanaObjList.length > 0) {
                    ThanaId = thanaObjList[0].districtId;
                    Thana = thanaObjList[0].district;
                    districtObjList = allDistrictData.filter(d => d.districtId == thanaObjList[0].parentId && d.areaType == 2);
                    if (districtObjList.length > 0) {
                        DistrictId = districtObjList[0].districtId;
                        District = districtObjList[0].district;
                    }
                    else {
                        return false;
                    }
                }
            }
            if (areaObjList.length > 1) {
                let areaListFromAddress = areaObjList.filter((d) => {
                    if (CustomerAddressWordList.includes(d.district.toLowerCase().split(" ")[0]) || CustomerAddressWordList.includes(d.districtBng.toLowerCase().split(" ")[0])
                        || CustomerAddressWordList.includes(d.district.toLowerCase().split("-")[0]) || CustomerAddressWordList.includes(d.districtBng.toLowerCase().split("-")[0])
                    ) {
                        return d;
                    }
                });
                if (areaListFromAddress.length > 0) {
                    AreaId = areaListFromAddress[0].districtId;
                    Area = areaListFromAddress[0].district;
                    thanaObjList = allDistrictData.filter(d => d.districtId == areaListFromAddress[0].parentId && d.areaType == 3);
                    if (thanaObjList.length > 0) {
                        ThanaId = thanaObjList[0].districtId;
                        Thana = thanaObjList[0].district;
                        districtObjList = allDistrictData.filter(d => d.districtId == thanaObjList[0].parentId && d.areaType == 2);
                        if (districtObjList.length > 0) {
                            DistrictId = districtObjList[0].districtId;
                            District = districtObjList[0].district;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else { // if area not found
            thanaObjList = allDistrictData.filter(d => d.postalCode == PostalCode && d.areaType == 3);
            if (thanaObjList.length > 0) { // if thana found
                AreaId = 0;
                Area = "";
                if (thanaObjList.length == 1) {// if only one thana found
                    ThanaId = thanaObjList[0].districtId;
                    Thana = thanaObjList[0].district;
                    districtObjList = allDistrictData.filter(d => d.districtId == thanaObjList[0].parentId && d.areaType == 2);
                    if (districtObjList.length > 0) {
                        DistrictId = districtObjList[0].districtId;
                        District = districtObjList[0].district;
                    }
                    else {
                        return false;
                    }
                }
                if (thanaObjList.length > 1) {
                    let thanaListFromAddress = thanaObjList.filter((d) => {
                        if (CustomerAddressWordList.includes(d.district.toLowerCase().split(" ")[0]) || CustomerAddressWordList.includes(d.districtBng.toLowerCase().split(" ")[0])
                            || CustomerAddressWordList.includes(d.district.toLowerCase().split("-")[0]) || CustomerAddressWordList.includes(d.districtBng.toLowerCase().split("-")[0])) {
                            return d;
                        }
                    });
                    if (thanaListFromAddress.length > 0) {
                        ThanaId = thanaListFromAddress[0].districtId;
                        Thana = thanaListFromAddress[0].district;
                        districtObjList = allDistrictData.filter(d => d.districtId == thanaListFromAddress[0].parentId && d.areaType == 2);
                        DistrictId = districtObjList[0].districtId;
                        District = districtObjList[0].district;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        let obj = {
            DistrictId,
            ThanaId,
            AreaId,
            District,
            Thana,
            Area
        }
        return obj;
    }
    catch (e) {
        return false;
    }
}
