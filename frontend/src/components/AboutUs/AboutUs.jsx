import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUs.css';

import plant1 from '../../assets/images/Home/gallery-plant-7.jpg';
import plant2 from '../../assets/images/Home/gallery-plant-2.jpg';
import plant3 from '../../assets/images/Home/friendly_plant.jpg';
import plant4 from '../../assets/images/Home/flower.jpg';
import plant5 from '../../assets/images/Home/gallery-plant-4.jpg';
import plant6 from '../../assets/images/Home/collection-plant-5.jpg';
import plant7 from '../../assets/images/Home/gallery-plant-3.jpg';
import plant8 from '../../assets/images/Home/gallery-plant-5.jpg';
import plant9 from '../../assets/images/Home/plant-32.jpg';
import plant10 from '../../assets/images/Home/plant_slide_1.jpg';
import plant11 from '../../assets/images/Home/gallery-plant-8.jpg';
import plant12 from '../../assets/images/Home/gallery-plant-1.jpg';
import plant13 from '../../assets/images/Home/giant_plant.jpg';
import plant14 from '../../assets/images/Home/plant_slide_2.jpg';
import plant15 from '../../assets/images/Home/plant-8.jpg';
const slideshowImages = [plant5, plant6, plant8, plant9, plant10, plant11, plant12, plant13];

const circleCards = [
    { img: plant1, badge: 'Indoor'       },
    { img: plant2, badge: 'Outdoor'      },
    { img: plant3, badge: 'Pet Friendly' },
    { img: plant4, badge: 'Flower'       },

];

const highlights = [
    {
        num: '01',
        title: 'Quality Guaranteed',
        text: 'Every plant is hand-selected for health and vigour. We inspect each one before it ever reaches your door.',
        img: plant15,
    },
    {
        num: '02',
        title: 'Expert Care Tips',
        text: 'Simple, friendly guidance for every plant — so beginners thrive just as much as seasoned green thumbs.',
        img: plant14,
    },
    {
        num: '03',
        title: 'For Every Space',
        text: 'Tiny desk companions to grand statement pieces — we curate the perfect fit for any corner of your life.',
        img: plant7,
    },
];


export default function About() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slideshowImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main>

            {/* ── HERO ── */}
            <section className="about-us">
                    <Container>
                        <Row className="align-items-center gy-5">

                            {/* LEFT — text */}
                            <Col lg={5} md={6}>
                                <p className="aboutus-section">About Us</p>

                                <h1 className="aboutus-title">
                                    Where nature<br />
                                    meets{' '}
                                    <span className="gold-word">style</span>
                                    <span className="italic-line">— beautifully.</span>
                                </h1>

                                <div className="line-divider " />
                                <p className="aboutus-disc ">
                                    We believe every space deserves something living. Something
                                    that breathes, grows, and quietly transforms the room around it.
                                </p>

                                <div className="aboutus-scroll">
                                    <div className="scroll-line" />
                                    Scroll to explore
                                </div>
                            </Col>

                            {/* RIGHT — diagonal circles */}
                            <Col lg={7} md={6} className="d-flex justify-content-center justify-content-lg-end">
                                <div className="circles-diagonal">
                                    {circleCards.map((card, i) => (
                                        <div className={`diag-circle diag-circle-${i}`} key={i}>
                                            <img src={card.img} alt={card.badge} />
                                            <div className="diag-overlay" />
                                            <div className="diag-badge">
                                                <span className="diag-dot" />
                                                {card.badge}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                        </Row>
                    </Container>
            </section>

            {/* ── STORY ── */}
            <section className="story-aboutus-section">
                <Container>
                    <Row className="align-items-center g-5">

                        <Col lg={5} md={12} className="order-lg-2">
                            <div className="story-img-block">
                                <div className="story-img-card main">
                                    {slideshowImages.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt="Indoor plant collection"
                                            className={`story-card-img slide-img${i === currentIndex ? ' slide-img--active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <div className="story-img-card accent">
                                    {slideshowImages.map((img, i) => {
                                        const accentIndex = (currentIndex + 2) % slideshowImages.length;
                                        return (
                                            <img
                                                key={i}
                                                src={img}
                                                alt="Accent plant"
                                                className={`story-card-img story-card-img--tinted slide-img${i === accentIndex ? ' slide-img--active' : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>

                        <Col lg={7} md={12} className="order-lg-1">
                            <span className="story-number">01</span>
                            <p className="story-ourstory">Our Story</p>
                            <h2 className="story-heading">
                                Plants that bring{' '}
                                <em>life</em> into<br />every corner
                            </h2>
                            <div className="story-body">
                                <p>
                                    Welcome to our plant shop, where nature meets style. We offer a carefully
                                    selected range of indoor and outdoor plants designed to bring freshness,
                                    beauty, and life into your space.
                                </p>
                                <p>
                                    Whether you're looking for low-maintenance greenery or statement plants,
                                    you'll find something perfect for your home or office. Each plant is chosen
                                    for its quality and health, so you can enjoy long-lasting greenery with
                                    confidence.
                                </p>
                                <p>
                                    We also provide helpful care tips to make plant ownership simple and
                                    enjoyable, no matter your experience level. From small decorative plants
                                    to larger statement pieces, we're here to help you create your own
                                    green corner.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* ── HIGHLIGHTS ── */}
            <section className="whatweoffer-section">
                <Container>
                    <div className="whatweoffer-header">
                        <div className="section-offer">What we offer</div>
                        <h2 className="section-title-light">
                            Everything you need<br />to grow with confidence
                        </h2>
                    </div>

                    <Row className="g-4">
                       {highlights.map((item, i) => (
                        <Col key={i} md={4}>
                            <div className="image-offer-card">
                                <div className="image-offer-card-num">{item.num}</div>
                                <div className="image-offer-card-wrap">
                                    <img
                                    src={item.img}
                                    alt={item.title}
                                    className="image-offer-card-img"
                                    />
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                        </Col>
                    ))}
                    </Row>
                </Container>
            </section>

            {/* ── MISSION ── */}
            <section className="mission-section">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <div className="mission-title">Our Mission</div>
                            <p className="mission-quote">
                                "To make plants accessible, affordable, and easy to care for —
                                while promoting a more natural and calming lifestyle."
                            </p>
                            <p className="mission-team">— The Plant Shop Team</p>
                            <a href="./indoor-plants" className="mission-button">
                                Shop our plants <span className="button-arrow">→</span>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>

        </main>
    );
}