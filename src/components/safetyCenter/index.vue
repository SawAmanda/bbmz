<template>
    <section>
        <table class="loginPwdManagement registerNumber">
            <tr class="desc">
                <td colspan="2">登录密码管理</td>
            </tr>
            <tr>
                <td>新密码：</td>
                <td>
                    <el-input v-model="newpassword" placeholder="请输入新密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>确认新密码：</td>
                <td>
                    <el-input v-model="newpassword2" placeholder="请确认新密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>手机号码：</td>
                <td>
                    <el-input v-model="tel" placeholder="请输入手机号码" autocomplete="off" class="el-input--mini"></el-input>
                    <el-button type="primary" class="el-button--mini" @click="loginSend" :disabled="yzm">{{timetest}}</el-button>
                </td>
            </tr>
            <tr>
                <td>手机验证码：</td>
                <td>
                    <el-input v-model="tel2" placeholder="请输入手机验证码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="modifyLoginPwd">修改密码</el-button>
                    <el-button type="warning" class="el-button--mini" @click="reset">重置</el-button>
                </td>
            </tr>
        </table>
        <table class="moneyPwdManagement registerNumber">
            <tr class="desc">
                <td colspan="2">交易密码管理</td>
            </tr>
            <tr>
                <td>新密码：</td>
                <td>
                    <el-input v-model="newpassword3" placeholder="请输入新密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>确认新密码：</td>
                <td>
                    <el-input v-model="newpassword4" placeholder="请确认新密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>手机号码：</td>
                <td>
                    <el-input v-model="tel3" placeholder="请输入手机号码" autocomplete="off" class="el-input--mini"></el-input>
                    <el-button type="primary" class="el-button--mini" @click="tranSend" :disabled="yzm2">{{timetest2}}</el-button>
                </td>
            </tr>
            <tr>
                <td>手机验证码：</td>
                <td>
                    <el-input v-model="tel4" placeholder="请输入手机验证码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="modifyTranPwd">修改密码</el-button>
                    <el-button type="warning" class="el-button--mini" @click="reset2">重置</el-button>
                </td>
            </tr>
        </table>
        <table class="moneyPwdManagement">
            <tr class="desc">
                <td colspan="2">上传收款码</td>
            </tr>
            <tr>
                <td>选择文件类型：</td>
                <td>
                    <el-select v-model="value" class="el-select--mini">
                        <el-option v-for="item in lx" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td>选择文件：</td>
                <td>
                    <el-upload
                        class="upload-demo"
                        drag
                        action="/static/assets/plugins/kindeditor/php/upload_json.php?dir=image"
                        multiple
                        :show-file-list=false
                        name="imgFile"
                        :on-success="imgsuccess"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </td>
            </tr>
            <tr>
                <td>微信二维码：</td>
                <td>
                    <img :src="wechatpay" v-if="wechatpay" style="max-height: 200px;">
                </td>
            </tr>
            <tr>
                <td>支付宝二维码：</td>
                <td>
                    <img :src="alipay" style="max-height: 200px;">
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
export default {
    data() {
        return {
            newpassword: '',
            newpassword2: '',
            tel: '',
            tel2: '',
            newpassword3: '',
            newpassword4: '',
            tel3: '',
            tel4: '',
            lx: [
                {
                    value:'1',
                    label:'微信收款码'
                },
                {
                    value:'2',
                    label:'支付宝收款码'
                }
            ],
            value: '',
            yzm: false,
            yzm2: false,
            timetest: '发送验证码',
            time: '',
            timetext: '重新获取',
            timetest2: '发送验证码',
            time2: '',
            timetext2: '重新获取',
            timer: '',
            timer2: '',
            alipay: '',
            wechatpay: '',
        }
    },
    mounted() {
        this.$http({
            method: "get",
            url: "/member/member/getMemberPayCode",
            params: {
                token: window.localStorage.getItem("token"),
                user_id: JSON.parse(window.localStorage.getItem("ust")).user_id
            }
        })
        .then(res=>{
            this.alipay = this.$root.host + res.data.data.alipay
            this.wechatpay = this.$root.host + res.data.data.wechat_pay
        })
        .catch(error=>{
            this.$message({
                message: error.response.data.response,
                type: 'error'
            })
        })
    },
    methods: {
        reset() {
            this.newpassword= '',
            this.newpassword2= '',
            this.tel= '',
            this.tel2= ''
        },
        reset2() {
            this.newpassword3= '',
            this.newpassword4= '',
            this.tel3= '',
            this.tel4= ''
        },
        loginSend() {
            if (this.tel == '' || !(/^1[34578]\d{9}$/.test(this.tel))) {
                this.$message({
                message: '请输入正确的手机号码',
                type: 'error'
            })
            }else if (/^1[34578]\d{9}$/.test(this.tel)) {
                this.$http({
                    method: "get",
                    url: "/member/member/checkMobileIsExist",
                    params: {
                        mobile: this.tel
                    }
                })
                .then(res=>{
                    if (res.data.data == true) {
                        this.$http({
                            method: "get",
                            url: "/config/sms_auth/createNewSms",
                            params: {
                                mobile: this.tel
                            }
                        })
                        let self = this
                        self.yzm = true;
                        self.time = 60
                        self.timer = setInterval(function(){
                            self.time--
                            self.timetest = self.timetext + self.time
                            if(self.time == 0) {
                                self.timetest = '重新获取'
                                self.yzm = false
                                clearInterval(self.timer)
                            }
                        },1000)
                    }else if (res.data.data == false) {
                        this.$message({
                            message: '手机未注册,请先注册',
                            type: 'error'
                        })
                    }
                })
            }
        },
        tranSend() {
            if (this.tel3 == '' || !(/^1[34578]\d{9}$/.test(this.tel3))) {
                this.$message({
                message: '请输入正确的手机号码',
                type: 'error'
            })
            }else if (/^1[34578]\d{9}$/.test(this.tel3)) {
                this.$http({
                    method: "get",
                    url: "/member/member/checkMobileIsExist",
                    params: {
                        mobile: this.tel3
                    }
                })
                .then(res=>{
                    if (res.data.data == true) {
                        this.$http({
                            method: "get",
                            url: "/config/sms_auth/createNewSms",
                            params: {
                                mobile: this.tel3
                            }
                        })
                        let self = this
                        self.yzm2 = true;
                        self.time2 = 60
                        self.timer2 = setInterval(function(){
                            self.time2--
                            self.timetest2 = self.timetext2 + self.time2
                            if(self.time2 == 0) {
                                self.timetest2 = '重新获取'
                                self.yzm2 = false
                                clearInterval(self.timer2)
                            }
                        },1000)
                    }else if (res.data.data == false) {
                        this.$message({
                            message: '手机未注册,请先注册',
                            type: 'error'
                        })
                    }
                })
            }
        },
        imgsuccess(res) {
            var imgurl = res.url
            if (res.error == 0) {
                if (this.value == 1) {
                    this.$http({
                        method: "get",
                        url: "/member/member/updatePayCode",
                        params: {
                            token: window.localStorage.getItem("token"),
                            pic_url: imgurl,
                            code_type: "wechat_pay"
                        }
                    })
                    .then(res=>{
                        this.wechatpay = this.$root.host + imgurl
                        
                    })
                    .catch(error=>{
                        this.$message({
                            message: error.response.data.response,
                            type: 'error'
                        })
                    })
                }else if (this.value == 2) {
                    this.$http({
                        method: "get",
                        url: "/member/member/updatePayCode",
                        params: {
                            token: window.localStorage.getItem("token"),
                            pic_url: imgurl,
                            code_type: "alipay"
                        }
                    })
                    .then(res=>{
                        this.alipay = this.$root.host + imgurl
                    })
                    .catch(error=>{
                        this.$message({
                            message: error.response.data.response,
                            type: 'error'
                        })
                    })
                }
            }
        },
        modifyLoginPwd() {
            if (this.newpassword == '' || this.newpassword2 == '') {
                this.$message({
                    message: '新密码或确认新密码不能为空',
                    type: 'error'
                })
            }else if (!(this.newpassword == this.newpassword2)) {
                this.$message({
                    message: '新密码和确认新密码不一致',
                    type: 'error'
                })
            }else if (this.tel == '' || !(/^1[34578]\d{9}$/.test(this.tel))) {
                this.$message({
                    message: '请输入正确的手机号码',
                    type: 'error'
                })
            }else if (this.tel2 == '') {
                this.$message({
                    message: '手机验证码不能为空',
                    type: 'error'
                })
            }else {
                this.$http({
                    method: "get",
                    url: "/member/member/modifyLoginPwd",
                    params: {
                        token: window.localStorage.getItem("token"),
                        login_pwd: this.newpassword,
                        confirm_pwd: this.newpassword2,
                        mobile: this.tel,
                        code: this.tel2
                    }
                })
                .then(res=>{
                    if (res.data.code == 200) {
                        this.newpassword = ''
                        this.newpassword2 = ''
                        this.tel = ''
                        this.tel2 = ''
                        this.$message({
                            message: '登录密码修改成功',
                            type: 'success'
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
        modifyTranPwd() {
            if (this.newpassword3 == '' || this.newpassword4 == '') {
                this.$message({
                    message: '新密码或确认新密码不能为空',
                    type: 'error'
                })
            }else if (!(this.newpassword3 == this.newpassword4)) {
                this.$message({
                    message: '新密码和确认新密码不一致',
                    type: 'error'
                })
            }else if (this.tel3 == '' || !(/^1[34578]\d{9}$/.test(this.tel3))) {
                this.$message({
                    message: '请输入正确的手机号码',
                    type: 'error'
                })
            }else if (this.tel4 == '') {
                this.$message({
                    message: '手机验证码不能为空',
                    type: 'error'
                })
            }else {
                this.$http({
                    method: "get",
                    url: "/member/member/modifyTranPwd",
                    params: {
                        token: window.localStorage.getItem("token"),
                        tran_pwd: this.newpassword3,
                        confirm_pwd: this.newpassword4,
                        mobile: this.tel3,
                        code: this.tel4
                    }
                })
                .then(res=>{
                    if (res.data.code == 200) {
                        this.newpassword3 = ''
                        this.newpassword4 = ''
                        this.tel3 = ''
                        this.tel4 = ''
                        this.$message({
                            message: '交易密码修改成功',
                            type: 'success'
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
        }
    }
}
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-top: 2px solid red;
    border-collapse: collapse;
    .desc {
        background: #e8e8e8;
        height: 28px;
        line-height: 28px;
        td {
            text-align: left;
            padding: 0 20px;
            font-weight: 600;
            font-size: 14px;
            border: 1px solid #ddd;
        }
    }
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
        
    }
}
.moneyPwdManagement {
    margin-top: 10px;
}
</style>
