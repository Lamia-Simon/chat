package star.astro.chat.model.mongodb.link;

public class LinkAdapter implements Link {

    GroupChatUserLink groupChatUserLink;

    public LinkAdapter(GroupChatUserLink groupChatUserLink) {
        this.groupChatUserLink = groupChatUserLink;
    }

    @Override
    public String getId() {
        return groupChatUserLink.getId();
    }

    @Override
    public String getHostId() {
        return groupChatUserLink.getChatroomId();
    }

    @Override
    public String getGuestId() {
        return groupChatUserLink.getUser();
    }

}
