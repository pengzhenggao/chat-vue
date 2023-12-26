<template>
    <div>
        <div class="play-audio">
            <div v-show="connectStatus===0" class="contain">
                <div class="connection">
                    <div>正在呼叫</div>
                    <Loading1/>
                </div>
                <el-button type="danger" icon="el-icon-close" @click="endEarly">挂断</el-button>
            </div>
            <div v-show="connectStatus===1">
                <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
                    <div>连接中</div>
                    <Loading1/>
                </div>
            </div>
            <div v-show="connectStatus===3">
                <video v-show="false" ref="remoteVideo" playsinline autoplay></video>
                <div class="play">
                    <div v-if="play" class="microphone" @click="closePlay">
                        <span class="el-icon-microphone"></span>
                    </div>
                    <div v-else class="microphone" @click="startPlay">
                        <span class="el-icon-turn-off-microphone"></span>
                    </div>
                    <Loading2 v-if="play"/>
                    <Loading3 v-if="!play"/>
                    <el-button type="danger" style="margin-top: 10px" @click="closeVoice"><i class="el-icon-close"></i>挂断</el-button>
                </div>
            </div>

            <div v-show="connectStatus===4" style="width: 100%">
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
                        <el-button type="danger" @click="hangUp"><i class="el-icon-close"></i>&nbsp;挂断</el-button>
                        <el-button type="primary" @click="accept"><i class="el-icon-phone-outline"></i>&nbsp;接受
                        </el-button>
                    </div>
                </div>
            </div>
            <div v-show="connectStatus===5">
                <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
                    <span>正在建立连接</span>
                    <Loading1/>
                </div>
            </div>
            <div v-show="connectStatus===6">
                <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
                    <span>正在中断</span>
                    <Loading1/>
                </div>
            </div>
            <div v-show="connectStatus<0">
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
    import Loading2 from "../loading/Loading2";
    import Loading3 from "../loading/Loading3";

    export default {
        name: "VideoCalls",
        components: {
            Loading1,
            Loading2,
            Loading3
        },
        data() {
            return {
                switch: true,
                connectStatus: 0,
                peerConnection: null,
                localStream: null,
                remoteStream: null,
                play: true,
                requester: {
                    id: null,
                    avatar: null,
                    nickName: null,
                },
                fromId: null,
                sendMessage: {
                    action: 10008,
                    token: getToken(),
                    receiverId: "",
                    content: "",
                    extend: 0,
                },
            }
        },
        props: {
            friendItem: {
                type: Object
            }
        },
        beforeDestroy() {
            if (this.peerConnection!=null ){
                this.peerConnection.close();
            }
            if (this.localStream!=null){
                this.localStream.getTracks().forEach(track => track.stop());
            }
            this.initData()
        },
        methods: {
            accept() {
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 2;
                this.connectStatus = 5;
                socket.send(this.sendMessage)
            },
            endEarly(){
                this.fromId = this.friendItem.friendshipId;
                this.hangUp()
            },
            hangUp() {

                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 7;
                this.connectStatus = 6;
                console.log(this.sendMessage)
                socket.send(this.sendMessage);
            },
            closeVoice() {
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 8;
                this.connectStatus = 6;
                socket.send(this.sendMessage);
            },
            closePlay() {
                this.$refs.remoteVideo.pause();
                this.play = false;
            },
            startPlay() {
                this.$refs.remoteVideo.play();
                this.play = true;
            },
            initializePeerConnection() {
                this.peerConnection = new RTCPeerConnection(null);
                this.peerConnection.onicecandidate = this.handleIceCandidate;
                this.peerConnection.onaddstream = this.handleRemoteStreamAdded;
                for (const track of this.localStream.getTracks()) {
                    this.peerConnection.addTrack(track, this.localStream);
                }
            },
            handleIceCandidate(event) {
                if (event.candidate) {
                    this.sendMessage.extend = 6;
                    this.sendMessage.receiverId = this.fromId;
                    this.sendMessage.content = event.candidate;
                    socket.send(this.sendMessage)
                }
            },
            handleRemoteStreamAdded(event) {
                this.$refs.remoteVideo.srcObject = event.stream;
            },
            //开启摄像头
            getLocalStream() {
                var _this = this;
                return new Promise((resolve, reject) => {
                    navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    }).then(stream => {
                        this.connectStatus = 3;
                        _this.localStream = stream;
                        // _this.$refs.localVideo.srcObject = stream;
                        // this.localStream.getTracks().forEach(track => {
                        //     this.peerConnection.addTrack(track, stream);
                        // });
                        resolve(true);
                    })
                        .catch(error => {
                            console.error('Error accessing local media:', error);
                        });
                })
            },
            createOfferAndSendMessage(sessionDescription) {
                this.peerConnection.setLocalDescription(sessionDescription);
                this.sendMessage.extend = 4;
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.content = sessionDescription;
                socket.send(this.sendMessage)
            },
            handleCreateOfferError() {
                console.log("错误")
            },
            doAnswer() {
                if (this.peerConnection == null) {
                    this.initializePeerConnection();
                }
                this.peerConnection.createAnswer().then(this.createAnswerAndSendMessage, this.handleCreateAnswerError);
            },
            createAnswerAndSendMessage(sessionDescription) {
                this.peerConnection.setLocalDescription(sessionDescription);
                this.sendMessage.extend = 5;
                this.sendMessage.content = sessionDescription;
                this.sendMessage.receiverId = this.friendItem.friendshipId.toString();
                socket.send(this.sendMessage)
                // ws.value.send(JSON.stringify({type:"4",uid:uid.value,to:rid.value,message:sessionDescription}))
            },
            handleCreateAnswerError() {
                console.log("错误")
            },
            initData() {
                this.connectStatus = 0;
                this.peerConnection = null;
                this.localStream = null;
                this.remoteStream = null;
                this.requester = {
                    id: null,
                    avatar: null,
                    nickName: null,
                };
                this.fromId = null;
                this.sendMessage = {
                    action: 10008,
                    token: getToken(),
                    receiverId: "",
                    content: "",
                    extend: 0,
                }
            },
            voiceResponse(event) {
                switch (event.message) {
                    case 1:
                        this.connectStatus = 4;
                        this.fromId = event.data.id;
                        this.requester.id = event.data.id;
                        this.requester.avatar = event.data.avatar;
                        this.requester.nickName = event.data.nickName;
                        break;
                    case 2:
                        this.getLocalStream().then((res) => {
                            this.fromId = event.data.from;
                            this.sendMessage.receiverId = this.fromId;
                            this.sendMessage.extend = 3;
                            socket.send(this.sendMessage);
                        });
                        break;
                    case 3:
                        this.getLocalStream().then(res => {
                            if (this.peerConnection == null) {
                                this.initializePeerConnection();
                            }
                            this.peerConnection.createOffer(this.createOfferAndSendMessage, this.handleCreateOfferError)
                        });
                        break;
                    case 4:
                        if (this.peerConnection == null) {
                            this.initializePeerConnection()
                        }
                        this.peerConnection.setRemoteDescription(new RTCSessionDescription(event.data));
                        this.doAnswer();
                        break;
                    case 5:
                        this.peerConnection.setRemoteDescription(new RTCSessionDescription(event.data));
                        break;
                    case 6:
                        var candidate = new RTCIceCandidate({
                            sdpMLineIndex: event.data.sdpMLineIndex,
                            candidate: event.data.candidate
                        });
                        this.peerConnection.addIceCandidate(candidate);
                        break;
                    case 7:
                        this.$emit('closeVoice', event.data);
                        this.initData();
                        break;
                    case 8:
                        if (this.peerConnection!=null ){
                            this.peerConnection.close();
                        }
                        if (this.localStream!=null){
                            this.localStream.getTracks().forEach(track => track.stop());
                        }
                        this.$emit('closeVoice', event.data);
                        this.initData();
                        break;
                    default:
                        this.connectStatus = -1
                }
            },
        }, mounted() {

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

    .play {
        display: flex;
        font-size: 60px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .play .microphone {
        width: 120px;
        height: 120px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 50%;
        background-color: #eeeeee;
    }

    .play .microphone:hover {
        background-color: #e5e5e5;
    }
</style>
