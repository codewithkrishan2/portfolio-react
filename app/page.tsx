import JsonLd from '@/components/JsonLd'
import { graph, profilePageSchema } from '@/lib/schema'
import Header from '@/components/Header'
import CinematicHero from '@/components/hero/CinematicHero'
import Parallax from '@/components/Parallax'
import Services from '@/components/Services'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      {/* Declares the homepage as this person's profile page, referencing the
          Person and WebSite nodes the root layout already emits. */}
      <JsonLd json={graph(profilePageSchema())} />
      <Header revealAfterHero />
      <main id="main">
        <CinematicHero />
        <Parallax variant="services" />
        <Services />
        <Experience />
        <Parallax variant="work" />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
