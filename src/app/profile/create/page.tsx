import FormContainer from "@/components/form/form-container";
import FormInput from "@/components/form/form-input";
import { SubmitButton } from "@/components/form/buttons";
import { createProfileAction } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfileCreatePage() {
  const user = await currentUser();
  console.log(user);
  if (user?.privateMetadata?.hasProfile) {
    redirect("/");
  }
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">new user</h1>
      <div className="rounded-md border p-8">
        <FormContainer action={createProfileAction}>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormInput name={"firstName"} type={"text"} label={"성"} />
            <FormInput name={"lastName"} type={"text"} label={"이름"} />
            <FormInput name={"userName"} type={"text"} label={"닉네임"} />
          </div>
          <SubmitButton text="프로필 만들기" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}
