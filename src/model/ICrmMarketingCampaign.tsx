 export interface ICrmMarketingCampaign{
     id: number;
     memberId: number;
     name: string;
     description: string;
     startDate: Date;
     endDate: Date;
     budsetget: number;
     status:string
 }