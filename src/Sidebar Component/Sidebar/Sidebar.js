import React from "react";
import "../Sidebar/Css/sidebar.css";
import db from "../../FireBase/firebase";
import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "../Sidebarchat/SidebarChat";
import { useStateValue } from "../../StateProvider/StateProvider";

const Sidebar = () => {
  const [{ user }] = useStateValue(); //geting the user value from the global context.
  const [rooms, setRooms] = useState([]); //to hold all the rooms.
  const [referRooms, setReferRooms] = useState([]); //to provide the filtering functionality.

  useEffect(() => {
    /**
     * One of the responsibility of this sidebar is to show all the already existing rooms.
     */
    db.collection("ChatRooms").onSnapshot((snapshot) => {
      /**
       * From the ChatRooms collection in DB , getting all the rooms and storing them inside the rooms state as well in the referRooms state to provide
       * the filtering functionality.
       */
      setRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
      setReferRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
    /**
     * This useEffect will run only once after the component and its child components will be mounted to the tree.
     * Similar to ComponentDidMount lifecycle method in class based component in react.
     */
  }, []);
  const handleSubmit = (search) => {
    if (search) {
      const newRooms = referRooms.filter((room) => {
        return room.data.name.toLowerCase().match(search.toLowerCase(), "i"); //doing a case insensitive regular expression search to find if any room has the search value in there name.
      });
      setRooms([...newRooms]);
    } else {
      setRooms(referRooms);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} className="sidebar_icon" />
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchcontainer">
          <SearchOutlined
            style={{ color: "rgb(189,189,189", height: "17px", width: "17px" }}
          />
          <input
            placeholder="search"
            type="text"
            id="input"
            onChange={(e) => {
              handleSubmit(e.target.value);
            }}
          ></input>
        </div>
      </div>
      <div className="sidebar_chatboxs">
        <SidebarChat addNewChat />{" "}
        {/*Here SidebarChat is acting as a buttom to create a new room */}
        {/**
         * SidebarChat will be a reuseable component for both to show the option to create a new room and also to show info about the
         * already existing rooms.
         * The addNewChat prop will make me able to differentiate between the two requirements.
         */}
        {rooms.map((room) => {
          const { id, data } = room;
          return <SidebarChat key={id} id={id} data={data.name} />;
          {
            /*Here SidebarChat is acting as a card to show rooms info*/
          }
        })}
      </div>
    </div>
  );
};

export default Sidebar;
