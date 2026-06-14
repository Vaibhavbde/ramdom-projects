import Logo from "../../components/Logo"
import Modal from "../../components/Modal"

export default function Hero() {
 return (
        <>
            <div className="hero-container  mt-32 z-0 relative my-5">

        
                <div className="px-32">
                    <img src="heroSection/paan-corner.webp" alt="" />
                </div>
                

                <div className="px-32 flex justify-start mt-5 ml-3">
                    <img src="heroSection/babycare-WEB.avif" alt="" className="h-48 mr-5" />
                    <img src="heroSection/Pet-Care_WEB.avif" alt="" className="h-48 mr-5" />
                    <img src="heroSection/pharmacy-WEB.avif" alt="" className="h-48" />
                </div>


            </div>
        </>
    )
}