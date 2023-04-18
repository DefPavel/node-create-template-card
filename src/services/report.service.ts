import { readFile, writeFile, mkdir, access, constants } from 'fs/promises';
import createReport from 'docx-templates';
import * as path from 'path';
import { Student } from '../interfaces/students';
import { getBufferImageByUrl } from './students.service';

const checkFileExists = async (file: string): Promise<boolean> => {
    try {
        await access(file, constants.F_OK);
        return true;
    } catch {
        return false;
    }
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

    // write File
    await writeFile(path.join(__dirname, `../storage/${student.lastname}.docx`), buffer);
}