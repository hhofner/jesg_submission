import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function VerificationStandardBlock({ error }: { error?: string }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <Label><h2 className="text-xl">Verification Standard</h2></Label>
      <div className="items-top flex space-x-2">
        <Checkbox id="ISO-standard" name="verification-standard" value="ISO-standard"/>
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="ISO-standard"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ISO 14064-3
          </label>
        </div>
      </div>
      <div className="items-top flex space-x-2">
        <Checkbox id="other-standard" name="verification-standard" value="other-standard"/>
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="other-standard"
            name="other-standard"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Other
          </label>
        </div>
      </div>
      {error ? <small className="text-red-500">{error}</small> : null }
      <Input type="text" id="other-standard-text" placeholder="Other verification standard (If 'Other' was selected)" name="other-standard-text"/>
    </fieldset>)
}
