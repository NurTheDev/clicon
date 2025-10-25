export const getImgUrl =(name : string) : string => {
    return new URL(`../../public/${name}`, import.meta.url).href
}