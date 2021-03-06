﻿$(function () {
    query();
    $("#searchBtn").click(function () { query(); });
    DistributionOrder();
});

function query() {
    $("#list").hiMallDatagrid({
        url: './List',
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
        queryParams: { ProductName: $("#ProductName").val(), shopName: $("#ShopName").val(), status: $("#Status").val() },
        toolbar: /*"#goods-datagrid-toolbar",*/'',
        columns:
        [[
            { field: "Id", hidden: true },
            { field: "ProductName", title: '商品名称' },
            { field: "ProDisStatus", title: '分销状态',width:100 },
            { field: "ShopName", title: '所属商家' },
             { field: "AgentNum", title: '代理次数' },
              { field: "ForwardNum", title: '转发次数' },
            { field: "DistributionSaleNum", title: '推广成交数' },
            { field: "DistributionSaleAmount", title: '推广成交额' },
            { field: "SaleNum", title: '总交易数' },
            { field: "SaleAmount", title: '总交易额' },
            { field: "Brokerage", title: '分销佣金（已结算）', width: 100, },
           
        {
            field: "operation", operation: true, title: "排序", width: 90,
            formatter: function (value, row, index) {
                 var id = row.Id;
                var html = ["<span class=\"btn-a\">"];      
                html.push("<input type='textbox' class='text-order' data-id='" + id + "' value='" + row.Sort + "'></input>");
                html.push("</span>");
                return html.join("");
            }
        }
        ]]
    });
}
function AutoComplete() {
    //autocomplete
    $('#autoTextBox').autocomplete({
        source: function (query, process) {
            var matchCount = this.options.items;//返回结果集最大数量
            $.post("./getMembers", { "keyWords": $('#autoTextBox').val() }, function (respData) {
                return process(respData);
            });
        },
        formatItem: function (item) {
            return item.value;
        },
        setValue: function (item) {
            return { 'data-value': item.value, 'real-value': item.key};
        }
    });
}




function DistributionOrder()
{
    var _order = 0;
    $('.container').on('focus', '.text-order', function () {
        _order = parseInt($(this).val());
    });
    $('.container').on('blur', '.text-order', function () {
        var id = $(this).data("id");
        if ($(this).hasClass('text-order')) {
            if (isNaN($(this).val()) || parseInt($(this).val()) <= 0) {
                //$.dialog({
                //    title: '更新排序信息',
                //    lock: true,
                //    width: '400px',
                //    padding: '20px',
                //    content: ['<div class="dialog-form">您输入的序号不合法,此项只能是大于零的整数.</div>'].join(''),
                //    button: [
                //    {
                //        name: '关闭',
                //    }]
                //});
                $.dialog.errorTips("您输入的序号不合法,此项只能是大于零的整数", function () { $(this).val(_order); });
            } else {
                if (parseInt($(this).val()) === _order) return;
                UpdateOrder(id, parseInt($(this).val()));
            }
        }
    });
};


function UpdateOrder(pid,sort)
{
    $.ajax({
        type: "post",
        async: false,
        url: "UpdateDistrituionOrder",
        data: { pid:pid,sort:sort},
        success: function (result) {
            if (result.success == true) {
                query();
            }
            else {
                $.dialog.errorTips("更新排序失败！" + result.msg);
            }
        }
    });
}