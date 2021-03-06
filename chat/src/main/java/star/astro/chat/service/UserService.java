package star.astro.chat.service;

import org.springframework.stereotype.Service;
import star.astro.chat.model.mongodb.GroupChat;
import star.astro.chat.model.mongodb.User;
import star.astro.chat.model.mongodb.link.FriendLink;
import star.astro.chat.model.mongodb.link.GroupChatUserLink;
import star.astro.chat.model.mongodb.link.LinkAdapter;
import star.astro.chat.model.wrapper.chatroom.Chatroom;
import star.astro.chat.model.wrapper.chatroom.ChatroomFactory;
import star.astro.chat.model.wrapper.chatroom.ChatroomType;
import star.astro.chat.repository.FriendLinkRepository;
import star.astro.chat.repository.GroupChatRepository;
import star.astro.chat.repository.GroupChatUserLinkRepository;
import star.astro.chat.repository.UserRepository;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final GroupChatRepository groupChatRepository;

    private final FriendLinkRepository friendLinkRepository;

    private final GroupChatUserLinkRepository groupChatUserLinkRepository;

    public UserService(UserRepository userRepository, GroupChatRepository groupChatRepository, FriendLinkRepository friendLinkRepository, GroupChatUserLinkRepository groupChatUserLinkRepository) {
        this.userRepository = userRepository;
        this.groupChatRepository = groupChatRepository;
        this.friendLinkRepository = friendLinkRepository;
        this.groupChatUserLinkRepository = groupChatUserLinkRepository;
    }

    public User findUserByName(String name) {
        return userRepository.findUserByName(name);
    }

    public boolean createUserByName(String name, String password) {
        if (userRepository.findUserByName(name) != null) {
            return false;
        } else {
            User user = new User(name, password);
            userRepository.save(user);
            return true;
        }
    }

    public User retrieveUserByName(String name) {
        return userRepository.findUserByName(name);
    }

    public boolean login(String name, String password) {
        boolean granted = false;
        User user = userRepository.findUserByName(name);
        if (user != null) {
            if (password.equals(user.getPassword())) {
                granted = true;
            }
        }
        return granted;
    }

    public boolean addFriend(String username, String friendName) {
        if (userRepository.findUserByName(friendName) == null) {
            return false;
        }
        FriendLink friendLink = new FriendLink();
        friendLink.setUsername0(username);
        friendLink.setUsername1(friendName);
        friendLinkRepository.save(friendLink);
        return true;
    }

    public void changePassword(String username, String password) {
        User user = findUserByName(username);
        user.setPassword(password);
        userRepository.save(user);
    }

    public void userOnline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOnline();
        userRepository.save(user);
    }

    public void userOffline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOffline();
        userRepository.save(user);
    }

    public List<Chatroom> getPrivateChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();

        // get friends as user0
        List<FriendLink> friendLinks = friendLinkRepository.findFriendLinkByUsername0(username);
        for (FriendLink friendLink : friendLinks) {
            String username1 = friendLink.getGuestId();
            User user = userRepository.findUserByName(username1);
            String chatroomId = friendLink.getId();
            Chatroom chatroom = ChatroomFactory.getChatroom(chatroomId, user.getName(), ChatroomType.PRIVATECHAT);
            chatrooms.add(chatroom);
        }

        // get friends as user1
        friendLinks = friendLinkRepository.findFriendLinkByUsername1(username);
        for (FriendLink friendLink : friendLinks) {
            String username0 = friendLink.getHostId();
            User user = userRepository.findUserByName(username0);
            String chatroomId = friendLink.getId();
            Chatroom chatroom = ChatroomFactory.getChatroom(chatroomId, user.getName(), ChatroomType.PRIVATECHAT);
            chatrooms.add(chatroom);
        }

        return chatrooms;
    }

    public List<Chatroom> getGroupChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        List<GroupChatUserLink> groupChatUserLinks = groupChatUserLinkRepository.findGroupChatUserLinkByUsername(username);
        for (GroupChatUserLink groupChatUserLink : groupChatUserLinks) {
            LinkAdapter linkAdapter = new LinkAdapter(groupChatUserLink);
            String chatroomId = linkAdapter.getHostId();
            GroupChat groupChat = groupChatRepository.findGroupChatById(chatroomId);
            String chatroomName = groupChat.getName();
            Chatroom chatroom = ChatroomFactory.getChatroom(chatroomId, chatroomName, ChatroomType.GROUPCHAT);
            chatrooms.add(chatroom);
        }
        return chatrooms;
    }

    public boolean createChatroom(String username, String chatroomName) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(chatroomName);
        groupChat = groupChatRepository.save(groupChat);
        String chatroomId = groupChat.getId();
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
        return true;
    }

    public boolean joinChatroom(String username, String chatroomId) {
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
        return true;
    }

    public List<Chatroom> getUserChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        chatrooms.addAll(getPrivateChatrooms(username));
        chatrooms.addAll(getGroupChatrooms(username));
        return chatrooms;
    }

    public void deleteFriend(String chatroomId) {
        friendLinkRepository.deleteById(chatroomId);
    }

    public void exitGroup(String chatroomId) {
        groupChatUserLinkRepository.deleteByChatroomId(chatroomId);
    }
    public void addSticker(String user,String sticker){
        User u = userRepository.findUserByName(user);
        List<String> stickers = u.getStickers();
        stickers.add(sticker);
        u.setStickers(stickers);
        userRepository.save(u);
    }

    public List<String> getStickers(String user){
        User u = userRepository.findUserByName(user);
        return u.getStickers();
    }
}
