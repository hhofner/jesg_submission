import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input";

export default function ScopeVerificationBlock() {
  return (
    <fieldset className="flex flex-col gap-4">
      <Label><h2 className="text-xl">Scope Verified</h2></Label>
      <div className="items-top flex space-x-2">
        <Checkbox id="ISO-checkbox" name="scope-verification" value="scope-1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="ISO-checkbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Scope 1 and/or 2
          </label>
        </div>
      </div>
      <div className="items-top flex space-x-2">
        <Checkbox id="ISO-checkbox" name="scope-verification" value="scope-3" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="ISO-checkbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Scope 3
          </label>
        </div>
      </div>
    </fieldset>
  )
}
