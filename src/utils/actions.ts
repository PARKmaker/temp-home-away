"use server";

import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from "@/utils/schemas";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/utils/supabase";

async function getAuthUser() {
  const user = await currentUser();
  if (!user) throw new Error("You must be logged in to access this route");

  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
}

function renderError(error: unknown): { message: string } {
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
}

export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/");
}

export async function fetchProfileImage() {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
}

export async function fetchProfile() {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!profile) redirect("/profile/create");
  return profile;
}

export async function updateProfileAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }

  return { message: "update profile action" };
}

export async function updateProfileImageAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });

    return { message: "프로필 이미지 수정" };
  } catch (error) {
    return renderError(error);
  }
}

export async function createPropertyAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image as File);

    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/");
}

export async function fetchProperties({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) {
  return db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function fetchFavoriteId({ propertyId }: { propertyId: string }) {
  const user = await getAuthUser();

  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });

  return (favorite?.id as string) || null;
  // return null;
}

export async function toggleFavoriteAction(prevState: {
  propertyId: string;
  favoriteId: string | null;
  pathname: string;
}) {
  const user = await getAuthUser();

  const { propertyId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "즐겨찾기 해제" : "즐겨찾기 등록" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchFavorites() {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true,
        },
      },
    },
  });

  return favorites.map((favorite) => favorite.property);
}

export async function fetchPropertyDetails(id: string) {
  return db.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
}
