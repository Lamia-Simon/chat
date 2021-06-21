package star.astro.chat.model.wrapper.chatroom;

public class GroupChatroom extends Chatroom {

    public GroupChatroom(String chatroomId, String name) {
        this.chatroomId = chatroomId;
        this.name = name;
        this.type = ChatroomType.GROUPCHAT.getValue();
    }

}
