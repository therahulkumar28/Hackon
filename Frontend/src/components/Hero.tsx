import Particle from "./Particle";
import TextEffect from "./TextEffect";

const Hero = () => {
    return (
        <div className="h-screen bg-gray-900 bg-cover bg-center relative">
            <Particle />
            <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
                <div className="lg:flex lg:grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-3xl md:text-5xl text-white font-bold">
                            HI, WE'RE <span className="text-yellow-400">CODE CREW!</span>
                        </h1>
                        <TextEffect />
                        <p className="mt-4 text-lg text-white">
                            We aim to revolutionize the payment landscape by implementing a suite of AI-powered solutions, including a chatbot for seamless customer payment query handling, an automated budgeting tool with threshold notifications and yearly spending limits, comprehensive savings tracking, detailed spending analysis by product categories, and a sophisticated recommendation engine that optimizes payment methods based on individual transaction histories, success rates, cashback availability, and payment option costs. In addition, we successfully tackled Theme 4 of the AMAZON HackOn Season 4.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
