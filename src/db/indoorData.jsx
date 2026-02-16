
import IndoorImages from "../assets/index";

const IndoorData = [
    {
        id: "ALOCASIA-MELO",
        title: "Alocasia Melo",
        label: "NEW",
        category: "Indoor",
        size: "SM",
        price: 49,
        dateAdded: "2025-02-15",
        variants: [
            { id: "ALM-CLAY", type: "CLAY", image: IndoorImages.ALOCASIA_MELO.CLAY, stock: 12 },
            { id: "ALM-SLATE", type: "SLATE", image: IndoorImages.ALOCASIA_MELO.SLATE, stock: 8 },
        ],
    },
    {
        id: "BAMBOO-PALM",
        title: "Bamboo Palm",
        label: "BESTSELLER",
        category: "Indoor",
        size: "XXL",
        price: 199,
        dateAdded: "2024-03-10",
        variants: [
            { id: "BAM-CLAY", type: "CLAY", image: IndoorImages.BAMBOO_PALM.CLAY, stock: 5 },
            { id: "BAM-STONE", type: "STONE", image: IndoorImages.BAMBOO_PALM.STONE, stock: 3 },
            { id: "BAM-CHARCOAL", type: "CHARCOAL", image: IndoorImages.BAMBOO_PALM.CHARCOAL, stock: 7 },
            { id: "BAM-INDIGO", type: "INDIGO", image: IndoorImages.BAMBOO_PALM.INDIGO, stock: 4 },
            { id: "BAM-SLATE", type: "SLATE", image: IndoorImages.BAMBOO_PALM.SLATE, stock: 6 },
        ],
    },
    {
        id: "XANTHOSOMA-LINDENII",
        title: "Xanthosoma Lindenii",
        label: "NEW",
        category: "Indoor",
        size: "MD",
        salePrice: 89,
        price: 109,
        dateAdded: "2025-02-05",
        variants: [
            { id: "XAN-MD-CLAY", type: "CLAY", image: IndoorImages.XANTHOSOMA_LINDENII.CLAY, stock: 10 },
            { id: "XAN-MD-CHARCOAL", type: "CHARCOAL", image: IndoorImages.XANTHOSOMA_LINDENII.CHARCOAL, stock: 8 }
        ]
    },
    {
        id: "HOYA-COMPACTA",
        title: "Hoya Compacta",
        size: "XS",
        price: 39,
        dateAdded: "2024-02-18",
        variants: [
            { id: "HOY-XS-CHARCOAL", type: "CHARCOAL", image: IndoorImages.HOYA_COMP.CHARCOAL, stock: 15 }
        ]
    },
    {
        id: "HOYA-HEART",
        title: "Hoya Heart",
        label: "MOST_GIFTED",
        size: "XS",
        price: 39,
        dateAdded: "2024-02-22",
        variants: [
            { id: "HOYH-XS-CHARCOAL", type: "CHARCOAL", image: IndoorImages.HOYA_HEART.CHARCOAL, stock: 18 },
            { id: "HOYH-XS-STONE", type: "STONE", image: IndoorImages.HOYA_HEART.STONE, stock: 18 }

        ]
    },
    {
        id: "RED-PRAYER-PLANT",
        title: "Red Prayer Plant",
        label: "BESTSELLER",
        size: "SM",
        price: 49,
        dateAdded: "2024-01-30",
        variants: [
            { id: "RPP-SM-CLAY", type: "CLAY", image: IndoorImages.RED_PRAYER.CLAY, stock: 12 },
            { id: "RPP-SM-CHARCOAL", type: "CHARCOAL", image: IndoorImages.RED_PRAYER.CHARCOAL, stock: 12 },
            { id: "RPP-SM-SLATE", type: "SLATE", image: IndoorImages.RED_PRAYER.SLATE, stock: 12 }
        ]
    },
    {
        id: "FIDDLE-LEAF-FIG",
        title: "Fiddle Leaf Fig",
        size: "XXL",
        salePrice: 199,
        price: 259,
        dateAdded: "2024-02-28",
        variants: [
            { id: "FLF-XXL-STONE", type: "STONE", image: IndoorImages.FIDDLE_FIG.STONE, stock: 10 },
            { id: "FLF-XXL-CLAY", type: "CLAY", image: IndoorImages.FIDDLE_FIG.CLAY, stock: 10 },
            { id: "FLF-XXL-CHARCOAL", type: "CHARCOAL", image: IndoorImages.FIDDLE_FIG.CHARCOAL, stock: 8 },
            { id: "FLF-XXL-INDIGO", type: "INDIGO", image: IndoorImages.FIDDLE_FIG.INDIGO, stock: 8 },
            { id: "FLF-XXL-SLATE", type: "SLATE", image: IndoorImages.FIDDLE_FIG.SLATE, stock: 8 }

        ]

    },
    {
        id: "NEON-PRAYER-PLANT",
        title: "Neon Prayer Plant",
        label: "BESTSELLER",
        size: "MD",
        price: 69,
        dateAdded: "2024-01-15",
        variants: [
            { id: "NPP-MD-CHARCOAL", type: "CHARCOAL", image: IndoorImages.NEON_PRAYER.CHARCOAL, stock: 10 },

        ]
    },
    {
        id: "SANSEVIERIA",
        title: "Sansevieria",
        label: "LOW_MAINTENANCE",
        size: "XL",
        price: 149,
        dateAdded: "2024-03-05",
        variants: [
            { id: "SAN-XL-STONE", type: "STONE", image: IndoorImages.SANSEVIERIA_PLANT.STONE, stock: 10 },
            { id: "SAN-XL-CLAY", type: "CLAY", image: IndoorImages.SANSEVIERIA_PLANT.CLAY, stock: 10 },
            { id: "SAN-XL-CHARCOAL", type: "CHARCOAL", image: IndoorImages.SANSEVIERIA_PLANT.CHARCOAL, stock: 8 },
            { id: "SAN-XL-INDIGO", type: "INDIGO", image: IndoorImages.SANSEVIERIA_PLANT.INDIGO, stock: 8 },
            { id: "SAN-XL-SLATE", type: "SLATE", image: IndoorImages.SANSEVIERIA_PLANT.SLATE, stock: 8 }

        ]
    },
    {
        id: "ZZ-CHAMELEON",
        title: "ZZ Chameleon",
        label: "RARE_BLOOM",
        size: "MD",
        price: 109,
        salePercentage: 20,
        dateAdded: "2024-03-18",
        variants: [
            { id: "MT-XL-CHARCOAL", type: "CHARCOAL", image: IndoorImages.ZZ_CHAMELEON.CHARCOAL, stock: 7 }
        ]
    },
    {
        id: "PHILODENDRON-BIRKIN",
        title: "Philodendron Birkin",
        label: "NEW",
        size: "SM",
        price: 49,
        salePercentage: 20,
        dateAdded: "2025-02-12",
        variants: [
            { id: "MT-XL-CLAY", type: "CLAY", image: IndoorImages.PHIL_BIRKIN.CLAY, stock: 11 },
            { id: "MT-XL-STONE", type: "STONE", image: IndoorImages.PHIL_BIRKIN.STONE, stock: 7 },
            { id: "MT-XL-INDIGO", type: "INDIGO", image: IndoorImages.PHIL_BIRKIN.INDIGO, stock: 7 },
            { id: "MT-XL-CHARCOAL", type: "CHARCOAL", image: IndoorImages.PHIL_BIRKIN.CHARCOAL, stock: 7 },
            { id: "MT-XL-SLATE", type: "SLATE", image: IndoorImages.PHIL_BIRKIN.SLATE, stock: 7 },

        ]
    },
    {
        id: "AIR-PLANTS",
        title: "Air Plants",
        label: "NEW",
        size: "XS",
        price: 117,
        salePrice: 79,
        dateAdded: "2025-02-12",
        variants: [
            { id: "AIR-XS-DEFAULT", type: "DEFAULT", image: IndoorImages.AIR_PLANT.DEFAULT, stock: 25 },
            { id: "AIR-XS-CLAY", type: "CLAY", image: IndoorImages.AIR_PLANT.CLAY, stock: 25 }
        ]
    },
    {
        id: "MONEY-TREE",
        title: "Money Tree",
        label: "MOST_GIFTED",
        size: "XL",
        price: 117,
        salePrice: 79,
        dateAdded: "2025-02-01",
        variants: [
            { id: "MT-XL-CLAY", type: "CLAY", image: IndoorImages.MONEY_TREE.CLAY, stock: 11 },
            { id: "MT-XL-STONE", type: "STONE", image: IndoorImages.MONEY_TREE.STONE, stock: 7 },
            { id: "MT-XL-INDIGO", type: "INDIGO", image: IndoorImages.MONEY_TREE.INDIGO, stock: 7 },
            { id: "MT-XL-CHARCOAL", type: "CHARCOAL", image: IndoorImages.MONEY_TREE.CHARCOAL, stock: 7 },
            { id: "MT-XL-SLATE", type: "SLATE", image: IndoorImages.MONEY_TREE.SLATE, stock: 7 },

        ]
    },
    {
        id: "YELLOW-ORCHIDE",
        title: "2 ft Yellow Orchid",
        label: "SALE",
        size: "MD",
        price: 117,
        salePrice: 79,
        isBundle: true,
        variants: [
            { id: "YO-MD-CHARCOAL", type: "CHARCOAL", image: IndoorImages.YELLOW_ORCHIDE.CHARCOAL, stock: 10 },
            { id: "YO-MD-CLAY", type: "CLAY", image: IndoorImages.YELLOW_ORCHIDE.CLAY, stock: 10 },
            { id: "YO-MD-SLATE", type: "SLATE", image: IndoorImages.YELLOW_ORCHIDE.SLATE, stock: 10 },
            { id: "YO-MD-WHITE", type: "WHITE", image: IndoorImages.YELLOW_ORCHIDE.WHITE, stock: 10 },

        ]
    },

];

export default IndoorData;

