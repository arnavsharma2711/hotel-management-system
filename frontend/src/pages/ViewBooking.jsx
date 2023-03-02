import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "../components/Booking";
import { toast } from "react-toastify";

import Container from "react-bootstrap/Container";

const Bookings = () => {
  function getDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("https://hotel-api-arnavsharma2711.vercel.app/bookings")
      .then((response) => {
        setBookings(response.data);
      });
  }, []);

  function notify(temp) {
    if (parseInt(temp) < 24) toast.info("Booking Deleted - NO REFUND");
    else if (parseInt(temp) < 48) toast.info("Booking Deleted - 50% REFUND");
    else toast.info("Booking Deleted - 100% REFUND");
  }
  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to continue delete the booking") === true) {
      axios
        .get(`https://hotel-api-arnavsharma2711.vercel.app/bookings/${id}`)
        .then((response) => {
          let currentDate = new Date();
          currentDate = getDate(currentDate);
          let createdAt = getDate(response.data.startTime);
          const milliseconds = Math.abs(
            Date.parse(currentDate) - Date.parse(createdAt)
          );
          let temp = milliseconds / 36e5;

          notify(temp);
        });
      axios
        .delete(`https://hotel-api-arnavsharma2711.vercel.app/bookings/${id}`)
        .then(() => {
          setBookings(bookings.filter((booking) => booking._id !== id));
        });
    }
  };

  return (
    <div>
      <h1>View Bookings</h1>
      <Container className="container">
        {bookings.map((booking) => (
          <div className="item" key={booking._id}>
            <BookingCard booking={booking} />
            <button
              className="btn btn-danger btn1"
              onClick={() => handleDelete(booking._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Bookings;
