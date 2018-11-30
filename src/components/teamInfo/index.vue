<template>
    <section class="numberManagement">
        <table class="numberManagement pointList">
            <tr class="desc">
                <td>团队人数</td>
                <td>团队业绩</td>
                <td>团队奖励</td>
            </tr>
            <tr v-for="jiangli in getNum">
                <td>{{jiangli.num1}}</td>
                <td>{{jiangli.num2}}</td>
                <td>{{jiangli.num3}}</td>
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
            :total="jlList.length">
            </el-pagination>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentPage:1,
            pagesize:10,
            jlList: [
                {
                    num1: 1000,
                    num2: 100000,
                    num3: 20000000
                },
                {
                    num1: 1000,
                    num2: 100000,
                    num3: 20000000
                },
                {
                    num1: 1000,
                    num2: 100000,
                    num3: 20000000
                },
            ]
        }
    },
    computed: {
        getNum() {
            let Num = this.jlList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
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
        cursor: pointer;
        &:nth-of-type(2n):not(.noData):hover {
            background: oldlace;
        }
        &:nth-of-type(odd):not(.desc):hover {
            background: #f0f9eb;
        }
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
}
</style>

