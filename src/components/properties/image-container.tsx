/**
 * Created by tkdgu:박상현 on 2024-10-23
 */
import Image from "next/image";

type ImageContainerProps = {
  mainImage: string;
  name: string;
};

export default function ImageContainer({
  mainImage,
  name,
}: ImageContainerProps) {
  return (
    <section className="relative mt-8 h-[300px] md:h-[500px]">
      <Image
        src={mainImage}
        alt={name}
        fill
        className="rounded object-cover"
        sizes="100vw"
        priority
      />
    </section>
  );
}
