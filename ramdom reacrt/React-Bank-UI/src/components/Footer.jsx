import styles from "../style";
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => (
  <footer className={`${styles.flexCenter} ${styles.paddingY} flex-col bg-black`}>
    {/* Top section: Logo + links */}
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full max-w-7xl`}>
      {/* Logo + Description */}
      <div className="flex-[1] flex flex-col justify-start mr-10 mb-8 md:mb-0">
        <img
          src={logo}
          alt="HooBank Logo"
          className="w-[266px] h-[72px] object-contain mb-4"
        />
        <p className={`${styles.paragraph} mt-4 max-w-[312px] text-gray-400`}>
          A new way to make the payments easy, reliable and secure.
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex-[1.5] w-full flex flex-wrap justify-between">
        {footerLinks.map((footerlink) => (
          <div
            key={footerlink.title}
            className="flex flex-col ss:my-0 my-4 min-w-[150px]"
          >
            <h3 className="font-poppins font-medium text-[18px] leading-[27px] text-white mb-4">
              {footerlink.title}
            </h3>
            <ul className="list-none flex flex-col gap-3">
              {footerlink.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.link || "#"}
                    className="font-poppins font-normal text-[16px] leading-[24px] text-gray-400 hover:text-blue-500 transition-colors duration-300"
                    target={link.link ? "_blank" : "_self"}
                    rel={link.link ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom section: Copyright + Social Media */}
    <div className="w-full flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
      <p className="font-poppins font-normal text-[16px] text-gray-400 text-center md:text-left mb-4 md:mb-0">
        Copyright Ⓒ {new Date().getFullYear()} HooBank. All Rights Reserved.
      </p>

      <ul className="flex flex-row space-x-6">
        {socialMedia.map((social) => (
          <li key={social.id}>
            <a
              href={social.link || "#"}
              target={social.link ? "_blank" : "_self"}
              rel={social.link ? "noopener noreferrer" : undefined}
              className="transition-transform transform hover:scale-110"
            >
              <img
                src={social.icon}
                alt={`${social.id} icon`}
                className="w-5 h-5 object-contain"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
