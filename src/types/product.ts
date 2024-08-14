
export enum CLOTH_SEASON {
    ALL = 'All Seasons',
    FALL = 'Fall', 
    SPRING = 'Spring', 
    SUMMER = 'Summer', 
    WINTER = 'Winter', 
}

export enum CLOTH_GENDER {
    FEMALE = "female",
    MALE = 'male',
    UNISEX = 'Unisex'
}

export enum CLOTH_CATEGORIES {
    DRESS = "dress",
    JACKET = "jacket",
    PANTS = "pants",
    SHOES = "shoes",
    SHIRT = "shirt"
}

export enum CLOTH_STYLE {
    CASUAL = "casual",
    FORMAL = "formal",
    SPORT = "sport"
}

export enum CAR_TRANSMISSION {
    AUTOMATIC = "automatic",
    MANUAL = "manual"
}
export enum CAR_ENGINE_TYPE {
    DIESEL = "diesel",
    ELECTRIC = "electric",
    HYBRID = "hybrid",
    PETROL = "petrol"
}

export enum FURNITURE_CATEGORY {
    BED = "bed",
    CHAIR = "chair",
    CABINET = "cabinet",
    SOFA = "sofa",
    TABLE = "table"
}

export enum PRODUCTS_CATEGORIES {
    CLOTH = "cloth",
    CARS = "cars",
    EXPIRABLE = "expirable",
    FURNITURE = "furniture"
}

export enum PRODUCT_STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending"
}

export type CarType = {
    color: string,
    engine: {
        horsepower: number,
        type: CAR_ENGINE_TYPE
    },
    make: string,
    model: string,
    transmission: CAR_TRANSMISSION,
    year: number,
}

export type ExpirableProductType = {
    barcode: string,
    expirationDate: string,
    manufactureDate: string,
}

export type FurnictureType = {
    material: string,
    dimensions: {
        height: string,
        length: string,
        width: string
    }
}

export type ClothType = {
    brand: string,
    barcode?: string;
    category: CLOTH_CATEGORIES, // e.g., 'Shirt', 'Pants', 'Dress', 'Jacket', 'Shoes'
    size: string, // e.g., 'S', 'M', 'L', 'XL', or numerical sizes
    material?: string, // e.g., 'Cotton', 'Polyester', 'Wool'
    color: string,
    gender: CLOTH_GENDER,
    description?: string,
    careInstructions?: string, // e.g., 'Machine wash cold, tumble dry low'
    season: CLOTH_SEASON, 
    style: CLOTH_STYLE
    sku: string, // Stock Keeping Unit for tracking
    tags?: string[], // e.g., ['Eco-Friendly', 'New Arrival', 'Best Seller']
}

export type ProductType = {
    category: PRODUCTS_CATEGORIES;
    id?: string;
    name: string;
    barcode?: string;
    purchasePrice: number;
    sellPrice: number;
};


export type GblobalProductType = {
    category: PRODUCTS_CATEGORIES;
    id: string;
    warehouses: string[]
}


export type WarehouseProductType = {
    id: string;
    profit: number;
    purchasePrice: number;
    stock: {
        quantity: number
    };
    sellPrice: number;
};

export type StoreProductType = WarehouseProductType & {
    createdAt: string;
    category: PRODUCTS_CATEGORIES;
    description?: string;
    name: string;
    car?: CarType;
    cloth?: ClothType;
    expirable?: ExpirableProductType;
    furnicture?: FurnictureType;
    status: PRODUCT_STATUS;
    stores: string[]
    username: string;
};

export type ProductInfoType = StoreProductType;

export type ProductFilterType = {
    category?: string | string[];
    price?: {
        min: number;
        max: number
    };
    searchKey?: string;
};