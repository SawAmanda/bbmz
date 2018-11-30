<template>
    <section>
        <p class="pageTips">您当前的交易积分：{{tran}}， 中心积分：{{cen}}， 当前转换比例：{{bili}}</p>
        <table class="registerNumber">
            <tr class="desc">
                <td colspan="2">请填写您要转换的中心积分</td>
            </tr>
            <tr>
                <td>转换数量：</td>
                <td>
                    <el-input v-model="input" placeholder="请输入转换数量" autocomplete="off" class="el-input--mini"></el-input>
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
            tran: '',
            cen: '',
            bili: '1:1',
            input: '',
        }
    },
    mounted() {
        this.storage = window.localStorage
        let ustdata = JSON.parse(this.storage.getItem("ust"))
        this.cen = ustdata.cen
        this.tran = ustdata.tran
    },
    methods: {
        open4() {
            if (this.input == '' || this.input == this.tran || this.input == 0) {
                this.$message({
                    showClose: true,
                    message: '请输入正确的转换数量',
                    type: 'error'
                });
            }else if(this.input > this.tran) {
                this.$message({
                    showClose: true,
                    message: '要转换的中心积分的数量不能大于当前的拥有的中心积分数量',
                    type: 'error'
                });
            }else {
                this.$http({
                    method: "get",
                    url: "/member/member_store/tranToCenter",
                    //发送两个数据 token验证用户是否登陆 point转换数量
                    params: {
                        token: window.localStorage.getItem("token"),
                        point: this.input
                    }
                })
                .then(res=>{
                    if(res.data.code == 200) {
                        let cen = parseInt(this.cen)
                        let input = parseInt(this.input)
                        let tran = parseInt(this.tran)
                        this.cen = cen + input
                        this.tran = tran - input
                        this.$root.getMe(this.storage.getItem("token"))
                        this.input = ''
                    }
                })
                .catch(error=>{
                    if (error.response.data.code == 400) {
                        this.$message({
                            message: error.response.data.response,
                            type: 'error'
                        })
                    }
                })
            }
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

