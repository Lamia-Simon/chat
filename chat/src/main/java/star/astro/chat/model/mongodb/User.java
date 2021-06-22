package star.astro.chat.model.mongodb;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Document
public class User {

    @Id
    String name;
    String password;
    boolean online;
    List<String> stickers;

    public User(String name, String password) {
        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline() {
        this.online = true;
    }

    public void setOffline() {
        this.online = false;
    }

    public void setStickers(List<String> stickers){
        this.stickers = stickers;
    }
    
    public List<String> getStickers(){
        return this.stickers;
    }
}
