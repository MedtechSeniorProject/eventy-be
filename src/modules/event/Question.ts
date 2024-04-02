import QuestionType from "./dto/add-question.dto";

export default interface Question {
    type: QuestionType;
    question: string;
    options: string[] | null;
    isRequired: boolean;
}