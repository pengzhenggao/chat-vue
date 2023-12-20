<template>
    <div>
        <div class="play-audio">
            <div v-show="connectStatus===0" class="contain">
                <div class="connection">
                    <div>正在呼叫</div>
                    <Loading1/>
                </div>
                <el-button type="danger" icon="el-icon-close">挂断</el-button>
            </div>
            <div v-show="connectStatus===1" style="width: 100%">
                <div style="margin: 0 auto;text-align: center;display: flex;flex-direction: column;align-items: center">
                    <div>
                        <img :src="requester.avatar" style="width: 70px;height: 70px;border-radius: 50%;margin: 0 auto">
                        <div>
                            <span style="color: #409EFF">{{requester.nickName}}</span><span>邀请你进行语音通话</span>
                        </div>
                    </div>
                    <div style="margin: 15px 0 15px 0">
                        <Loading1/>
                    </div>

                    <div>
                        <el-button type="danger"><i class="el-icon-close"></i>&nbsp;挂断</el-button>
                        <el-button type="primary"><i class="el-icon-phone-outline"></i>&nbsp;接受</el-button>

                    </div>
                </div>
            </div>
            <div v-show="connectStatus<0" class="connection">
                <div><span><i class="el-icon-warning" style="font-size: 30px;color: darkred"></i>
            </span>
                    <div style="color: darkred">服务器错误</div>
                </div>
            </div>
            <!-- <el-button @click="startCall" ref="start">开始对讲</el-button>
             <el-button @click="stopCall" ref="stop">结束对讲</el-button>-->
        </div>
    </div>
</template>

<script>
    import {socket} from "../../config/websocket/socket";
    import {getToken} from "../../utils/auth";
    import Loading1 from "../loading/Loading1";

    export default {
        name: "VoiceCalls",
        props: {
            friendItem: Object
        },
        components: {
            Loading1
        },
        data() {
            return {
                ws: null,
                mediaStack: null,
                audioCtx: null,
                scriptNode: null,
                source: null,
                play: true,
                fromId: null,
                connectStatus: 0,
                requester: {
                    id: null,
                    nickName: null,
                    avatar: null,
                },
                sendMessage: {
                    action: 10008,
                    token: getToken(),
                    receiverId: "",
                    content: "",
                    extend: 0,
                },
            }
        }, methods: {
            initWs1() {
                //设置好友ID
                let recipientId = localStorage.getItem('userId') == "2" ? "1" : "2";
                this.ws = new WebSocket('ws://192.168.206.204:8081/video/' + localStorage.getItem('userId') + "/" + recipientId)
                this.ws.onopen = () => {
                    console.log('socket 已连接')
                }
                this.ws.binaryType = 'arraybuffer';
                this.ws.onmessage = ({data}) => {
                    console.log("接收到的数据--》" + data)


                    // 将接收的数据转换成与传输过来的数据相同的Float32Array
                    const buffer = new Float32Array(data)
                    // 创建一个空白的AudioBuffer对象，这里的4096跟发送方保持一致，48000是采样率
                    const myArrayBuffer = this.audioCtx.createBuffer(1, 4096, 48000)
                    // 也是由于只创建了一个音轨，可以直接取到0
                    const nowBuffering = myArrayBuffer.getChannelData(0)
                    // 通过循环，将接收过来的数据赋值给简单音频对象
                    for (let i = 0; i < 4096; i++) {
                        nowBuffering[i] = buffer[i]
                    }
                    // 使用AudioBufferSourceNode播放音频
                    const source = this.audioCtx.createBufferSource()
                    source.buffer = myArrayBuffer
                    const gainNode = this.audioCtx.createGain()
                    source.connect(gainNode)
                    gainNode.connect(this.audioCtx.destination)
                    var muteValue = 1;
                    if (!this.play) { // 是否静音
                        muteValue = 0
                    }
                    gainNode.gain.setValueAtTime(muteValue, this.audioCtx.currentTime)
                    source.start()
                }
                this.ws.onerror = (e) => {
                    console.log('发生错误', e)
                }
                this.ws.onclose = () => {
                    console.log('socket closed')
                }

            },
            // 开始对讲
            startCall() {
                this.play = true;
                this.audioCtx = new AudioContext();
                this.fromId = this.friendItem.friendshipId.toString()
                // 该变量存储当前MediaStreamAudioSourceNode的引用
                // 可以通过它关闭麦克风停止音频传输

                // 创建一个ScriptProcessorNode 用于接收当前麦克风的音频
                this.scriptNode = this.audioCtx.createScriptProcessor(4096, 1, 1)
                navigator.mediaDevices
                    .getUserMedia({audio: true, video: false})
                    .then((stream) => {
                        this.mediaStack = stream
                        this.source = this.audioCtx.createMediaStreamSource(stream)

                        this.source.connect(this.scriptNode)
                        this.scriptNode.connect(this.audioCtx.destination)
                    })
                    .catch(function (err) {
                        /* 处理error */
                        console.log('err', err)
                    });
                // 当麦克风有声音输入时，会调用此事件
                // 实际上麦克风始终处于打开状态时，即使不说话，此事件也在一直调用
                this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
                    const inputBuffer = audioProcessingEvent.inputBuffer;
                    // console.log("inputBuffer",inputBuffer);
                    // 由于只创建了一个音轨，这里只取第一个频道的数据
                    // 通过socket传输数据，实际上传输的是Float32Array
                    // console.log("发送的数据",inputData);
                    this.sendMessage.content = inputBuffer.getChannelData(0);
                    this.sendMessage.receiverId = this.fromId;
                    socket.send(this.sendMessage)
                }
            },
            // 关闭麦克风
            stopCall() {
                this.play = false;
                this.mediaStack.getTracks()[0].stop()
                this.scriptNode.disconnect()
            },
            voiceResponse(event) {
                switch (event.message) {
                    case 1:
                        this.connectStatus = 1;
                        this.fromId = event.data.id;
                        this.requester.id = event.data.id;
                        this.requester.avatar = event.data.avatar;
                        this.requester.nickName = event.data.nickName;
                        break;
                    case 2:
                        break;
                    default:

                }
            }
        }
    }
</script>

<style scoped>
    .play-audio {
        margin: 20px;
    }

    .connection {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .contain {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .contain button {
        margin-top: 10px;
    }

    .accepting {

    }
</style>
