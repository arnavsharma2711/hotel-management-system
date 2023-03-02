import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Navigation() {
  return (
    <Navbar className="">
      <Container>
        <Navbar.Brand>
          <h2>Hotel Manegement System</h2>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Stack direction="horizontal" gap={3}>
            <Link to="/">
              <Button variant="success">New Booking</Button>
            </Link>
            <Link to="/view">
              <Button variant="dark">View Booking</Button>
            </Link>
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
