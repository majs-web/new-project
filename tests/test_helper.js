
import { Certificate } from "../models/certificates";
import { User } from "../models/user";

export const initialCertificates = [
    {
        content: 'Fire Certificate',
        important: false
    },
    {
        content: 'Electrcal Certificate',
        important: true
    }
]

export const nonExistingId = async () => {
    const certificate = new Certificate({ content: 'willremovethissoon '})
    await certificate.save()
    await certificate.deleteOne()

    return certificate._id.toString()
}

export const certficatesInDb = async () => {
    const certficates = await Certificate.find({})
    return certficates.map(certificate => certificate.toJSON())
}

export const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}