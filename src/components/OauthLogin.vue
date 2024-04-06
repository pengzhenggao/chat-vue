<template>
    <div class="oauth-background">
        <div id="preloader_1">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>

<script>
    import service from "../http";

    export default {
        name: "OauthLogin.vue",
        data(){
            return{

            }
        },
        created() {
            this.getAccessToken()
        },
        methods:{
            getAccessToken(){
                let code = this.$route.query.code;
                if (this.$route.path==="/oauth/login/gitee"){
                    this.gitee(code)
                }else if (this.$route.path==="/oauth/login/github"){
                    this.github(code)
                }else if (this.$route.path==="/oauth/login/qq"){
                    this.qq(code)
                }
            },
            qq(code){
                service({
                    method:"get",
                    url:"/users/QQAccessToken/getAccessToken",
                    params:{
                        code:code
                    }
                }).then(res=>{
                    if (res && res.code===20000){
                        this.oauthLogin(res.message,"qq")
                    }else{
                        this.$router.push("/login")
                    }
                }).catch(()=>{
                    this.$router.push("/login")
                })
            },
            github(code){
                service({
                    method:"get",
                    url:"/users/gitHubAccessToken/getAccessToken",
                    params:{
                        code:code
                    }
                }).then(res=>{
                    if (res && res.code===20000){
                        this.oauthLogin(res.message,"github")
                    }else{
                        this.$router.push("/login")
                    }
                }).catch(()=>{
                    this.$router.push("/login")
                })
            },
            gitee(code){
                service({
                    method:"get",
                    url:"/users/giteeAccessToken/getAccessToken",
                    params:{
                        code:code
                    }
                }).then(res=>{
                    if (res.code===20000){
                        this.oauthLogin(res.message,"gitee")
                    }else{
                        this.$router.push("/login")
                    }
                }).catch(()=>{

                    this.$router.push("/login")
                })
            },
            oauthLogin(accessToken,type){
                service({
                    method:"get",
                    url:`/${type}/callback`,
                    params:{
                        accessToken:accessToken
                    }
                }).then(res=>{
                    if (res.code===20000){
                        this.$store.dispatch('user/saveUserLogin', res.data).then(res=>{
                            this.$router.push('/')
                        })
                    }else{
                        this.$router.push("/login")
                    }
                }).catch(()=>{

                    this.$router.push("/login")
                })
            }
        }
    }
</script>

<style scoped>
    .oauth-background {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 1000;
    }
    #preloader_1 {
        position: relative;
        top: 45vh;
        left: 45vw;
    }
    #preloader_1 span {
        display: block;
        bottom: 0px;
        width: 9px;
        height: 5px;
        background: #9b59b6;
        position: absolute;
        animation: preloader_1 1.5s infinite ease-in-out;
    }
    #preloader_1 span:nth-child(2) {
        left: 11px;
        animation-delay: 0.2s;
    }
    #preloader_1 span:nth-child(3) {
        left: 22px;
        animation-delay: 0.4s;
    }
    #preloader_1 span:nth-child(4) {
        left: 33px;
        animation-delay: 0.6s;
    }
    #preloader_1 span:nth-child(5) {
        left: 44px;
        animation-delay: 0.8s;
    }
    @keyframes preloader_1 {
        0% {
            height: 5px;
            transform: translateY(0px);
            background: #9b59b6;
        }
        25% {
            height: 30px;
            transform: translateY(15px);
            background: #3498db;
        }
        50% {
            height: 5px;
            transform: translateY(0px);
            background: #9b59b6;
        }
        100% {
            height: 5px;
            transform: translateY(0px);
            background: #9b59b6;
        }
    }
</style>
