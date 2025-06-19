import { IExpresssionTranform } from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";
import { IFormula } from "../../redux/child-reducers/formula/formula.types";

export interface IExpressionTransformationProps {
  open: boolean;
  data: IFormula;
  onClose: () => void;
  onComplete: () => void;
  source_reference_in_pms?: string; // Optional parameter for OTA reference
}
