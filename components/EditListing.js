import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { updateListing } from '@/utils/vendorUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  category: yup.string().required('Category is required'),
});

export const EditListing = ({ listing, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: listing
  });

  const updateListingMutation = useMutation(
    (data) => updateListing(listing.id, data),
    {
      onSuccess: () => {
        alert('Listing updated successfully!');
        onSuccess();
      },
      onError: (error) => {
        alert(`Error updating listing: ${error.message}`);
      }
    }
  );

  const onSubmit = (data) => {
    updateListingMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('title')} placeholder="Title" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <Textarea {...register('description')} placeholder="Description" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>
      <div>
        <Input {...register('price')} type="number" placeholder="Price per day" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>
      <div>
        <Input {...register('category')} placeholder="Category" />
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
      </div>
      <Button type="submit" disabled={updateListingMutation.isLoading}>
        {updateListingMutation.isLoading ? 'Updating...' : 'Update Listing'}
      </Button>
    </form>
  );
};