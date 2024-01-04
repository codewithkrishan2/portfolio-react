import "./hero.scss"
import { motion } from 'framer-motion';
import { Link } from "react-scroll";


const textVariants = {
    initial: {
        x: -500,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 1,
            staggerChildren: 0.1,
        }
    },
    scrollButton: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 2,
            repeat: Infinity
        }
    },
};

const slideVariants = {
    initial: {
        x: 0,
    },
    animate: {
        x: "-420%",
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 30,
        }
    },
}

const Hero = () => {
    return (
        <div className="hero">
            <div className="wrapper">
                <motion.div className="textContainer"
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                >
                    <motion.h2>KRISHAN KANT SINGH GAUTAM</motion.h2>
                    <motion.h1>Software Developer</motion.h1>
                    <motion.div className="buttons">
                        <Link className="buttonlink" to="Portfolio" smooth={true} duration={100}>
                            See the latest work
                        </Link>
                        <Link className="buttonlink" to="Contact" smooth={true} duration={100}>
                            Contact me
                        </Link>
                        {/* <button>See the latest work</button>
                        <button>Contact me</button> */}
                    </motion.div>
                    <motion.img variants={textVariants} animate="scrollButton" src="/scroll.png" alt="scroll image" />
                </motion.div>
            </div>

            <motion.div className="slidingTextContainer"
                variants={slideVariants}
                initial="initial"
                animate="animate"
            >
                Coder . Traveller . Digital Marketer . Software Developer
            </motion.div>
            <div className="imageContainer">
                <img src="/hero.webp" alt="hero pic" />
            </div>

        </div>
    )
}

export default Hero