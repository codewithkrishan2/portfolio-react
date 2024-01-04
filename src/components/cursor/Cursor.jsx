import { useEffect, useState } from "react"
import "./cursor.scss"
import { motion } from 'framer-motion';

const Cursor = () => {

    const [position, setPostion] = useState({x: 0, y: 0});

    useEffect(()=>{
        const mouseMove = (e)=>{
            setPostion({
                x: e.clientX,
                y: e.clientY
            })
        }
        window.addEventListener("mousemove", mouseMove);

        return ()=>{
            window.removeEventListener("mousemove", mouseMove);
        };

    });

    return (
        <motion.div className="cursor" animate={{ x: position.x+20, y: position.y+40 }}>
            <img src="/favicon.png" alt="Cursor Image" />
        </motion.div>
    )
}

export default Cursor