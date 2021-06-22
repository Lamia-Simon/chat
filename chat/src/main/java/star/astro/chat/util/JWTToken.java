package star.astro.chat.util;

import org.apache.shiro.authc.AuthenticationToken;

/**
 * 这是一个存储JWT的数据结构
 */
public class JWTToken implements AuthenticationToken {

    private String token;

    public JWTToken(String token){
        this.token = token;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return token;
    }

}
