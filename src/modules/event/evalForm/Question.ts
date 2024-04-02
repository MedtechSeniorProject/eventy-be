import QuestionType from "./QuestionType";

class Question {
  type: QuestionType;
  question: string;
  isRequired: boolean;
  options: string[] | null;

  constructor(
    type: QuestionType,
    question: string,
    isRequired: boolean,
    options?: string[],
  ) {
    this.type = type;
    this.question = question;
    this.isRequired = isRequired;
    if (options){
      this.options = options;
    }
    else {
      this.options = null;
    }
  }
}

export default Question;
