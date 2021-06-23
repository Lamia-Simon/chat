import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {
    Button,
    List,
    ListItem,
    Table,
    TableContainer,
    TextField,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import ListIcon from "@material-ui/icons/List";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import MessageBox from "./components/message/Message";
import Panels from "./components/panels/Panels";
import { Popover } from "@material-ui/core";
import { NoEncryption } from "@material-ui/icons";
import GridList from '@material-ui/core/GridList';
import GridListTile from "@material-ui/core/GridListTile";
import axios from "axios";

const appBarHeight = 80;
const drawerWidth = "26%";
const middleSectionUnifiedHeight = 545; // very hacky

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        display: "flex",
        width: `calc(100% - ${drawerWidth})`,
        height: appBarHeight,
        marginLeft: drawerWidth,
        backgroundColor: "LightSalmon",
        borderTop: "1px solid black",
    },
    iconGroup: {
        display: "flex",
        alignItems: "center",
        marginLeft: "auto",
    },
    accountIcon: {
        marginRight: 20,
    },
    logOut: {},
    chatroomName: {
        height: appBarHeight,
        display: "flex",
        alignItems: "center",
    },
    activeChatButton: {
        textTransform: "none",
    },
    activeChatChatroomIdContainer: {
        padding: 10,
    },
    drawer: {
        width: drawerWidth,
        height: "auto",
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    titleContainer: {
        height: 80,
        display: "flex",
        alignItems: "center",
        //borderTop: "1px solid black",
    },
    title: {
        marginLeft: 40,
        fontSize: 40,
    },
    listContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "auto",
        maxHeight: middleSectionUnifiedHeight,
    },
    forTableContainerOfChats: {
        width: "100%",
        maxHeight: middleSectionUnifiedHeight, // very hacky
    },
    forTableContainerOfMessages: {
        width: "100%",
        maxHeight: middleSectionUnifiedHeight + 17, // very hacky
        paddingBottom: "100px",
    },
    panelsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    deleteChat: {
        height: 50,
        marginLeft: 5,
    },
    privateChatCard: {
        width: "100%",
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "none",
    },
    groupChatCard: {
        width: "100%",
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "none",
        backgroundColor: "sandyBrown",
    },
    userInfo: {
        zIndex: 1250,
        position: "fixed",
        bottom: 40,
        left: 40,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
    messagesArea: {
        width: "100%",
        minHeight: 600, // hacky
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        display: "flex",
        flexDirection: "column",
        paddingBottom: 25,
    },
    inputContainer: {
        zIndex: 1300,
        position: "fixed",
        bottom: 0,
        right: 0,
        width: `calc(100% - ${drawerWidth})`,
        height: 258,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 12,
        borderTop: "1px solid lightgray",
        backgroundColor: "white",
    },
    forTextField: {},
    stickers:{

    },
}));

const { REACT_APP_SERVER_ADDRESS } = process.env;

var stompClient = null;

export default function Chat(props) {
    const classes = useStyles();

    const setPage = props.setPage;
    const username = props.user.name;
    const [chatText, setChatText] = useState("");
    const [rooms, setRooms] = useState([]);
    const [stickers, setStickers] = useState([]);
    var img;
    var sticker;
    const [activeChat, setActiveChat] = useState({});
    const [currentChatroomMessages, setCurrentChatroomMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [openinfo, setOpenInfo] = React.useState(false);
    const [opensticker, setOpenSticker] = React.useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [comform, setComform] = useState("");

    const handleClickOpenInfo = () => {
        setNewPassword("");
        setComform("");
        setOpenInfo(true);
    };

    const handleClickCloseInfo = () => {
        setOpenInfo(false);
    };

    const handleClickOpenSticker = () => {
        setOpenSticker(true);
    };

    const handleClickCloseSticker = () => {
        setOpenSticker(false);
    };

    const subscribeInfo = () => {
        if(newPassword!==""){
            if(newPassword===comform){
                let formData = new FormData();
                formData.append("username", username);
                formData.append("password", newPassword);
                fetch(
                    REACT_APP_SERVER_ADDRESS + "/user/password",
                    {
                        method: "PUT",
                        body:formData
                    }
                ).then((response) => {
                    response.json().then((data) => {
                        if (data.success === true) {
                            handleClickCloseInfo();
                        } else {
                            console.log("nope");
                        }
                    });
                });
            }
            else{
                alert("两次输入的密码需相同");
            }
        }
        else{
            alert("两次输入的密码需相同");
        }
    };

    const deleteChat = (room) => {
        let formData = new FormData();
        formData.append("chatroomId", room.chatroomId);
        let requestUrl;
        if(room.type === 1) {
            requestUrl = REACT_APP_SERVER_ADDRESS + "/user/group/leave"
        }
        else {
            requestUrl = REACT_APP_SERVER_ADDRESS + "/user/friend/delete"
        }
        fetch(requestUrl, {
            method: "DELETE",
            body: formData,
        }).then((response) => {
            response.json().then((data) => {
                if (data.success === true) {
                    setChatrooms();
                } else {
                    console.log("nope");
                }
            });
        });
    };

    const setChatrooms = () => {
        axios
            .get(
                REACT_APP_SERVER_ADDRESS + "/user/chatroom?username=" + username
            )
            .then((response) => {
                setRooms(response.data);
            });
    };
    // eslint-disable-next-line
    useEffect(setChatrooms, []); // set chatrooms after entering the chat page

    const setMyStickers = () => {
        fetch(
            REACT_APP_SERVER_ADDRESS + "/user/sticker/get?username=" + username,
            {
                method: "GET",
            }
        ).then((response) => {
            response.json().then((data) => {
                if(data.stickers == null) {
                    setStickers([])
                }
                else {
                    setStickers(data.stickers);
                }
            });
        });
    };
    // eslint-disable-next-line
    useEffect(setMyStickers, []);

    useEffect(() => {
        if (rooms === undefined) {
            return;
        } else {
            if (rooms.length > 0) {
                if (activeChat.chatroomId === "") {
                    setActiveChat(rooms[0]);
                }
            }
            connect();
        }
        // eslint-disable-next-line
    }, [rooms]);

    const refreshChatroomMessages = () => {
        let messages = findChatMessages(activeChat.name);
        setCurrentChatroomMessages(messages);
    };
    // eslint-disable-next-line
    useEffect(refreshChatroomMessages, [activeChat, receivedMessages]);

    const findChatMessages = () => {
        let messages = [];
        for (let i = 0; i < receivedMessages.length; i++) {
            let message = receivedMessages[i];
            if (
                message.sender === activeChat.name ||
                message.receiver === activeChat.name
            ) {
                messages.push(message);
            }
        }
        return messages;
    };

    const logout = () => {
        setPage("sign-in");
    };

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS(REACT_APP_SERVER_ADDRESS + "/chat");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");
        subscribeChatrooms();
    };
    // eslint-disable-next-line
    const subscribeNotifications = () => {
        stompClient.subscribe("/topic/notice." + username, onNoticeReceived);
    };

    const onNoticeReceived = (ntc) => {
        let notice = JSON.parse(ntc);
        console.log(notice);
        setChatrooms();
    };

    const subscribeChatrooms = () => {
        rooms.map((room) =>
            stompClient.subscribe(
                "/topic/chatroom." + room.chatroomId,
                onMessageReceived
            )
        );
    };

    const onMessageReceived = (msg) => {
        let message = JSON.parse(msg.body);
        if (message.sender === username) {
            message.mine = true;
        } else {
            message.mine = false;
        }
        setReceivedMessages((messages) => [...messages, message]);
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            activateSendChatMessage("txt");
        }
    };

    const sendChatMessage = (time, type) => {
        var msg = chatText;
        if (type === "img") msg = img;
        console.log(type);
        //    console.log(chatText);
        // let type = "txt";
        // console.log(msg);
        // if(msg.length>10&&msg.substring(0,10) === "data:image"){
        //     type = "img";
        //     console.log("type set as img");
        // }
        // else    console.log("type set as txt");
        if (type === "img" || msg.trim() !== "") {
            let chatroomId = activeChat.chatroomId;
            let friendName = activeChat.name;
            const message = {
                sender: username,
                receiver: friendName,
                content: type === "img" ? img : chatText,
                time: new Date(time),
                type: type,
            };
            console.log("msg constructed");
            stompClient.send(
                "/app/chatroom/" + chatroomId,
                {},
                JSON.stringify(message)
            );
            console.log("message sent");
        }
        setChatText("");
    };

    const activateSendChatMessage = (type) => {
        // get UTC time first, send message in callback
        fetch(REACT_APP_SERVER_ADDRESS + "/time", {
            method: "GET",
        }).then((response) => {
            response.json().then((data) => {
                let time = data.UTCTime.UnixTime;
                sendChatMessage(time, type);
            });
        });
    };
    const triggerUpload = () => {
        const trig = document.getElementById("trig");
        trig.click();
    };
    const handleFileChange = (e) => {
        var files = e.target.files;
        // console.log(files);
        // var reader = new FileReader();
        console.log(files[0]);
        if (files[0].size > 5000000) {
            alert("图片大小不得超过1M");
            return;
        }
        cutImageBase64AndSend(files[0], 400, 0.6);
        // reader.readAsDataURL(files[0]);//读取本地图片
        // reader.onload = function (e) {
        //     // alert(this.result);
        //     // console.log(this.result);
        //     // setImg(this.result);
        //     img = this.result;
        //     console.log(img);
        // };
    };
    const cutImageBase64AndSend = (file, wid, quality) => {
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);
        var base64;
        var image = new Image();
        image.src = blob;
        image.onload = function () {
            var that = this;
            //生成比例
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = wid || w;
            h = w / scale;
            //生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            //   canvas.attr({
            //     width: w,
            //     height: h
            //   });
            ctx.drawImage(that, 0, 0, w, h);
            // 生成base64
            base64 = canvas.toDataURL("image/jpeg", quality || 0.8);
            img = base64;
            activateSendChatMessage("img");
        };
    };



    const handleStickerChosen = (e) => {
        var files = e.target.files;
        // console.log(files);
        // var reader = new FileReader();
        console.log(files[0])
        if(files[0].size>5000000){
            alert("图片大小不得超过1M");
            return ;
        }
        cutStickerImageBase64AndSend(files[0],400,0.6);
        // reader.readAsDataURL(files[0]);//读取本地图片
        // reader.onload = function (e) {
        //     // alert(this.result);
        //     // console.log(this.result);
        //     // setImg(this.result);
        //     img = this.result;
        //     console.log(img);
        // };
    };
    const cutStickerImageBase64AndSend = (file,wid,quality) => {
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);
        var base64;
        var image = new Image();
        image.src = blob;
        image.onload = function() {
            var that = this;
            //生成比例
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = wid || w;
            h = w / scale;
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.setAttribute("width",w);
            canvas.setAttribute("height",h);
            //   canvas.attr({
            //     width: w,
            //     height: h
            //   });
            ctx.drawImage(that, 0, 0, w, h);
            // 生成base64
            base64 = canvas.toDataURL('image/jpeg', quality || 0.8);
            sticker  = base64
            let formData = new FormData();
            formData.append("username", username);
            formData.append("sticker", sticker);
            fetch(
                REACT_APP_SERVER_ADDRESS + "/user/sticker/add",
                {
                    method: "POST",
                    body:formData
                }
            ).then((response) => {
                response.json().then((data) => {
                    if (data.success === true) {
                        setMyStickers();
                    } else {
                        console.log("nope");
                    }
                });
            });
        }
    };

    const stickerSend = (sticker) =>{
        img = sticker;
        activateSendChatMessage(
            "img"
        );
    };

    const handlesticker = (sticker) =>{
        var ans = "data:image/png;base64," + sticker;
        return ans;
    }

    // for popover
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    //

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.chatroomName}>
                        <Button
                            className={classes.activeChatButton}
                            onClick={()=>handleClick}
                            disabled={activeChat.type === 0}
                            style={{
                                color: "black",
                            }}
                        >
                            <Typography variant="h4" noWrap>
                                {activeChat.name}
                            </Typography>
                        </Button>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={()=>handleClose}
                            anchorOrigin={{
                                vertical: "center",
                                horizontal: "right",
                            }}
                        >
                            <div
                                className={
                                    classes.activeChatChatroomIdContainer
                                }
                            >
                                <Typography variant="h6">
                                    {activeChat.chatroomId}
                                </Typography>
                            </div>
                        </Popover>
                    </div>
                    <div className={classes.iconGroup}>
                        <div>
                            <AccountCircleIcon
                                fontSize={"large"}
                                className={classes.accountIcon}
                                onClick={handleClickOpenInfo}
                            ></AccountCircleIcon>
                            <Dialog
                                open={openinfo}
                                onClose={handleClickCloseInfo}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">
                                    Information
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Name:{username}
                                    </DialogContentText>
                                    <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="New Password:"
                                    type="password"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Comform:"
                                        type="password"
                                        fullWidth
                                        value={comform}
                                        onChange={(e) => setComform(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleClickCloseInfo}
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={subscribeInfo}
                                        color="primary"
                                    >
                                        Subscribe
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => logout()}
                            disableElevation
                            className={classes.logOut}
                        >
                            Logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}>
                    <div className={classes.titleContainer}>
                        <div className={classes.title}>Chat!</div>
                    </div>
                </div>
                <Divider />

                <TableContainer className={classes.forTableContainerOfChats}>
                    <Table stickyHeader>
                        <List>
                            {rooms.map((room) => (
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setActiveChat(room)}
                                        className={
                                            room.type === 0
                                                ? classes.privateChatCard
                                                : classes.groupChatCard
                                        }
                                    >
                                            <Typography
                                                variant="h5"
                                                gutterBottom
                                                align="center"
                                            >
                                                {room.name}
                                            </Typography>
                                        </Button>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className={classes.deleteChat}
                                        onClick={() => deleteChat(
                                            room
                                        )}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Table>
                </TableContainer>

                <div className={classes.panelsContainer}>
                    <Panels
                        username={username}
                        setChatrooms={setChatrooms}
                    ></Panels>
                </div>

                <div className={classes.userInfo}>
                    <Typography variant="h4">{username}</Typography>
                </div>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />

                <TableContainer className={classes.forTableContainerOfMessages}>
                    <Table
                        stickyHeader
                        className={classes.forRightSideContentTable}
                    >
                        <div className={classes.messagesArea}>
                            {currentChatroomMessages.map((message) => (
                                <MessageBox
                                    username={message.sender}
                                    content={message.content}
                                    time={message.time}
                                    mine={message.mine}
                                ></MessageBox>
                            ))}
                        </div>
                    </Table>
                </TableContainer>
            </main>
            <div className={classes.inputContainer}>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows="8"
                    className={classes.forTextField}
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                ></TextField>
                <div style={{ display: "flex" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={(e) => activateSendChatMessage("txt")}
                    >
                        SEND
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={triggerUpload}
                    >
                        <input
                            style={{ display: "none" }}
                            id="trig"
                            type="file"
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            onChange={handleFileChange}
                        />
                        发送图片
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClickOpenSticker}
                    >
                        发送表情
                    </Button>
                    <Dialog open={opensticker} onClose={handleClickCloseSticker} aria-labelledby="form-dialog-title" className={classes.stickers}>
                        <DialogContent>
                            <GridList cellHeight={160} className={classes.gridList} cols={4}>
                                {stickers.map((sticker,index) => (
                                    <GridListTile key={index} >
                                        <img src={handlesticker(sticker)} alt="" />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClickCloseSticker} color="primary">
                                Cancel
                            </Button>
                            <Button  color="primary" onClick={triggerUpload}>
                                <input style={{ display: "none" }} id="trig" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" onChange={handleStickerChosen} />
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
