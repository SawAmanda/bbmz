<template>
    <section class="shareArea">
        <div class="topPart">
            <div class="topPartOne">
                <p>第<span class="term">{{time}}</span>期，截止时间</p>
                <p>
                    <span>
                        <span>{{hour}}</span>
                        :
                        <span>{{min}}</span>
                        :
                        <span>{{sec}}</span>
                    </span>
                </p>
            </div>
            <div class="topPartTwo">
                <div>
                    <p>
                        第
                        <span class="term">{{time2}}</span>
                        期
                    </p>
                    <p>开奖号码</p>
                </div>
                <div>
                    <p>
                        万位
                        <span>{{num[0]}}</span>
                    </p>
                    <p>
                        千位
                        <span>{{num[2]}}</span>
                    </p>
                    <p>
                        百位
                        <span>{{num[4]}}</span>
                    </p>
                    <p>
                        十位
                        <span>{{num[6]}}</span>
                    </p>
                    <p>
                        个位
                        <span>{{num[8]}}</span>
                    </p>
                </div>
            </div>
            <div class="toPartThree">
                <table>
                    <tr v-for="go in test">
                        <td>{{go.number}}</td>
                        <td>{{go.result}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="mainContent">
            <p class="limit">
                <span>可用额度:<span>{{money}}</span></span>
                <el-tooltip class="item" effect="dark" content="从万、千、百、十、个位任意位置上各选1个号码组成一注" placement="top-start"><span>[玩法介绍]</span>
                </el-tooltip>
                <el-tooltip class="help item" effect="dark" content="从万位、千位、百位、十位、个位任意位置上选择1个号码，相同位置上的开奖号码含有所选号码，即为中奖。" placement="top-start"><span>[帮助]</span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="投注方案：1；开奖号码万位：1，即中万位一等奖。" placement="top-start"><span>[案例]</span>
                </el-tooltip>
            </p>
            <div class="selectorContent">
                <ul class="leftContent">
                    <li v-for="(buystart,index) in buylocation">
                        <p class="moneyPosition">{{buystart}}</p>
                        <p class="numList">
                            <span v-for="go in lottery">{{go}}</span>
                        </p>
                        <p class="typeList">
                            <span @click="big_click($event,index)">{{ruleList[0]}}</span>
                            <span @click="small_click($event,index)">{{ruleList[1]}}</span>
                            <span @click="one_click($event,index)">{{ruleList[2]}}</span>
                            <span @click="two_click($event,index)">{{ruleList[3]}}</span>
                            <span @click="clear_click($event,index)">{{ruleList[4]}}</span>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="showContent">
                <div class="btnList">
                    <p class="btn selectBtn" @click="confirm">选好了</p>
                    <p class="btn confirmBuyBtn" @click="buyconfirm">确认购买</p>
                </div>
                <div class="tableList">
                    <table>
                        <tr v-for="(record,index) in buyrecord">
                            <td>
                                <el-radio v-model="radio" :label=index @change="changeradio(index)"></el-radio>
                            </td>
                            <td>{{record.time}}</td>
                            <td>{{record.num1}}</td>
                            <td>{{record.num2}}</td>
                            <td>{{record.num3}}</td>
                            <td>
                                <i class="el-icon-error" @click="open2(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="buyLotteryList">
            <p class="title">购彩明细</p>
            <table>
                <tr class="desc">
                    <td v-for="desc in lotteryList">{{desc}}</td>
                </tr>
                <tr v-for="(dingdan,index) in getNum">
                    <td>{{index+1}}</td>
                    <td>{{dingdan.order_sn}}</td>
                    <td>{{dingdan.create_time_label}}</td>
                    <td>五星定位胆</td>
                    <td>{{dingdan.ub_term}}</td>
                    <td>{{dingdan.place_label}}</td>
                    <td>{{dingdan.ub_num.replace(/,/g,"")}}</td>
                    <td>{{dingdan.ub_pay}}</td>
                    <td>{{dingdan.ub_win == null?'0':dingdan.ub_win}}</td>
                    <td>{{dingdan.status_label}}</td>
                </tr>
                <tr v-if="lotteryList2.length == 0">
                    <td colspan="10">暂无数据</td>
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
                :total="lotteryList2.length">
                </el-pagination>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            date: '',
            time: '',
            time2: '',
            num: '',
            time3: '',
            hour: '00',
            min: '00',
            sec: '00',
            buyrecord: [],
            buylocation: ['万位','千位','百位','十位','个位'],
            lottery: [0,1,2,3,4,5,6,7,8,9],
            ruleList: ['大','小','单','双','清'],
            radio: '',
            currentPage:1,
            pagesize:10,
            lotteryList: ['序号','订单号','投注时间','玩法','期号','下注位','投注号码','金额（元）','奖金（元）','状态'],
            lotteryList2: [],
            test: '',
            money: 0,
            timer: null,
            buynum: {},
            ub_place: null,
            ub_num: null,
            ub_id: JSON.parse(window.localStorage.getItem("ust")).user_id,
            timer2: null,
            timer3: null,
            miao: 60
        }
    },
    created() {
        this.$root.getMe(window.localStorage.getItem("token"))
        this.$http({
            method: "get",
            url: "/config/result/getLatestNumberResult",
            params: {
                token: window.localStorage.getItem("token"),
            }
        })
        .then(res=>{
            this.time2 = res.data.data.number
            this.num = res.data.data.result
        })
        .catch(error=>{
            this.$message({
                message: error.response.data.response,
                type: 'error'
            })
        })

        this.$http({
            method: "get",
            url: "/config/result/getLatestOpenPrizeLogByBeiBei",
            params: {
                token: window.localStorage.getItem("token"),
            }
        })
        .then(res=>{
            this.test = res.data.data
        })
        .catch(error=>{
            this.$message({
                message: error.response.data.response,
                type: 'error'
            })
        })

        

        this.$http({
            method: "get",
            url: "/member/bet/getMyBet",
            params: {
                token: window.localStorage.getItem("token"),
            }
        })
        .then(res=>{
            this.lotteryList2 = res.data.data
        })
        .catch(error=>{
            this.$message({
                message: error.response.data.response,
                type: 'error'
            })
        })
    },
    mounted() {  
        this.timerun() 
        this.money = JSON.parse(window.localStorage.getItem("ust")).task

        this.timer = setInterval(()=>{
            this.miao--
            if (this.miao == 0) {
                this.$http({
                    method: "get",
                    url: "/config/result/getLatestNumberResult",
                    params: {
                        token: window.localStorage.getItem("token"),
                    }
                })
                .then(res=>{
                    this.time2 = res.data.data.number
                    this.num = res.data.data.result
                })
                .catch(error=>{
                    this.$message({
                        message: error.response.data.response,
                        type: 'error'
                    })
                })

                this.$http({
                    method: "get",
                    url: "/config/result/getLatestOpenPrizeLogByBeiBei",
                    params: {
                        token: window.localStorage.getItem("token"),
                    }
                })
                .then(res=>{
                    this.test = res.data.data
                })
                .catch(error=>{
                    this.$message({
                        message: error.response.data.response,
                        type: 'error'
                    })
                })
                this.miao = 60
            }
        },1000)

    },
    computed: {
        getNum() {
            let Num = this.lotteryList2.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
            return Num
        }
    },
    methods: {
        handleSizeChange(size) {
            this.pagesize = size;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        open2(index) {
            this.$confirm('确定删除该组号码？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.buyrecord.splice(index,1)
            }).catch(()=>{
                this.$message({
                    message: error.response.data.response,
                    type: 'error'
                })
            })
        },
        big_click(event,index) {
            this.buynum.ub_place = index
            if(index == 0) {
                this.buynum.num1 = "万"
            }else if(index == 1) {
                this.buynum.num1 = "千"
            }else if(index == 2) {
                this.buynum.num1 = "百"
            }else if(index == 3) {
                this.buynum.num1 = "十"
            }else if(index == 4) {
                this.buynum.num1 = "个"
            }
            this.buynum.num2 = event.target.innerHTML
            this.buynum.num3 = '56789'
            let parentList = event.target.parentNode.parentNode.parentNode.children
            for (var j = 0;j<parentList.length;j++) {
                let List2 = parentList[j].children[1].children;
                for (var a = 0;a<List2.length;a++) {
                    let List3 = List2[a];
                    List3.classList.remove("active")
                    parentList[index].children[1].children[0].classList.remove("active")
                    parentList[index].children[1].children[1].classList.remove("active")                  
                    parentList[index].children[1].children[2].classList.remove("active")                  
                    parentList[index].children[1].children[3].classList.remove("active")                  
                    parentList[index].children[1].children[4].classList.remove("active")                  
                    parentList[index].children[1].children[5].classList.add("active")
                    parentList[index].children[1].children[6].classList.add("active")
                    parentList[index].children[1].children[7].classList.add("active")
                    parentList[index].children[1].children[8].classList.add("active")
                    parentList[index].children[1].children[9].classList.add("active")
                }
            }
        },
        small_click(event,index) {
            this.buynum.ub_place = index
            if(index == 0) {
                this.buynum.num1 = "万"
            }else if(index == 1) {
                this.buynum.num1 = "千"
            }else if(index == 2) {
                this.buynum.num1 = "百"
            }else if(index == 3) {
                this.buynum.num1 = "十"
            }else if(index == 4) {
                this.buynum.num1 = "个"
            }
            this.buynum.num2 = event.target.innerHTML
            this.buynum.num3 = '01234'
            let parentList = event.target.parentNode.parentNode.parentNode.children
            for (var j = 0;j<parentList.length;j++) {
                let List2 = parentList[j].children[1].children;
                for (var a = 0;a<List2.length;a++) {
                    let List3 = List2[a];
                    List3.classList.remove("active")
                    parentList[index].children[1].children[5].classList.remove("active")
                    parentList[index].children[1].children[6].classList.remove("active")                  
                    parentList[index].children[1].children[7].classList.remove("active")                  
                    parentList[index].children[1].children[8].classList.remove("active")                  
                    parentList[index].children[1].children[9].classList.remove("active")                  
                    parentList[index].children[1].children[0].classList.add("active")
                    parentList[index].children[1].children[1].classList.add("active")
                    parentList[index].children[1].children[2].classList.add("active")
                    parentList[index].children[1].children[3].classList.add("active")
                    parentList[index].children[1].children[4].classList.add("active")
                }
            }
        },
        one_click(event,index) {
            this.buynum.ub_place = index
            if(index == 0) {
                this.buynum.num1 = "万"
            }else if(index == 1) {
                this.buynum.num1 = "千"
            }else if(index == 2) {
                this.buynum.num1 = "百"
            }else if(index == 3) {
                this.buynum.num1 = "十"
            }else if(index == 4) {
                this.buynum.num1 = "个"
            }
            this.buynum.num2 = event.target.innerHTML
            this.buynum.num3 = '13579'
            let parentList = event.target.parentNode.parentNode.parentNode.children
            for (var j = 0;j<parentList.length;j++) {
                let List2 = parentList[j].children[1].children;
                for (var a = 0;a<List2.length;a++) {
                    let List3 = List2[a];
                    List3.classList.remove("active")
                    parentList[index].children[1].children[0].classList.remove("active")
                    parentList[index].children[1].children[2].classList.remove("active")                  
                    parentList[index].children[1].children[4].classList.remove("active")                  
                    parentList[index].children[1].children[6].classList.remove("active")                  
                    parentList[index].children[1].children[8].classList.remove("active")                  
                    parentList[index].children[1].children[1].classList.add("active")
                    parentList[index].children[1].children[3].classList.add("active")
                    parentList[index].children[1].children[5].classList.add("active")
                    parentList[index].children[1].children[7].classList.add("active")
                    parentList[index].children[1].children[9].classList.add("active")
                }
            }
        },
        two_click(event,index) {
            this.buynum.ub_place = index
            if(index == 0) {
                this.buynum.num1 = "万"
            }else if(index == 1) {
                this.buynum.num1 = "千"
            }else if(index == 2) {
                this.buynum.num1 = "百"
            }else if(index == 3) {
                this.buynum.num1 = "十"
            }else if(index == 4) {
                this.buynum.num1 = "个"
            }
            this.buynum.num2 = event.target.innerHTML
            this.buynum.num3 = '02468'
            let parentList = event.target.parentNode.parentNode.parentNode.children
            for (var j = 0;j<parentList.length;j++) {
                let List2 = parentList[j].children[1].children;
                for (var a = 0;a<List2.length;a++) {
                    let List3 = List2[a];
                    List3.classList.remove("active")
                    parentList[index].children[1].children[1].classList.remove("active")
                    parentList[index].children[1].children[3].classList.remove("active")                  
                    parentList[index].children[1].children[5].classList.remove("active")                  
                    parentList[index].children[1].children[7].classList.remove("active")                  
                    parentList[index].children[1].children[9].classList.remove("active")                  
                    parentList[index].children[1].children[0].classList.add("active")
                    parentList[index].children[1].children[2].classList.add("active")
                    parentList[index].children[1].children[4].classList.add("active")
                    parentList[index].children[1].children[6].classList.add("active")
                    parentList[index].children[1].children[8].classList.add("active")
                }
            }
        },
        clear_click(event,index) {
            let childrenList = event.target.parentNode.previousElementSibling.children
            for (var i = 0;i<childrenList.length;i++) {
                let List = childrenList[i];
                List.classList.remove("active")
            }
            let parentList = event.target.parentNode.parentNode.parentNode.children
            for (var j = 0;j<parentList.length;j++) {
                let List2 = parentList[j].children[1].children;
                for (var a = 0;a<List2.length;a++) {
                    let List3 = List2[a];
                    List3.classList.remove("active")
                }
            }
        },
        timerun(){
            this.$http({
                method: "get",
                url: "/config/result/getNewPrizeInfo",
                params: {
                    token: window.localStorage.getItem("token"),
                }
            })
            .then(res=>{
                this.time = res.data.data.currentPeriod
                this.time3 = res.data.data.secondsLeft
                this.hour = parseInt(this.time3/1000/60/60%24)
                this.min = parseInt(this.time3/1000/60%60)
                this.sec = parseInt(this.time3/1000%60)
                if (this.hour < 10 && this.hour >= 0) {
                    this.hour = "0"+ this.hour
                }
                if (this.min < 10 && this.hour >= 0) {
                    this.min = "0"+ this.min
                }
                if (this.sec < 10 && this.sec >= 0) {
                    this.sec = "0"+ this.sec
                }
                if (this.hour < 0) {
                    this.hour = "00"
                }
                if (this.min < 0) {
                    this.min = "00"
                }
                if (this.sec < 0) {
                    this.sec = "00"
                }
                
                this.timer = setInterval(()=>{
                    if (this.time3 < 0) {
                        clearInterval(this.timer)
                        this.buyrecord = []
                        this.timerun()
                    }
                    if (this.time3 > 0) {
                        this.time3 -= 1000
                        this.hour = parseInt(this.time3/1000/60/60%24)
                        this.min = parseInt(this.time3/1000/60%60)
                        this.sec = parseInt(this.time3/1000%60)
                        if (this.hour < 10 && this.hour >= 0) {
                            this.hour = "0"+ this.hour
                        }
                        if (this.min < 10 && this.hour >= 0) {
                            this.min = "0"+ this.min
                        }
                        if (this.sec < 10 && this.sec >= 0) {
                            this.sec = "0"+ this.sec
                        }
                        if (this.hour < 0) {
                            this.hour = "00"
                        }
                        if (this.min < 0) {
                            this.min = "00"
                        }
                        if (this.sec < 0) {
                            this.sec = "00"
                        }
                    }
                },1000)
            })
            .catch(error=>{
                this.$message({
                    message: error.response.data.response,
                    type: 'error'
                })
            })
        },
        confirm(){
            if ((JSON.stringify(this.buynum) == "{}")) {
                this.$message({
                    message: '您还没有选择号码或所选号码不全',
                    type: 'warning'
                })
            }else {
                this.date = new Date();
                var y = this.date.getFullYear();
                var m = this.date.getMonth() + 1;
                m = m<10?('0'+m):m;
                var d = this.date.getDate();
                d = d<10?('0'+d):d;
                var h = this.date.getHours();
                h = h<10?('0'+h):h;
                var min = this.date.getMinutes();
                min = min<10?('0'+min):min;
                var sec = this.date.getSeconds();
                sec = sec<10?('0'+sec):sec;
                this.date = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
                this.buynum.time = this.date
                this.buyrecord.push(this.buynum)
                this.buynum = {}
                var clearList = document.querySelector(".leftContent").children;
                for (var i = 0;i<clearList.length;i++) {
                    let List = clearList[i].children[1].children;
                    for (var a = 0;a<List.length;a++) {
                        let List2 = List[a];
                        List2.classList.remove("active")
                    }
                }
            }
        },
        changeradio(value) {
            var numList = this.buyrecord[value]
            this.ub_place = numList.ub_place;
            this.ub_num = numList.num3.split("").toString();
        },
        buyconfirm() {
            if (!this.ub_place && !this.ub_num) {
                this.$message({
                    message: '请在已选好的列表中选择一注进行购买',
                    type: 'warning'
                })
            }else {
                this.$http({
                    method: "get",
                    url: "/member/bet/createBet",
                    params: {
                        token: window.localStorage.getItem("token"),
                        user_id: this.ub_id,
                        ub_place: this.ub_place,
                        ub_num: this.ub_num
                    }
                })
                .then(res=>{
                    if (res.data.code == 200) {
                        this.$root.getMe(window.localStorage.getItem("token"))
                        this.$message({
                            message: res.data.data,
                            type: 'success'
                        })
                        this.ub_place = null
                        this.ub_num = null
                        this.buyrecord = []
                        this.radio = ''
                        this.money = 0
                        this.$http({
                            method: "get",
                            url: "/member/bet/getMyBet",
                            params: {
                                token: window.localStorage.getItem("token"),
                            }
                        })
                        .then(res=>{
                            this.lotteryList2 = res.data.data
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        message: error.response.data.response,
                        type: 'error'
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.topPart {
    display: flex;
    font-size: 14px;
    background: #f56c6c;
    border-radius: 8px;
    margin-top: 6px;
    padding: 10px 0;
    color: #fff;
    position: relative;
    left: 0;
    top: 0;
    .term {
        color: #fffc00;
        font-weight: 600;
    }
    .topPartOne {
        width: 25%;
        font-size: 14px;
        line-height: 26px;
        text-align: center;
        white-space: nowrap;
        p {
            &:nth-of-type(2) {
                font-size: 20px;
                margin-top: 5px;
                line-height: 30px;
            }
            span span {
                background: #f59898;
                padding: 4px 6px;
                border-radius: 6px;
            }
        }
    }
    .topPartTwo {
        width: 55%;
        display: flex;
        white-space: nowrap;
        div {
            &:first-of-type {
            width: 30%;
            text-align: right;
            font-size: 14px;
            line-height: 24px;
            p {
                &:nth-of-type(2) {
                    font-size: 20px;
                    line-height: 32px;
                }
            }
            }
            &:nth-of-type(2) {
                width: 60%;
                margin-left: 10px;
                display: flex;
                align-items: center;
                p {
                    text-align: center;
                    margin-left: .2rem;
                    span {
                        display: block;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        line-height: 50px;
                        margin-top: 4px;
                        background: #fff;
                        font-size: 26px;
                        text-align: center;
                        color: #f56c6c;
                    }
                }
            }
        }
    }
    .toPartThree {
        width: 20%;
        height: 84px;
        overflow: hidden;
        padding-top: 9px;
        padding-bottom: 7px;
        position: absolute;
        left: 80%;
        top: 0;
        z-index: 100;
        &:hover {
            background: #ff7979;
            border-radius: 0 8px 8px 8px;
            height: 490px;
        }
        cursor: pointer;
        table {
            width: 100%;
            tr {
                &:hover {
                    background: #f56c6c;
                    color: #fff;
                }
                td {
                    padding: 0;
                    line-height: 22px;
                    height: 19px;
                    &:first-of-type {
                        text-align: right;
                        padding-right: .2rem
                    }
                    &:nth-of-type(2) {
                        text-align: left;
                        padding-left: .2rem;
                    }
                }
            }
        }
    }
    &::before,&::after {
        content: "";
        display: block;
        width: 1px;
        height: 62px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA9CAYAAAEbqjPJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFCQjY2NTk0QkVFRjExRTc4MjRBQTAwNjM0RTNCQkJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFCQjY2NTk1QkVFRjExRTc4MjRBQTAwNjM0RTNCQkJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUJCNjY1OTJCRUVGMTFFNzgyNEFBMDA2MzRFM0JCQkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUJCNjY1OTNCRUVGMTFFNzgyNEFBMDA2MzRFM0JCQkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Ii9FMAAAAlklEQVR42mL4//8/KxMDA4MgiFAGEUogghtEvAARtxmASvgAAghE8IC4EiBCE0SIgYjfIOI+SFYSRLADBBCI4ACJgQkeuMmicBYviGAHEf9AxBcQ8R5EvIKzPoGIHwABBjYPxGIGESwgghVOgI3nhLP44IYixNjgYowggglE/AER/8HGw7lfQcR3VNZ3uJKfIOIXXPFfAONCLwCS5asPAAAAAElFTkSuQmCC");
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    &::before {
        left: 25%;
    }
    &::after {
        left: 80%;
    }
}

.mainContent {
    margin-top: 15px;
    .limit {
        display: inline-block;
        font-size: 14px;
        span {
            padding: 3px 6px;
            &:first-of-type {
                background: red;
                display: inline-block;
                color: #fff;
            }
            &:nth-of-type(2) {
                cursor: pointer;
                color: red;
                &:hover {
                    color: #db5c5c;
                }
            }
            &:nth-of-type(3) {
                cursor: help;
                color: red;
                &:hover {
                    color: #db5c5c;
                }
            }
            &:nth-of-type(4) {
                cursor: pointer;
                color: red;
                &:hover {
                    color: #db5c5c;
                }
            }
        }
    }
    .selectorContent {
        margin-top: 1px;
        border-top: 5px solid red;
        display: flex;
        .leftContent {
            width: 100%;
            border: 1px solid #eee;
            li {
                padding: 8px 10px 8px 0;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                p {
                    display: flex;
                    span {
                        display: block;
                        border: 1px solid #f56c6c;
                        color: #f56c6c;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        line-height: 38px;
                        text-align: center;
                        font-size: 14px;
                        margin: 0 6px;
                        cursor: pointer;
                        &:hover {
                            color: #fff;
                            background: #f78989;
                            border-color: #f78989;
                        }
                    }
                }
                .moneyPosition {
                    position: relative;
                    left: 0;
                    top: 0;
                    white-space: nowrap;
                    margin-top: 6px;
                    border-radius: 4px;
                    line-height: 28px;
                    height: 28px;
                    padding: 0 15px;
                    color: #fff;
                    background-color: #f56c6c;
                    border-color: #f56c6c;
                    font-size: 14px;
                    &::before {
                        content: "";
                        width: 4px;
                        height: 36px;
                        border-radius: 2px;
                        display: block;
                        background-color: #f56c6c;
                        border-color: #f56c6c;
                        position: absolute;
                        left: 0;
                        top: -4px;
                    }
                }
                .numList {
                    span {
                        padding: 0;
                        border-radius: 50%;
                        color: #f56c6c;
                        border-color: #f56c6c;
                        font-size: 18px;
                        &:hover {
                            color: #fff;
                            background: #f8d6d6;
                        }
                    }
                    .active {
                        background: #f8d6d6;
                        color: #f56c6c;
                    }
                }
            }
        }
    }
    .showContent {
        margin-top: 10px;
        background: #fff;
        font-size: 12px;
        line-height: 20px;
        width: 100%;
        display: flex;
        border: 1px solid #eee;
        .btnList {
            width: 20%;
            border-right: 1px solid #eee;
            .btn {
                padding: 7px 15px;
                font-size: 12px;
                border-radius: 3px;
                margin-top: 20px;
                text-align: center;
                width: 70%;
                margin-left: 15%;
                color: #fff;
                background-color: #67c23a;
                border-color: #67c23a;
                cursor: pointer;
                &:last-child {
                    background-color: #409eff;
                    border-color: #409eff;
                }
            }
        }
        .tableList {
            width: 80%;
            height: 120px;
            max-height: 120px;
            overflow-y: scroll;
            overflow-x: hidden;
            table {
                width: 100%;
                text-align: center;
                border-collapse: collapse;
                tr {
                    background: #fafafa;
                    &:nth-of-type(odd) {
                        background: #fbfbfb;
                    }
                    td {
                        border-bottom: 1px dotted #e7e7e7;
                        i {
                            cursor: pointer;
                            color: red;
                        }
                    }
                }
            }
        }
    }
}

.buyLotteryList {
    margin-top: 10px;
    .title {
        font-size: 14px;
        line-height: 28px;
    }
    table {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        font-size: 12px;
        line-height: 26px;
        tr {
            background: #fafafa;
            &:nth-of-type(2n):hover {
                background: oldlace;
                cursor: pointer;
            }
            &:nth-of-type(odd):not(.desc):hover {
                background: #f0f0eb;
                cursor: pointer;
            }
        }
        .desc {
            background: #f56c6c;
            color: #fff;
            td {
                border-right: 1px solid #fff;
            }
        }
    }
}
</style>

