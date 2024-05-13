

export const getDayXAxis = () => {
    let categories = []
    
    for(let i = 1; i <= 31; i++) { 
        categories.push(i)
    } 

    return {
        categories
    }
}