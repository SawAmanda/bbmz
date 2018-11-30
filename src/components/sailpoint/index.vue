<template>
    <section>
        <table class="registerNumber">
            <tr class="desc">
                <td colspan="2">挂卖交易积分</td>
            </tr>
            <tr>
                <td>挂卖数量(可用交易积分{{tran}})：</td>
                <td>
                    <el-input v-model="input" placeholder="请输入挂卖数量" autocomplete="off" class="el-input--mini"></el-input>
                    <span class="tips">挂卖数量需要在103~2062之间</span>
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
                    <el-button type="primary" class="el-button--mini" @click="open4">确认挂卖</el-button>
                </td>
            </tr>
        </table>
        <table class="sailList">
            <tr class="desc">
                <td>序号</td>
                <td>交易编号</td>
                <td>交易数量</td>
                <td>出售用户</td>
                <td>出售时间</td>
                <td>状态</td>
            </tr>
            <tr v-for="(sail,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{sail.order_no}}</td>
                <td>{{sail.num}}</td>
                <td>{{sellername}}</td>
                <td>{{sail.create_time_label}}</td>
                <td>{{sail.status_label}}</td>
            </tr>
            <tr v-if="sailList.length == 0">
                <td colspan="6">暂无数据</td>
            </tr>
        </table>
        <div class="pagation">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sailList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentPage: 1,
            pagesize: 10,
            input: '',
            password: '',
            tran: '',
            sailList: [],
            newsailList: null,
            storage: '',
            sellername: ''
        }
    },
    computed: {
        getNum() {
            let Num = this.sailList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    mounted() {
        this.storage = window.localStorage
        let ustdata = JSON.parse(this.storage.getItem("ust"))
        this.tran = ustdata.tran

        this.$http({
            method: "get",
            url: "/member/tran_center/getMyCreateOrderList",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            this.sailList = res.data.data
            this.sellername = JSON.parse(this.storage.getItem("ust")).username
        })
    },
    methods: {
        open4() {
            let self = this
            self.$http({
                method: "get",
                url: "/member/tran_center/createTranIntegralOrder",
                params: {
                    token: window.localStorage.getItem("token"),
                    point: this.input,
                    tran_pwd: this.password
                }
            }).then(res=>{
                if (res.data.code == 200) {
                    this.$root.getMe(this.storage.getItem("token"))
                    this.tran -= this.input
                    this.input = ''
                    this.password = ''
                    this.$message({
                        showClose: true,
                        message: '挂卖成功',
                        type: 'success'
                    });
                    this.$http({
                        method: "get",
                        url: "/member/tran_center/getMyCreateOrderList",
                        params: {
                            token: window.localStorage.getItem("token")
                        }
                    }).then(res=>{
                        this.sailList = res.data.data
                        this.sellername = JSON.parse(this.storage.getItem("ust")).username
                    })
                }
            }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: error.response.data.response,
                    type: 'error'
                });
            })
        },
        handleSizeChange(size) {
            this.pagesize = size;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
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
.sailList {
    width: 100%;
    margin-top: 10px;
    border-top: 2px solid red;
    border-collapse: collapse;
    .desc td {
        text-align: center;
        font-weight: 600;
    }
    tr td {
        text-align: center!important;
    }
}
.el-input--mini .el-input__inner {
    width: 30% !important;
}
</style>

