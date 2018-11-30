<template>
    <section>
        <div>
            <h3 class="title">{{title}}</h3>
            <p class="subTitle">
                作者：<span class="author">admin</span>
                发布时间：<span class="publicTime">{{time}}</span>
            </p>
            <p class="content" v-html="content"></p>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {   
            title: '',
            time: '',
            content: ''
        }
    },
    created() {
        this.$http({
        method: "get",
            url: "/article/article/getArticleInfo",
            params: {
                token: window.localStorage.getItem("token"),
                id: this.$route.params.id
            }
        }).then(res=>{
            this.title = res.data.data.title
            this.time = res.data.data.create_time
            this.content = res.data.data.content
        })
    }
}
</script>

<style lang="scss" scoped>
.title {
    line-height: 60px;
    text-align: center;
    font-size: 24px;
}
.subTitle {
    text-align: center;
    color: #777;
    font-size: 12px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    .author {
        margin-right: 20px;
    }
}
.content {
    padding: 10px;
    text-indent: 28px;
    font-size: 14px;
    line-height: 22px;
    color: #333;
}
</style>

