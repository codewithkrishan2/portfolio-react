import { useRef } from "react";
import "./services.scss"
import { motion, useInView } from "framer-motion"


const variants ={
    initial:{
        x:-500,
        y:100,
        opacity:0
    },
    animate:{
        x:0,
        y:0,
        opacity:1,
        transition:{
            duration:1,
            staggerChildren : 0.1,
        }
    }
};

const Services = () => {

    const ref = useRef();

    const isInView = useInView(ref, { margin: "-100px" });

  return (
    <motion.div
         className="services" 
        variants={variants} 
        initial="initial" 
        //whileInView="animate"
        ref={ref}
        animate={ "animate" }
        >
        <motion.div className="textContainer" variants={variants}>
            <p> I focus on helping your brand grow
                <br /> and move forword
            </p>
            <hr />
        </motion.div>
        <motion.div className="titleContainer" variants={variants}>
            <div className="title">
                <img src="/people.webp" alt="image containing people at work." loading='lazy' />
                <h1>
                    <motion.b whileHover={{color:"orange"}} >Perfect</motion.b> Solutions
                </h1>
            </div>
            <div className="title">
                <h1>
                    <motion.b whileHover={{color:"orange"}} >For Your</motion.b> Business
                </h1>
                <button>WHAT I DO?</button>
            </div>
        </motion.div>
        <motion.div className="listContainer" variants={variants}>
            <motion.div whileHover={{background:"lightgray",color:"black"}}  className="box">
                <h2>Full Stack Development</h2>
                <p>I excel in crafting end-to-end solutions that harmonize 
                    creativity and functionality. 
                    As a full-stack developer, I seamlessly navigate from user 
                    interface design to server-side architecture and databases,
                    ensuring a comprehensive development process.</p>
                {/* <button>Go</button> */}
            </motion.div>
            <motion.div whileHover={{background:"lightgray",color:"black"}} className="box">
                <h2>Digital Marketing</h2>
                <p>
                I specialize in strategic digital marketing solutions, 
                leveraging my expertise in SEO, social media, 
                and analytics to enhance online visibility. 
                From crafting compelling content to implementing data-driven campaigns,
                 I drive results that elevate brands in the digital landscape.
                </p>
                {/* <button>Go</button> */}
            </motion.div>
            <motion.div whileHover={{background:"lightgray",color:"black"}} className="box">
                <h2>Personal Branding</h2>
                <p>Crafting compelling narratives that resonate, I elevate individual identities. 
                    Through strategic storytelling, I build authentic personal brands, 
                    leaving a lasting impression that aligns with your unique values and goals.
                         Let&apos;s define and amplify your personal brand presence.</p>
                {/* <button>Go</button> */}
            </motion.div>
            <motion.div whileHover={{background:"lightgray",color:"black"}} className="box">
                <h2>Web and Graphic Designing </h2>
                <p>I transform ideas into captivating visuals. 
                    Specializing in web and graphic design, along with video editing, 
                    I bring creativity and technical expertise to elevate your brand&apos;s visual identity.
                     Let&apos;s make your content stand out.</p>
                {/* <button>Go</button> */}
            </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default Services