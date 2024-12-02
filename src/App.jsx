import { useEffect } from 'react';
import "./app.scss";
import Navbar from './components/navbar/Navbar';
import Contact from "./components/contact/Contact.jsx";
import Cursor from "./components/cursor/Cursor.jsx";
import Hero from './components/hero/Hero';
import Parallax from "./components/parallax/Parallax.jsx";
import Portfolio from "./components/portfolio/Portfolio.jsx";
import Services from "./components/services/Services.jsx";
import Skills from "./components/skills/Skills.jsx";
import About from './components/about/About';

function App() {
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    // Disable developer tools access using F12 and Ctrl + Shift + I
    const handleKeyDown = (event) => {
      if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
      }
    };

    // Detect if Developer Tools is open
    const detectDevTools = () => {
      const start = new Date().getTime();
      debugger;
      const end = new Date().getTime();

      if (end - start > 100) {
        alert('Developer Tools detected!');
        document.write("Please disable developer tools.");
        // window.location.href = "about:blank"; // You can redirect if needed
      }
    };

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Detect developer tools every second
    const interval = setInterval(detectDevTools, 1000);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <>
      <Cursor />
      <section id="Homepage"> 
        <Navbar />
        <Hero />
      </section>
      <section id="Services"><Parallax type="services" /></section>
      <section id="ServiceSection"><Services /></section>
      <section id="Portfolio"><Parallax type="portfolio" /></section>
      <Portfolio />
      <section id="Skills"><Skills /></section>
      <section id="About"><About /></section>
      <section id="Contact"><Contact /></section>
    </>
  );
}

export default App;
