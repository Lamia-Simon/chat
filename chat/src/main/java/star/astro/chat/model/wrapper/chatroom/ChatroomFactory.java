package star.astro.chat.model.wrapper.chatroom;

public class ChatroomFactory {

    public static Chatroom getChatroom(String chatroomId, String chatroomName, ChatroomType chatroomType) {
        if (chatroomType.equals(ChatroomType.PRIVATECHAT)) {
            return new PrivateChatroom(chatroomId, chatroomName);
        } else if (chatroomType.equals(ChatroomType.GROUPCHAT)) {
            return new GroupChatroom(chatroomId, chatroomName);
        } else {
            return null;
        }
    }

}
