import {nanoid} from "nanoid"

export const randomUUID = () => {
    const new_random_id = nanoid()
    return new_random_id
}