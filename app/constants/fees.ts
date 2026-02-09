export const PLATFORM_FEE = 50000;
export const INSPECTION_FEE = 100000;
export const DEPOSIT_MIN_AMOUNT = 100000;

export const calculateTotal = (price: number, type: 'PURCHASE' | 'DEPOSIT', depositAmount?: number) => {
    if (type === 'PURCHASE') {
        return price + PLATFORM_FEE + INSPECTION_FEE;
    }
    return (depositAmount || 0) + PLATFORM_FEE;
};
