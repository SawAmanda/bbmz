<template>
    <section>
        <table class="sailTableList">
            <tr class="desc">
                <td>序号</td>
                <td>交易编号</td>
                <td>交易数量</td>
                <td>购买用户</td>
                <td>出售用户</td>
                <td>出售时间</td>
                <td>状态</td>
            </tr>
            <tr v-for="(sail,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{sail.order_no}}</td>
                <td>{{sail.num}}</td>
                <td>{{buyName}}</td>
                <td>{{sail.seller_username}}</td>
                <td>{{sail.create_time_label}}</td>
                <td v-if="sail.status == 2">
                    <el-button type="primary" class="el-button--mini" @click="buyIn(index)">待付款</el-button>
                </td>
                <td v-if="!(sail.status == 2)">{{sail.status_label}}</td>
            </tr>
            <tr v-if="sailtableList.length == 0">
                <td colspan="7">暂无数据</td>
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
            :total="sailtableList.length">
            </el-pagination>
        </div>
        <div class="selfModal" v-if="selfShade">
            <h3 class="title">卖家信息</h3>
            <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="bgOut">
                <i class="el-message-box__close el-icon-close"></i>
            </button>
            <div class="sailerInfo">
                <p>
                    卖家昵称：<span>{{newbuyList.seller_username}}</span>
                </p>
                <p>
                    卖家手机号码：<span>{{newbuyList.seller_mobile}}</span>
                </p>
                <p>
                    卖家等级：<span>{{newbuyList.user_level_label}}</span>
                </p>
                <p>
                    选择支付方式：
                    <el-radio v-model="pay" label="1">支付宝</el-radio>
                    <el-radio v-model="pay" label="2">微信</el-radio>
                </p>
                <p style="text-align: center;margin-top: 8px;">
                    <img :src="pay==1?ali:wechat">
                </p>
                <p>
                    <el-button type="danger" @click="bgOut">取消</el-button>
                    <el-button type="primary" @click="buynext">已付款，上传支付截图</el-button>
                </p>
            </div>
        </div>
        <div class="qrCodeInfo" v-if="selfShade2">
            <h3 class="title">上传支付截图</h3>
            <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="bgOut2">
                <i class="el-message-box__close el-icon-close"></i>
            </button>
            <el-upload
            class="upload-demo"
            ref="upload"
            action="/static/assets/plugins/kindeditor/php/upload_json.php?dir=image"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            list-type="picture"
            :limit=1
            :on-exceed="handleExceed"
            name="imgFile"
            :on-success="imgsuccess"
            >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
        </div>
        <div class="selfShade" v-if="selfShade||selfShade2" @click="bgOut"></div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentPage:1,
            pagesize:10,
            selfShade: false,
            selfShade2: false,
            sailtableList: [],
            pay:'1',
            newsailtableList: null,
            buyName: JSON.parse(window.localStorage.getItem("ust")).username,
            ali: '',
            wechat: '',
            newbuyList: [],
        }
    },
    mounted() {
        this.$http({
            method: "get",
            url: "/member/tran_center/getMyPayedOrder",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            this.sailtableList = res.data.data
        })
    },
    computed: {
        getNum() {
            let Num = this.sailtableList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    methods: {
        handleSizeChange(size) {
            this.pagesize = size;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        imgsuccess(res) {
            if (res.error == 0) {
                this.$http({
                    method: "get",
                    url: "/member/tran_center/payOrder",
                    params: {
                        token: window.localStorage.getItem("token"),
                        pay_pic : res.url,
                        tran_id : this.newbuyList.d_id
                    }
                })
                .then(res=>{
                    if (res.data.code == 200) {
                        this.selfShade = false;
                        this.selfShade2 = false;
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        })
                        this.$http({
                            method: "get",
                            url: "/member/tran_center/getMyPayedOrder",
                            params: {
                                token: window.localStorage.getItem("token")
                            }
                        }).then(res=>{
                            this.sailtableList = res.data.data
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        message: error.response.data.response,
                        type: 'error'
                    })
                })
                
                
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning('当前限制选择 1 个文件');
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
        },
        handlePreview(file) {
        },
        buyIn(index) {
            this.selfShade = true;
            this.newbuyList = this.sailtableList[index]
            this.$http({
                method: "get",
                url: "/member/member/getMemberPayCode",
                params: {
                    token: window.localStorage.getItem("token"),
                    user_id: this.newbuyList.seller_uid
                }
            })
            .then(res=>{
                this.ali = this.$root.host + res.data.data.alipay
                this.wechat = this.$root.host + res.data.data.wechat_pay
            })
            .catch(()=>{
                this.$message({
                    message: '已取消订单！',
                    type: 'error'
                })
            })
        },
        bgOut() {
            this.selfShade = false;
            this.selfShade2 = false;
        },
        bgOut2() {
            this.selfShade = false;
            this.selfShade2 = false;
        },
        buynext() {
            this.selfShade = false;
            this.selfShade2 = true;
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
            font-size: 14px;
            border: 1px solid #ddd;
            text-align: center;
            padding: 6px 10px 6px 20px;
        }
    }
}

.selfModal {
    position: fixed;
    top: 50%;
    left: 30%;
    right: 30%;
    z-index: 20000;
    background: #fff;
    border-radius: 6px;
    transform: translateY(-50%);
    padding: 15px;
    .title {
        text-align: center;
    }
    .sailerInfo {
        font-size: 14px;
        color: #555;
        line-height: 28px;
        padding: 10px;
        img {
            width: 120px;
            margin: 10px 0;
        }
        p {
            &:last-child {
                margin-top: 20px;
                text-align: center;
            }
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
    h3 {
        margin-bottom: 20px;
        font-weight: 300;
    }
}
</style>

