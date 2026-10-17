import { memoryAdapter } from "better-auth/adapters/memory";
export type Role="admin"|"user";
export interface Product {id:string;name:string;description:string;price:number;stock:number;sellerId?:string;createdAt:string;updatedAt:string}
export interface UserRole {userId:string;role:Role}
const now=new Date().toISOString();
const memoryDb={user:[] as Array<{id:string;email:string;name:string|null;image:string|null;emailVerified:boolean;emailVerifiedAt:Date|null;createdAt:Date;updatedAt:Date;lastSignInAt:Date|null}>,session:[] as unknown[],account:[] as unknown[],verification:[] as unknown[],product:[
{id:"ulos-ragi-hotang",name:"Kain Ulos Motif Ragi Hotang",description:"Tenun khas Batak dengan motif bermakna, dibuat dengan ketelitian tangan pengrajin lokal.",price:285000,stock:8,createdAt:now,updatedAt:now},
{id:"kopi-pusuk-buhit",name:"Kopi Arabika Pusuk Buhit",description:"Kopi lokal dengan aroma hangat dari kawasan sekitar Danau Toba. Cocok untuk teman pagi.",price:68000,stock:24,createdAt:now,updatedAt:now},
{id:"tas-anyaman",name:"Tas Anyaman Pandan",description:"Tas ringan buatan tangan dengan sentuhan alami, cocok untuk jalan-jalan dan hadiah.",price:125000,stock:12,createdAt:now,updatedAt:now},
{id:"andaliman",name:"Bumbu Andaliman Samosir",description:"Bumbu khas Batak dengan sensasi segar yang unik untuk menambah karakter masakan.",price:45000,stock:30,createdAt:now,updatedAt:now}
] as Product[],userRole:[] as UserRole[]};
export const adapter=memoryAdapter(memoryDb);export const db=memoryDb;
export const SEED_ADMIN_EMAIL="admin@example.com";export const SEED_ADMIN_PASSWORD="admin12345";
export function getUserRole(userId:string):Role{return db.userRole.find(r=>r.userId===userId)?.role??"user"}
export function setUserRole(userId:string,role:Role){const existing=db.userRole.find(r=>r.userId===userId);if(existing)existing.role=role;else db.userRole.push({userId,role})}
export function removeUserRole(userId:string){db.userRole=db.userRole.filter(r=>r.userId!==userId)}
