
export interface ApiModel {

    id: string;
    hasOwner: boolean;
  
    output: () => any;
    shortoutput: () => any;
  }
  