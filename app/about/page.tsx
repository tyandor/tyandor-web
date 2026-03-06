'use client'

// import { Metadata } from 'next'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// export const metadata: Metadata = {
// title: 'About | My Blog',
// description: 'Learn more about the author and purpose of this blog',
// }

export default function AboutPage() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const animation = gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-7xl font-bold italic mb-8 text-rosePine-rose">About</h1>
      <div ref={contentRef} className="prose prose-rosePine dark:prose-rosePineDawn opacity-0">
        <p>
          I&apos;m a Colorado Springs based Software Engineer. I&apos;m also a philosopher. This is my personal website, so of course any opinions expressed here should be taken as mine alone.
        </p>
        <h2>
          About this website
        </h2>
        <p>
          What I write and share here comes from a wide range of interests. I often have ideas, tools, and tips that will interest engineers and developers. Some will be useful to anyone. Primarily, though, I&apos;m using this as a documentation system. The audience I most often have in mind is my future self. Also, much of the content here is in a draft state, so...
        </p>
        <p>
          That said, I do occasionally write <Link href="/articles">articles</Link> with a more general audience in mind. If you happen to share some of my interests you might find other content here useful as well. If that&apos;s the case, this system is designed with ways to drill down into specific topics and make connections among them. On most pages you&apos;ll find catgories and tags with links to related content.
        </p>
        <h2>
          Research interests
        </h2>
        <p>
          Some current areas of interests, specific to software engineering:
        </p>
        <ul>
          <li>Systems thinking</li>
          <li>Complexity sciences</li>
          <li>Experimentation design</li>
          <li>Design thinking</li>
          <li>Natural language processing</li>
          <li>AI (of course)</li>
        </ul>
        <p>
          In addition to my current professional interests in software engineering, I also publish content, albeit less frequently, on various topics in philosophy. I was a university professor for many years, and continue to do research in several areas:
        </p>
        <ul>
          <li>Philosophy of science</li>
          <li>Philosophy of mind</li>
          <li>Ordinary language philosophy</li>
          <li>Linguistics and general semantics</li>
          <li>Epistemology</li>
          <li>Erotetics</li>
          <li>Logic</li>
          <li>Semiotics</li>
          <li>Category theory</li>
          <li>Mythology and storytelling</li>
          <li>Fantasy and science fiction literature</li>
          <li>Poetry and poetics</li>
        </ul>
        <h2>Design notes</h2>
        <p>
          My logo - &and;&or; - is a symbolic form of my last name. It combines two of the symbols used in formal logic for conjunction (and) and disjunction (or).
        </p>
        <p>
          This site is built using <a href="https://nextjs.org/" target="_blank">Next.js/React</a> and <a href="https://tailwindcss.com/" target="_blank">Tailwind</a>. The theme is based on one of my favorite colorschemes for editing code, <a href="https://rosepinetheme.com/" target="_blank">Rose Pine</a>.
        </p>
      </div>
    </div>
  )
}

