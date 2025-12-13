export const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Yummin",
    "image": "https://yummin.in/placeholder.jpg",
    "description": "Amritsar's favorite spot for Shakes, Juices, Beverages, and Desserts.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Opposite Gurudwara Har Rai Sahib, Majitha Road",
        "addressLocality": "Amritsar",
        "addressRegion": "Punjab",
        "postalCode": "143001",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 31.6340,
        "longitude": 74.8723
    },
    "url": "https://yummin.in",
    "telephone": "+918877116603",
    "priceRange": "₹₹",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Friday",
                "Sunday"
            ],
            "opens": "12:00",
            "closes": "23:45"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Thursday",
                "Saturday"
            ],
            "opens": "12:00",
            "closes": "00:00"
        }
    ],
    "menu": "https://yummin.in/menu",
    "servesCuisine": "Beverages, Desserts, Cafe"
};
