<template>
    <section>
        <table class="serviceInfo">
            <tr class="desc">
                <td>序号</td>
                <td>客服名</td>
                <td>手机号</td>
                <td>微信号</td>
                <td>在线状态</td>
            </tr>
            <tr>
                <td>{{service.Id}}</td>
                <td>{{service.Name}}</td>
                <td>{{service.Tel}}</td>
                <td>{{service.Wechat}}</td>
                <td>{{service.State}}</td>
            </tr>
        </table>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentPage:1,
            pagesize:10,
            service: {
                Id: 1,
                Name: '小爱',
                Tel: '00000000000',
                Wechat: 'bei19bei13',
                State: '在线'
            }
        }
    },
    created() {
        this.$http({
        method: "get",
        url: "/config/config/getConfig",
        params: {}
        })
        .then(res=>{
            this.service.Name = res.data.data.site_cust_name
            this.service.Wechat = res.data.data.site_cust_wx
        })
    }
}
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-top: 2px solid red;
    border-collapse: collapse;
    tr {
        td {
            font-size: 14px;
            border: 1px solid #ddd;
            text-align: center;
            padding: 6px 10px 6px 20px;
        }
    }
}
</style>

