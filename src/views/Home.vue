<template>
    <div class="scroll">
        <!--        头部-->
        <div class="header" id='testNavBar' :class='{ fixedNavbar: isfixTab }'>
            <div class="system-name">
                <div style="display: flex;flex-direction: row;align-items: center;cursor: pointer">
                    <img src="../../public/logo.png" style="width: 40px"/>
                    <span class="logo-name">{{$t('system.logoName')}}</span>
                </div>
                <div style="margin-left: auto;margin-right: 50px;display: flex;flex-direction: row;align-items: center">
                    <div class="login" @click="routerLogin"><span class="detail"> <i class="el-icon-s-custom"></i>{{$t('system.loginName')}}</span>
                    </div>
                    <div class="register" @click="routerRegister"><span class="detail"><i
                            class="el-icon-user-solid"></i>{{$t('system.registerName')}}</span></div>
                </div>
            </div>
        </div>
        <!--        轮播图-->
        <div style="margin: 0 auto;height: 100%">
            <el-carousel :interval="6000" arrow="always" height="500px">
                <el-carousel-item>
                    <img src="../assets/image/home/chat3.png" style="width: 100%;height: 500px"/>
                </el-carousel-item>
                <el-carousel-item>
                    <img src="../assets/image/home/chat2.png" style="width: 100%;height: 500px"/>
                </el-carousel-item>
            </el-carousel>
        </div>

        <!--        软件生命开发周期-->
        <div class="software">
            <div style="display: flex;flex-direction: column;width: 450px">
                <h1 style="font-size: 50px">软件开发的生命周期</h1>
                <div class="section-subtitle"><span >The life cycle of software development</span></div>
                <div class="ruanjian">
                    <div class="ruanjian-item">
                        <p>1.项目计划</p>
                        <p>PLNNNG</p>
                    </div>
                    <div class="ruanjian-item">
                        <p>2.需求分析</p>
                        <p>ANALYSIS</p>
                    </div>
                    <div class="ruanjian-item">
                        <p>3.软件设计</p>
                        <p>DESIGN</p>
                    </div>
                    <div class="ruanjian-item">
                        <p>4.软件开发</p>
                        <p>IMPLEMENTATION</p>
                    </div>
                    <div class="ruanjian-item">
                        <p>5.集成测试</p>
                        <p>TESTING&INTEGRATION</p>
                    </div>
                    <div class="ruanjian-item">
                        <p>6.系统维护</p>
                        <p>MAINTENANCE</p>
                    </div>
                </div>
            </div>
            <img src="../assets/image/home/life--cycle-of--software--development-ball.png"/>
        </div>

        <div class="advert2"
             @mouseenter="enterImg" @mouseleave="leaveImg">
            <h1 style="font-size: 50px">了解和语系统</h1>
            <el-image :src="require('@/assets/image/home/advert2.png')"></el-image>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                isfixTab:false
            }
        },
        methods: {
            enterImg() {

            },
            leaveImg() {

            },
            handleTabFix() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                var offsetTop = document.querySelector('#testNavBar').offsetTop;
                scrollTop > offsetTop ? this.isfixTab = true : this.isfixTab = false
            },
            routerLogin() {
                this.$router.push("/login")
            },
            routerRegister() {
                this.$router.push("/register")
            }
        },mounted() {
            window.addEventListener('scroll', this.handleTabFix, true)
        },
        beforeRouteLeave (to, from, next) {
            window.removeEventListener('scroll', this.handleTabFix, true)
            next()
        },
    }
</script>

<style scoped>
    .header {
        background-color: white;
        width: 100%;
        height: 60px;
        box-shadow: rgba(0, 0, 0, 0.15) 0 2px 15px;
    }

    .system-name {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        margin-left: 9%;
        font-family: "PingFang SC", serif;
        line-height: 64px;
        font-size: 20px;
        font-weight: 800;
        color: #000000;
    }

    .system-name .logo-name {
        font-size: 28px;
        background-image: -webkit-linear-gradient(top, #bc8550, #d77f34, #de6912);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .login {
        color: #565656;
        font-size: 17px;
        cursor: pointer;
        margin-right: 10px;

    }

    .register {
        color: #565656;
        font-size: 17px;
        cursor: pointer;
    }

    .detail {
        border: 1px solid #bc8550;
        background-color: #efd895;
        padding: 8px
    }

    .detail:hover {
        color: black;
        background-color: #e4ce8e;
    }

    .advert2 {
        background-image: url('../assets/image/home/software-screenshot-background.png');
        background-size: cover;
        width: 100%;
        margin: 80px auto;
        text-align: center;
    }

    .software {
        margin-top: 20px;
        height: 600px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-image: url('../assets/image/home/life--cycle-of--software--development-background.png');
        background-size: cover;
    }

    .section-subtitle {
        letter-spacing: 1.5px;
        font-size: 30px;
        padding: 10px 0 20px;
        text-shadow: 1px 3px 3px #ccc;
        color: #9999998c;
    }

    .ruanjian{
        text-align: left;
        letter-spacing: 1.5px;
        font-size: 14px;
        text-shadow: 1px 3px 3px #ccc;
        color: #9999998c;
        margin-left: 5px;
    }
    .ruanjian-item {
        width: 220px;
        padding: 5px 0;
    }


    #circle {
        background: #f8f9fa;
        float: left;
        width: 100%;
        padding: 20px 0 50px;
    }

    .fixedNavbar {
        background-color: #f3f3f3;
        position: fixed;
        width: 100%;
        z-index: 2032;
        top: 0;
        left: 0;
        padding-bottom: 5px;
    }

</style>
