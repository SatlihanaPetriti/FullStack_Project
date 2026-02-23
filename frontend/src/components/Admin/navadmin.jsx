// src/components/navadmin.jsx
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';

const NavAdmin = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand href="#">
                    <span className="fs-4">🌿 Plant Shop Admin</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="#products">Products</Nav.Link>
                        <Nav.Link href="#orders">Orders</Nav.Link>
                        <Nav.Link href="#customers">Customers</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search products..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavAdmin;