import { Request, Response } from "express";
import { getToken } from "../../services/auth.service";
import { User } from "../../interfaces/user";
import { getStudentWithPhoto } from "../../services/students.service";
import { sendTemplateStudentDocx } from "../../services/report.service";

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const user: User = {
            login: "1978",
            password: "005e7dbc17761eeaf487d484151c3536:c4ec37b4060cb9fbf50f4c4627b1c58c",
            id_module: 1
        };
        // get token jmu
        const { auth_token } = await getToken(user);
        // get students
        const arrayStudents = await getStudentWithPhoto(auth_token);

        // только бакалавр 1-3 курс
        const arrayBak = arrayStudents.filter(x =>
            x.name_department === 'Факультет музыкально-художественного образования имени Джульетты Якубович'
            && x.form_name === 'Очная'
            && x.level_name === 'бакалавриат'
            && (x.group_course === '1' || x.group_course === '2' || x.group_course === '3')
        );
        // магистратура 1 курс
        const arrayMag = arrayStudents.filter(x =>
            x.name_department === 'Факультет музыкально-художественного образования имени Джульетты Якубович'
            && x.form_name === 'Очная'
            && x.level_name === 'магистратура'
            && x.group_course === '1');

        const mergeArray = [...arrayMag, ...arrayBak];

        // const filterArray = arrayStudents.find( x => x.lastname === 'Тасаковский');

        let i = 1;
        let codeStudent = '';
        for (const iterator of mergeArray) {
     
            const index = i < 10 ? `00${i}` : (i < 100 && i >= 10) ? `0${i}` : i.toString();
            const date = iterator.group_date_start.slice(-2);
            // console.log({original: iterator.group_date_start , split: date});  
            codeStudent = `1${iterator.code}${date}${index}`;
            // create template
            await sendTemplateStudentDocx(iterator, codeStudent);
            i++;
        }
        res.status(200).send(mergeArray)

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};


