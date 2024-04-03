import { randomUUID } from "crypto";
import QuestionType from "./dto/add-question.dto";

export default class Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  isRequired: boolean;

  constructor(
    id: string | undefined,
    type: QuestionType,
    question: string,
    isRequired: boolean,
    options?: string[] | null
  ) {
    this.id = id ?? randomUUID();
    this.type = type;
    this.question = question;
    this.isRequired = isRequired;
    this.options = options ?? null;
  }
}
