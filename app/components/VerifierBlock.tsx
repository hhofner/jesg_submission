import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Input } from "~/components/ui/input";

export default function VerifierBlock({ error }: { error?: string }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <Label htmlFor="email" className="flex justify-between">
      <h2 className="text-xl required">Verifier</h2>
    </Label>
      <RadioGroup name="verifier">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-yes" id="option-yes" required/>
          <Label htmlFor="option-yes">Yes</Label>
        </div>
        <Input type="text" id="verifier" name="verifier-name" placeholder="Verifier (if answered 'yes' above)" />
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-no" id="option-no" />
          <Label htmlFor="option-no">No</Label>
        </div>
      </RadioGroup>
      {error ? <small className="text-red-500">{error}</small> : null }
    </fieldset>)
}
