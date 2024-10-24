"use client";
import { useState } from "react";
import { amenities, Amenity } from "@/utils/amenities";
import { Checkbox } from "@/components/ui/checkbox";
export default function AmenitiesInput({
  defaultValue,
}: {
  defaultValue?: Amenity[];
}) {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
    defaultValue || amenities,
  );

  const handleChange = (amenity: Amenity) => {
    setSelectedAmenities((prev) => {
      return prev.map((a) => {
        if (a.name === amenity.name) {
          return { ...a, selected: !a.selected };
        }
        return a;
      });
    });
  };

  return (
    <section>
      <input
        type="hidden"
        name="amenities"
        value={JSON.stringify(selectedAmenities)}
      />
      <div className="grid grid-cols-2 gap-4">
        {selectedAmenities.map((amenity) => (
          <div key={amenity.name} className="flex items-center space-x-2">
            <Checkbox
              id={amenity.name}
              checked={amenity.selected}
              onCheckedChange={() => handleChange(amenity)}
            />
            <label
              htmlFor={amenity.name}
              className="flex items-center gap-x-2 text-sm font-medium capitalize leading-none"
            >
              {amenity.name}
              <amenity.icon className="h-4 w-4" />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
