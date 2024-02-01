// declare global {
//     // eslint-disable-next-line @typescript-eslint/no-namespace
//     namespace Express {
//       interface Request {
//         user?: UserModel,
//         tokenType?: {tokenType: boolean},
//       }
//     }
// }
// declare namespace Express {
//   export interface Request {
//       user: any;
//   }
// }

// import * as express from "express"
// declare global {
//     namespace Express {
//         interface Request {
//             user? : Record<string, any>
//         }
//     }
// }
export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}