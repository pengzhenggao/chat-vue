<template>
    <div class="content-box">
        <div class="verify-box">
            <slide-verify
                    ref="slideRef"
                    :l="42"
                    :r="10"
                    :w="290"
                    :h="220"
                    :imgs="images"
                    slider-text="向右滑动"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
                    @fulfilled="onRefreshComplete"
                    @again="onAgain"
            >
            </slide-verify>
        </div>
        <div class="tips" :class="!isSuccess?'error' : 'success'">{{ tipsMsg }}</div>
    </div>
</template>

<script>
    export default {
        name: "LoginValidation",
        data() {
            return {
                images: [
                    require('@/assets/login/dog1.jpg'),
                    require('@/assets/login/mao.jpg'),
                    require('@/assets/login/mao2.jpg'),
                    require('@/assets/login/mao4.jpg'),
                ],
                tipsMsg:'',
                isSuccess: true,
            }
        },
        methods: {
            // 成功回调
            onSuccess(){
                this.isSuccess = true;
                this.tipsMsg = '恭喜您，验证成功啦！';
                this.$emit('successValidation')
                var _this = this
                setTimeout(()=>{
                    _this.$refs.slideRef.reset();
                },500)
            },
            // 失败回调
            onFail(){
                this.isSuccess = false;
                this.tipsMsg = '验证失败，请重试哦！';
            },
            // 点击刷新回调
            onRefresh(){
                this.tipsMsg = ''
            },
            // 刷新成功后回调
            onRefreshComplete(){
                this.tipsMsg = '';
                this.isSuccess = true;
            },
            // 检测到非人为操作
            onAgain() {
                this.tipsMsg = "再试一次吧～";
                this.$refs.slideRef.reset();
            }
        }
    }
</script>

<style scoped>
    .error{
        color: red;
    }
    .success{
        color: #3BB54A;
    }
</style>
