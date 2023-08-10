export class Mood {

  mood: number;
  changes: boolean;
  date: number;
  makeChanges?: number;
  details?: string;

}

export class MoodObjectWithId extends Mood {
  _id: string;
  mId: number;
}

export class BackendResponse {
  message: string;
  success: string;
}

export class MoodObjectFRBK extends BackendResponse {
  data: MoodObjectWithId;
}

export class MoodArray extends BackendResponse {
  data: MoodObjectWithId[];
}

export class UpdateMood {
  _id: string;
  mood: number;
  makeChanges: number;
  details: string;

  
  date?: number;
  changes?: boolean;
}

export class NumberOfChanges extends BackendResponse{

  data: {
      numOfDiet: number;

      numOfRoutine: number;

      numOfExercise: number;

      numOfSleep: number;

      numOfHygiene: number;

      numOfSocial: number;

      numOfOther: number;

      numOfDays: number;

      persents: {
        diet: number;

        routine: number;

        exercise: number;

        sleep: number;

        hygiene: number;

        social: number;

        other: number;
      }
  }

 
}

export class AvgMood extends BackendResponse {
  data: number
}
