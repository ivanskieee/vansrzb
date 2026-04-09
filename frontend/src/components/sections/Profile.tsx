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

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      if (!isDeleting) {
        currentIndex++;
        setDisplayedText(fullText.slice(0, currentIndex));
        if (currentIndex === fullText.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, pauseDuration);
          return;
        }
      } else {
        currentIndex--;
        setDisplayedText(fullText.slice(0, currentIndex));
        if (currentIndex === 0) {
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
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start p-5 sm:p-8 rounded-lg border">

      {/* Avatar — 140×155 on mobile, original 200×220 on sm+ */}
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 w-[140px] h-[155px] sm:w-[200px] sm:h-[220px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered ? "/profile-2.jpg" : "/profile-1.jpg"}
          alt="Profile"
          className="w-full h-full"
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </div>

      {/* Content — centered on mobile, left-aligned on sm+ */}
      <div className="flex-1 text-center sm:text-left w-full">

        {/* Name + badge */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h1 className="text-2xl sm:text-4xl font-bold">Ivan Brilata</h1>
          <svg className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5 l2.1 1.5 2.6-.3 1.3 2.3 2.4.9-.3 2.6 1.5 2.1-1.5 2.1.3 2.6-2.4.9-1.3 2.3-2.6-.3-2.1 1.5-2.1-1.5-2.6.3-1.3-2.3-2.4-.9.3-2.6-1.5-2.1 1.5-2.1-.3-2.6 2.4-.9 1.3-2.3 2.6.3L12 2.5z"
              fill="#1DA1F2"
            />
            <path
              d="M9.5 12.5l1.8 1.8 3.8-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-600 dark:text-slate-400 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Tiaong Quezon Province, Philippines</span>
        </div>

        {/* Typewriter */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 min-h-[24px]">
          {displayedText}
          <span
            className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5"
            style={{ animation: "blink 1s step-end infinite" }}
          />
        </p>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Buttons — centered on mobile, left on sm+ — original gap-3, max-w-md preserved */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-5 sm:mt-6 max-w-[260px] sm:max-w-md mx-auto sm:mx-0">
          <a href="/cv-brilata-1.pdf" download>
            <Button size="sm" className="w-full sm:size-lg sm:h-11 sm:text-base">
              Download CV
            </Button>
          </a>
          <a href="mailto:ibrilata.dev@gmail.com">
            <Button size="sm" className="w-full sm:size-lg sm:h-11 sm:text-base">
              Email
            </Button>
          </a>
          <a href="https://github.com/ivanskieee" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full sm:size-lg sm:h-11 sm:text-base">
              GitHub
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/vansrzb/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full sm:size-lg sm:h-11 sm:text-base">
              LinkedIn
            </Button>
          </a>
        </div>

      </div>
    </div>
  );
}
