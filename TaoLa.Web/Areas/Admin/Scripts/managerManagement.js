﻿

$(function () {
    query();

    //添加管理员
    $('.add-manager').click(function () {
        LoadAddBox();
    });
})

function Delete(id) {
    $.dialog.confirm('确定删除该条记录吗？', function () {
        var loading = showLoading();
        $.post("./Delete", { id: id }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
    });
}
function BatchDelete() {
    var selectedRows = $("#list").TaoLaDatagrid("getSelections");
    var selectids = new Array();

    for (var i = 0; i < selectedRows.length; i++) {
        selectids.push(selectedRows[i].Id);
    }
    if (selectedRows.length == 0) {
        $.dialog.errorTips("你没有选择任何选项！");
    }
    else {
        $.dialog.confirm('确定删除选择的管理员吗？', function () {
            var loading = showLoading();
            $.post("./BatchDelete", { ids: selectids.join(',') }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
        });
    }
}

function query() {
    $("#list").TaoLaDatagrid({
        url: './list',
        nowrap: false,
        rownumbers: true,
        NoDataMsg: '没有找到符合条件的数据',
        border: false,
        fit: true,
        fitColumns: true,
        pagination: true,
        idField: "Id",
        pageSize: 10,
        pageNumber: 1,
        queryParams: {},
        toolbar: /*"#goods-datagrid-toolbar",*/'',
        operationButtons: "#batchOperate",
        columns:
        [[
            { checkbox: true, width: 39 },
            { field: "Id", hidden: true },
            { field: "UserName", title: '管理员' },
            { field: "CreateDate", title: '创建日期' },
            { field: "RoleName", title: '权限组' },
        {
            field: "operation", operation: true, title: "操作",
            formatter: function (value, row, index) {
                var id = row.Id.toString();
                var roleid = row.RoleId.toString();
                var username = row.UserName.toString();
                var html = ["<span class=\"btn-a\">"];
                html.push("<a onclick=\"ChangePassWord('" + id + "','" + username + "','" + roleid + "');\">修改</a>");
                if (row.RoleId != 0) {
                    html.push("<a onclick=\"Delete('" + id + "');\">删除</a>");
                }
                html.push("</span>");
                return html.join("");
            }
        }
        ]]
    });
}

function LoadRoleList(callback) {
    if ($("#RoleId option").length > 0) {
        callback();
        return;
    }
    var loading = showLoading();
    var result = false;
    $.ajax({
        type: 'post',
        url: 'RoleList',
        cache: false,
        async: true,
        data: {},
        dataType: "json",
        success: function (data) {
            loading.close();
            $(data).each(function (index, item) { $("#RoleId").append("<option value=" + item.Id + ">" + item.RoleName + "</option>") });
            callback();
        },
        error: function () {
            loading.close();
        }
    });
}


function ChangePassWord(id, username, roleid) {

    LoadRoleList(function () {
        $("#UserName").val(username).attr("disabled", true);
        $("#PassWord").val("");
        if (roleid != 0) {
            $("#roleGroupDiv").show();
            $("#RoleId").val(roleid);
        }
        else {
            $("#roleGroupDiv").hide();
        }
    });

    $.dialog({
        title: '修改密码',
        lock: true,
        id: 'ChangePwd',
        width: '400px',
        content: document.getElementById("addManagerform"),
        padding: '20px 10px',
        okVal: '确定',
        init: function () {
            $("#PassWord").focus();
        },
        ok: function () {
            var loading = showLoading();
            var SelectedRoleId = $("#RoleId").val();
            if (SelectedRoleId == null)
                SelectedRoleId = 0;
            var password = $("#PassWord").val();
            $.post("./ChangePassWord",
                { id: id, password: password, roleid: SelectedRoleId },
                function (data) {
                    loading.close();
                    if (data.success) {
                        $.dialog.tips("修改成功", function () { if (roleid != 0 && roleid != SelectedRoleId) query(); });
                        $("#password").val("");
                    }
                    else
                        $.dialog.errorTips("修改失败:" + data.msg);
                });
        }
    });
}

function LoadAddBox() {
    LoadRoleList(function () {
        $("#UserNameDiv").show();
        $("#UserName").val("").removeAttr("disabled");
        $("#roleGroupDiv").show();
        $("#PassWord").val("");
        $("#RoleId").val("")
    })
    $.dialog({
        title: '添加管理员',
        id: 'addManager',
        content: document.getElementById("addManagerform"),
        lock: true,
        okVal: '确认添加',
        init: function () {
            $("#UserName").focus();
        },
        ok: function () {
            var roleId = $("#RoleId").val();
            var username = $("#UserName").val();
            var password = $("#PassWord").val();
            if (roleId == null) {
                $.dialog.errorTips("请选择权限组，如果无权限组请先添加！");
                return false;
            }
            if (!CheckAdd(username, password))
                return false;Add
            AddManage(username, password, 1);
        }
    });
}

function AddManage(username, password, roleid) {
    var loading = showLoading();
    $.ajax({
        type: 'post',
        url: 'Add',
        cache: false,
        async: true,
        data: { UserName: username, PassWord: password, RoleId: roleid },
        dataType: "json",
        success: function (data) {
            loading.close();
            if (data.success) {
                $.dialog.tips("添加成功！");
                $("#addManagerform input").val("");
                query();
            }
            else {
                $.dialog.errorTips("添加失败！" + data.msg);
            }
        },
        error: function () {
            loading.close();
        }
    });
}





function CheckAdd(username, password) {
    var reg = /^[\u4E00-\u9FA5\@A-Za-z0-9\_\-]{4,20}$/;
    if (username.length < 4) {
        $.dialog.tips("用户名不能小于4个字符");
        return false;
    }
    else if (!reg.test(username)) {
        $.dialog.tips('用户名需为4-20位字符，支持中英文、数字及"-"、"_"的组合');
        return false;
    }
    else if (password.length < 6) {
        $.dialog.tips("密码不能小于6个字符");
        return false;
    }
    var loading = showLoading();
    var result = false;
    $.ajax({
        type: 'post',
        url: 'IsExistsUserName',
        cache: false,
        async: false,
        data: { UserName: username },
        dataType: "json",
        success: function (data) {
            loading.close();
            result = !data.Exists;
            if (data.Exists)
                $.dialog.errorTips("该用户名已存在！");
        },
        error: function () {
            loading.close();
        }
    });
    return result;
}