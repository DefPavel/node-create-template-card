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

export const getBufferImageByUrl = async (urlStudent: string) : Promise<ResponseImage> => {
    
    const {data} = await axios.get(config.HOST_API + `/${urlStudent}`,  { responseType: 'arraybuffer' });

    const typeFile = urlStudent.substring(urlStudent.length - 3);

    const buffer = Buffer.from(data, "utf-8")
    return {
        data: buffer,
        width: 2.90,
        height: 3.80,
        extension: `.${typeFile}`,
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