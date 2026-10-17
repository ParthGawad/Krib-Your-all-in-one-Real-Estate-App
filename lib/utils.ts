const formatPrice = (price: number) => {
    if (price >= 10000000) {
        const cr = (price / 10000000).toFixed(1).replace(/\.0$/, "")
        return `₹${cr}Cr`
    } else if (price >= 100000) {
        const lkh = (price / 100000).toFixed(1).replace(/\.0$/, "")
        return `₹${lkh}Lakh`
    } else {
        return `₹${price}`
    }
}

export { formatPrice }
