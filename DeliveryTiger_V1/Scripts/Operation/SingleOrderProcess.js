const setMerchant = () => {
    let selectedMerchantId = $("#Merchant").val();
    if (selectedMerchantId !== -1) {
        CurrentMerchant = AllMerchantInfo.filter(m => m.courierUserId == selectedMerchantId)[0];
        console.log(CurrentMerchant);
    }
}
//Load All Lists
const LoadDistrictParentIdWise = (parentId, selectTagId, selectedValue) => {
    let url = apiBaseURL + "Other/GetAllDistrictFromApi/" + parentId;
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response != null) {
                if (selectTagId.includes("District")) {
                    DrawLocationData(response.data.districtInfo, selectTagId, selectedValue);
                }
                if (!selectTagId.includes("District")) {
                    DrawLocationData(response.data.districtInfo[0].thanaHome, selectTagId, selectedValue);
                }
            }
            else {
                console.log(response);
                alert("No Data Found.");
            }
        },
        Error: function (response) {
            console.log(response);
            alert("Error.");
        }
    });
}
const GetThanaList = () => {
    document.getElementById('Thana').disabled = false;
    LoadDistrictParentIdWise($("#District").val(), "Thana", null);
}
const GetAreaList = () => {
    let CityDistricts = [14, 77, 78, 79, 80];
    if (!CityDistricts.includes(parseInt($("#District").val()))) {
        document.getElementById('Area').disabled = false;
        LoadDistrictParentIdWise($("#Thana").val(), "Area", null);
    }
}
const DrawLocationData = (data, selectTagId, selectedValue) => {
    $("#" + selectTagId + "").empty();
    let tagName = selectTagId.includes("District") ? "District" : "";
    tagName = selectTagId.includes("Thana") ? "Thana" : tagName;
    tagName = selectTagId.includes("Area") ? "Area" : tagName;
    $("#" + selectTagId + "").append('<option value="-1">Select ' + tagName + '</option>');
    $.each(data, function (i, district) {
        if (selectTagId.includes("District")) {
            $("#" + selectTagId + "").append('<option value="' + district.districtId + '">' + district.districtBng + '</option>');
        }
        if (!selectTagId.includes("District")) {
            $("#" + selectTagId + "").append('<option value="' + district.thanaId + '">' + district.thanaBng + ' (' + district.postalCode + ')</option>');
        }
    });
    if (selectedValue != null) {
        $("#" + selectTagId + " option").prop('selected', false)
            .filter("[value='" + selectedValue + "']")
            .prop('selected', true);
    }
}