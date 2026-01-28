import bcrypt from "bcrypt"

export const createHash = password => bcrypt.hashSync(password, 10)
export const validaPass = (password, hash) => bcrypt.compareSync(password, hash)
