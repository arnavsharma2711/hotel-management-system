import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
function RoomCard({ roomNumber, roomType, pricePerHour, imageUrl }) {
  return (
    <Card style={{ width: "15rem", textAlign: "center" }}>
      <Card.Body>
        <Card.Img variant="top" src={imageUrl} />
        <Card.Title>{`Room ${roomNumber}`}</Card.Title>
        <br />
        <Card.Subtitle className="mb-2 text-muted">
          {" "}
          {`Price: ₹${pricePerHour}/hr`}
        </Card.Subtitle>
        <Card.Text></Card.Text>
        <Link to="/add" state={{ roomNumber, roomType, pricePerHour }}>
          <Button style={{ width: "100%" }} variant="primary">
            Book Room
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default RoomCard;
