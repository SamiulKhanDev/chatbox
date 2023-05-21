import { Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider/StateProvider";
import db from "../FireBase/firebase";
import firebase from "firebase";

const Chat = () => {
  const [seed, setSeed] = useState("12"); //to randomly change the avatar
  const [value, setValue] = useState(""); //new sms value.
  const [sms, setSms] = useState([]); //all sms so far.
  const { ChatRoomsId } = useParams(); // from the paremeneters get the id of the chatroom.
  const [chatRoomName, setChatRoomName] = useState(""); //to hold the name of the chatroom with the chatroomid.
  const [{ user }] = useStateValue(); //using the context, [valueObjs, updationFunction].
  useEffect(() => {
    if (ChatRoomsId) {
      /**
       * If users wants to navigate to a particuler chatroom, they need to provide the chatroomid,
       * so, whenever we have a chatroomid , that basically means that we have a requirement to fetch the name of the chatroom with the chatroomid and all the messages from the corresponding
       * chatroom.
       * Inside Firbase i have created a collection of all the Chatrooms created so far, The collection name is ChatRooms.
       * Now from the ChatRooms, using the ChatRoomId, we will fetch the needed ChatRoom. Now after getting the ChatRoom, we have set the chatRoomName
       * state's value with the name.
       * Now also we have to fetch all the sms from inside the chatroom.
       * Inside every ChatRoom we have a Collection called sms. This collection will store all the sms that are sent to this particuler room.
       */
      db.collection("ChatRooms")
        //Getting the name of the ChatRoom using the ChatRoomsId that was provided in the URL.
        .doc(ChatRoomsId)
        .onSnapshot((snapshot) => {
          //onSnapshot method basically takes a realtime image of the current state of the document.
          setChatRoomName(snapshot.data().name); //updating the value of the chatRoomName state using the setter function.
        });
      db.collection("ChatRooms")
        .doc(ChatRoomsId)
        .collection("sms") //fetching all the sms from the ChatRoom.
        .orderBy("timestamp", "asc") //ordering all the sms in asending order
        .onSnapshot((snapshot) => {
          setSms(snapshot.docs.map((doc) => doc.data())); //now updating the value of sms state.
        });
    }
    /**
     * This useEffect will run after the chat component will mount to the component tree and afterwards whenever the ChatRoomsId varibale changes.
     */
  }, [ChatRoomsId]);
  const handleClick = (e) => {
    /**
       Whenever a logged in user would like to send a sms to the group, the sms need to be stored insdie the sms collection of the particuler ChatRoom.
       */
    e.preventDefault(); //as the inout type is submit, when ever we will submit the doc, the page will refreash, to tackle this problem,i have prevented the default behaviour.
    db.collection("ChatRooms").doc(ChatRoomsId).collection("sms").add({
      name: user.displayName,
      sms: value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      /**
       * After identifying the ChatRoom with the ChatRoomId storing a new sms
       * inside the sms collection.
       * The schema of that sms is {name: user who sending the sms, sms: the value of the sms, timestamp: time and date when the sms was sent}.
       */
    });
    setValue(""); // after storing the sms, clearing out the input value, so a new sms can be write and send.
  };
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000)); //to randomly change the avatar.
  }, [ChatRoomsId]);
  return (
    <div className="chat">
      {/* The div will store the header,body and footer portion of the chat
      page. */}
      <div className="chat_header">
        {/** Inside the header we will have the chatRoomName, the random avatar
        fetch from the an API and last seen information that is the time at
    which the last sms was sent in this group. */}
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_info">
          <h4>{chatRoomName}</h4>
          <p>
            last seen at{" "}
            {new Date(sms[sms.length - 1]?.timestamp?.toDate()).toUTCString()}
          </p>
        </div>
      </div>
      <div className="chat_body">
        {/** Inside this div, all sms will be rendered with different styles to
        differentiate between which sms is recieved and which sms was sent. 
        To accomlish this i have used the shortcircutting concept of react.
        */}
        {sms.map((mas) => {
          return (
            <div
              className={` chat_sms ${
                mas.name === user.displayName && "chat_smssent"
                //if the name who has sent the sms and users name is same then it is a sent sms, style it accordingly.
              }`}
            >
              <p className="chat_name">{mas.name}</p>
              <span className="chat_chat">{mas.sms}</span>
              <p className="chat_timestamp">
                {new Date(mas.timestamp?.toDate().getTime()).toUTCString()}
              </p>
            </div>
          );
        })}
      </div>
      <div className="chat_footer">
        {/*
                Footer will store the Input element where user will type the new sms.
                And whenever they feel the sms is ready will click the sent button, which will invoke the handleClick function with the click event 
                has argument.
              */}
        <form>
          <input
            value={value}
            type="text"
            placeholder="type a massage"
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={(e) => handleClick(e)} type="submit">
            send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
