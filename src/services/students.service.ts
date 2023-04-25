import axios from "axios";
import { Student } from "../interfaces/students";
import config from "../config";

type StudentResponse = {
    withPhoto: Student[],
    withOutPhoto: Student[],
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