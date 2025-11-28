import crypto from "crypto";

export function generateToken(length = 16){
    return crypto.randomBytes(length).toString("base64url")
}