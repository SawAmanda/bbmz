<template>
    <section>
        <table class="sailTableList">
            <tr class="desc">
                <td>序号</td>
                <td>交易编号</td>
                <td>交易数量</td>
                <td>购买用户</td>
                <td>购买用户联系方式</td>
                <td>出售用户</td>
                <td>订单时间</td>
                <td>状态</td>
                <td>操作</td>
            </tr>
            <tr v-for="(sail,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{sail.order_no}}</td>
                <td>{{sail.num}}</td>
                <td>{{sail.buyer_username}}</td>
                <td>{{sail.buyer_mobile}}</td>
                <td>{{sellername}}</td>
                <td>{{sail.create_time_label}}</td>
                <td>{{sail.status_label}}</td>
                <td><el-button type="primary" class="el-button--mini" :disabled="!(sail.status==3)" @click="cheackIn(sail)">查看转账截图</el-button></td>
            </tr>
            <tr v-if="sailtableList.length == 0">
                <td colspan="9">暂无数据</td>
            </tr>
            <div class="qrCodeInfo" v-if="selfShade">
                <h3 class="title">转账截图</h3>
                <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="bgOut">
                    <i class="el-message-box__close el-icon-close"></i>
                </button>
                <p style="text-align: center;margin-top: 8px;">
                    <img :src="pay_pic == ''?'':pay_pic" alt="">
                </p>
                <el-button type="danger" @click="bgOut">取消</el-button>
                <el-button style="margin-left: 10px;" type="primary" @click="submit">确认订单</el-button>
                </el-upload>
            </div>
            <div class="selfShade" v-if="selfShade" @click="bgOut"></div>
        </table>
        <div class="pagation">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sailtableList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentPage:1,
            pagesize:10,
            sailtableList: [],
            newsailtableList: {},
            selfShade: false,
            sailtableList2: '',
            pay_pic: ''
        }
    },
    mounted() {
        this.$http({
            method: "get",
            url: "/member/tran_center/getMyCreateOrderList",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            this.sailtableList = res.data.data
            this.sellername = JSON.parse(window.localStorage.getItem("ust")).username
        })
    },
    computed: {
        getNum() {
            let Num = this.sailtableList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    methods: {
        bgOut() {
            this.selfShade = false;
            this.selfShade2 = false;
        },
        handleSizeChange(size) {
            this.pagesize = size;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        //查看转账截图
        cheackIn(index) {
            this.selfShade = true
            this.selfShade2 = index
            this.pay_pic = this.$root.host + this.selfShade2.pay_pic
        },
        submit() {
            this.$http({
                method: "get",
                url: "/member/tran_center/confirmTranIntegralOrder",
                params: {
                    token: window.localStorage.getItem("token"),
                    tran_id: this.selfShade2.d_id
                }
            })
            .then(res=>{
                if (res.data.code == 200) {
                    this.$message({
                        message: '成功确认订单',
                        type: 'success'
                    })
                    this.sailtableList[(this.sailtableList.length - this.selfShade2.d_id)].status = 4
                    this.sailtableList[(this.sailtableList.length - this.selfShade2.d_id)].status_label = '已完成'
                    this.sailtableList = this.sailtableList
                    this.bgOut()
                }
            })
            .catch(error=>{
                this.$message({
                    message: error.response.data.response,
                    type: 'error'
                })
            })
        }
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
            font-size: 13px;
            border: 1px solid #ddd;
            text-align: center;
            padding: 6px 10px 6px 20px;
        }
    }
}

.selfShade {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #000;
    opacity: .4;
    z-index: 10000;
}

.qrCodeInfo {
    position: fixed;
    top: 40%;
    transform: translateY(-50%);
    left: 30%;
    right: 30%;
    z-index: 20000;
    background: #fff;
    border-radius: 6px;
    padding: 15px;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
    img {
        width: 120px;
        margin: 10px 0;
    }
    h3 {
        margin-bottom: 20px;
        font-weight: 300;
    }
}
</style>

