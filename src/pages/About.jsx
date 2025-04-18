import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-20"> {/* Add top padding to avoid overlap with fixed Navbar */}
                <div className="px-6 py-10 max-w-4xl mx-auto text-justify text-gray-800 leading-relaxed">
                    <h1 className="text-3xl font-bold mb-6 text-center">About RMS</h1>
                    <p>
                        RMS was launched in 2017 with one driving ambition – to provide Indian men with an alternative dressing solution.
                        Mr. Rohit Yadav, our founder, mastered the art of manufacturing shirts in fabrics, colours and fit that sat at the intersection of international fashion and the Indian spirit.
                    </p>
                    <p className="mt-4">
                        His vision was simple – build the first global fashion brand that is proudly RMS bold and expressive style. RMS strives to provide our patrons with creative swag while being contemporary at heart.
                    </p>
                    <p className="mt-4">
                        RMS has been synonymous with the world of shirts from the very beginning. We firmly believe that shirts for men are not just a piece of clothing but a way of life.
                    </p>
                    <p className="mt-4">
                        RMS has an exhaustive range in the most comfortable fabrics, textures and colours.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default About;
