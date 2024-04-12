<template>
    <div class="main">
        <div style="text-align: center">
            <div class="body-content">
                <h1 class="title"><i class="el-icon-message"></i>&nbsp;{{mailFrom.title}}</h1>
                <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
                    <p class="content"><span v-html="mailFrom.content"></span></p>
                </el-scrollbar>
                <p class="date">通知时间：{{mailFrom.createTime}}</p>
            </div>
            <div style=" background-color: #eaeaea;padding: 20px 0 10px 0">
                <div v-if="mailFrom.isRead!=null">
                    <el-button @click="read(mailFrom.id)" v-if="mailFrom.isRead===0">我已阅读</el-button>
                    <el-button v-else type="info">已阅读</el-button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "EmailView",
        data() {
            return {
                mailFrom: {},
            }
        },
        created() {
            if (!this.$route.query.id || !this.$route.query.type) {
                this.$router.back(-1)
            }
        },
        mounted() {
            var emailId = this.$route.query.id;
            var type = this.$route.query.type;
            if (emailId && type) {
                this.conversion(type, emailId)
            }
        },
        methods: {
            read(id){
                service({
                    method:"put",
                    url:`/users/notify/read/${id}`
                }).then(res=>{
                    if (res.code===20000){
                        this.$notify({
                            title:"阅读邮件",
                            type:"success",
                            message:"已阅读"
                        });
                        this.mailFrom.isRead = 1
                    }
                })
            },
            conversion(type, emailId) {
                switch (type) {
                    case 'notify':
                        this.notifyDetail(emailId);
                        break;
                    case 'announcement':
                        this.announcementDetail(emailId);
                        break;
                }
            },
            notifyDetail(emailId) {
                service({
                    method: "get",
                    url: `/users/NotifyById/${emailId}`
                }).then(res => {
                    this.mailFrom = res.data;
                })
            },
            announcementDetail(emailId) {
                service({
                    method: "get",
                    url: `/users/announcementById/${emailId}`
                }).then(res => {
                    console.log(res)
                    this.mailFrom = res.data;
                })
            },
        }
    }
</script>

<style scoped>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        margin: 0 auto;
    }

    .body-content {
        margin-top: 100px;
        width: 800px;
        height: 250px;
        background-color: #eaeaea;
        padding: 40px 40px 70px 40px;

    }

    .date {
        padding-top: 10px;
        text-align: right;
        font-size: 14px;
        color: #969696;
    }

    .content {
        line-height: 1.5rem;
        text-indent: 2em;
        text-align: left;
    }

    /deep/.el-scrollbar__wrap {
        overflow-y: hidden;
    }
</style>
