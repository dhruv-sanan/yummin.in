

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image?: string;
    isVegetarian: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    tags?: string[];
}

export type Category =
    | "Milkshakes"
    | "Exotic Milkshakes"
    | "Floats"
    | "Classic Shakes"
    | "Fruit Shakes"
    | "Coffee"
    | "Smoothies"
    | "Milk Bottle"
    | "Fruit Cream"
    | "Amritsari Specials"
    | "Savory";

export const CATEGORIES: Category[] = [
    "Milkshakes",
    "Exotic Milkshakes",
    "Floats",
    "Classic Shakes",
    "Fruit Shakes",
    "Coffee",
    "Smoothies",
    "Milk Bottle",
    "Fruit Cream",
    "Amritsari Specials",
    "Savory"
];

export interface MenuGroup {
    name: string;
    categories: Category[]; // Sub-categories
    directLink?: boolean; // If true, clicking opens the category directly (no sub-menu)
}

export const MENU_GROUPS: MenuGroup[] = [
    {
        name: "Amritsari Specials",
        categories: ["Amritsari Specials", "Milk Bottle", "Fruit Cream"]
    },
    {
        name: "Milkshakes",
        categories: ["Milkshakes", "Exotic Milkshakes", "Classic Shakes", "Fruit Shakes"]
    },
    {
        name: "Cold Coffee",
        categories: ["Coffee"]
    },
    {
        name: "Coolers",
        categories: ["Floats", "Smoothies"]
    }
];

export const MENU_ITEMS: MenuItem[] = [
    // Milkshakes
    {
        id: "1",
        name: "Its So Chocolatey",
        description: "Chocolate Sauce & Premium Cocoa blended with Milk, Ice Cream",
        price: 109,
        category: "Milkshakes",
        isVegetarian: true,
        tags: ["BestSeller"],
        isBestseller: true
    },
    {
        id: "2",
        name: "Chocolate Oreo",
        description: "Chocolate Shake blended with Crunchy & Creamy Oreo Cookies",
        price: 129,
        category: "Milkshakes",
        isVegetarian: true
    },
    {
        id: "3",
        name: "Creamy Oreo Temptation",
        description: "Oreo Cookies, Milk, Ice Cream. Topped with Oreo Crumbles",
        price: 129,
        category: "Milkshakes",
        isVegetarian: true
    },
    {
        id: "4",
        name: "Kitkat Krunch",
        description: "Chocolate Shake blended with Crunchy Kitkat",
        price: 129,
        category: "Milkshakes",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "5",
        name: "Hazelnut Heaven",
        description: "Combination of Chocolate shake and Roasted Hazelnuts",
        price: 129,
        category: "Milkshakes",
        isVegetarian: true
    },
    {
        id: "6",
        name: "Choco Chip Affair",
        description: "Chocolate Shake blended with Crunchy Choco Chips",
        price: 129,
        category: "Milkshakes",
        isVegetarian: true
    },
    {
        id: "7",
        name: "Snickers Fest",
        description: "A Chocolate shake with caramel & nutty twist of Snickers",
        price: 139,
        category: "Milkshakes",
        isVegetarian: true
    },
    {
        id: "8",
        name: "Nutella Madness",
        description: "Luscious Nutella blended with Chocolate Sauce, Milk, Ice Cream",
        price: 169,
        category: "Milkshakes",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "9",
        name: "Ferrero Rocher",
        description: "Ferrero Rocher Chocolates, Chocolate Sauce, Milk, Ice Cream",
        price: 199,
        category: "Milkshakes",
        isVegetarian: true
    },

    // Exotic Milkshakes
    {
        id: "10",
        name: "Salted Caramel",
        description: "Caramel Sauce, Pink Salt, Milk, Ice Cream",
        price: 139,
        category: "Exotic Milkshakes",
        isVegetarian: true
    },
    {
        id: "11",
        name: "Pop Caramelito",
        description: "Popcorn Syrup, Caramel Sauce, Milk, Ice Cream",
        price: 139,
        category: "Exotic Milkshakes",
        isVegetarian: true,
        isNew: true
    },
    {
        id: "12",
        name: "Lotus Biscoff Caramello Blast",
        description: "Blend of Lotus Biscoff spread with Milk and Vanilla Ice Cream",
        price: 169,
        category: "Exotic Milkshakes",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "13",
        name: "Childhood Glimpses",
        description: "Bubblegum Syrup, Strawberry Syrup, Marshmallows, Milk, Ice Cream",
        price: 159,
        category: "Exotic Milkshakes",
        isVegetarian: true
    },

    // Floats
    {
        id: "14",
        name: "Coke Float",
        description: "Coke topped with Vanilla Ice Cream",
        price: 69,
        category: "Floats",
        isVegetarian: true
    },
    {
        id: "15",
        name: "Orange Sunset",
        description: "Orange with Vanilla Ice Cream and splash of Sparkling Soda",
        price: 99,
        category: "Floats",
        isVegetarian: true
    },

    // Classic Shakes
    {
        id: "16",
        name: "Vanilla Velvet",
        description: "Vanilla Icecream, Milk, Vanilla Syrup",
        price: 119,
        category: "Classic Shakes",
        isVegetarian: true
    },
    {
        id: "17",
        name: "Butterscotch Bliss",
        description: "Vanilla Icecream, Milk, Butterscoth Syrup",
        price: 119,
        category: "Classic Shakes",
        isVegetarian: true
    },

    // Fruit Shakes
    {
        id: "18",
        name: "Tropical Mango",
        description: "Blend of Fresh Mango chunks with Milk & Ice Cream",
        price: 99,
        category: "Fruit Shakes",
        isVegetarian: true
    },
    {
        id: "19",
        name: "Blissful Banana",
        description: "Banana, Milk, Icecream. Topped with Ice cream & Banana Slices",
        price: 99,
        category: "Fruit Shakes",
        isVegetarian: true
    },

    // Coffee
    {
        id: "20",
        name: "Signature Cold Coffee",
        description: "A Delicious smooth and icy blend of Davidoff Coffee Shot with Milk and Ice Cream",
        price: 119,
        category: "Coffee",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "21",
        name: "Flavoured Cold Coffee",
        description: "Vanilla, Hazelnut, Caramel, Chocolate, Irish Cream, Tiramisu, Brown Butter, Vanilla Hazelnut",
        price: 149,
        category: "Coffee",
        isVegetarian: true
    },

    // Smoothies
    {
        id: "22",
        name: "Mango Magic",
        description: "Mango Chunks blended with Greek Yogurt, Milk, Honey and Banana",
        price: 199,
        category: "Smoothies",
        isVegetarian: true
    },
    {
        id: "23",
        name: "Wild Strawberry",
        description: "Strawberries blended with Greek Yogurt, Milk, Honey and Banana",
        price: 219,
        category: "Smoothies",
        isVegetarian: true
    },

    // Milk Bottle
    {
        id: "24",
        name: "Milk Badam",
        description: "Creamy blend of Milk, Almonds, Cashew & Hint of Elaichi",
        price: 50,
        category: "Milk Bottle",
        isVegetarian: true
    },
    {
        id: "25",
        name: "Kesar Pista Milk",
        description: "Creamy Blend of Milk, Original Kashmiri Kesar, Pista & Almonds",
        price: 60,
        category: "Milk Bottle",
        isVegetarian: true
    },

    // Amritsari Specials
    {
        id: "26",
        name: "Khoya Kulfi",
        description: "Traditional Khoya Kulfi, Falooda Noodles, Rabri & Gond Katira",
        price: 80,
        category: "Amritsari Specials",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "27",
        name: "Rabri Faluda in Glass",
        description: "Rich Rabri with Falooda noodles",
        price: 130,
        category: "Amritsari Specials",
        isVegetarian: true
    },
    {
        id: "28",
        name: "Lassi",
        description: "Thick and creamy Lassi. Topped with almonds and pista",
        price: 60,
        category: "Amritsari Specials",
        isVegetarian: true
    },

    // Savory
    {
        id: "29",
        name: "Paneer Tikka Sandwich",
        description: "Grilled sandwich with spiced paneer tikka, veggies & mint chutney",
        price: 149,
        category: "Savory",
        isVegetarian: true,
        isBestseller: true
    },
    {
        id: "30",
        name: "Masala Fries",
        description: "Crispy fries tossed with spicy masala seasoning",
        price: 89,
        category: "Savory",
        isVegetarian: true
    },
    {
        id: "31",
        name: "Veg Grilled Sandwich",
        description: "Classic grilled sandwich with fresh vegetables & cheese",
        price: 129,
        category: "Savory",
        isVegetarian: true
    },
    {
        id: "32",
        name: "Nachos with Cheese",
        description: "Crispy nachos topped with melted cheese & jalapeños",
        price: 139,
        category: "Savory",
        isVegetarian: true
    },
    {
        id: "33",
        name: "Chilli Cheese Toast",
        description: "Toasted bread topped with spicy cheese spread",
        price: 99,
        category: "Savory",
        isVegetarian: true
    }
];
