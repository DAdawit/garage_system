import { ValidationError } from "class-validator";

export const validationErrorFormater = (errors: ValidationError[]) => {
  return errors.map((error) => ({
    property: error.property,
    // constraints: error.constraints,
    errors: error.constraints
      ? Object.keys(error.constraints).map(
          (key) => error.constraints && error?.constraints[key]
        )
      : [],
  }));
};
