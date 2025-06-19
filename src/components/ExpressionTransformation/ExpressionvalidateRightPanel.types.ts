import { IExpresssionTranform } from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";
import { IFormula } from "../../redux/child-reducers/formula/formula.types";

export interface IExpressionValidateRightPanelProps {
  open: boolean;
  data: IFormula;
  onComplete: () => void;
  onClose: () => void;
}
