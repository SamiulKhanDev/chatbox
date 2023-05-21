import React from "react";
import "../Sidebarchat/Css/sidebarchat.css";
import db from "../../FireBase/firebase";
import { useState } from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useEffect } from "react";
const SidebarChat = ({ addNewChat, id, data }) => {
  /**
   * Providing the addNewChat,id and data to this component from the parent as a prop.
   */
  const [lastSms, setLastSms] = useState([]); //to store and show the last sms that was sent to this room.
  const [seed, setSeed] = React.useState("12"); //to randomly change the avatar.

  useEffect(() => {
    if (id) {
      /**
       * If id is present then fetch the corresponding room from the room list, and get the last sent sms.
       */
      db.collection("ChatRooms")
        .doc(id)
        .collection("sms")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setLastSms(
            snapshot.docs.map((doc) => {
              return doc.data().sms;
            })
          );
        });
    }
    /**
     * This useEffect will run only once after the component and its child components will be mounted to the tree.
     * Similar to ComponentDidMount lifecycle method in class based component in react.
     */
  }, []);

  const createChat = async () => {
    /**
     * To create a new room user must provide the name of the room.
     */
    const roomName = prompt("enter chat room name"); //promting user to provide the new room name.
    if (roomName) {
      //if roomName has been provided , create a new room.
      db.collection("ChatRooms").add({
        name: roomName,
      });
    }
  };
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  return !addNewChat ? (
    <Link to={`/ChatRooms/${id}`}>
      <div key={id} className="sidebarchat">
        <Avatar
          style={{ height: "25px", width: "25px" }}
          src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
        />
        <div className="sidebarchat_info">
          <h4>{data}</h4>
          <p>{lastSms[0]}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarchat">
      <h4>Create a new room</h4>
    </div>
  );
};

export default SidebarChat;
