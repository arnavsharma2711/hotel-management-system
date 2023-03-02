import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomCard from "../components/Room";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  function sendUrl(type) {
    if (type === "A")
      return "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    else if (type === "B")
      return "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    else
      return "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "https://hotel-api-arnavsharma2711.vercel.app/rooms"
      );
      setRooms(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Available Rooms</h1>

      <Container className="container">
        {rooms.map((room) => (
          <Row className="item" key={room.id}>
            <RoomCard
              roomNumber={room.roomNumber}
              roomType={room.roomType}
              pricePerHour={room.pricePerHour}
              imageUrl={sendUrl(room.roomType)}
            />
          </Row>
        ))}
      </Container>
    </>
  );
}

export default RoomList;
