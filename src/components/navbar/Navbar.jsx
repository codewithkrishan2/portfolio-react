import Sidebar from "../sidebar/Sidebar"
import "./navbar.scss"
import { motion } from "framer-motion"
const Navbar = () => {
  return (
    <div className="navbar"> 
        {/* sidebar */}
        <Sidebar/>
        <div className="wrapper">
            <motion.span 
            initial={{opacity:0, scale:0.5}} 
            animate={{opacity:1, scale:1}}
            transition={{duration:0.5}}
            >Krishan Kant</motion.span>
            <div className="social">
                <a href="https://github.com/codewithkrishan2" target="_blank" rel="noreferrer"><img src="/github.png" alt="github icon" /></a>
                <a href="https://www.linkedin.com/in/codewithkrishan/" target="_blank" rel="noreferrer"><img src="/linkedin.png" alt="linkedin icon" /></a>
                <a href="https://www.instagram.com/krishan_kant_singh_gautam/" target="_blank" rel="noreferrer"><img src="/instagram.png" alt="instagram icon" /></a>
            </div>
        </div>
    </div>
  )
}

export default Navbar