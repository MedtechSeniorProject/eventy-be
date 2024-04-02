import QuestionType from "./QuestionType";

class Question {
  type: QuestionType;
  options: string[];
  question: string;
  isRequired: boolean;

  constructor(
    type: QuestionType,
    options: string[],
    question: string,
    isRequired: boolean
  ) {
    this.type = type;
    this.options = options;
    this.question = question;
    this.isRequired = isRequired;
  }
}

export default Question;
