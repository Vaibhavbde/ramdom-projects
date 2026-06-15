import React from 'react';

// --- 1. SAMPLE DATA ---
const reviews = [
    {
        id: 1,
        name: 'Marie Morrison',
        // In a real app, you would import images or use an external URL
        reviewText: 'I have hinted that I would often jerk poor Queequeg from between the whale and the ship—where he would occasionally fall, from the incessant rolling and swaying of both.',
        timeAgo: '12 minutes ago',
        rating: 4,
    },
    {
        id: 2,
        name: 'Brandon Porter',
        reviewText: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among the crew. Now hands are wanted here, and then again.',
        timeAgo: '3 hours ago',
        rating: 5,
    },
    {
        id: 3,
        name: 'James Peters',
        reviewText: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among the crew.',
        timeAgo: '1 day ago',
        rating: 3,
    },
    {
        id: 4,
        name: 'Judy Arnold',
        reviewText: 'Being the savage\'s bowsman, that is, the person who pulled...',
        timeAgo: '5 hours ago',
        rating: 5,
    },
];


// --- 2. STAR RATING COMPONENT (Helper) ---
const StarRating = ({ rating }) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
        const starClass = i <= rating ? 'text-yellow-400' : 'text-gray-300';
        // SVG for a star icon
        stars.push(
            <svg
                key={i}
                className={`w-4 h-4 ${starClass} inline-block fill-current`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path d="M10 15.27L16.18 19L14.54 12.33L19 7.85L12.97 7.26L10 1L7.03 7.26L1 7.85L5.46 12.33L3.82 19L10 15.27Z" />
            </svg>
        );
    }

    return <div className="flex space-x-0.5">{stars}</div>;
};


// --- 3. REVIEW CARD COMPONENT (Reusable Item) ---
const ReviewCard = ({ name, avatarSrc, reviewText, timeAgo, rating }) => {
    return (
        <div className="flex p-4 w-full">
            {/* Avatar (Left side) */}
            <div className="flex-shrink-0 mr-4 mt-1">
                <img
                    src="/women.png"
                    alt={`Avatar of ${name}`}
                    className="w-16 p-2 h-16 rounded-full object-cover shadow-md filter contrast-75 saturate-125" // Added filters to mimic the image's style
                />
            </div>

            {/* Content (Right side) */}
            <div className="flex flex-col w-full">
                {/* Name and Rating Row */}
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    <StarRating rating={rating} />
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {reviewText}
                </p>

                {/* Time Ago */}
                <p className="text-xs text-gray-400 mt-2">{timeAgo}</p>
            </div>
        </div>
    );
};


// --- 4. MAIN SECTION COMPONENT ---
const ReviewSection = () => {
    return (
        // Main container (Adjust max-w-4xl to change overall width)
        <div className="mx-auto mt-20 p-4 sm:p-6 bg-white">
            <h1 className='text-center font-bold text-3xl mb-10 text-black'>Customer Review</h1>
            {/* Grid Layout: 2 columns on medium screens and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-12">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        name={review.name}
                        avatarSrc={review.avatarSrc}
                        reviewText={review.reviewText}
                        timeAgo={review.timeAgo}
                        rating={review.rating}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;