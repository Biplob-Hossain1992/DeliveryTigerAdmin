/// <reference path="../jquery-3.1.1.min.js" />
/// <reference path="../plugins/jquery-ui/jquery-ui.min.js" />

//var apiBaseURL = "https://adcore.ajkerdeal.com/api/"; //swagger
//var apiBaseURL = "http://localhost:58676/api/";


const updateRegisterTermsAndCondition = () => {
    let id = $("#idHidden").val();
    let termsAndConditionsText = $("#termsAndConditionsHtml").html();
    let newText = $(".note-editable").html();
    if (newText == "") {
        alert("Please Input Terms & Conditions Text.");
        $("#termsAndConditionsHtml").focus();
        return false;
    }
    let Obj = {
        id: parseInt(id),
        registerTermsConditions: newText
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Settings/UpdateRegisterTermsConditions/" + id;

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
                if (response.status == 201) {
                    alert("Terms & Conditions Updated.");
                    loadRegisterTermsConditions();
                }
                else if (response.status == 422) {
                    console.log(response.responseJSON);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
};

const updateTermsAndCondition = () => {
    let id = $("#idHidden").val();
    let termsAndConditionsText = $("#termsAndConditionsHtml").html();
    let newText = $(".note-editable").html();
    if (newText == "") {
        alert("Please Input Terms & Conditions Text.");
        $("#termsAndConditionsHtml").focus();
        return false;
    }
    let Obj = {
        id: parseInt(id),
        termsConditions: newText
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Settings/UpdateSettings/" + id;

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
                if (response.status == 201) {
                    alert("Terms & Conditions Updated.");
                    loadTermsAndConditions();
                }
                else if (response.status == 422) {
                    console.log(response.responseJSON);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
};
const loadRegisterTermsConditions = () => {
    let url = apiBaseURL + "Settings/GetSettings";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                let html = response.model.registerTermsConditions;
                let id = response.model.id;
                $("#idHidden").val(id);
                $('.click2edit').html(html);
                $('.click2edit').summernote();
                $('.click2edit').summernote({ focus: true });
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
const loadTermsAndConditions = () => {
    let url = apiBaseURL + "Settings/GetSettings";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                let html = response.model.termsConditions;
                let id = response.model.id;
                $("#idHidden").val(id);
                $('.click2edit').html(html);
                $('.click2edit').summernote();
                $('.click2edit').summernote({ focus: true });
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

const loadVoucherTermsAndConditions = () => {
    let url = apiBaseURL + "Settings/GetSettings";
    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response !== null) {
                let html = response.model.voucherTermsConditions;
                let id = response.model.id;
                $("#idHidden").val(id);
                $('.click2edit').html(html);
                $('.click2edit').summernote();
                $('.click2edit').summernote({ focus: true });
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

const updateVoucherTermsConditions = () => {
    let id = $("#idHidden").val();
    let voucherTermsAndConditionsText = $("#voucherTermsAndConditionsHtml").html();
    let newText = $(".note-editable").html();
    if (newText == "") {
        alert("Please Input Terms & Conditions Text.");
        $("#voucherTermsAndConditionsHtml").focus();
        return false;
    }
    let Obj = {
        id: parseInt(id),
        voucherTermsConditions: newText
    };
    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Settings/UpdateVoucherTermsConditions/" + id;

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
                if (response.status == 201) {
                    alert("Voucher Terms & Conditions Updated...!!!");
                    loadVoucherTermsAndConditions();
                }
                else if (response.status == 422) {
                    console.log(response.responseJSON);
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

const loadSmsAndMailDetails = () => {
    let statusId = parseInt($("#Status").val());
    if (statusId !== '-1') {
        
        $.each(AllStatusListData, function (i, status) {
            if (status.statusId === statusId) {
                //$('.click2edit').summernote();
                //$('.note-editable').html(status.email);
                $('#emailHtml').summernote('code', status.email);
                $("#smsText").val(status.message);
                $("#customerSmsText").val(status.customerMessage);
                $("#retentionSmsText").val(status.retentionMessage);
                $('#customerEmailHtml').summernote('code', status.customerEmail);
            }
        });
    }
    else {
        $('.click2edit').summernote();
        $('.note-editable').html("");
        $("#smsText").text("");
        $("#customerSmsText").text("");
    }
}
const updateSmsMailFormat = () => {
    let statusId = $("#Status").val();
    let smsText = $("#smsText").val();
    let emailText = $('#emailHtml').summernote('code');//$(".note-editable").html();
    let customerMessage = $("#customerSmsText").val();
    let retentionMessage = $("#retentionSmsText").val();
    let customerEmail = $('#customerEmailHtml').summernote('code');


    let Obj = {
        statusId: statusId,
        email: emailText,
        message: smsText,
        customerMessage: customerMessage,
        customerEmail: customerEmail,
        retentionMessage: retentionMessage
    };

    let json = JSON.stringify(Obj);
    let url = apiBaseURL + "Permission/UpdateSmsEmail/" + statusId;

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
                if (response.status == 201 || response.status == 200) {
                    alert("SMS & Mail Format Updated.");
                    //loadAllStatus("Status");
                    redisSingleRemove("LoadCourierStatus");
                }
            }
            else {
                alert("Error.");
            }
        }
    });
}

function redisSingleRemove(value) {
    let url = apiBaseURL + "Redis/SingleRemoveAsync/" + value;
    $.ajax({
        type: "DELETE",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token").trim() },
        crossDomain: true,
        url: url,
        contentType: "application/json",
        dataType: 'json',
        complete: function (response) {
            if (response.readyState == 4) {
                if (response.status == 201 || response.status == 200) {
                    console.log("Redis clean");
                }
            }
            else {
                console.log(response);
            }
        }
    });
}

const SendSms = () => {
    let smsNumber = $("#smsNumber").val();
    let smsText = $("#smsText").val();
    if (smsNumber === "") {
        alert("Insert Correct Mobile Number.");
        return false;
    }
    if (smsText === "") {
        alert("Input Correct SMS Text.");
        return false;
    }
    let smsNumberList = smsNumber.split(",");
    
    let Obj = {
        numbers: smsNumberList,
        text: smsText,
        type: 0,
        datacoding: 0
    };
    let ObjList = [];
    ObjList.push(Obj);
    let json = JSON.stringify(ObjList);
    let url = bridgeBaseUrl +"SmsComunication/SendSms";
    $.ajax({
        type: "POST",
        headers: { "API_KEY": 'Ajkerdeal_~La?Rj73FcLm' },
        contentType: "application/json",
        crossDomain: true,
        url: url,
        dataType: 'json',
        data: json,
        complete: function (response) {
            if (response.readyState == 4) {
                alert("SMS Sent.");
            }
            else {
                alert("Error.");
            }
        }
    });
}