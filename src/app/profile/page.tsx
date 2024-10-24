import FormContainer from "@/components/form/form-container";
import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from "@/utils/actions";
import FormInput from "@/components/form/form-input";
import { SubmitButton } from "@/components/form/buttons";
import ImageInputContainer from "@/components/form/image-input-container";

export default async function ProfilePage() {
  const profile = await fetchProfile();
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">user profile</h1>
      <div className="rounded-md border p-8">
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.userName}
          action={updateProfileImageAction}
          text={"프로필 이미지 수정"}
        />
        <FormContainer action={updateProfileAction}>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormInput
              name={"firstName"}
              type={"text"}
              label={"성"}
              defaultValue={profile.firstName}
            />
            <FormInput
              name={"lastName"}
              type={"text"}
              label={"이름"}
              defaultValue={profile.lastName}
            />
            <FormInput
              name={"userName"}
              type={"text"}
              label={"닉네임"}
              defaultValue={profile.userName}
            />
          </div>
          <SubmitButton text="프로필 수정" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
  return <h1>PropertiesPage</h1>;
}
