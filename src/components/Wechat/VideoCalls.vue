<template>
    <div class="contain">
        <div v-show="connecting===0" class="connection">
            <div class="wait">
                <span>正在等待对方回应</span>
                <div class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div v-show="connecting===1" class="connection">
            <div class="wait">
                <span>连接中</span>
                <div class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div v-show="connecting===3" style="text-align: center">
            <div style="display: flex;justify-content: center;align-items: center">
                <video ref="localVideo" playsinline autoplay
                       :class="{'localVideo':this.switch,'remoteVideo':!this.switch}"></video>
                <video ref="remoteVideo" playsinline autoplay
                       :class="{'localVideo':!this.switch,'remoteVideo':this.switch}"></video>
            </div>
            <el-button type="danger" icon="el-icon-close" @click="closeVideo">结束通话</el-button>
            <el-button v-if="this.switch" @click="switchWindos" icon="el-icon-refresh">切换对方窗口</el-button>
            <el-button v-else @click="switchWindos" icon="el-icon-refresh">切换自己窗口</el-button>
        </div>
        <div v-show="connecting===4" style="width: 100%">
            <div style="margin: 0 auto;text-align: center">
                <img :src="requestFrom.avatar" style="width: 70px;height: 70px;border-radius: 50%;margin: 0 auto">
                <div><span style="color: #409EFF">{{requestFrom.nickName}}</span><span>邀请你进行视频通话</span></div>
                <div class="loading" style="margin: 10px auto;text-align: center">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div>
                    <el-button type="danger" @click="hangUp"><i class="el-icon-close"></i>&nbsp;挂断</el-button>
                    <el-button type="primary" @click="accept"><i class="el-icon-phone-outline"></i>&nbsp;接受</el-button>

                </div>
            </div>
        </div>
        <div v-show="connecting===5" class="connection">
            <div class="wait">
                <span>正在建立连接</span>
                <div class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div v-show="connecting===6" class="connection">
            <div class="wait">
                <span>正在中断</span>
                <div class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div v-if="connecting<0" class="connection">
            <div><span><i class="el-icon-warning" style="font-size: 30px;color: darkred"></i>
            </span>
                <div style="color: darkred">服务器错误</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getToken} from "../../utils/auth";
    import {socket} from "../../config/websocket/socket";

    export default {
        name: "VideoCalls",
        data() {
            return {
                switch: true,
                connecting: 0,
                peerConnection: null,
                localStream: null,
                remoteStream: null,
                requestFrom: {
                    id: null,
                    avatar: null,
                    nickName: null,
                },
                fromId: null,
                sendMessage: {
                    action: 10007,
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
        methods: {
            accept() {
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 2;
                this.connecting = 5;
                socket.send(this.sendMessage)
            },
            hangUp() {
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 7;
                this.connecting = 6;
                socket.send(this.sendMessage);
            },
            closeVideo() {
                this.sendMessage.receiverId = this.fromId;
                this.sendMessage.extend = 8;
                this.connecting = 6;
                socket.send(this.sendMessage);
            },
            switchWindos() {
                this.switch = !this.switch
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
                        video: true,
                    }).then(stream => {
                        this.connecting = 3;
                        _this.localStream = stream;
                        _this.$refs.localVideo.srcObject = stream;
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
                this.switch = true;
                this.connecting = 0;
                this.peerConnection = null;
                this.localStream = null;
                this.remoteStream = null;
                this.requestFrom = {
                    id: null,
                    avatar: null,
                    nickName: null,
                },
                    this.fromId = null;
                this.sendMessage = {
                    action: 10007,
                    token: getToken(),
                    receiverId: "",
                    content: "",
                    extend: 0,
                }
            },
            VCResponse(event) {
                switch (event.message) {
                    case 1:
                        this.connecting = 4;
                        this.fromId = event.data.id;
                        this.requestFrom.id = event.data.id;
                        this.requestFrom.avatar = event.data.avatar;
                        this.requestFrom.nickName = event.data.nickName;
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
                        this.$emit('closeVideo', event.data);
                        this.initData();
                        break;
                    case 8:
                        this.peerConnection.close();
                        this.localStream.getTracks().forEach(track => track.stop());
                        this.$emit('closeVideo', event.data);
                        this.initData();
                        break;
                    default:
                        this.connecting = -1
                }
            },
        }, mounted() {

        }
    }
</script>

<style scoped>
    .contain {
        position: relative;
        margin: 20px auto;
    }

    .contain .connection {
        text-align: center;
    }

    .contain .connection .wait {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .loading,
    .loading > div {
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
        margin-top: 4px;
        width: 54px;
        height: 18px;
    }

    .loading > div {
        width: 8px;
        height: 8px;
        margin: 4px;
        border-radius: 100%;
        opacity: 0;
        animation: ball-fall 1s ease-in-out infinite;
    }

    .loading > div:nth-child(1) {
        animation-delay: -200ms;
    }

    .loading > div:nth-child(2) {
        animation-delay: -100ms;
    }

    .loading > div:nth-child(3) {
        animation-delay: 0ms;
    }

    @keyframes ball-fall {
        0% {
            opacity: 0;
            transform: translateY(-145%);
        }

        10% {
            opacity: 0.5;
        }

        20% {
            opacity: 1;
            transform: translateY(0);
        }

        80% {
            opacity: 1;
            transform: translateY(0);
        }

        90% {
            opacity: 0.5;
        }

        100% {
            opacity: 0;
            transform: translateY(145%);
        }
    }

    .remoteVideo {
        position: absolute;
        top: 0;
        right: 10px;
        width: 130px;
        height: 130px;
    }

    .localVideo {
        width: 400px;
        height: 400px;
    }
</style>
