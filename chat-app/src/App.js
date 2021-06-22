import React from "react";
import SignIn from "./sign-in/SignIn";
import Chat from "./chat/Chat";
import SignUp from "./sign-up/SignUp";
import axios from "axios";

(function () {
    let token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        axios.defaults.headers.common["Authorization"] = null;
    }
})();

class App extends React.Component {
    props = {};

    state = {
        user: {
            name: "",
        },
        friends: [],
        chatrooms: [],
        online: false,
        pageOnDisplay: "sign-in",
    };

    setPageOnDisplay = (pageToDisplay) => {
        this.setState({
            pageOnDisplay: pageToDisplay,
            online: false,
        });
    };

    setUserOnline = (user) => {
        this.setState({
            user: user,
            online: true,
        });
    };

    render() {
        const { user, online, pageOnDisplay } = this.state;
        const displaySignInPage = pageOnDisplay === "sign-in";
        const displaySignUpPage = pageOnDisplay === "sign-up";

        function Main(props) {
            if (props.online === false) {
                if (displaySignInPage) {
                    return (
                        <SignIn
                            setUser={props.setUser}
                            setPage={props.setPage}
                        ></SignIn>
                    );
                }
                if (displaySignUpPage) {
                    return <SignUp setPage={props.setPage}></SignUp>;
                }
            } else {
                return <Chat user={props.user} setPage={props.setPage}></Chat>;
            }
        }

        return (
            <Main
                online={online}
                user={user}
                setUser={this.setUserOnline}
                setPage={this.setPageOnDisplay}
            ></Main>
        );
    }
}

export default App;
