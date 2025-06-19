import { Button } from "@/components/ui/Button";

interface Props {
	isUpdate: boolean;
	activeStep: number;
	steps: string[];
	onButtonClick: (type: string) => void;
}

export function PropertyFormButton({
	activeStep,
	steps,
	isUpdate,
	onButtonClick,
}: Props) {
	return (
		<div className="flex flex-row gap-2">
			{activeStep !== 0 && (
				<Button
					variant="solid"
					type="button"
					onClick={() => onButtonClick("BACK")}
				>
					Back
				</Button>
			)}
			{isUpdate && (
				<Button
					variant="solid"
					type="button"
					onClick={() => onButtonClick("SAVE")}
				>
					Save
				</Button>
			)}
			{isUpdate && activeStep <= steps.length - 2 && (
				<Button
					variant="solid"
					type="button"
					onClick={() => onButtonClick("SAVE_AND_CONTINUE")}
				>
					Save & Continue
				</Button>
			)}
			<Button
				variant="default"
				type="button"
				onClick={() => onButtonClick("SUBMIT")}
			>
				Save & Exit
			</Button>
			{isUpdate && activeStep <= steps.length - 2 && activeStep !== 1 && (
				<Button
					variant="solid"
					type="button"
					onClick={() => onButtonClick("CONTINUE")}
				>
					Continue
				</Button>
			)}
			{(!isUpdate || activeStep === steps.length - 1) && (
				<Button
					variant="default"
					type="button"
					onClick={() => onButtonClick("SUBMIT")}
				>
					Submit
				</Button>
			)}
			{isUpdate && activeStep === steps.length - 1 && (
				<Button
					variant="solid"
					type="button"
					onClick={() => onButtonClick("CLOSE")}
				>
					Close
				</Button>
			)}
		</div>
	);
}
