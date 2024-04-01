import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function DisclosureInformationBlock() {
  return (
    <fieldset>
      <div className="grid w-full max-w-md items-center gap-1.5">
        <Label htmlFor="picture"><h2 className="text-xl">Disclosure Location</h2></Label>
        <Label htmlFor="picture">File</Label>
        <Input id="picture" type="file" className="w-full" name="disclosure-info-file" />
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="text" name="disclosure-info-url" />
      </div>
    </fieldset>
  )
}
