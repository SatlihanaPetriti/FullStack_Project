import { Navbar, Container } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';
import { useState } from 'react';
import './style.css';
import '../../Pages/Home/index.css';

const messages = [
  "FREE SHIPPING AND RETURNS",
  "NEW SEASON, NEW STYLES: FASHION SALE YOU CAN'T MISS",
  "LIMITED TIME OFFER: FASHION SALE YOU CAN'T RESIST",
  'FREE SHIPPING AND RETURNS',
  "NEW SEASON, NEW STYLES: FASHION SALE YOU CAN'T MISS",
  "LIMITED TIME OFFER: FASHION SALE YOU CAN'T RESIST",
];

const Announcement = () => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Navbar className='announcement-navbar'>
      <Container fluid className='announcement-container px-0'>
        <div className='scroll-wrapper'>
          <div className='scroll-content'>
            {[...messages, ...messages].map((text, index) => (
              <p key={index} className='announcement-text'>
                {text}
              </p>
            ))}
          </div>
        </div>

        <CloseButton
          variant='white'
          className='close-btn'
          onClick={() => setShow(false)}
        />
      </Container>
    </Navbar>
  );
};

export default Announcement;
