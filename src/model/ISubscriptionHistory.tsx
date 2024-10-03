export interface ISubscriptionHistory {
    authId: number,
    subscriptionType: string,
    status: string,
    startDate: Date,
    endDate: Date,
    planName: string,
    planPrice: number
    planDescription: string
}