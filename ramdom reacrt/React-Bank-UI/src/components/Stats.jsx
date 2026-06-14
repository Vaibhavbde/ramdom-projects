import { stats } from "../constants";
import styles from "../style";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const Stats = () => (
  <section className={`${styles.flexCenter} flex-wrap sm:mb-20 mb-6`}>
    {stats.map((stat, index) => (
      <motion.div
        key={stat.id}
        className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-start items-center m-3 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <h4 className="font-poppins font-bold xs:text-[40px] text-[30px] xs:leading-[50px] leading-[40px] text-gradient">
          <CountUp end={Number(stat.value)} duration={2} />
        </h4>
        <p className="font-poppins font-bold xs:text-[40px] text-[30px] xs:leading-[50px] leading-[40px] text-gradient">{stat.title === "Transaction"?"M+":"+"}</p>
        <p className="font-poppins font-medium xs:text-[18px] text-[14px] xs:leading-[24px] leading-[20px] text-white uppercase ml-0 sm:ml-3 mt-2 sm:mt-0">
          {stat.title}
        </p>
      </motion.div>
    ))}
  </section>
);

export default Stats;
