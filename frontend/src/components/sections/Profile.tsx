import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Profile() {
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Full-Stack Developer \\ System Analyst";
  const typingSpeed = 70;
  const pauseDuration = 1200;

  // Back-and-forth (typewriter) animation
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      if (!isDeleting) {
        // Typing forward
        currentIndex++;
        setDisplayedText(fullText.slice(0, currentIndex));

        if (currentIndex === fullText.length) {
          // Pause at full text before deleting
          isDeleting = true;
          timeoutId = setTimeout(type, pauseDuration);
          return;
        }
      } else {
        // Deleting backward
        currentIndex--;
        setDisplayedText(fullText.slice(0, currentIndex));

        if (currentIndex === 0) {
          // Pause at empty before typing again
          isDeleting = false;
          timeoutId = setTimeout(type, pauseDuration / 2);
          return;
        }
      }

      timeoutId = setTimeout(type, isDeleting ? typingSpeed / 2 : typingSpeed);
    };

    timeoutId = setTimeout(type, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex gap-8 items-start p-8 rounded-lg border">
      {/* Avatar with instant hover swap */}
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
        style={{ width: "200px", height: "220px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered ? "/profile-2.jpg" : "/profile-1.jpg"}
          alt="Profile"
          style={{
            width: "200px",
            height: "220px",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-4xl font-bold">Ivan Brilata</h1>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            {/* Curly / star-like badge shape */}
            <path
              d="M12 2.5
       l2.1 1.5 2.6-.3 1.3 2.3 2.4.9-.3 2.6 1.5 2.1-1.5 2.1.3 2.6-2.4.9-1.3 2.3-2.6-.3-2.1 1.5-2.1-1.5-2.6.3-1.3-2.3-2.4-.9.3-2.6-1.5-2.1 1.5-2.1-.3-2.6 2.4-.9 1.3-2.3 2.6.3L12 2.5z"
              fill="#1DA1F2"
            />

            {/* Check icon */}
            <path
              d="M9.5 12.5l1.8 1.8 3.8-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Tiaong Quezon Province, Philippines</span>
        </div>

        {/* Typewriter text */}
        <p className="text-base text-slate-600 dark:text-slate-400 min-h-[24px]">
          {displayedText}
          <span
            className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5"
            style={{
              animation: "blink 1s step-end infinite",
            }}
          />
        </p>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        <div className="grid grid-cols-2 gap-3 mt-6 max-w-md">
          {/* Download CV */}
          <a href="/cv-brilata-1.pdf" download>
            <Button size="lg" className="w-full">
              Download CV
            </Button>
          </a>

          {/* Email */}
          <a href="mailto:ibrilata.dev@gmail.com">
            <Button size="lg" className="w-full">
              Email
            </Button>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/ivanskieee"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-full">
              GitHub
            </Button>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/vansrzb/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-full">
              LinkedIn
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
