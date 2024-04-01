import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

export default function AssuranceLevelBlock() {
  return (
    <fieldset className="flex flex-col gap-4">
      <Label><h2 className="text-xl">Assurance Level</h2></Label>
      <RadioGroup name="assurance-level">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-limited" id="option-limited" />
          <Label htmlFor="option-limited">Limited assurance</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-reasonable" id="option-reasonable" />
          <Label htmlFor="option-reasonable">Reasonable assurance</Label>
        </div>
      </RadioGroup>
    </fieldset>
  )
}
