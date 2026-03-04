import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar px-3">
            <Container fluid>
                <Navbar.Brand as={Link} to="/admin">
                    PlantShop Admin Dashboard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="admin-navbar-nav" />
                <Navbar.Collapse id="admin-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Product Management" id="products-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/products">
                                All Products
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Add Product
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Categories
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Labels
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Order Management" id="orders-dropdown">
                            <NavDropdown.Item >
                                All Orders
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Pending Orders
                                <span className=" ms-2"></span>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Processing
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                Completed
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Inventory Management" id="inventory-dropdown">
                            <NavDropdown.Item >
                                Current Stock
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                Restock List
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;