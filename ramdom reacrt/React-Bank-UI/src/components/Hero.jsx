import styles from "../style";
import { discount, robot } from "../assets";
import GetStarted from "./GetStarted";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY} min-h-screen`}>
      {/* Left Content */}
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        {/* Discount Badge */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-4"
        >
          <img src={discount} alt="20% discount" className="w-[32px] h-[32px] animate-bounce" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{" "}
            <span className="text-white">1 Month</span> Account
          </p>
        </motion.div>

        {/* Headings */}
        <div className="flex flex-row justify-between items-center w-full">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]"
          >
            The Next <br className="sm:block hidden" />
            <span className="text-gradient">Generation</span>
          </motion.h1>

          <div className="ss:flex hidden md:mr-4 mr-0">
            <GetStarted />
          </div>
        </div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full"
        >
          Payment Method.
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`${styles.paragraph} max-w-[470px] mt-5 text-gray-300`}
        >
          Our team of experts uses a methodology to identify the credit cards
          most likely to fit your needs. We examine annual percentage rates and annual fees.
        </motion.p>
      </div>

      {/* Right Image */}
      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <motion.img
          src={robot}
          alt="3D robot holding credit card"
          className="w-[100%] h-[100%] relative z-[5]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        />

        {/* Gradient effects */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient animate-pulse" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40 animate-pulse" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient animate-pulse" />
      </div>

      {/* Mobile CTA */}
      <div className={`ss:hidden ${styles.flexCenter} mt-6`}>
        <GetStarted />
      </div>
    </section>
  );
};

export default Hero;
