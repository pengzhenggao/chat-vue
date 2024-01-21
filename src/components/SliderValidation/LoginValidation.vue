<template>
    <div class="content-box">
        <div class="verify-box">
            <slide-verify
                    ref="slideRef"
                    :l="42"
                    :r="10"
                    :w="290"
                    :h="220"
                    :xl="xl"
                    :yl="yl"
                    :imgs="images"
                    slider-text="向右滑动"
                    @sureEndMove="sureEndMove"
                    @fail="onFail"
                    @refresh="onRefresh"
                    @fulfilled="onRefreshComplete"
                    @again="onAgain">
            </slide-verify>
        </div>
        <div class="tips" :class="!isSuccess?'error' : 'success'">{{ tipsMsg }}</div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "LoginValidation",
        props:{
            //100-200
            xl:{
                type:Number,
                default:0
            },
            //30-160
            yl:{
                type:Number,
                default:0
            },
            sliderName:{
                type:String,
                default:null
            },
            username:{
                type:String,
                default:null
            }
        },
        data() {

            return {
                images: [
                    require('@/assets/login/dog1.jpg'),
                    require('@/assets/login/mao.jpg'),
                    require('@/assets/login/mao2.jpg'),
                    require('@/assets/login/mao4.jpg'),
                ],
                tipsMsg: '',
                isSuccess: true,
            }
        },mounted() {
        },
        methods: {
            // 成功回调
            onSuccess(client) {
                service({
                    method:"post",
                    url:"/verifysliderlocation",
                    data:{sliderName:this.sliderName,account:this.username,currentLocation:client,type:"accountLogin"}
                }).then(res=>{
                    if (res && res.code===20000){
                        this.isSuccess = true;
                        this.tipsMsg = '恭喜您，验证成功啦！';
                        this.$emit('successValidation');
                        var _this = this;
                        setTimeout(() => {
                            _this.$refs.slideRef.reset();
                        }, 500)
                    }
                }).catch(()=>{
                    this.$emit("closeValidation")
                })

            },
            // 失败回调
            onFail() {
                this.isSuccess = false;
                this.tipsMsg = '验证失败，请重试哦！';
                var _this = this;
                setTimeout(() => {
                    _this.$refs.slideRef.reset();
                }, 500)
            },
            // 点击刷新回调
            onRefresh() {
                this.tipsMsg = ''
            },
            // 刷新成功后回调
            onRefreshComplete() {
                this.tipsMsg = '';
                this.isSuccess = true;
            },
            // 检测到非人为操作
            onAgain() {
                this.tipsMsg = "再试一次吧～";
                this.$refs.slideRef.reset();
            },
            sureEndMove(client, times) {
                /**
                 * 鼠标抬起触发事件
                 * 在这里执行请求
                 * 这里为模拟判断, 可根据需求在此处进行请求, 获取状态, 判断是否执行 成功/失败 方法
                 * */
                if (client >= this.xl - 5 && client <= this.xl + 5) {
                    this.onSuccess(client)
                } else {
                    this.onFail();


                }
            }
        }
    }
</script>

<style scoped>
    .error {
        color: red;
    }

    .success {
        color: #3BB54A;
    }
</style>
