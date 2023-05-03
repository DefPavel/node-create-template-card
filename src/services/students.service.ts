import axios from "axios";
import { Student } from "../entity/students";
import config from "../config";

type StudentResponse = {
    withPhoto: Student[],
    withOutPhoto: Student[],
}

export const checkStudentInWorking = async (token: string, fullName: string): Promise<boolean> => {

    const { data } = await axios.get(config.HOST_API + "/api/pers/person/find", { headers: { "auth-token": token }, params: { "text": fullName } });
    // Где не уволенный сотрудник
    const idPosition = data[0]?.id_position || 1;
    // Где карта уже указана
    const codeCard = data[0]?.skud_card || '0';
    
    if ((idPosition !== 1 && codeCard !== '0')) return true;

    return false;
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