package star.astro.chat.model.mongodb.link;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class FriendLink implements Link {

    @Id
    private String id;
    private String username0;
    private String username1;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String getHostId() {
        return username0;
    }

    public void setUsername0(String username0) {
        this.username0 = username0;
    }

    @Override
    public String getGuestId() {
        return username1;
    }

    public void setUsername1(String username1) {
        this.username1 = username1;
    }

}
