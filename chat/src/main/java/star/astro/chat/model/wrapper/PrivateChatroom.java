package star.astro.chat.model.wrapper;

public class PrivateChatroom extends Chatroom {

    public PrivateChatroom(String chatroomId, String name) {
        this.chatroomId = chatroomId;
        this.name = name;
        this.type = ChatroomType.PRIVATECHAT.getValue();
    }

}
