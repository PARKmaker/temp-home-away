import {
  deleteReviewAction,
  fetchPropertyReviewsByUser,
} from "@/utils/actions";
import Title from "@/components/properties/title";
import ReviewCard from "@/components/review/review-card";
import FormContainer from "@/components/form/form-container";
import { IconButton } from "@/components/form/buttons";
import EmptyList from "@/components/home/empty-list";

export default async function ReviewsPage() {
  const reviews = await fetchPropertyReviewsByUser();
  if (reviews.length === 0) return <EmptyList />;

  return (
    <>
      <Title text="Your Reviews" />
      <section className="mt-4 grid gap-8 md:grid-cols-2">
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { name, image } = review.property;
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
          };
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReview reviewId={review.id} />
            </ReviewCard>
          );
        })}
      </section>
    </>
  );
}

const DeleteReview = ({ reviewId }: { reviewId: string }) => {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
};
