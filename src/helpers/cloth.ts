
import { CLOTH_CATEGORIES, CLOTH_GENDER, CLOTH_SEASON, CLOTH_STYLE } from "@/types/product";

type ClothEnumType = CLOTH_CATEGORIES | CLOTH_GENDER | CLOTH_SEASON | CLOTH_STYLE;

export const getList = (enumList: ClothEnumType) => Object
    .values(enumList)
    .map(item => ({ label: item, value: item }));


//@ts-ignore
export const clothCategories = getList(CLOTH_CATEGORIES)

//@ts-ignore
export const clothGenders = getList(CLOTH_GENDER)

//@ts-ignore
export const clothSeasons = getList(CLOTH_SEASON)

//@ts-ignore
export const clothStyles = getList(CLOTH_STYLE)
    