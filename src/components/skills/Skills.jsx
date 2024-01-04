// Skills.jsx
import "./skills.scss";
import { useRef } from "react";
import { motion } from 'framer-motion';

const items = [
  
  {
    id: 1,
    img: "/js.png",
    title: "JavaScript",
  },
  {
    id: 2,
    img: "/java.svg",
    title: "Java",
  },
  {
    id: 3,
    img: "/ts.png",
    title: "TypeScript",
  },
  {
    id: 4,
    img: "/c.svg",
    title: "C Language",
  },
  {
    id: 5,
    img: "/spring.svg",
    title: "Spring",
  },
  {
    id: 6,
    img: "/springboot.svg",
    title: "Spring Boot",
  },
  {
    id: 7,
    img: "/angular.svg",
    title: "Angular",
  },
  {
    id: 8,
    img: "/react.png",
    title: "React",
  },
  {
    id: 9,
    img: "/enterprise.svg",
    title: "Mircoservices",
  }, {
    id: 10,
    img: "/jwt.svg",
    title: "JWT",
  },
  {
    id: 11,
    img: "/Rest-api.svg",
    title: "Rest API",
  },
  {
    id: 12,
    img: "/jsp.svg",
    title: "JSP",
  },
  {
    id: 13,
    img: "/thymeleaf.svg",
    title: "Thymeleaf",
  },
  {
    id: 14,
    img: "/mysql.png",
    title: "MySQL",
  },
  {
    id: 15,
    img: "/postger.png",
    title: "PostgreSQL",
  },
  {
    id: 16,
    img: "/html.png",
    title: "HTML",
  },
  {
    id: 17,
    img: "/css.png",
    title: "CSS",
  },
  {
    id: 18,
    img: "/bootstrap.svg",
    title: "Bootstrap",
  },
  {
    id: 19,
    img: "/tailwind.png",
    title: "tailwind",
  },
  {
    id: 20,
    img: "/mui.png",
    title: "Material UI",
  },
  {
    id: 21,
    img: "/docker.webp",
    title: "Docker",
  },
  {
    id: 23,
    img: "/gitwhite.png",
    title: "GitHub",
  },
  {
    id: 24,
    img: "/intellijidea.svg",
    title: "IntelliJ",
  },
  {
    id: 25,
    img: "/eclipse.svg",
    title: "Eclipse",
  },
  {
    id: 26,
    img: "/maven.svg",
    title: "Maven",
  },
  {
    id: 27,
    img: "/office-365.svg",
    title: "MS Ofice",
  },
  {
    id: 28,
    img: "/postman.svg",
    title: "Postman",
  },
  {
    id: 29,
    img: "/swagger.svg",
    title: "Swagger",
  },

];

const fadeInAnimationVarients = {
  initial: {
    opacity: 0,
    y: 100,

  },
  animate: (item) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // Adjust the duration as needed
      type: 'spring', stiffness: 300,
      delay: 0.1 * item, // Stagger the animation for each item
    },

  }),
};


// eslint-disable-next-line react/prop-types
const Singles = ({ item, reference }) => (
  <motion.div
    drag
    dragConstraints={reference}
    dragElastic={0.5} // Adjust the elastic value as needed
    
  >
    <motion.li
      variants={fadeInAnimationVarients}
      initial="initial"
      whileInView="animate"
      whileHover={{ scale: 1.8 }}
      // eslint-disable-next-line react/prop-types
      custom={item.id}
    >
      <div>
        {/* eslint-disable-next-line react/prop-types */}
        <img src={item.img} alt="image of the skills" width={80} height={80} loading='lazy' />
        {/* eslint-disable-next-line react/prop-types */}
        <h4 style={{ display: "flex", justifyContent: "center" }}>{item.title}</h4>
      </div>
    </motion.li>
  </motion.div>
);





const Skills = () => {

  const ref = useRef(null);


  return (
    <div className="skills" ref={ref}>
      <div className="heading-container">
        <h1>My Skills </h1>
      </div>
      <ul className="single-container">
        {items.map(item => (
          <Singles item={item} key={item.id} reference={ref} />
        ))}
      </ul>
    </div>
  )
};

export default Skills;
