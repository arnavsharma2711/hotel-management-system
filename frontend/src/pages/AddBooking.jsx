import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const BookingForm = () => {
  const roomNumber = useLocation().state.roomNumber;
  const pricePerHour = useLocation().state.pricePerHour;
  const navigate = useNavigate();
  const [postAdded, setPostAdded] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState();
  const [booking, setBooking] = useState({
    userEmail: "",
    roomNumber: roomNumber,
    startTime: "",
    endTime: "",
    price: 0,
    paymentType: "",
    tip: 0,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBooking({ ...booking, [name]: value });
  };
  useEffect(() => {
    if (postAdded) {
      navigate("/view");
    }
  }, [postAdded, navigate]);

  useEffect(() => {
    if (booking.endTime === "" || booking.startTime === "") return;
    const milliseconds = Math.ceil(
      Math.abs(Date.parse(booking.endTime) - Date.parse(booking.startTime))
    );
    const hours = Math.ceil(milliseconds / 36e5);
    const priceDisplay = hours * pricePerHour;
    setPriceDisplay(priceDisplay);
  }, [booking, pricePerHour]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const milliseconds = Math.ceil(
      Math.abs(Date.parse(booking.endTime) - Date.parse(booking.startTime))
    );
    const hours = Math.ceil(milliseconds / 36e5);
    const price = hours * pricePerHour;
    const updatedBooking = { ...booking, price };
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://hotel-api-arnavsharma2711.vercel.app/bookings",
      headers: {
        "Content-Type": "application/json",
      },
      data: updatedBooking,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data._id !== undefined) {
          toast.success("Booking Made");
          setPostAdded(true);
        } else toast.error("Booking Failed");
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Add Bookings</h1>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>User Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={booking.userEmail}
          name="userEmail"
          onChange={handleInputChange}
          required
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Room Number:</Form.Label>
        <Form.Control
          type="text"
          name="roomNumber"
          value={booking.roomNumber}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Start Time:</Form.Label>
        <Form.Control
          type="datetime-local"
          name="startTime"
          value={booking.startTime}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>End Time:</Form.Label>
        <Form.Control
          type="datetime-local"
          name="endTime"
          value={booking.endTime}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Price:</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={priceDisplay}
          required
          disabled
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Payment Type:</Form.Label>
        <select
          name="paymentType"
          class="form-control"
          id="exampleFormControlSelect1"
          value={booking.paymentType}
          onChange={handleInputChange}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
        </select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Tip:</Form.Label>
        <Form.Control
          type="number"
          name="tip"
          value={booking.tip}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Booking
      </Button>
    </Form>
  );
};

export default BookingForm;
