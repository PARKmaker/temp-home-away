/**
 * Created by tkdgu:박상현 on 2024-10-23
 */
import Image from "next/image";

type UserInfoProps = {
  profile: {
    profileImage: string;
    firstName: string;
  };
};

export default function UserInfo({
  profile: { profileImage, firstName },
}: UserInfoProps) {
  return (
    <article className="mt-4 grid grid-cols-[auto,1fr] gap-4">
      <Image
        src={profileImage}
        alt={firstName}
        width={50}
        height={50}
        className="h-12 w-12 rounded-md object-cover"
      />
      <div>
        <p>
          Hosted by
          <span className="font-bold"> {firstName}</span>
        </p>
        <p className="font-light text-muted-foreground">
          Superhost &middot; 2 years hosting
        </p>
      </div>
    </article>
  );
}
