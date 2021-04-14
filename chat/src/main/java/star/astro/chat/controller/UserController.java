package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.model.Chatroom;
import star.astro.chat.model.Friend;
import star.astro.chat.model.User;
import star.astro.chat.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user")
    public JSONObject addUserByNickname(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.createUserByName(username, password);
        ret.put("success", granted);
        ret.put("exc", "");
        return ret;
    }

    @GetMapping("/user")
    public User getUserByName(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.retrieveUserByName(username);
    }

    @PostMapping("/login")
    public JSONObject login(@RequestParam Map<String, Object> params, HttpServletRequest request) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.login(username, password);
        if (granted) {
            userService.userOnline(username);
            request.getSession().setAttribute("username", username);
        }
        ret.put("success", granted);
        ret.put("username", username);
        ret.put("exc", "");
        return ret;
    }

    @PostMapping("/user/friend")
    public boolean addFriend(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String friendName = (String) params.get("friendName");
        return userService.addFriend(username, friendName);
    }

    @PostMapping("/chatroom")
    public boolean createChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomName = (String) params.get("chatroomName");
        return userService.createChatroom(username, chatroomName);
    }

    @PutMapping("/chatroom")
    public boolean joinChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomId = (String) params.get("chatroomId");
        return userService.joinChatroom(username, chatroomId);
    }

    @GetMapping("/user/room")
    public List<Friend> getPrivateChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getFriends(username);
    }

    @GetMapping("/chatroom")
    public List<Chatroom> getUserChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getChatrooms(username);
    }

}
