"use server";

import {
  createReviewSchema,
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
import { calculateTotals } from "@/utils/calculate-totals";
import { formatDate } from "@/utils/format";

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

async function getAdminUser() {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");

  return user;
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

  return (favorite && favorite.id) || null;
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
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  });
}

export async function createReviewAction(prevState: any, formData: FormData) {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchPropertyReviews(propertyId: string) {
  const reviews = await db.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
}

export async function fetchPropertyReviewsByUser() {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
}

export async function deleteReviewAction(prevState: { reviewId: string }) {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchPropertyRating(propertyId: string) {
  const result = await db.review.groupBy({
    by: ["propertyId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  return {
    rating: result[0]?._avg.rating?.toFixed() ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

// 리뷰 있는지 확인
export async function findExistingReview(userId: string, propertyId: string) {
  return db.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  });
}

export async function createBookingAction(prevState: {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
}) {
  let bookingId: null | string = null;

  const user = await getAuthUser();

  await db.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });

  const { propertyId, checkOut, checkIn } = prevState;
  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: { price: true },
  });

  if (!property) {
    return { message: "Property not found" };
  }

  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price,
  });

  try {
    const booking = await db.booking.create({
      data: {
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId: user.id,
        propertyId,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }

  redirect(`/checkout?bookingId=${bookingId}`);
}

export async function fetchBookings() {
  const user = await getAuthUser();
  const bookings = await db.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
}

export async function deleteBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchRentals() {
  const user = await getAuthUser();
  const rentals = await db.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const rentalsWithBookingsSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightSum = await db.booking.aggregate({
        where: { propertyId: rental.id, paymentStatus: true },
        _sum: { totalNights: true },
      });

      const orderTotalSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });
      return {
        ...rental,
        totalNightsSum: totalNightSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    }),
  );

  return rentalsWithBookingsSums;
}

export async function deleteRentalAction(prevState: { propertyId: string }) {
  const { propertyId } = prevState;
  const user = await getAuthUser();

  try {
    await db.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    });
    revalidatePath("/rentals");
    return { message: "Rental 삭제 성공" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchRentalDetails(propertyId: string) {
  const user = await getAuthUser();
  return db.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
  });
}

export async function updatePropertyAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    });

    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Update Successful" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updatePropertyImageAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Property Image Updated Successful" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchReservations() {
  const user = await getAuthUser();

  const reservations = await db.booking.findMany({
    where: {
      paymentStatus: true,
      property: {
        profileId: user.id,
      },
    },

    orderBy: {
      createdAt: "desc", // or 'asc' for ascending order
    },

    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
        },
      }, // include property details in the result
    },
  });
  return reservations;
}

export async function fetchStats() {
  await getAdminUser();

  const usersCount = await db.profile.count();
  const propertiesCount = await db.property.count();
  const bookingsCount = await db.booking.count({
    where: {
      paymentStatus: true,
    },
  });

  return {
    usersCount,
    propertiesCount,
    bookingsCount,
  };
}

export async function fetchChartsData() {
  await getAdminUser();

  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAge = date;

  const bookings = await db.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAge,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let bookingsPerMonth = bookings.reduce(
    (total, current) => {
      const date = formatDate(current.createdAt, true);
      const existingEntry = total.find((entry) => entry.date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        total.push({ date, count: 1 });
      }
      return total;
    },
    [] as Array<{ date: string; count: number }>,
  );

  return bookingsPerMonth;
}

export async function fetchReservationStats() {
  const user = await getAuthUser();
  const properties = await db.property.count({
    where: {
      profileId: user.id,
    },
  });

  const totals = await db.booking.aggregate({
    _sum: {
      orderTotal: true,
      totalNights: true,
    },
    where: {
      property: {
        profileId: user.id,
      },
    },
  });

  return {
    properties,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  };
}
