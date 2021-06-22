package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import lombok.AllArgsConstructor;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.model.wrapper.chatroom.Chatroom;
import star.astro.chat.service.UserService;
import star.astro.chat.util.JWTUtil;
import star.astro.chat.util.RedisUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final RedisUtil redisUtil;

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
        long currentTimeMillis = System.currentTimeMillis();
        String token = JWTUtil.createToken(username, currentTimeMillis);
        redisUtil.set(username, currentTimeMillis, 7 * 24 * 60 * 60);
        ret.put("success", granted);
        ret.put("username", username);
        ret.put("token", token);
        ret.put("exc", "");
        return ret;
    }

    @RequiresRoles("user")
    @PostMapping("/user/friend")
    public JSONObject addFriend(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String friendName = (String) params.get("friendName");
        boolean success = userService.addFriend(username, friendName);
        ret.put("success", success);
        ret.put("exc", "");
        return ret;
    }

    @PutMapping("/user/password")
    public JSONObject changePassword(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        userService.changePassword(username, password);
        ret.put("success", true);
        ret.put("exc", "");
        return ret;
    }

    @RequiresRoles("user")
    @PostMapping("/chatroom")
    public JSONObject createChatroom(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String chatroomName = (String) params.get("chatroomName");
        boolean success = userService.createChatroom(username, chatroomName);
        ret.put("success", success);
        return ret;
    }

    @RequiresRoles("user")
    @PutMapping("/user/chatroom")
    public JSONObject joinChatroom(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String chatroomId = (String) params.get("chatroomId");
        boolean success = userService.joinChatroom(username, chatroomId);
        ret.put("success", success);
        return ret;
    }

    @RequiresRoles("user")
    @GetMapping("/user/chatroom")
    public List<Chatroom> getUserChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getUserChatrooms(username);
    }

    @PostMapping("/user/friend/delete")
    public JSONObject deleteFriend(@RequestParam("user") String user, @RequestParam("friend") String friend) {
        JSONObject ret = new JSONObject();
        userService.deleteFriend(user, friend);
        ret.put("success", true);
        return ret;
    }

    @PostMapping("/user/group/leave")
    public JSONObject exitGroup(@RequestParam("user") String user, @RequestParam("groupId") String group) {
        JSONObject ret = new JSONObject();
        userService.exitGroup(user, group);
        ret.put("success", true);
        return ret;
    }

    @RequiresRoles("user")
    @PostMapping("/user/sticker/add")
    public JSONObject addSticker(@RequestParam Map<String, Object> params){
        String username = (String) params.get("username");
        String stickerBase64 =  (String) params.get("sticker");
        userService.addSticker(username,stickerBase64);
        JSONObject ret = new JSONObject();
        ret.put("success", true);
        return ret;
    }

    @GetMapping("/user/sticker/get")
    public JSONObject getSticker(@RequestParam Map<String, Object> params){
        String username = (String) params.get("username");
        // userService.addSticker(username,sticker);
        JSONObject ret = new JSONObject();
        ret.put("success", true);
        ret.put("stickers",userService.getStickers(username));
        return ret;
    }

}
