<template>
    <section>
        <table class="userInfo">
            <tr class="desc">
                <td colspan="4">个人基本信息</td>
            </tr>
            <tr>
                <td>登录用户名：</td>
                <td>{{ust.username}}</td>
                <td>中心积分：</td>
                <td>{{ust.cen}}</td>
            </tr>
            <tr>
                <td>交易积分：</td>
                <td>{{ust.tran}}</td>
                <td>注册积分：</td>
                <td>{{ust.reg}}</td>
            </tr>
            <tr>
                <td>动态积分：</td>
                <td>{{ust.dyn}}</td>
                <td>任务积分：</td>
                <td>{{ust.task}}</td>
            </tr>
            <tr>
                <td>VIP等级：</td>
                <td colspan="3">{{ust.level}}</td>
            </tr>
        </table>
        <table class="noticeList">
            <tr class="desc">
                <td>序号</td>
                <td>公告标题</td>
                <td>作者</td>
                <td>发布时间</td>
            </tr>
            <tr title="点击查看详情" v-for="(notice,index) in getNum" @click="goTourl(index)">
                <td>{{index+1}}</td>
                <td>{{notice.title}}</td>
                <td>admin</td>
                <td>{{notice.create_time}}</td>
            </tr>
            <tr v-if="tableData2.length == 0">
                <td colspan="4">暂无数据</td>
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
            :total="tableData2.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            start: false,
            currentPage:1,
            ustdata: '',
            ust: {
                reg: '',
                tran: '',
                task: '',
                cen: '',
                dyn: '',
                level: '',
                username: '',
            },
            storage: '',
            pagesize:10,
            tableData2: [],
            Newindex: ''
        }
    },
    created() {
        this.storage = window.localStorage
        this.username = this.storage.getItem("username")
        this.ustdata = JSON.parse(this.storage.getItem("ust"))
        this.$root.getMe(this.storage.getItem("token"))
        this.$http({
        method: "get",
            url: "/article/article/getArticleList",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            this.tableData2 = res.data.data
        })
    },
    mounted() {
        this.ust = this.ustdata 
    },
    computed: {
        getNum() {
            let Num = this.tableData2.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num.reverse()
        },
    },
    methods: {
        goTourl(url) {
            this.Newindex = this.tableData2.length - url
            this.$router.push({path:'/index/noticedetail/'+ this.tableData2[this.Newindex-1].id});
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
table {
    width: 100%;
    border-top: 2px solid red;
    border-collapse: collapse;
    tr {
        &:nth-of-type(odd):not(.desc) {
            background: #fbfbfb;
        }
        &:nth-of-type(odd):not(.desc):hover {
            background-color: #f0f9eb;
            cursor: pointer;
        }
        &:nth-of-type(even):not(.desc):hover {
            background-color: oldlace;
            cursor: pointer;
        }
    }
}
.userInfo {
    tr td {
        font-size: 14px;
        border: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        text-align: right;
        font-weight: 600; 
        &:nth-of-type(2n) {
            text-align: left;
            font-weight: 500;
        }
    }
    .desc {
        background: #e8e8e8;
        height: 28px;
        line-height: 28px;
        td {
            text-align: left;
        }
    }
}
.noticeList {
    margin-top: 10px;
    .desc {
        background: #e8e8e8;
        height: 28px;
        line-height: 28px;
    }
    td {
        text-align: center;
        border: 1px solid #ddd;
        font-weight: 400;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
    }
}
</style>

