import { Link } from "react-router-dom";

const NewAndOff = () => {
    return (
        <div className="flex justify-center items-center gap-2 mt-12 px-4">
            <Link
                to="/new-arrivals"
                className="w-1/2 h-auto block"
            >
                <img
                    src="https://d118ps6mg0w7om.cloudfront.net/media/images/New-Arrivals.jpg"
                    alt="New Arrivals"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
            </Link>
            <Link
                to="/offers"
                state={{ offer: "50", image: "https://d118ps6mg0w7om.cloudfront.net/media/images/bottom-Sale-banner.jpg" }}
                className="w-1/2 h-auto block"
            >
                <img
                    src="https://d118ps6mg0w7om.cloudfront.net/media/images/bottom-Sale-banner.jpg"
                    alt="Offers"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
            </Link>
        </div>
    );
};

export default NewAndOff;
