export enum UserType {
  ADMIN,
  EMPLOYEE,
  OWNER,
  AGENT,
  SYNDIC,
  TENANT,
  INTERNSHIP,
}

export interface User {
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
  userType: UserType;
}
