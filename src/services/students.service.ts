import axios from "axios";
import { Student } from "../interfaces/students";
import config from "../config";

type StudentResponse = {
    withPhoto: Student[],
    withOutPhoto: Student[],
}

type ResponseImage = {
    data: Buffer,
    width: number,
    height: number,
    extension: string
}

const ImageFormatText = (url: string) => {

    const original = url.replace(' ', '%20')
        .toLowerCase()
        .substring(url.length - 3);

    if (original === 'jpg' || original === 'png')
        return original;

    return 'jpeg';
}

export const getBufferImageByUrl = async (urlStudent: string): Promise<ResponseImage> => {

    const { data } = await axios.get(config.HOST_API + `/${urlStudent}`, { responseType: 'arraybuffer' });

    const typeFile = ImageFormatText(urlStudent);

    const buffer = Buffer.from(data, "utf-8")
    return {
        data: buffer,
        width: 2.90,
        height: 3.70,
        extension: `.${typeFile.toLowerCase()}`,
    }
}

export const getStudentWithPhoto = async (token: string): Promise<Student[]> => {

    const { data, status } = await axios.get<StudentResponse>(config.HOST_API + "/api/education/students/skud/all", { headers: { "auth-token": token } });

    if (status !== 200) return null;

    return data.withPhoto;
}

export const getStudentWithNoPhoto = async (token: string): Promise<Student[]> => {

    const { data, status } = await axios.get<StudentResponse>(config.HOST_API + "/api/education/students/skud/all", { headers: { "auth-token": token } });

    if (status !== 200) return null;

    return data.withOutPhoto;
}