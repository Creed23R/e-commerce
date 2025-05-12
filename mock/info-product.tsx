export const mockData = {
    orders: 1250,
    totalRevenue: "$125,000",
    keyFeatures: [
        "Industry-leading noise cancellation",
        "30-hour battery life",
        "Touch sensor controls",
        "Speak-to-chat technology"
    ],
    colors: ["Black", "Silver", "Blue", "White"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
        {
            id: "1",
            userName: "John Doe",
            userImage: "/placeholders/user-1.jpg",
            rating: 5,
            comment: "This product exceeded my expectations. Great quality and performance!",
            date: "2 days ago"
        },
        {
            id: "2",
            userName: "Jane Smith",
            userImage: "/placeholders/user-2.jpg",
            rating: 4,
            comment: "Very good product, but I wish it had more color options.",
            date: "1 week ago"
        },
        {
            id: "3",
            userName: "Mike Johnson",
            userImage: "/placeholders/user-3.jpg",
            rating: 5,
            comment: "Absolutely love it! Would recommend to anyone.",
            date: "2 weeks ago"
        }
    ],
    ratingStats: [
        { stars: 5, count: 45, percentage: 75 },
        { stars: 4, count: 12, percentage: 20 },
        { stars: 3, count: 2, percentage: 3 },
        { stars: 2, count: 1, percentage: 1 },
        { stars: 1, count: 1, percentage: 1 }
    ],
    totalReviews: 60
};