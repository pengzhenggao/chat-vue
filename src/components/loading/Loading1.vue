<template>
    <div style="height: 10px;margin-left: 20px;width: 20px">
        <div class="loading"></div>
    </div>
</template>

<script>
    export default {
        name: "loading1"
    }
</script>

<style scoped>
    .loading {
        display: block;
        position: relative;
        width: 6px;
        height: 10px;

        animation: rectangle infinite 1s ease-in-out -0.2s;

        background-color: #000;
    }

    .loading:before,
    .loading:after {
        position: absolute;
        width: 6px;
        height: 10px;
        content: "";
        background-color: #000;
    }

    .loading:before {
        left: -14px;

        animation: rectangle infinite 1s ease-in-out -0.4s;
    }

    .loading:after {
        right: -14px;

        animation: rectangle infinite 1s ease-in-out;
    }

    @keyframes rectangle {
        0%,
        80%,
        100% {
            height: 10px;
            box-shadow: 0 0 #000;
        }

        40% {
            height: 15px;
            box-shadow: 0 -10px #000;
        }
    }
</style>
