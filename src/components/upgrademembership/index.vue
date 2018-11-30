<template>
    <section>
        <table class="upgrademembership">
            <tr class="desc">
                <td colspan="2">会员升级</td>
            </tr>
            <tr>
                <td>当前等级：</td>
                <td>{{vip}}
                </td>
            </tr>
            <tr>
                <td>当前中心积分数量：</td>
                <td>{{zhongxinjifen}}</td>
            </tr>
            <tr>
                <td>升级至：</td>
                <td>
                    <el-select v-model="value" class="el-select--mini">
                        <el-option v-for="item in options" :key="item.level_id" :label="item.level_name" :value="item.level_id" v-if="item.level_id> user_level"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button type="primary" class="el-button--mini" @click="open4">确认升级</el-button>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
export default {
    data() {
        return {
            vip: null,
            zhongxinjifen: null,
            options: [],
            value: '',
            storage: window.localStorage,
            level: '',
            user_level: ''
        }
    },
    created() {
        let self = this
        this.$root.getMe(this.storage.getItem("token"))
        this.user_level = JSON.parse(this.storage.getItem("ust")).user_level
        this.$http({
            method: "get",
            url: "/member/level/getLevelList",
            params: {
                token: this.storage.getItem("token"),
            }
        })
        .then(res=>{
            self.options = res.data.data
        })
    },
    mounted() {
        this.vip = JSON.parse(this.storage.getItem("ust")).level
        this.zhongxinjifen = JSON.parse(this.storage.getItem("ust")).cen
    },
    methods: {
        open4() {
            if (this.value == '') {
                this.$message({
                    showClose: true,
                    message: '请选择正确的升级等级',
                    type: 'error'
                });
            }else {
                 this.$http({
                    method: "get",
                    url: "/member/member/upgrade",
                    params: {
                        token: this.storage.getItem("token"),
                        level_id: this.value
                    }
                })
                .then(res=>{
                    if (res.data.code == 200) {
                        this.$message({
                            message: res.data.data,
                            type: 'success'
                        })
                        this.value = ''
                        this.$root.getMe(this.storage.getItem("token"))
                        this.zhongxinjifen = JSON.parse(this.storage.getItem("ust")).cen
                        this.vip = JSON.parse(this.storage.getItem("ust")).level
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.pageTips {
    width: 100%;
    height: 40px;
    border: 1px solid #d78860;
    border-radius: 4px;
    background: #ffe8c5;
    font-size: 14px;
    color: #444;
    line-height: 40px;
    padding: 0 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
}
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
            color: #888;
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
.sailList {
    width: 100%;
    margin-top: 10px;
    border-top: 2px solid red;
    border-collapse: collapse;
    .desc td {
        text-align: center;
        font-weight: 600;
    }
    tr td {
        text-align: center!important;
    }
}
.el-input--mini .el-input__inner {
    width: 30% !important;
}
</style>

