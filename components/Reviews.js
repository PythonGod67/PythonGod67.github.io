import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewsForListing, addReview, updateReview, deleteReview } from '@/utils/vendorUtils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from 'lucide-react';
import { auth } from '@/firebase-config';

const schema = yup.object().shape({
  rating: yup.number().min(1).max(5).required('Rating is required'),
  comment: yup.string().required('Comment is required'),
});

const REVIEWS_PER_PAGE = 5;

export const Reviews = ({ listingId }) => {
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const queryClient = useQueryClient();

  const { data: reviewsData, refetch } = useQuery(
    ['reviews', listingId, page],
    () => getReviewsForListing(listingId, page, REVIEWS_PER_PAGE)
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editingReview
  });

  const addReviewMutation = useMutation(
    (reviewData) => addReview(listingId, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', listingId]);
        reset();
      },
      onError: (error) => {
        alert(`Error adding review: ${error.message}`);
      }
    }
  );

  const updateReviewMutation = useMutation(
    ({ reviewId, reviewData }) => updateReview(reviewId, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', listingId]);
        setEditingReview(null);
        reset();
      },
      onError: (error) => {
        alert(`Error updating review: ${error.message}`);
      }
    }
  );

  const deleteReviewMutation = useMutation(
    (reviewId) => deleteReview(reviewId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', listingId]);
      },
      onError: (error) => {
        alert(`Error deleting review: ${error.message}`);
      }
    }
  );

  const onSubmit = (data) => {
    if (editingReview) {
      updateReviewMutation.mutate({ reviewId: editingReview.id, reviewData: data });
    } else {
      addReviewMutation.mutate(data);
    }
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Reviews</h3>
      {reviewsData?.reviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(review.createdAt.toDate()).toLocaleDateString()}
                </span>
              </div>
              {auth.currentUser?.uid === review.userId && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingReview(review)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{review.comment}</p>
          </CardContent>
        </Card>
      ))}

      {reviewsData?.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(p => Math.min(reviewsData.totalPages, p + 1))}
            disabled={page === reviewsData.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
        <h4 className="text-xl font-semibold">
          {editingReview ? 'Edit Your Review' : 'Add Your Review'}
        </h4>
        <div className="flex items-center space-x-2">
          <Input
            {...register('rating')}
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            className="w-24"
          />
          {renderStars(watch('rating'))}
        </div>
        {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
        <div>
          <Textarea {...register('comment')} placeholder="Your review" />
          {errors.comment && <p className="text-red-500">{errors.comment.message}</p>}
        </div>
        <Button type="submit" disabled={addReviewMutation.isLoading || updateReviewMutation.isLoading}>
          {editingReview ? 'Update Review' : 'Submit Review'}
        </Button>
        {editingReview && (
          <Button type="button" variant="outline" onClick={() => {
            setEditingReview(null);
            reset();
          }}>
            Cancel Edit
          </Button>
        )}
      </form>
    </div>
  );
};