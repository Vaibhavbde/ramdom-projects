import { useState, useEffect } from "react";
import { ArrowUpIcon} from 'lucide-react'

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show button when scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 ${
        visible ? "inline" : "hidden"
      }`}
      aria-label="Back to top"
    >
      <ArrowUpIcon />
    </button>
  );
};

export default BackToTop;
