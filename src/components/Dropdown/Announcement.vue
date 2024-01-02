<template>
    <div class="drop">
        <div class="drop-right" v-if="announcementList==null">
            <p style="font-weight: 600">{{announcementList.title}}</p>
            <p style="font-size: 13px" v-html="announcementList.content"></p>
        </div>
        <div v-else style="font-size: 15px;margin: 0 auto;color: #999999">
            <span>暂无公告</span>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        announcementList:{
            type:Object,
            default:null
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
    width: 80px;
    height: 32px;
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
.drop-left-btns{
    height: 20px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 2px;
}
.drop-left-btns-primary{
    background: #E8F6FD;
    border: 1px solid #91D5FF;
}
.drop-left-btns-success{
    background: #F8FDF6;
    border: 1px solid #A2FC76;
}
.drop-left-btns-warning{
    background: #FDF9F4;
    border: 1px solid #FDC673;
}
.drop-left-btns-danger{
    background: #FEF5F5;
    border: 1px solid #FCBEBE;
}
.drop-left-btns-info{
    background: #FCFCFD;
    border: 1px solid #CDCDCD;
}
.drop-right{
    flex: 1;
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
}
.drop-right p:nth-child(1){
    text-align: center;
}
.drop-right p{
    width: 100%;

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
    text-overflow: ellipsis;
    overflow: hidden;
}

</style>
