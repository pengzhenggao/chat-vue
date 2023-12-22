<template>
    <div class="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script>
    export default {
        name: "Loading3"
    }
</script>

<style scoped>
    .loading,
    .loading > div {
        margin-top: 10px;
        position: relative;
        box-sizing: border-box;
    }

    .loading {
        display: block;
        font-size: 0;
        color: #000;
    }

    .loading.la-dark {
        color: #333;
    }

    .loading > div {
        display: inline-block;
        float: none;
        background-color: currentColor;
        border: 0 solid currentColor;
    }

    .loading {
        width: 40px;
        height: 32px;
    }

    .loading > div {
        width: 4px;
        height: 32px;
        margin: 2px;
        margin-top: 0;
        margin-bottom: 0;
        border-radius: 0;
        animation-name: line-scale-party;
        animation-iteration-count: infinite;
    }
    .loading.la-sm {
        width: 20px;
        height: 16px;
    }

    .loading.la-sm > div {
        width: 2px;
        height: 16px;
        margin: 1px;
        margin-top: 0;
        margin-bottom: 0;
    }

    .loading.la-2x {
        width: 80px;
        height: 64px;
    }

    .loading.la-2x > div {
        width: 8px;
        height: 64px;
        margin: 4px;
        margin-top: 0;
        margin-bottom: 0;
    }

    .loading.la-3x {
        width: 120px;
        height: 96px;
    }

    .loading.la-3x > div {
        width: 12px;
        height: 96px;
        margin: 6px;
        margin-top: 0;
        margin-bottom: 0;
    }

    @keyframes line-scale-party {
        0% {
            transform: scaleY(1);
        }

        50% {
            transform: scaleY(0.4);
        }

        100% {
            transform: scaleY(1);
        }
    }
</style>
