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
          style={{ width: "200px", height: "220px", objectFit: "cover", objectPosition: "top" }}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-4xl font-bold">Ivan Brilata</h1>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
            <path
              d="M9 12l2 2 4-4"
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
          <Button size="lg">Download CV</Button>
          <Button size="lg">Email</Button>
          <Button variant="outline" size="lg">
            GitHub
          </Button>
          <Button variant="outline" size="lg">
            LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}