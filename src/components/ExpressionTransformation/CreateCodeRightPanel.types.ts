import { IVariableItem } from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";

export interface ICreateCodeRightPanelProps {
  open: boolean;
  data: IVariableItem;
  onComplete: () => void;
  onClose: () => void;
}
