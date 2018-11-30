<template>
    <section class="header">
        <div class="logo">
            <img :src="logoImg" alt="">
        </div>
        <div class="nav">
            <div class="welcomeWord">
                <p>欢迎您！<span class="userName">{{userName}}</span></p>
            </div>
            <div class="navList">
                <div v-for="nav in navList">
                    <router-link :to="nav.url">{{nav.name}}</router-link>
                </div>
            </div>
        </div>
        <Leftnav v-if="!isStart"></Leftnav>
        <RightContent :class="[isStart?'fullWidth noMarginTop':'inactive',isLeft?'active':'inactive']"></RightContent>
    </section>
</template>

<script>
import Leftnav from './common/leftnav'
import RightContent from './common/rightContent'

export default {
    data() {
        return {
            userName: '',
            storage: '',
            Token: '',
            login: '',
            navList: [
                {name:"首页",url:'/index/home'},
                {name:"任务申请",url:'/index/applyTask'},
                {name:"开始任务",url:'/index/shareArea'}
            ],
            logoImg: ''
        }
    },
    created() {
        this.$http({
            method: "get",
            url: "/config/config/getConfig",
            params: {}
        })
        .then(res=>{
            this.logoImg = res.data.data.site_logo
        })
        .catch(error=>{
            this.$message({
                message: error.response.data.response,
                type: 'error'
            })
        })
        this.storage = window.localStorage
        this.Token = this.storage.getItem("token");
        this.userName = JSON.parse(this.storage.getItem("ust")).username
        this.$http({
            method: "get",
            url: "/member/member/checkNormalIsSignIn",
            params: {
                token: this.Token
            }
        }).catch(error=>{
            this.$message({
                message: '请登录后操作',
                type: 'error'
            })
        })
        this.$root.getMe(this.storage.getItem("token"))
    },
    computed: {
        isStart() {
            return this.$route.path == "/index/shareArea"
        },
        isLeft() {
            return this.$store.state.isCollapse
        }
    },
    components: {
        Leftnav,
        RightContent
    },
}
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    .logo {
    width: 100%;
        img {
            display: block;
            width: 100%;
            height: 70px;
        }
    }
    .nav {
        width: 100%;
        height: 48px;
        background-color: #f56c6c;
        font-size: 16px;
        position: relative;
        line-height: 48px;
        display: flex;
        .welcomeWord {
            background-color: #dd5b5deb;
            width: 250px;
            margin-left: 64px;
            text-align: center;
            display: flex;
            border-right: 1px solid #f8c9c9;
            color: #fff;
            overflow: hidden;
            p {
                padding-left: 25px;
            }
        }
        .navList {
            display: flex;
            div a {
                display: block;
                padding: 0 20px;
                font-weight: 600;
                border-right: 1px solid #dbdbdb;
                &:hover {
                    background-color: #db4800;
                }
            }
        }
    }
}
.rightContent {
    position: fixed;
    top: 103px;
    right: 0;
    bottom: 0;
    margin: 15px;
    padding: 15px;
    background-color: #fff;
    overflow-y: scroll;
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
.inactive {
    left: 220px;
    transition: .3s cubic-bezier(.25,.02,.75,.92);
}

.active {
    left: 65px;
    transition: .3s cubic-bezier(.25,.02,.75,.92);
}

.fullWidth {
    left: 0;
}
.noMarginTop {
    margin: 15px 0;
    padding: 0 1rem;
}
</style>

