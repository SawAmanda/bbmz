<template>
    <section>
        <p class="pageTips">您当前的中心积分：{{cen}}， 交易积分：{{tran}}， 当前转换比例：{{bili}}</p>
        <table class="registerNumber">
            <tr class="desc">
                <td colspan="2">请填写您要转换的中心积分</td>
            </tr>
            <tr>
                <td>转换数量：</td>
                <td>
                    <el-input v-model="input" placeholder="请输入转换数量" autocomplete="off" class="el-input--mini"></el-input>
                    <span class="tips">最低转换数量125，最高转换数量2500</span>
                </td>
            </tr>
            <tr>
                <td>交易密码：</td>
                <td>
                    <el-input v-model="password" type="password" placeholder="请输入交易密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="open4">确认转换</el-button>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
export default {
    data() {
        return {
            cen: '',
            tran: '',
            bili: '5:4',
            input: '',
            password: '',
            storage: window.localStorage
        }
    },
    created() {
        this.$root.getMe(this.storage.getItem("token"))
    },
    mounted() {
        let ustdata = JSON.parse(this.storage.getItem("ust"))
        this.cen = ustdata.cen
        this.tran = ustdata.tran
    },
    methods: {
        open4() {
            let self = this
            self.$http({
                method: "get",
                url: "/member/tran_center/createCenterIntegralOrder",
                params: {
                    token: this.storage.getItem("token"),
                    point: this.input,
                    tran_pwd: this.password
                }
            }).then(res=>{
                if (res.data.code == 200) {
                    this.$root.getMe(this.storage.getItem("token"))
                    this.cen -= this.input
                    this.input = ''
                    this.password = ''
                    this.$message({
                        message: '挂卖成功',
                        type: 'success'
                    })
                    this.$root.getMe(window.localStorage.getItem("token"))
                }
            }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: error.response.data.response,
                    type: 'error'
                });
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.pageTips {
    width: 100%;
    height: 40px;
    border: 1px solid #d78860;
    border-radius: 4px;
    background: #ffe8c5;
    font-size: 14px;
    color: #444;
    line-height: 40px;
    padding: 0 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
}
table {
    width: 100%;
    border-top: 2px solid red;
    border-collapse: collapse;
    tr td {
        font-size: 14px;
        border: 1px solid #ddd;
        padding: 6px 10px 6px 20px;
        text-align: right;
        .tips {
            font-size: 14px;
            margin-left: 10px;
            color: #888;
        }
        &:nth-of-type(2n) {
            text-align: left;
            width: 70%;
            font-weight: 500;
        }
        .el-input {
            display: inline;
            font-size: 12px;
        }
    }
    .desc {
        background: #e8e8e8;
        height: 28px;
        line-height: 28px;
        td {
            font-size: 14px;
            border: 1px solid #ddd;
            text-align: left;
            padding: 0 20px;
            font-weight: 600;
        }
    }
}
.el-input--mini .el-input__inner {
    width: 30% !important;
}
</style>

