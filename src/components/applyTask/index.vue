<template>
    <section>
        <table>
            <tr class="desc">
                <td colspan="2">任务申请</td>
            </tr>
            <tr>
                <td>当前等级：</td>
                <td class="applyTd">
                    <span>{{ust.level}}</span>
                </td>
            </tr>
            <tr>
                <td>最大申请额度：</td>
                <td class="applyTd">
                    <span>{{levelnum}}</span>
                </td>
            </tr>
            <tr>
                <td>任务积分：</td>
                <td class="applyTd">
                    <span>{{ust.task}}</span>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="createNewTask">立即申请</el-button>
                </td>
            </tr>
        </table>
        <table class="tradeList">
            <tr class="desc">
                <td>序号</td>
                <td>交易数量</td>
                <td>交易时间</td>
                <td>申请IP</td>
                <td>来源</td>
            </tr>
            <tr v-for="(apply,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{apply.num}}</td>
                <td>{{apply.time}}</td>
                <td>{{apply.ip}}</td>
                <td>{{apply.from}}</td>
            </tr>
            <tr v-if="applyList.length == 0">
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
            :total="applyList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            level: '',
            levelnum: '',
            worknum: '0',
            currentPage:1,
            pagesize:10,
            ust: '',
            applyList: [],
            newappleList: ''
        }
    },
    created() {
        this.storage = window.localStorage
        this.username = this.storage.getItem("username")
        this.ustdata = JSON.parse(this.storage.getItem("ust"))

        this.$http({
            method: "get",
            url: "/member/level/getLevelInfo",
            params: {
                token: window.localStorage.getItem("token"),
                level_id: this.ustdata.user_level
            }
        })
        .then(res=>{
            this.levelnum = res.data.data.level_max * res.data.data.level_point / 100
        })
    },
    mounted() {
        this.ust = this.ustdata 
        this.$http({
            method: "get",
            url: "/member/task/getMyTaskList",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            for (var i=0;i<res.data.data.length;i++) {
                var pointdata = res.data.data[i]
                this.newappleList = {}
                this.newappleList.num = pointdata.utk_points
                this.newappleList.time = pointdata.create_time_label
                this.newappleList.ip = pointdata.utk_ip
                this.newappleList.from = '申请任务取得积分'
                this.applyList.unshift(this.newappleList)
            }
        })
    },
    computed: {
        getNum() {
            let Num = this.applyList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        },
    },
    methods: {
        handleSizeChange(size) {
            this.pagesize = size;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        createNewTask() {
            let self = this
            self.$http({
                method: "get",
                url: "/member/task/createNewTask",
                params: {
                    token: window.localStorage.getItem("token")
                }
            }).then(res=>{
                if (res.data.code == 200) {
                    this.$message({
                        message: '申请成功',
                        type: 'success'
                    })
                    this.$root.getMe(window.localStorage.getItem("token"))
                    let tasknum = parseInt(this.ust.task)
                    let newtasknum = parseInt(res.data.data)
                    this.ust.task = tasknum + newtasknum
                    this.$http({
                        method: "get",
                        url: "/member/task/getMyTaskList",
                        params: {
                            token: window.localStorage.getItem("token")
                        }
                    }).then(res=>{
                        for (var i=0;i<res.data.data.length;i++) {
                            var pointdata = res.data.data[i]
                            this.newappleList = {}
                            this.newappleList.num = pointdata.utk_points
                            this.newappleList.time = pointdata.create_time_label
                            this.newappleList.ip = pointdata.utk_ip
                            this.newappleList.from = '申请任务取得积分'
                            this.applyList.unshift(this.newappleList)
                        }
                    })
                }
            }).catch(error=>{
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
    cursor: default;
    .desc {
        background: #e8e8e8;
        height: 28px;
        line-height: 28px;
        td {
            text-align: left;
            padding: 0 20px;
            font-weight: 600;
        }
    }
    tr {
        td {
            font-size: 14px;
            border: 1px solid #ddd;
            padding: 6px 10px 6px 20px;
            text-align: right;
            &:nth-of-type(2n) {
                text-align: left;
            }
        }
        .applyTd {
            width: 70%;
        }
    }
    
}
table.tradeList {
    margin-top: 10px;
    tr td {
        text-align: center;
    }
}
</style>

