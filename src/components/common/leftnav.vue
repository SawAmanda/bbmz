<template>
    <nav>
        <span class="controlIcon" v-model="isCollapse" @click="tagglecollapse" :class="isCollapse?'inactive':'active'">
            <b :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></b>
        </span>
        <el-menu :default-active="this.$router.path" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <el-menu-item index="/index/home">
                <i class="el-icon-setting"></i>
                <span slot="title">账户首页</span>
            </el-menu-item>
            <el-submenu index="/index" default-active>
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">积分转换</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/index/dynamictocenter">动态积分-中心积分</el-menu-item>
                    <el-menu-item index="/index/centertoregister">中心积分-注册积分</el-menu-item>
                    <el-menu-item index="/index/centertotrade">中心积分-挂卖大厅</el-menu-item>
                    <el-menu-item index="/index/tradetocenter">交易积分-中心积分</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">交易大厅</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/index/buypoint">购买交易积分</el-menu-item>
                    <el-menu-item index="/index/sailpoint">挂卖交易积分</el-menu-item>
                    <el-menu-item index="/index/sailtable">个人挂卖报表</el-menu-item>
                    <el-menu-item index="/index/buytable">个人购买报表</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">会员中心</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/index/teaminfo">团队信息</el-menu-item>
                    <el-menu-item index="/index/registernumber">注册会员</el-menu-item>
                    <el-menu-item index="/index/numbermangement">会员管理</el-menu-item>
                    <el-menu-item index="/index/upgrademembership">会员升级</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">财务管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/index/centerpoint">中心积分报表</el-menu-item>
                    <el-menu-item index="/index/dynamicpoint">动态积分报表</el-menu-item>
                    <el-menu-item index="/index/taskpoint">任务积分报表</el-menu-item>
                    <el-menu-item index="/index/tradepoint">交易积分报表</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">账户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/index/safetycenter">变更密码</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="/index/servicecenter">
                <i class="el-icon-setting"></i>
                <span slot="title">客服中心</span>
            </el-menu-item>
            <el-menu-item @click="exit">
                <i class="el-icon-setting"></i>
                <span slot="title">账号退出</span>
            </el-menu-item>
        </el-menu>
    </nav>
</template>

<script>
export default {
    data() {
      return {
          isCollapse: this.$store.state.isCollapse
      };
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      tagglecollapse(){
          if (this.isCollapse) {
              this.$store.state.isCollapse = false;
              this.isCollapse = this.$store.state.isCollapse
          }else {
              this.$store.state.isCollapse = true;
              this.isCollapse = this.$store.state.isCollapse
          }
      },
      exit() {
        this.$confirm('退出登录，是否继续？','提示',{
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            lockScroll: true,
            showCancelButton: false
        }).then(()=>{
            window.localStorage.clear()
            this.$router.push({path:'/'});
            this.$message({
                type: 'success',
                message: '再见'
            })
        })
      }
    }
}
</script>

<style lang="scss" scoped>
nav {
    position: fixed;
    left: 0;
    top: 118px;
    .controlIcon {
        display: block;
        font-size: 16px;
        font-weight: 900;
        padding: 0 20px;
        text-align: center;
        line-height: 56px;
        border-right: 1px solid #ededed;
        cursor: pointer;
        border-bottom: 1px solid #ededed;
        width: 24px;
        transition: all .3s cubic-bezier(.25,.02,.75,.92);
        &:hover {
            background-color: #ecf5ff;
            b {
                color: #35ff84;
            }
        }
    }
    .active {
        width: 180px;
    }
    .el-menu .el-menu-item-group .el-menu-item {
        padding-left: 60px!important;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 220px;
        min-height: 400px;
        overflow-y: scroll;
    }
    .el-menu {
        border-right: 1px solid #e6e6e6;
        list-style: none;
        position: fixed;
        top: 175px;
        left: 0;
        bottom: 0;
        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: rgba(0,0,0,.2);
        }
        &::-webkit-scrollbar-track {
            border-radius: 0;
            background: rgba(0,0,0,.1);
        }
    }
}
</style>
