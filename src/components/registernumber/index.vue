<template>
    <section>
        <table class="registerNumber">
            <tr class="desc">
                <td colspan="2">新增会员</td>
            </tr>
            <tr>
                <td>用户名：</td>
                <td>
                    <el-input v-model="username" placeholder="请输入用户名" autocomplete="off" class="el-input--mini"></el-input>
                    <span class="tips">用户名由4-16位的字母或数字组成</span>
                </td>
            </tr>
            <tr>
                <td>推荐人：</td>
                <td>{{tjr}}</td>
            </tr>
            <tr>
                <td>推荐码：</td>
                <td>
                    <el-input v-model="tjm" placeholder="请输入推荐码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>真实姓名</td>
                <td>
                    <el-input v-model="name" placeholder="请输入真实姓名" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>手机号码：</td>
                <td>
                    <el-input v-model="tel" placeholder="请输入手机号码" autocomplete="off" class="el-input--mini"></el-input>
                    <el-button type="primary" class="el-button--mini" :disabled="yzm" @click="send">{{timetest}}</el-button>
                </td>
            </tr>
            <tr>
                <td>手机验证码：</td>
                <td>
                    <el-input v-model="telyzm" placeholder="请输入手机验证码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>登录密码：</td>
                <td>
                    <el-input v-model="password" type="password" placeholder="请输入登录密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>确认登录密码：</td>
                <td>
                    <el-input v-model="password2" type="password" placeholder="请再次确认登录密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>安全密码：</td>
                <td>
                    <el-input v-model="password3" type="password" placeholder="请输入安全密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>确认安全密码：</td>
                <td>
                    <el-input v-model="password4" type="password" placeholder="请再次确认安全密码" autocomplete="off" class="el-input--mini"></el-input>
                </td>
            </tr>
            <tr>
                <td>用户等级：</td>
                <td>
                    <el-select v-model="money" placeholder="请选择用户等级" class="el-select--mini">
                        <el-option
                        v-for="item in moneyList"
                        :key="item.level_id"
                        :label="item.level_name"
                        :value="item.level_id"
                        >
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="submit">增加成员</el-button>
                    <el-button type="warning" class="el-button--mini" @click="reset">重置</el-button>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            tjm: '',
            name: '',
            tel: '',
            yzm: false,
            telyzm: '',
            password2: '',
            password3: '',
            password4: '',
            tjr: '',
            storage: '',
            timetest: '发送验证码',
            time: '',
            timer: null,
            timetext: '重新获取',
            moneyList: [],
            money: ''
        }
    },
    mounted() {
        this.storage = window.localStorage
        this.tjr = JSON.parse(this.storage.getItem("ust")).username
        ///member/level/getLevelList
        this.$http({
            method: "get",
            url: "/member/level/getLevelList",
            params: {
                token: this.storage.getItem("token")
            }
        })
        .then(res=>{
            this.moneyList = res.data.data
        })
    },
    methods: {
        reset() {
            this.username = '',
            this.password = '',
            this.tjm = '',
            this.name = '',
            this.tel = '',
            this.telyzm = '',
            this.password2 = '',
            this.password3 = '',
            this.password4 = '',
            this.money = ''
        },
        // !(/^1[34578]\d{9}$/.test(this.tel))
        submit() {
            if(!(/^\w{4,16}$/.test(this.username))) {
                this.$message({
                    message: '用户名必须由4-16位的字母或数字组成',
                    type: 'error'
                })
            }else if (this.name == '') {
                this.$message({
                    message: '真实姓名不能为空',
                    type: 'error'
                })
            }else if (this.tel == '') {
                this.$message({
                    message: '手机号码不能为空',
                    type: 'error'
                })
            }else if (this.telyzm == '') {
                this.$message({
                    message: '手机验证码不能为空',
                    type: 'error'
                })
            }else if (this.password == '') {
                this.$message({
                    message: '登录密码不能为空',
                    type: 'error'
                })
            }else if (this.password2 == '') {
                this.$message({
                    message: '确认登录密码不能为空',
                    type: 'error'
                })
            }else if (!(this.password == this.password2)) {
                this.$message({
                    message: '两次输入的登录密码不一样，请重新输入',
                    type: 'error'
                })
            }else if (this.password3 == '') {
                this.$message({
                    message: '安全密码不能为空',
                    type: 'error'
                })
            }else if (this.password4 == '') {
                this.$message({
                    message: '确认安全密码不能为空',
                    type: 'error'
                })
            }
            else if (!(this.password3 ==this.password4)) {
                this.$message({
                    message: '两次输入的安全密码不一样，请重新输入',
                    type: 'error'
                })
            }else if (this.money == '') {
                this.$message({
                    message: '用户等级不能为空',
                    type: 'error'
                })
            }else {
                // 普通用户注册下线用户 - /member/member/createSubMember
                // point:积分username:用户名login_pwd:登录密码mobile:手机号code:验证码
                this.$http({
                    method: "get",
                    url: "/member/member/createSubMember",
                    params: {
                        token: this.storage.getItem("token"),
                        point: this.moneyList[this.money].level_point,
                        username: this.username,
                        realname: this.name,
                        login_pwd: this.password,
                        confirm_login_pwd: this.password2,
                        mobile: this.tel,
                        safe_pwd: this.password3,
                        confirm_safe_pwd: this.password4,
                        code: this.telyzm 
                    }
                }).then(res=>{
                    if(res.data.code == 200) {
                        this.$message({
                            message: res.data.data,
                            type: 'success'
                        })
                        this.reset()
                    }
                }).catch(error=>{
                    this.$message({
                        message: error.response.data.response,
                        type: 'error'
                    })
                })
            }
        },
        send() {
            if (this.tel == '' || !(/^1[34578]\d{9}$/.test(this.tel))) {
                this.$message({
                    message: '请输入正确的手机号码',
                    type: 'error'
                })
            }else if (/^1[34578]\d{9}$/.test(this.tel)) {
                this.$http({
                    method: "get",
                    url: "/config/sms_auth/createNewSms",
                    params: {
                        token: this.storage.getItem("token"),
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
    tr td {
        font-size: 14px;
        border: 1px solid #ddd;
        padding: 6px 10px 6px 20px;
        text-align: right;
        .tips {
            font-size: 14px;
            margin-left: 10px;
        }
        &:nth-of-type(2n) {
            text-align: left;
            font-weight: 500;
            width: 70%;
        }
        .el-input {
            display: inline;
            font-size: 12px;
        }
        .el-select {
            width: 30%;
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
</style>

