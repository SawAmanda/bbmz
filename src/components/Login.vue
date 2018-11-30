<!-- 登陆界面 -->
<template>
  <section class="login_bg" id="bg">
    <div class="login_bg2">
      <div class="login">
        <div class="login_title">
          <h3>用户登录</h3>
        </div>
        <div class="login_form">
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="ruleForm2.username" autocomplete="off" placeholder="请输入用户名或手机号码"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
              <el-button @click="centerDialogVisible=true">忘记密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      title="忘记密码"
      :visible.sync="centerDialogVisible"
      width="40%"
      center>
      <span>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="手机号码">
            <el-input type="text" v-model="telnumber" autocomplete="off" placeholder="请输入手机号码"></el-input>
            <el-button type="primary" class="el-button--mini" :disabled="yzm" @click="send">{{timetest}}</el-button>
          </el-form-item>
          <el-form-item label="手机验证码">
            <el-input type="text" v-model="telnumber2" autocomplete="off" placeholder="请输入手机验证码"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="newpassword" autocomplete="off" placeholder="请输入8-16位的大写字母、小写字母和数字组成的新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="newpassword2" autocomplete="off" placeholder="请再次确认新密码" ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="subpass">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名或手机号码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      telnumber: '',
      telnumber2: '',
      newpassword: '',
      newpassword2: '',
      yzm: false,
      timetest: '发送验证码',
      time: '',
      timetext: '重新获取',
      centerDialogVisible: false,
      username: false,
      password: false,
      timer: null,
      successtext: "",
      // localstorage别名
      storage: "",
      ruleForm2: {
        username: "",
        pass: ""
      },
      rules2: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  created() {
    window.localStorage.clear()
  },
  mounted() {
    var H = document.documentElement.clientHeight;
    document.getElementById("bg").style.height = H + "px";
    // 定义localstorage
    this.storage = window.localStorage;
  },
  methods: {
    //登录页面 登录按钮事件
    submitForm(formName) {
      let self = this;
      //利用axios发送Get请求
      self
        .$http({
          method: "get",
          url: "/member/member/signIn",
          //发送两个数据 用户名username和密码login_pwd
          params: {
            username: self.ruleForm2.username,
            login_pwd: self.ruleForm2.pass
          }
        })
        .then(res => {
          /**
           * 获取接口返回的数据
           * 用户名密码正确 返回三个数据 data值（验证是否登录的值）response值（返回文本） code（是否成功）
           * Token：data的字段（作为验证登录的凭证）
           * Success：返回登录文本信息 ｛
           *    1.用户名错误
           *    2.密码错误
           *    3.ok（用户名密码正确）
           * ｝
           * Code：200（登录成功） 400 (所有登录失败后)
           */
          let resdata = {
            token: res.data.data,
            success: res.data.response,
            code: res.data.code
          };
          /**
           * 返回Code为200 登录成功
           * 存储Token字段到localstorage 供其他页面调用
           * Success为ok时 返回 登录成功文本
           * 跳转页面到首页
           */
          if (resdata.code == 200) {
            this.storage.setItem("token", resdata.token);
          }
          if (resdata.success == "ok") {
            this.successtext = "登录成功";
          }

          this.$root.getMe(resdata.token);

          setTimeout(() => {
            this.$router.push({ path: "/index/home" });
            this.$message({
              showClose: true,
              message: this.successtext,
              type: "success"
            });
          }, 500);
        })
        .catch(error => {
          let errorres = error.response.data.response;
          this.$message({
            showClose: true,
            message: errorres,
            type: "error"
          });
        });
    },
    subpass() {
      if (this.telnumber == '' || !(/^1[34578]\d{9}$/.test(this.telnumber))) {
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        })
      }else if (this.newpassword == '' || this.newpassword2 == '') {
        this.$message({
          message: '请输入正确的新密码',
          type: 'error'
        })
      }else if (!(this.newpassword == this.newpassword2)) {
        this.$message({
          message: '请输入正确的新密码',
          type: 'error'
        })
      }else {
        this.$http({
          method: "get",
          url: "/member/member/forgetLoginPwd",
          params: {
            mobile: this.telnumber,
            code: this.telnumber2,
            login_pwd: this.newpassword,
            confirm_login_pwd: this.newpassword2
          }
        })
        .then(res=>{
          if (res.data.code == 200) {
            this.telnumber = '',
            this.telnumber2 = '',
            this.newpassword = '',
            this.newpassword2 = '',
            this.timetest = '发送验证码',
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
            this.centerDialogVisible = false
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
    send() {
      if (this.telnumber == '' || !(/^1[34578]\d{9}$/.test(this.telnumber))) {
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        })
      }else if (/^1[34578]\d{9}$/.test(this.telnumber)) {
        this.$http({
          method: "get",
          url: "/member/member/checkMobileIsExist",
          params: {
            mobile: this.telnumber
          }
        })
        .then(res=>{
          if (res.data.data == true) {
            this.$http({
                method: "get",
                url: "/config/sms_auth/createNewSms",
                params: {
                    mobile: this.telnumber
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
    }
  }
};
</script>

<style lang="scss" scoped>
.login_bg {
  width: 100%;
  height: 100%;
  background: url("../../static/image/bg.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  .login_bg2 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .login {
      width: 600px;
      height: 400px;
      margin: 0 auto;
      padding-top: 105px;
      .login_title {
        color: #fff;
        h3 {
          text-align: center;
          margin-bottom: 30px;
        }
      }
    }
  }
  .el-dialog__wrapper {
    
    .el-dialog__body {
      .el-form-item__content {
        display: flex;
        button {
          margin-right: 0;
          margin-left: 20px;
        }
      }
    }
  } 
}
</style>

