<template>
    <div class="drop" @click="routerMailView">
        <div class="drop-left">
            <AnnouncementSvg/>
        </div>
        <div class="drop-right" v-if="id">
            <p >{{title}}</p>
            <p >{{formatDate(time)}}</p>
        </div>
        <div style="font-size: 15px;margin: 0 auto;color: #999999" v-else>
            <span>暂无公告</span>
        </div>
    </div>
</template>

<script>
    import AnnouncementSvg from '../../assets/icon/announcement.svg'
export default {
        components:{
            AnnouncementSvg
        },
    props:{
        title:{
            type:String,
            default:null
        },
        content:{
            type:String,
            default:null
        },
        time:{
            type: String,
            required: true
        },
        id:{
            type:Number,
        }
    },methods:{
        routerMailView(){
            this.$router.push({
                path:"/mail-view",
                query:{
                    id:this.id,
                    type:'announcement'
                }
            })
        },
        formatDate(dateString ){
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    }
}
</script>

<style scoped>
    .drop{
        width: 300px;
        min-height: 65px !important;
        max-height: 87px !important;
        border-bottom: 1px solid #dcdfe6;
        padding: 12px 24px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;

    }
    .drop:hover{
        background: #E2EFFD;
    }
    .drop:hover img{
        transform: scale(1.5) rotate(360deg);
        opacity: 1;
    }
    .drop-left{
        width: 32px;
        height: 32px;
        background: burlywood;
        border-radius: 16px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .drop-left img{
        width: 32px;
        height: 32px;
        transition: all 0.5s;
    }
    .drop-left-icon{
        width: 20px;
        height: 20px;
        fill: currentColor;
        opacity: 0.9;
        transition: all 0.5s;
    }
    .drop-right{
        flex: 1;
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
    }
    .drop-right p{
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .drop-right p:nth-child(1){
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #515a6e;
        margin-bottom: 5px;
        max-height: 44px;
        min-height: 22px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .drop-right p:nth-child(2){
        font-size: 12px;
        color: #808695;
    }
</style>
