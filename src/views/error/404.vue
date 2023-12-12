<template>
    <div style="text-align: center;margin-top: 50px">
        <Error/>
        <div>
            抱歉！找不到页面
        </div>
        <div style="margin-top: 10px">
            <div v-if="countDown>0">
                <span style="color: #999999">{{message}}</span>&emsp;
                <span @click="backPage" style="color: #409EFF;font-size: 20px;cursor: pointer">返回上一级</span>
            </div>
            <div v-else>
                <span>正在返回...</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Error from "@/assets/icon/404.svg"

    export default {

        components: {
            Error
        },
        data() {
            return {
                countDown: 10,
                timer: null,
                message: "",
            }
        }, methods: {
            routerIndex(count) {
                if (!this.timer) {
                    if (count) {
                        this.countDown = Number(count)
                    } else {
                        this.countDown = 10;
                        sessionStorage.setItem("count404", this.countDown)
                    }
                    this.message = this.countDown + "秒后跳转上一页面";
                    setInterval(() => {
                        if (this.countDown > 0 && this.countDown <= 10) {
                            this.countDown--;
                            sessionStorage.setItem("count404", this.countDown)
                            this.message = this.countDown + "秒后跳转上一页面";
                        } else {
                            this.backPage()
                        }
                    }, 1000)
                }
            },
            backPage() {
                clearImmediate(this.timer);
                sessionStorage.removeItem("count404")
                this.$router.go(-1)
            }
        },
        mounted() {
            var count = sessionStorage.getItem("count404");
            if (count) {
                this.routerIndex(count)
            } else {
                this.routerIndex()
            }

        }, beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer)
            }
            sessionStorage.removeItem("count404")
        },
    }
</script>

<style scoped>

</style>
