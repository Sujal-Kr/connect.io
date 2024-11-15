import { faker } from "@faker-js/faker";
import { userModel } from "../models/user.model.js";

export const createUser = async (nums) => {
    try {
        const usersPromise = []
        for (let i = 0; i < nums; i++) {
            const tempuser = userModel.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            })
            usersPromise.push(tempuser)
        }
        await Promise.all(usersPromise)
        console.log(nums, " user created")
        process.exit(1)
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

