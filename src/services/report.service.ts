import { readFile, writeFile, mkdir, access, constants } from 'fs/promises';
import createReport from 'docx-templates';
import * as path from 'path';
import { Student } from '../entity/students';
import axios from "axios";
import config from "../config";

type ResponseImage = {
    data: Buffer,
    width: number,
    height: number,
    extension: string
}

const checkFileExists = async (file: string): Promise<boolean> => {
    try {
        await access(file, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export const getBufferImageByUrl = async (urlStudent: string): Promise<ResponseImage> => {

    const { data, status } = await axios.get(config.HOST_API + `/${urlStudent}`, { responseType: 'arraybuffer' });

    const typeFile = imageFormatText(urlStudent);

    const buffer = Buffer.from(data, "utf-8");

    if (status !== 200) return {
        data: null,
        width: 2.90,
        height: 3.70,
        extension: `.${typeFile.toLowerCase()}`,
    }
    
    return {
        data: buffer,
        width: 2.90,
        height: 3.70,
        extension: `.${typeFile.toLowerCase()}`,
    }
}

export const imageFormatText = (url: string) => {

    const original = url.replace(' ', '%20')
        .toLowerCase()
        .substring(url.length - 3);

    if (original === 'jpg' || original === 'png')
        return original;

    return 'jpeg';
}

export const createImage = async (buffer: Buffer, student: Student) => {

    const typeFile = imageFormatText(student.photo_path);
    await writeFile(path.join(__dirname, `../storage/${student.lastname}.${typeFile.toLowerCase()}`), buffer);
}

export const sendTemplateStudentDocx = async (student: Student, codeStudent: string) => {
 
    // Read template
    const template = await readFile(path.join(__dirname, '../reports/template-student.docx'));
    // get Buffer Image
    const getIamgeStudent = await getBufferImageByUrl(student.photo_path);

    const buffer = await createReport({
        template,
        cmdDelimiter: ['{{', '}}'],
        data: {
            lastname: student.lastname.toUpperCase(),
            firstname: student.firstname.toUpperCase(),
            middlename: student.middlename.toUpperCase(),
            department: student.name_department,
            group_date_start: student.group_date_start,
            specialty: `${student.specialty_name} ${student.profile_name}`,
            code: student.code,
            form_name: student.form_name === 'Очная' ? 'Студент очной формы' : 'Студент заочной формы',
            photo: getIamgeStudent,
            codeStudent: codeStudent,
        },
    });
    const accessDirectory = await checkFileExists(path.join(__dirname, "../storage"));
    // check create directory
    if (!accessDirectory)
        await mkdir(path.join(__dirname, "../storage"));

    // write File docx
    await writeFile(path.join(__dirname, `../storage/${codeStudent}_${student.lastname}.docx`), buffer);
    // create image 
    // await createImage(getIamgeStudent.data, student);
}