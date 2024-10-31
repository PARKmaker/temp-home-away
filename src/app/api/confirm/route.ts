/**
 * Created by tkdgu:박상현 on 2024-10-31
 */

import Stripe from "stripe";
import { NextRequest } from "next/server";
import db from "@/utils/db";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const bookingId = session.metadata?.bookingId;
    if (session.status !== "complete" || !bookingId) {
      throw new Error("Something went wrong");
    }
    await db.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: true },
    });
  } catch (error) {
    console.error(error);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  redirect("/bookings");
};
