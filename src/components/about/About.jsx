import './about.scss'
import { motion } from "framer-motion"

const About = () => {




    return (
        <div className="about" id='about-section'>
            <h1 >About </h1>
            <div className="about-container">
                <motion.div 
                
                initial={{opacity:0, scale:0.2}}
                animate={{opacity:1, scale:1}}

                
                className="image">
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 1.1 }}
                        src="/kksg.png" alt="image" loading='lazy' />
                </motion.div>
                <div className="text">
                    <motion.h2 whileHover={{ scale: 1.05 }}>
                        INTRODUCTION</motion.h2>
                    <motion.p whileHover={{ scale: 1.05 }}>Hello there! Krishan Kant Singh Gautam is delighted to have you here! (:</motion.p>
                    <br />
                    <motion.p
                        whileHover={{ scale: 1.05 }}
                    >
                        Krishan Kant is an MCA postgraduate skilled in crafting Full Stack 
                        Applications. His mastery of Java and Spring Boot translates to robust and scalable
                        backend solutions. On the other hand, he excels in crafting dynamic user interfaces 
                        with React and Angular, showcasing his expertise in UI development.

                    </motion.p>
                    <br />
                    <motion.p whileHover={{ scale: 1.05 }}>
                        Beyond coding, Krishan is a travel enthusiast, always seeking new adventures
                         to keep his perspectives fresh. Exploring different places not only satisfies
                          his curiosity but also inspires creativity in his tech endeavors.
                    </motion.p>
                    <br />
                    <motion.p whileHover={{ scale: 1.05 }}>Passionate about delivering seamless user experiences through web applications,
                         Krishan thrives on creating practical and efficient solutions.
                          He is eager to collaborate with like-minded individuals and teams
                           who share his enthusiasm for exceptional experiences. 
                           Thanks for checking out his portfolio – your visit means a lot!
                    </motion.p>
                    <a href="https://drive.google.com/drive/folders/17foKswAgLRhAUcA-zkbVKlB6wQwCzqSf?usp=sharing" target="_blank" rel="noreferrer"><button>Download Resume</button></a>
                </div>
            </div>
        </div>
    )
}

export default About;
