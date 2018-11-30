<template>
    <section>
        <div class="searchBox">
            <span class="timeLabel">时间</span>
            <el-date-picker
                v-model="value7"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                class="el-range-editor--small"
                >
            </el-date-picker>
            <el-button type="danger" class="el-button--small">搜索</el-button>
        </div>
        <table>
            <tr class="desc">
                <td>序号</td>
                <td>账户任务积分余量</td>
                <td>交易积分数量</td>
                <td>积分明细</td>
                <td>手续费</td>
                <td>时间</td>
            </tr>
            <tr v-for="(center,index) in getNum">
                <td>{{index+1}}</td>
                <td>{{center.Num1}}</td>
                <td>{{center.Num2}}</td>
                <td>{{center.Do}}</td>
                <td>{{center.Num3}}</td>
                <td>{{center.Time}}</td>
            </tr>
            <tr v-if="centerList.length == 0">
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
            :total="centerList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            centerList: [],
            pickerOptions2: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
            },
            value6: '',
            value7: '',
            currentPage:1,
            pagesize:10,
            newcenterList: '' 
        }
    },
    mounted() {
        this.$http({
            method: "get",
            url: "/member/store_record/getMyTaskRecord",
            params: {
                token: window.localStorage.getItem("token")
            }
        }).then(res=>{
            for (var i=0;i<res.data.data.length;i++) {
                var pointdata = res.data.data[i]
                this.newcenterList = {}
                this.newcenterList.Num1 = pointdata.data.updated_point
                this.newcenterList.Num2 = pointdata.str_num
                this.newcenterList.Do = pointdata.record_type
                this.newcenterList.Time = pointdata.create_time_label
                this.newcenterList.Num3 = pointdata.data.service_charge
                this.centerList.unshift(this.newcenterList)
            }
        })
    },
    computed: {
        getNum() {
            let Num = this.centerList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    methods: {
        goTourl(url) {
            this.$router.push({path:'/'+url});
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
    margin-top: 10px;
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
    tr td {
        font-size: 14px;
        border: 1px solid #ddd;
        line-height: 30px;
        height: 30px;
        text-align: center;
        padding: 5px 0;
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
}
.searchBox {
    font-size: 14px;
    border: 1px solid #ccc;
    background: #f3f3f3;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    .timeLabel {
        margin-right: 6px;
    }
    .el-range-editor {
        height: 32px;
        i {
            line-height: 24px;
        }
    }
    button {
        margin-left: 10px;
    }
}
</style>
