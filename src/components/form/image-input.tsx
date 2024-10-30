import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const name = "image";
export default function ImageInput() {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        이미지
      </Label>
      <Input
        id={name}
        name={name}
        type="file"
        required
        accept="image/*"
        className="max-w-xs"
      />
    </div>
  );
}
