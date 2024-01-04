import { useRef } from "react";
import "./portfolio.scss"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const items = [
    {
        id: 1,
        title: "Portfolio",
        img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Developed a personal portfolio website using React. The website showcases my work history, academic accomplishments, technical skills, and extracurricular activities.",
        url :"https://www.krishankant.me/",
    },
    {
        id: 2,
        title: "Gift App",
        img: "/giftstore.png",
        desc: "Developed a gift store website using React and Django(DRF). The website offers a curated selection of unique gifts, including customized, home decor, and accessories.",
        url :"https://www.yasgifts.me/",
    },
    {
        id: 3,
        title: "Contact App",
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Developed a contact manager application using Java, Spring boot, Thymeleaf and MySQL. The application allows users to add, edit, and delete contacts.",
        url :"https://github.com/codewithkrishan2/contact-manager/",
    },
    {
        id: 4,
        title: "Blog App",
        img: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Created a blog app using Java Spring Boot and React, seamlessly integrating backend and frontend technologies for a responsive and dynamic user experience.",
        url :"https://github.com/codewithkrishan2/blog/",
    },

]

// eslint-disable-next-line react/prop-types
const Single = ({ item }) => {
    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
    });

    const y = useTransform(scrollYProgress, [0, 1], [-300, 300]);

    return (
        <section>
            <div className="container">
                <div className="wrapper" >
                    <div className="imageContainer" ref={ref}>
                        {/* eslint-disable-next-line react/prop-types */}
                        <img src={item.img} alt="image of the project demo" loading='lazy' />
                    </div>
                    <motion.div className="textContainer" style={{ y }}>
                        {/* eslint-disable-next-line react/prop-types */}
                        <h2>{item.title}</h2>
                        {/* eslint-disable-next-line react/prop-types */}
                        <p>{item.desc}</p>
                        {/* eslint-disable-next-line react/prop-types */}
                        <a target={{_blank: true}} href={item.url}><button>See Demo</button></a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

const Portfolio = () => {

    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["end end", "start start"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 30,
    });

    return (
        <div className="portfolio" ref={ref}>
            <div className="progress">
                <h1>Featured Works</h1>
                <motion.div style={{ scaleX }} className="progressBar"></motion.div>
            </div>
            {items.map(item => (
                <Single item={item} key={item.id} />
            ))}
        </div>
    )
}

export default Portfolio