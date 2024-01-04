import "./app.scss"
import Navbar from "./components/Navbar/Navbar.jsx"
import Contact from "./components/contact/Contact.jsx";
import Cursor from "./components/cursor/Cursor.jsx";
import Hero from './components/hero/Hero';
import Parallax from "./components/parallax/Parallax.jsx";
import Portfolio from "./components/portfolio/Portfolio.jsx";
import Services from "./components/services/Services.jsx";
import Skills from "./components/skills/Skills.jsx";
import About from './components/about/About';
function App() {

  return (
    <>
      <Cursor/>
      <section id="Homepage"> 
        <Navbar />
        <Hero />
      </section>
      <section id="Services"> <Parallax type="services" /> </section>
      <section id="ServiceSection"><Services /></section>
      <section id="Portfolio"> <Parallax type="portfolio" /> </section>
      <Portfolio />
      {/* <Skills /> */}
      <section id="Skills"> <Skills /> </section>
      <section id="About"> <About /> </section>
      {/* <About id="About" type="about" /> */}
      <section id="Contact"> <Contact /> </section>
    </>
  )
}

export default App
