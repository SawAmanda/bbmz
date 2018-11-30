<template>
    <section class="numberManagement">
        <table class="pointList">
            <tr class="desc">
                <td>序号</td>
                <td>用户账号</td>
                <td>真实姓名</td>
                <td>在线状态</td>
                <td>手机号</td>
                <td>注册时间</td>
            </tr>
            <tr v-for="(center,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{center.user_name}}</td>
                <td>{{center.re_name == null?'刘明俊':center.re_name}}</td>
                <td>{{center.is_online == 0?'不在线':'在线'}}</td>
                <td>{{center.tel == null?'110':center.tel}}</td>
                <td>{{center.create_time_label}}</td>
            </tr>
            <tr v-if="centerList.length == 0">
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
            :total="centerList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            centerList: [
            ],
            currentPage:1,
            pagesize:10,
            newcenterList: ''
        }
    },
    created() {
        this.$http({
            method: "get",
            url: "/member/member/getMySubMember",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            this.centerList = res.data.data
        })
    },
    computed: {
        getNum() {
            let Num = this.centerList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    methods: {
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
.pointList {
    width: 100%;
    margin-top: 10px;
    border-top: 2px solid red;
    border-collapse: collapse;
    tr {
        td {
            font-size: 13px;
            border: 1px solid #ddd;
            text-align: center;
            line-height: 30px;
            height: 30px;
        }
    }
    .desc {
        background: #e8e8e8;
        cursor: default;
        height: 28px;
        line-height: 28px;
        td {
            text-align: center;
            font-weight: 600;
        }
    }
    .noData {
        td {
            font-size: 14px;
            border: 1px solid #ddd;
            text-align: center;
            line-height: 30px;
            height: 30px;
        }
    }
}
</style>

