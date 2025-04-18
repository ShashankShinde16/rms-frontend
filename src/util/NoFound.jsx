import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const NoResults = () => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("https://assets6.lottiefiles.com/packages/lf20_HpFqiS.json")
            .then(res => res.json())
            .then(setAnimationData);
    }, []);

    if (!animationData) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Lottie animationData={animationData} loop={true} className="w-60 h-60" />
        </div>
    );
};

export default NoResults;