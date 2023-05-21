import "./Css/App.css";
import Sidebar from "../Sidebar Component/Sidebar/Sidebar";
import Chat from "../Chat Component/Chat";
import "../Chat Component/Css/chat.css";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../Login Component/Login";
import { useStateValue } from "../StateProvider/StateProvider";
const App = () => {
  const [{ user }] = useStateValue();

  return (
    <div className="app">
      {/* If user not logged in show the Login page, where user will be able to
      login. Otherwise if user is already logged in show them the main page. */}
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            {/* As the Sidebar component will be common to all the pages, i have
            put it outside the switch. */}
            <Sidebar />
            <Switch>
              {/* Inside the switch there are 2 routes that i have created, 1)
              To navigate to different chatrooms using the corresponsing
              chatroomid. Passing the chatroomid with the url itself using
              variable parameters. 2) It is the default one, where the user will
          land when they firstly open the application. */}
              <Route path="/ChatRooms/:ChatRoomsId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
};

export default App;
