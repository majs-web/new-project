
import { Certificate } from "../models/certificates";

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